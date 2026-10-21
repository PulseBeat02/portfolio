import assert from "node:assert/strict";
import {afterEach, describe, it, mock} from "node:test";
import {UMAMI_WEBSITE_ID} from "@/lib/analytics";
import type {UmamiVisitor} from "@/lib/server/umami-collect";
import {enrichVisitorSessionWithNetworkDetails} from "./visitor-network-enrichment.ts";

const UMAMI_SERVER_URL = "https://umami.example.com";
const UMAMI_COLLECT_ENDPOINT_URL = "https://umami.example.com/api/send";
const VISITOR: UmamiVisitor = {ipAddress: "8.8.8.8", userAgent: "Mozilla/5.0", sessionToken: "session-token"};
const FORGED_EVENT = {type: "event", payload: {website: UMAMI_WEBSITE_ID, hostname: "brandonli.me", url: "/", ip: "198.51.100.1"}};

const IPINFO_ANSWERS = new Map<string, object>([
    ["https://api.ipinfo.io/lite/8.8.8.8?token=test-token", {asn: "AS15169", as_name: "Google LLC", as_domain: "google.com"}],
    ["https://ipinfo.io/8.8.8.8/json?token=test-token", {ip: "8.8.8.8", hostname: "dns.google"}],
]);

function mockFetch(answer: (requestedUrl: string) => Response) {
    const fakeFetch: typeof fetch = async (input) => answer(String(input));
    return mock.method(globalThis, "fetch", fakeFetch);
}

function answerLikeIpinfo(requestedUrl: string): Response {
    const ipinfoAnswer = IPINFO_ANSWERS.get(requestedUrl);
    return ipinfoAnswer ? Response.json(ipinfoAnswer) : Response.json({});
}

function readIdentifyRequests(fetchMock: ReturnType<typeof mockFetch>) {
    return fetchMock.mock.calls
        .filter(({arguments: [requestedUrl]}) => String(requestedUrl) === UMAMI_COLLECT_ENDPOINT_URL)
        .map(({arguments: [, requestInit]}) => ({
            headers: Object.fromEntries(new Headers(requestInit?.headers)),
            body: JSON.parse(String(requestInit?.body)),
        }));
}

function readSessionProperties(fetchMock: ReturnType<typeof mockFetch>) {
    return readIdentifyRequests(fetchMock).map(({body}) => body.payload.data);
}

describe("enrichVisitorSessionWithNetworkDetails", () => {
    afterEach(() => {
        mock.restoreAll();
        delete process.env.IPINFO_TOKEN;
    });

    it("tags the session with the IP address, hostname and network organization as a sanitised identify", async () => {
        process.env.IPINFO_TOKEN = "test-token";
        const fetchMock = mockFetch(answerLikeIpinfo);
        await enrichVisitorSessionWithNetworkDetails(UMAMI_SERVER_URL, VISITOR, FORGED_EVENT);
        assert.equal(fetchMock.mock.callCount(), 3);
        assert.deepEqual(readIdentifyRequests(fetchMock), [{
            headers: {
                "content-type": "application/json",
                "user-agent": "Mozilla/5.0",
                "x-umami-client-ip": "8.8.8.8",
                "x-umami-cache": "session-token",
            },
            body: {
                type: "identify",
                payload: {
                    website: UMAMI_WEBSITE_ID,
                    hostname: "brandonli.me",
                    url: "/",
                    data: {
                        ip: "8.8.8.8",
                        network_hostname: "dns.google",
                        network_organization: "Google LLC",
                        network_asn: "AS15169",
                        network_domain: "google.com",
                    },
                },
            },
        }]);
    });

    it("tags the session with the IP address alone without IPINFO_TOKEN or when IPinfo does not answer", async () => {
        const fetchMock = mockFetch(() => Response.json({error: "rate limited"}, {status: 429}));
        await enrichVisitorSessionWithNetworkDetails(UMAMI_SERVER_URL, VISITOR, FORGED_EVENT);
        assert.equal(fetchMock.mock.callCount(), 1);
        process.env.IPINFO_TOKEN = "test-token";
        await enrichVisitorSessionWithNetworkDetails(UMAMI_SERVER_URL, VISITOR, FORGED_EVENT);
        assert.equal(fetchMock.mock.callCount(), 4);
        assert.deepEqual(readSessionProperties(fetchMock), [{ip: "8.8.8.8"}, {ip: "8.8.8.8"}]);
    });

    it("skips IPinfo for non-public addresses and sends nothing without an address", async () => {
        process.env.IPINFO_TOKEN = "test-token";
        const fetchMock = mockFetch(answerLikeIpinfo);
        await enrichVisitorSessionWithNetworkDetails(UMAMI_SERVER_URL, {...VISITOR, ipAddress: "192.168.1.1"}, FORGED_EVENT);
        assert.deepEqual(readSessionProperties(fetchMock), [{ip: "192.168.1.1"}]);
        await enrichVisitorSessionWithNetworkDetails(UMAMI_SERVER_URL, {...VISITOR, ipAddress: null}, FORGED_EVENT);
        assert.equal(fetchMock.mock.callCount(), 1);
    });

    it("asks IPinfo again for every session instead of keeping its answers", async () => {
        process.env.IPINFO_TOKEN = "test-token";
        const fetchMock = mockFetch(answerLikeIpinfo);
        await enrichVisitorSessionWithNetworkDetails(UMAMI_SERVER_URL, VISITOR, FORGED_EVENT);
        await enrichVisitorSessionWithNetworkDetails(UMAMI_SERVER_URL, VISITOR, FORGED_EVENT);
        assert.equal(fetchMock.mock.callCount(), 6);
        assert.equal(readIdentifyRequests(fetchMock).length, 2);
    });
});
