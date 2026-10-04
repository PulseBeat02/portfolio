import {ExpiringKeySet} from "@/lib/server/expiring-key-set";
import {lookupIpNetworkOrganization, type IpNetworkOrganization} from "@/lib/server/ip-network-organization";
import {
    buildUmamiSessionPropertiesRequestBody,
    parseOwnWebsiteCollectPayload,
    postToUmamiCollectEndpoint,
    type UmamiVisitor,
} from "@/lib/server/umami-collect";

const ENRICHED_VISITOR_MEMORY_MILLISECONDS = 12 * 60 * 60 * 1000;
const MAXIMUM_REMEMBERED_ENRICHED_VISITORS = 10_000;

const recentlyEnrichedVisitorKeys = new ExpiringKeySet(ENRICHED_VISITOR_MEMORY_MILLISECONDS, MAXIMUM_REMEMBERED_ENRICHED_VISITORS);

function buildVisitorKey({ipAddress, userAgent}: UmamiVisitor): string {
    return `${ipAddress}|${userAgent ?? ""}`;
}

function toUmamiSessionProperties(networkOrganization: IpNetworkOrganization): Record<string, string> {
    return {
        network_organization: networkOrganization.organizationName,
        network_asn: networkOrganization.autonomousSystemNumber,
        ...(networkOrganization.organizationDomain ? {network_domain: networkOrganization.organizationDomain} : {}),
    };
}

export async function enrichVisitorSessionWithNetworkOrganization(
    visitor: UmamiVisitor,
    collectRequestBody: string,
    upstreamHeaders: Headers,
): Promise<void> {
    const ipinfoAccessToken = process.env.IPINFO_TOKEN;
    if (!ipinfoAccessToken || !visitor.ipAddress) return;

    const visitorKey = buildVisitorKey(visitor);
    if (recentlyEnrichedVisitorKeys.has(visitorKey)) return;

    const collectPayload = parseOwnWebsiteCollectPayload(collectRequestBody);
    if (!collectPayload) return;

    recentlyEnrichedVisitorKeys.add(visitorKey);
    const networkOrganization = await lookupIpNetworkOrganization(visitor.ipAddress, ipinfoAccessToken);
    if (!networkOrganization) return;

    await postToUmamiCollectEndpoint(
        buildUmamiSessionPropertiesRequestBody(collectPayload, toUmamiSessionProperties(networkOrganization)),
        upstreamHeaders,
    );
}
