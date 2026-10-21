import {lookupIpHostname, lookupIpNetworkOrganization, type IpNetworkOrganization} from "@/lib/server/ip-network-organization";
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
    const [networkHostname, networkOrganization] = await Promise.all([
        lookupIpHostname(ipAddress, ipinfoAccessToken),
        lookupIpNetworkOrganization(ipAddress, ipinfoAccessToken),
    ]);
    return {
        ...(networkHostname ? {network_hostname: networkHostname} : {}),
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
        buildUmamiSessionPropertiesRequest(collectRequest, {ip: visitor.ipAddress, ...networkProperties}),
        visitor,
    );
}
