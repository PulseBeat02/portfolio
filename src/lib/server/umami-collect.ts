import {isIPv4, isIPv6} from "node:net";
import {ANALYTICS_PROXY_ROUTES, UMAMI_WEBSITE_ID} from "@/lib/analytics";

const UPSTREAM_REQUEST_TIMEOUT_MILLISECONDS = 5_000;
const UMAMI_SERVER_URL_PROTOCOLS = new Set(["http:", "https:"]);
const TRAILING_SLASHES_PATTERN = /\/+$/;
const USER_AGENT_HEADER_NAME = "user-agent";
const UMAMI_CLIENT_IP_HEADER_NAME = "x-umami-client-ip";
const UMAMI_SESSION_TOKEN_HEADER_NAME = "x-umami-cache";
const UMAMI_REQUEST_CONTENT_TYPE = "application/json";
const IPV4_MAPPED_IPV6_PREFIX = "::ffff:";
const COLLECT_REQUEST_TYPES = new Set(["event", "identify"]);
const RECORD_REQUEST_TYPES = new Set(["record", "heatmap"]);
const VISITOR_OVERRIDE_PAYLOAD_FIELDS = new Set(["ip", "userAgent", "browser", "os", "device", "timestamp"]);

export interface UmamiRequest {
    type: string;
    payload: Record<string, unknown>;
}

export interface UmamiVisitor {
    ipAddress: string | null;
    userAgent: string | null;
    sessionToken: string | null;
}

export interface UmamiAnswer {
    ok: boolean;
    status: number;
    contentType: string | null;
    body: string;
}

export function resolveUmamiServerUrl(): string | null {
    const configuredUmamiServerUrl = process.env.UMAMI_URL;
    if (!configuredUmamiServerUrl || !URL.canParse(configuredUmamiServerUrl)) return null;
    const umamiServerUrl = new URL(configuredUmamiServerUrl);
    if (!UMAMI_SERVER_URL_PROTOCOLS.has(umamiServerUrl.protocol)) return null;
    return umamiServerUrl.href.replace(TRAILING_SLASHES_PATTERN, "");
}

function normalizeIpAddress(rawIpAddress: string): string | null {
    const unmappedIpAddress = rawIpAddress.startsWith(IPV4_MAPPED_IPV6_PREFIX)
        ? rawIpAddress.slice(IPV4_MAPPED_IPV6_PREFIX.length)
        : rawIpAddress;
    if (isIPv4(unmappedIpAddress)) return unmappedIpAddress;
    return isIPv6(rawIpAddress) ? rawIpAddress : null;
}

export function resolveUmamiVisitor(request: Request): UmamiVisitor {
    const forwardedForFirstHop = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const rawIpAddress = forwardedForFirstHop || request.headers.get("x-real-ip");
    return {
        ipAddress: rawIpAddress ? normalizeIpAddress(rawIpAddress) : null,
        userAgent: request.headers.get(USER_AGENT_HEADER_NAME),
        sessionToken: request.headers.get(UMAMI_SESSION_TOKEN_HEADER_NAME),
    };
}

function buildUmamiRequestHeaders({ipAddress, userAgent, sessionToken}: UmamiVisitor): Headers {
    const upstreamHeaders = new Headers({"content-type": UMAMI_REQUEST_CONTENT_TYPE});
    if (userAgent) upstreamHeaders.set(USER_AGENT_HEADER_NAME, userAgent);
    if (ipAddress) upstreamHeaders.set(UMAMI_CLIENT_IP_HEADER_NAME, ipAddress);
    if (sessionToken) upstreamHeaders.set(UMAMI_SESSION_TOKEN_HEADER_NAME, sessionToken);
    return upstreamHeaders;
}

function withoutVisitorOverrides(payload: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(Object.entries(payload).filter(([payloadField]) => !VISITOR_OVERRIDE_PAYLOAD_FIELDS.has(payloadField)));
}

async function postToUmami(
    umamiServerUrl: string,
    umamiRoute: string,
    umamiRequest: UmamiRequest,
    visitor: UmamiVisitor,
): Promise<UmamiAnswer | null> {
    try {
        const umamiResponse = await fetch(`${umamiServerUrl}/${umamiRoute}`, {
            method: "POST",
            headers: buildUmamiRequestHeaders(visitor),
            body: JSON.stringify(umamiRequest),
            cache: "no-store",
            signal: AbortSignal.timeout(UPSTREAM_REQUEST_TIMEOUT_MILLISECONDS),
        });
        return {
            ok: umamiResponse.ok,
            status: umamiResponse.status,
            contentType: umamiResponse.headers.get("content-type"),
            body: await umamiResponse.text(),
        };
    } catch {
        return null;
    }
}

export function postToUmamiCollectEndpoint(
    umamiServerUrl: string,
    {type, payload}: UmamiRequest,
    visitor: UmamiVisitor,
): Promise<UmamiAnswer | null> {
    return postToUmami(umamiServerUrl, ANALYTICS_PROXY_ROUTES.collectEndpoint, {type, payload: withoutVisitorOverrides(payload)}, visitor);
}

export function postToUmamiRecordEndpoint(
    umamiServerUrl: string,
    recordRequest: UmamiRequest,
    visitor: UmamiVisitor,
): Promise<UmamiAnswer | null> {
    return postToUmami(umamiServerUrl, ANALYTICS_PROXY_ROUTES.recordEndpoint, recordRequest, visitor);
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function parseJson(text: string): unknown {
    try {
        return JSON.parse(text);
    } catch {
        return undefined;
    }
}

const stringOrUndefined = (value: unknown) => (typeof value === "string" ? value : undefined);

function parseOwnWebsiteRequest(requestBody: string, requestTypes: ReadonlySet<string>): UmamiRequest | null {
    const parsedRequest = parseJson(requestBody);
    if (!isRecord(parsedRequest) || !isRecord(parsedRequest.payload)) return null;
    const {type, payload} = parsedRequest;
    if (typeof type !== "string" || !requestTypes.has(type) || payload.website !== UMAMI_WEBSITE_ID) return null;
    return {type, payload};
}

export function parseOwnWebsiteCollectRequest(collectRequestBody: string): UmamiRequest | null {
    return parseOwnWebsiteRequest(collectRequestBody, COLLECT_REQUEST_TYPES);
}

export function parseOwnWebsiteRecordRequest(recordRequestBody: string): UmamiRequest | null {
    return parseOwnWebsiteRequest(recordRequestBody, RECORD_REQUEST_TYPES);
}

export function findNewUmamiSessionToken({sessionToken}: UmamiVisitor, {ok, body}: UmamiAnswer): string | null {
    if (sessionToken || !ok) return null;
    const umamiAnswerBody = parseJson(body);
    return isRecord(umamiAnswerBody) && typeof umamiAnswerBody.cache === "string" ? umamiAnswerBody.cache : null;
}

export function buildUmamiSessionPropertiesRequest(
    {payload}: UmamiRequest,
    sessionProperties: Record<string, string>,
): UmamiRequest {
    return {
        type: "identify",
        payload: {
            website: UMAMI_WEBSITE_ID,
            hostname: stringOrUndefined(payload.hostname),
            screen: stringOrUndefined(payload.screen),
            language: stringOrUndefined(payload.language),
            url: stringOrUndefined(payload.url),
            data: sessionProperties,
        },
    };
}
