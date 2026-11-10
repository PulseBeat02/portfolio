import {lookupIpDetails, lookupIpNetworkOrganization, type IpNetworkOrganization} from "@/lib/server/ip-network-organization";
import {
    buildUmamiSessionPropertiesRequest,
    postToUmamiCollectEndpoint,
    type UmamiRequest,
    type UmamiVisitor,
} from "@/lib/server/umami-collect";

function toUmamiNetworkOrganizationProperties(networkOrganization: IpNetworkOrganization): Record<string, string> {
    return {
        network_organization: networkOrganization.organizationName,
        network_asn: networkOrganization.autonomousSystemNumber,
        ...(networkOrganization.organizationDomain ? {network_domain: networkOrganization.organizationDomain} : {}),
    };
}

async function lookupUmamiNetworkProperties(ipAddress: string): Promise<Record<string, string>> {
    const ipinfoAccessToken = process.env.IPINFO_TOKEN;
    if (!ipinfoAccessToken) return {};
    const [ipDetails, networkOrganization] = await Promise.all([
        lookupIpDetails(ipAddress, ipinfoAccessToken),
        lookupIpNetworkOrganization(ipAddress, ipinfoAccessToken),
    ]);
    return {
        ...(ipDetails?.hostname ? {network_hostname: ipDetails.hostname} : {}),
        ...(ipDetails?.timezone ? {ip_timezone: ipDetails.timezone} : {}),
        ...(ipDetails?.postal ? {ip_postal: ipDetails.postal} : {}),
        ...(ipDetails?.location ? {ip_location: ipDetails.location} : {}),
        ...(networkOrganization ? toUmamiNetworkOrganizationProperties(networkOrganization) : {}),
    };
}

export async function enrichVisitorSessionWithNetworkDetails(
    umamiServerUrl: string,
    visitor: UmamiVisitor,
    collectRequest: UmamiRequest,
): Promise<void> {
    if (!visitor.ipAddress) return;
    const networkProperties = await lookupUmamiNetworkProperties(visitor.ipAddress);
    await postToUmamiCollectEndpoint(
        umamiServerUrl,
        buildUmamiSessionPropertiesRequest(collectRequest, {
            ip: visitor.ipAddress,
            ...(visitor.userAgent ? {client_user_agent: visitor.userAgent} : {}),
            ...(visitor.languages ? {client_languages: visitor.languages} : {}),
            ...networkProperties,
        }),
        visitor,
    );
}
