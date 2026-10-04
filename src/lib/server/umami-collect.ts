import type {NextRequest} from "next/server";
import {UMAMI_UPSTREAM_COLLECT_ENDPOINT_URL, UMAMI_WEBSITE_ID} from "@/lib/analytics";

const UPSTREAM_REQUEST_TIMEOUT_MILLISECONDS = 5_000;
const UMAMI_CLIENT_IP_HEADER_NAME = "x-umami-client-ip";
const IPV4_MAPPED_IPV6_PREFIX = "::ffff:";
const VISITOR_HEADER_NAMES_TO_FORWARD = [
    "user-agent",
    "content-type",
    "accept-language",
    "x-umami-website-id",
    "x-umami-hostname",
    "x-umami-cache",
] as const;

export interface UmamiCollectPayload {
    website: string;
    hostname?: string;
    screen?: string;
    language?: string;
    url?: string;
}

export interface UmamiVisitor {
    ipAddress: string | null;
    userAgent: string | null;
}

function normalizeIpAddress(ipAddress: string): string {
    return ipAddress.startsWith(IPV4_MAPPED_IPV6_PREFIX) ? ipAddress.slice(IPV4_MAPPED_IPV6_PREFIX.length) : ipAddress;
}

export function resolveUmamiVisitor(request: NextRequest): UmamiVisitor {
    const forwardedForFirstHop = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const rawIpAddress = forwardedForFirstHop || request.headers.get("x-real-ip");
    return {
        ipAddress: rawIpAddress ? normalizeIpAddress(rawIpAddress) : null,
        userAgent: request.headers.get("user-agent"),
    };
}

export function buildUmamiCollectHeaders(request: NextRequest, visitor: UmamiVisitor): Headers {
    const upstreamHeaders = new Headers();
    for (const headerName of VISITOR_HEADER_NAMES_TO_FORWARD) {
        const headerValue = request.headers.get(headerName);
        if (headerValue) upstreamHeaders.set(headerName, headerValue);
    }
    if (visitor.ipAddress) upstreamHeaders.set(UMAMI_CLIENT_IP_HEADER_NAME, visitor.ipAddress);
    return upstreamHeaders;
}

export async function postToUmamiCollectEndpoint(collectRequestBody: string, upstreamHeaders: Headers): Promise<Response | null> {
    try {
        return await fetch(UMAMI_UPSTREAM_COLLECT_ENDPOINT_URL, {
            method: "POST",
            headers: upstreamHeaders,
            body: collectRequestBody,
            cache: "no-store",
            signal: AbortSignal.timeout(UPSTREAM_REQUEST_TIMEOUT_MILLISECONDS),
        });
    } catch {
        return null;
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

const stringOrUndefined = (value: unknown) => (typeof value === "string" ? value : undefined);

export function parseOwnWebsiteCollectPayload(collectRequestBody: string): UmamiCollectPayload | null {
    let parsedCollectRequest: unknown;
    try {
        parsedCollectRequest = JSON.parse(collectRequestBody);
    } catch {
        return null;
    }
    if (!isRecord(parsedCollectRequest) || !isRecord(parsedCollectRequest.payload)) return null;
    const {payload} = parsedCollectRequest;
    if (payload.website !== UMAMI_WEBSITE_ID) return null;
    return {
        website: UMAMI_WEBSITE_ID,
        hostname: stringOrUndefined(payload.hostname),
        screen: stringOrUndefined(payload.screen),
        language: stringOrUndefined(payload.language),
        url: stringOrUndefined(payload.url),
    };
}

export function buildUmamiSessionPropertiesRequestBody(
    collectPayload: UmamiCollectPayload,
    sessionProperties: Record<string, string>,
): string {
    return JSON.stringify({type: "identify", payload: {...collectPayload, data: sessionProperties}});
}
