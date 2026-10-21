import {after, type NextRequest} from "next/server";
import {ANALYTICS_PROXY_ROUTES} from "@/lib/analytics";
import {
    findNewUmamiSessionToken,
    parseOwnWebsiteCollectRequest,
    parseOwnWebsiteRecordRequest,
    postToUmamiCollectEndpoint,
    postToUmamiRecordEndpoint,
    resolveUmamiServerUrl,
    resolveUmamiVisitor,
    type UmamiAnswer,
    type UmamiVisitor,
} from "@/lib/server/umami-collect";
import {enrichVisitorSessionWithNetworkDetails} from "@/lib/server/visitor-network-enrichment";

const UMAMI_SCRIPT_CACHE_SECONDS = 24 * 60 * 60;
const UMAMI_GET_TIMEOUT_MILLISECONDS = 5_000;
const MAXIMUM_COLLECT_BODY_BYTES = 16 * 1024;
const MAXIMUM_RECORD_BODY_BYTES = 1_000_000;

const UMAMI_SCRIPT_ROUTES = new Set<string>([ANALYTICS_PROXY_ROUTES.trackerScript, ANALYTICS_PROXY_ROUTES.recorderScript]);
const MAXIMUM_BODY_BYTES_BY_POST_ROUTE = new Map<string, number>([
    [ANALYTICS_PROXY_ROUTES.collectEndpoint, MAXIMUM_COLLECT_BODY_BYTES],
    [ANALYTICS_PROXY_ROUTES.recordEndpoint, MAXIMUM_RECORD_BODY_BYTES],
]);

interface AnalyticsProxyRouteContext {
    params: Promise<{ path: string[] }>;
}

async function resolveRequestedProxyRoute({params}: AnalyticsProxyRouteContext): Promise<string> {
    const {path: pathSegments} = await params;
    return pathSegments.join("/");
}

function createEmptyResponse(status: number): Response {
    return new Response(null, {status});
}

async function fetchFromUmami(umamiUrl: string, requestInit: RequestInit): Promise<Response | null> {
    try {
        return await fetch(umamiUrl, {...requestInit, signal: AbortSignal.timeout(UMAMI_GET_TIMEOUT_MILLISECONDS)});
    } catch {
        return null;
    }
}

async function proxyUmamiScript(umamiServerUrl: string, scriptRoute: string): Promise<Response> {
    const scriptResponse = await fetchFromUmami(`${umamiServerUrl}/${scriptRoute}`, {next: {revalidate: UMAMI_SCRIPT_CACHE_SECONDS}});
    if (!scriptResponse?.ok) return createEmptyResponse(502);
    return new Response(await scriptResponse.text(), {
        headers: {
            "content-type": "application/javascript; charset=utf-8",
            "cache-control": `public, max-age=${UMAMI_SCRIPT_CACHE_SECONDS}`,
        },
    });
}

async function proxyRecorderConfiguration(umamiServerUrl: string): Promise<Response> {
    const configurationUrl = `${umamiServerUrl}/${ANALYTICS_PROXY_ROUTES.recorderConfiguration}`;
    const configurationResponse = await fetchFromUmami(configurationUrl, {cache: "no-store"});
    if (!configurationResponse) return createEmptyResponse(502);
    return new Response(configurationResponse.body, {
        status: configurationResponse.status,
        headers: {
            "content-type": configurationResponse.headers.get("content-type") ?? "application/json",
            "cache-control": "no-store",
        },
    });
}

export async function GET(_request: NextRequest, routeContext: AnalyticsProxyRouteContext) {
    const proxyRoute = await resolveRequestedProxyRoute(routeContext);
    const isUmamiScriptRoute = UMAMI_SCRIPT_ROUTES.has(proxyRoute);
    if (!isUmamiScriptRoute && proxyRoute !== ANALYTICS_PROXY_ROUTES.recorderConfiguration) return createEmptyResponse(404);
    const umamiServerUrl = resolveUmamiServerUrl();
    if (!umamiServerUrl) return createEmptyResponse(404);

    return isUmamiScriptRoute ? proxyUmamiScript(umamiServerUrl, proxyRoute) : proxyRecorderConfiguration(umamiServerUrl);
}

function passUmamiAnswerThrough({status, contentType, body}: UmamiAnswer): Response {
    // Response rejects any body, even "", for 204 and 304
    return new Response(body || null, {status, headers: {"content-type": contentType ?? "application/json"}});
}

async function forwardCollectRequest(umamiServerUrl: string, collectRequestBody: string, visitor: UmamiVisitor): Promise<Response> {
    const collectRequest = parseOwnWebsiteCollectRequest(collectRequestBody);
    if (!collectRequest) return createEmptyResponse(400);
    const collectAnswer = await postToUmamiCollectEndpoint(umamiServerUrl, collectRequest, visitor);
    if (!collectAnswer) return createEmptyResponse(502);

    const newSessionToken = findNewUmamiSessionToken(visitor, collectAnswer);
    if (newSessionToken) {
        after(() => enrichVisitorSessionWithNetworkDetails(umamiServerUrl, {...visitor, sessionToken: newSessionToken}, collectRequest));
    }
    return passUmamiAnswerThrough(collectAnswer);
}

async function forwardRecordRequest(umamiServerUrl: string, recordRequestBody: string, visitor: UmamiVisitor): Promise<Response> {
    const recordRequest = parseOwnWebsiteRecordRequest(recordRequestBody);
    if (!recordRequest) return createEmptyResponse(400);
    const recordAnswer = await postToUmamiRecordEndpoint(umamiServerUrl, recordRequest, visitor);
    return recordAnswer ? passUmamiAnswerThrough(recordAnswer) : createEmptyResponse(502);
}

export async function POST(request: NextRequest, routeContext: AnalyticsProxyRouteContext) {
    const proxyRoute = await resolveRequestedProxyRoute(routeContext);
    const maximumBodyBytes = MAXIMUM_BODY_BYTES_BY_POST_ROUTE.get(proxyRoute);
    if (!maximumBodyBytes) return createEmptyResponse(404);
    const umamiServerUrl = resolveUmamiServerUrl();
    if (!umamiServerUrl) return createEmptyResponse(204);

    const requestBody = await request.arrayBuffer();
    if (requestBody.byteLength > maximumBodyBytes) return createEmptyResponse(413);
    const requestText = new TextDecoder().decode(requestBody);
    const visitor = resolveUmamiVisitor(request);
    return proxyRoute === ANALYTICS_PROXY_ROUTES.collectEndpoint
        ? forwardCollectRequest(umamiServerUrl, requestText, visitor)
        : forwardRecordRequest(umamiServerUrl, requestText, visitor);
}
