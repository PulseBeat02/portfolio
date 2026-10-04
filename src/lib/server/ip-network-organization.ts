import {isIPv4, isIPv6} from "node:net";

const IPINFO_LITE_LOOKUP_BASE_URL = "https://api.ipinfo.io/lite";
const IPINFO_LOOKUP_TIMEOUT_MILLISECONDS = 3_000;

const NON_PUBLIC_IPV4_PREFIXES = ["10.", "127.", "169.254.", "192.168.", "0."] as const;
const NON_PUBLIC_IPV4_172_SECOND_OCTET_RANGE = {minimum: 16, maximum: 31} as const;
const NON_PUBLIC_IPV6_PREFIXES = ["::1", "fc", "fd", "fe80:"] as const;

export interface IpNetworkOrganization {
    autonomousSystemNumber: string;
    organizationName: string;
    organizationDomain: string | null;
}

interface IpinfoLiteResponse {
    asn?: unknown;
    as_name?: unknown;
    as_domain?: unknown;
}

function isNonPublicIpv4Address(ipAddress: string): boolean {
    if (NON_PUBLIC_IPV4_PREFIXES.some((prefix) => ipAddress.startsWith(prefix))) return true;
    const [firstOctet, secondOctet] = ipAddress.split(".").map(Number);
    return firstOctet === 172
        && secondOctet >= NON_PUBLIC_IPV4_172_SECOND_OCTET_RANGE.minimum
        && secondOctet <= NON_PUBLIC_IPV4_172_SECOND_OCTET_RANGE.maximum;
}

function isNonPublicIpv6Address(ipAddress: string): boolean {
    const lowercaseIpAddress = ipAddress.toLowerCase();
    return NON_PUBLIC_IPV6_PREFIXES.some((prefix) => lowercaseIpAddress.startsWith(prefix));
}

export function isPublicIpAddress(ipAddress: string): boolean {
    if (isIPv4(ipAddress)) return !isNonPublicIpv4Address(ipAddress);
    if (isIPv6(ipAddress)) return !isNonPublicIpv6Address(ipAddress);
    return false;
}

function parseIpinfoLiteResponse(response: IpinfoLiteResponse): IpNetworkOrganization | null {
    const {asn, as_name: organizationName, as_domain: organizationDomain} = response;
    if (typeof asn !== "string" || typeof organizationName !== "string") return null;
    return {
        autonomousSystemNumber: asn,
        organizationName,
        organizationDomain: typeof organizationDomain === "string" ? organizationDomain : null,
    };
}

export async function lookupIpNetworkOrganization(ipAddress: string, ipinfoAccessToken: string): Promise<IpNetworkOrganization | null> {
    if (!isPublicIpAddress(ipAddress)) return null;
    const lookupUrl = new URL(`${IPINFO_LITE_LOOKUP_BASE_URL}/${encodeURIComponent(ipAddress)}`);
    lookupUrl.searchParams.set("token", ipinfoAccessToken);
    try {
        const lookupResponse = await fetch(lookupUrl, {
            cache: "no-store",
            signal: AbortSignal.timeout(IPINFO_LOOKUP_TIMEOUT_MILLISECONDS),
        });
        if (!lookupResponse.ok) return null;
        return parseIpinfoLiteResponse(await lookupResponse.json());
    } catch {
        return null;
    }
}
