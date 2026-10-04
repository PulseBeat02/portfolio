import {after, type NextRequest} from "next/server";
import {ANALYTICS_PROXY_ROUTES, UMAMI_UPSTREAM_TRACKER_SCRIPT_URL} from "@/lib/analytics";
import {buildUmamiCollectHeaders, postToUmamiCollectEndpoint, resolveUmamiVisitor} from "@/lib/server/umami-collect";
import {enrichVisitorSessionWithNetworkOrganization} from "@/lib/server/visitor-network-enrichment";

const TRACKER_SCRIPT_CACHE_SECONDS = 24 * 60 * 60;
const TRACKER_SCRIPT_TIMEOUT_MILLISECONDS = 5_000;
const MAXIMUM_COLLECT_PAYLOAD_CHARACTERS = 16 * 1024;

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

async function fetchTrackerScript(): Promise<Response | null> {
    try {
        return await fetch(UMAMI_UPSTREAM_TRACKER_SCRIPT_URL, {
            next: {revalidate: TRACKER_SCRIPT_CACHE_SECONDS},
            signal: AbortSignal.timeout(TRACKER_SCRIPT_TIMEOUT_MILLISECONDS),
        });
    } catch {
        return null;
    }
}

export async function GET(_request: NextRequest, routeContext: AnalyticsProxyRouteContext) {
    if (await resolveRequestedProxyRoute(routeContext) !== ANALYTICS_PROXY_ROUTES.trackerScript) {
        return createEmptyResponse(404);
    }
    const trackerScriptResponse = await fetchTrackerScript();
    if (!trackerScriptResponse?.ok) return createEmptyResponse(502);
    return new Response(await trackerScriptResponse.text(), {
        headers: {
            "content-type": "application/javascript; charset=utf-8",
            "cache-control": `public, max-age=${TRACKER_SCRIPT_CACHE_SECONDS}`,
        },
    });
}

export async function POST(request: NextRequest, routeContext: AnalyticsProxyRouteContext) {
    if (await resolveRequestedProxyRoute(routeContext) !== ANALYTICS_PROXY_ROUTES.collectEndpoint) {
        return createEmptyResponse(404);
    }
    const collectRequestBody = await request.text();
    if (collectRequestBody.length > MAXIMUM_COLLECT_PAYLOAD_CHARACTERS) return createEmptyResponse(413);

    const visitor = resolveUmamiVisitor(request);
    const upstreamHeaders = buildUmamiCollectHeaders(request, visitor);
    const collectResponse = await postToUmamiCollectEndpoint(collectRequestBody, upstreamHeaders);
    if (!collectResponse) return createEmptyResponse(502);

    if (collectResponse.ok) {
        after(() => enrichVisitorSessionWithNetworkOrganization(visitor, collectRequestBody, upstreamHeaders));
    }
    return new Response(collectResponse.body, {
        status: collectResponse.status,
        headers: {"content-type": collectResponse.headers.get("content-type") ?? "application/json"},
    });
}
