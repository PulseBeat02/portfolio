import assert from "node:assert/strict";
import {afterEach, describe, it, mock} from "node:test";
import {isPublicIpAddress, lookupIpNetworkOrganization} from "./ip-network-organization.ts";

describe("isPublicIpAddress", () => {
    it("accepts public IPv4 and IPv6 addresses", () => {
        for (const publicIpAddress of ["8.8.8.8", "172.32.0.1", "2001:4860:4860::8888"]) {
            assert.equal(isPublicIpAddress(publicIpAddress), true, publicIpAddress);
        }
    });

    it("rejects private, loopback, link-local and malformed addresses", () => {
        for (const nonPublicIpAddress of ["10.0.0.1", "127.0.0.1", "172.16.0.1", "172.31.255.255", "192.168.1.1", "169.254.0.1", "::1", "fd00::1", "fe80::1", "not-an-ip"]) {
            assert.equal(isPublicIpAddress(nonPublicIpAddress), false, nonPublicIpAddress);
        }
    });
});

describe("lookupIpNetworkOrganization", () => {
    afterEach(() => mock.restoreAll());

    function mockFetchResponse(responseBody: unknown, status = 200) {
        return mock.method(globalThis, "fetch", async () => new Response(JSON.stringify(responseBody), {status}));
    }

    it("maps the IPinfo Lite response to a network organization", async () => {
        const fetchMock = mockFetchResponse({asn: "AS15169", as_name: "Google LLC", as_domain: "google.com"});
        assert.deepEqual(await lookupIpNetworkOrganization("8.8.8.8", "test-token"), {
            autonomousSystemNumber: "AS15169",
            organizationName: "Google LLC",
            organizationDomain: "google.com",
        });
        const requestedUrl = String(fetchMock.mock.calls[0].arguments[0]);
        assert.equal(requestedUrl, "https://api.ipinfo.io/lite/8.8.8.8?token=test-token");
    });

    it("skips the lookup entirely for non-public addresses", async () => {
        const fetchMock = mockFetchResponse({});
        assert.equal(await lookupIpNetworkOrganization("192.168.1.1", "test-token"), null);
        assert.equal(fetchMock.mock.callCount(), 0);
    });

    it("returns null for error responses and incomplete data", async () => {
        mockFetchResponse({error: "rate limited"}, 429);
        assert.equal(await lookupIpNetworkOrganization("8.8.8.8", "test-token"), null);
        mock.restoreAll();
        mockFetchResponse({asn: "AS15169"});
        assert.equal(await lookupIpNetworkOrganization("8.8.8.8", "test-token"), null);
    });
});
