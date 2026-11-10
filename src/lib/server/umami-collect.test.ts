import assert from "node:assert/strict";
import {afterEach, describe, it, mock} from "node:test";
import {UMAMI_WEBSITE_ID} from "@/lib/analytics";
import {
    buildUmamiSessionPropertiesRequest,
    findNewUmamiSessionToken,
    parseOwnWebsiteCollectRequest,
    postToUmamiCollectEndpoint,
    resolveUmamiServerUrl,
    resolveUmamiVisitor,
    type UmamiAnswer,
    type UmamiVisitor,
} from "./umami-collect.ts";

const UMAMI_SERVER_URL = "https://umami.example.com";
const COLLECT_ENDPOINT_URL = "http://localhost/ux/api/send";
const ANONYMOUS_VISITOR: UmamiVisitor = {ipAddress: null, userAgent: null, languages: null, sessionToken: null};

function mockUmamiResponse() {
    const fakeFetch: typeof fetch = async () => Response.json({});
    return mock.method(globalThis, "fetch", fakeFetch);
}

function readForwardedRequest(fetchMock: ReturnType<typeof mockUmamiResponse>) {
    const [forwardedUrl, forwardedInit] = fetchMock.mock.calls[0].arguments;
    return {
        url: String(forwardedUrl),
        headers: Object.fromEntries(new Headers(forwardedInit?.headers)),
        body: JSON.parse(String(forwardedInit?.body)),
    };
}

function createUmamiAnswer(body: string, status = 200): UmamiAnswer {
    return {ok: status < 300, status, contentType: "application/json", body};
}

describe("resolveUmamiServerUrl", () => {
    afterEach(() => {
        delete process.env.UMAMI_URL;
    });

    it("keeps the base path of http and https URLs without trailing slashes", () => {
        const expectedUmamiServerUrls = {
            "https://umami.example.com": "https://umami.example.com",
            "https://umami.example.com/": "https://umami.example.com",
            "http://umami.example.com/umami//": "http://umami.example.com/umami",
        };
        for (const [configuredUmamiServerUrl, expectedUmamiServerUrl] of Object.entries(expectedUmamiServerUrls)) {
            process.env.UMAMI_URL = configuredUmamiServerUrl;
            assert.equal(resolveUmamiServerUrl(), expectedUmamiServerUrl);
        }
    });
});

describe("resolveUmamiVisitor", () => {
    it("reads the visitor's accepted languages", () => {
        const request = new Request(COLLECT_ENDPOINT_URL, {headers: {"accept-language": "en-US,en;q=0.9"}});
        assert.equal(resolveUmamiVisitor(request).languages, "en-US,en;q=0.9");
        assert.equal(resolveUmamiVisitor(new Request(COLLECT_ENDPOINT_URL)).languages, null);
    });

    it("takes the first X-Forwarded-For hop, then X-Real-IP, and drops invalid addresses", () => {
        const visitorIpAddresses: {headers: Record<string, string>; ipAddress: string | null}[] = [
            {headers: {"x-forwarded-for": "203.0.113.7, 198.51.100.2", "x-real-ip": "198.51.100.3"}, ipAddress: "203.0.113.7"},
            {headers: {"x-real-ip": "::ffff:203.0.113.8"}, ipAddress: "203.0.113.8"},
            {headers: {"x-forwarded-for": "2001:db8::1"}, ipAddress: "2001:db8::1"},
            {headers: {"x-forwarded-for": "not-an-ip", "x-real-ip": "198.51.100.3"}, ipAddress: null},
            {headers: {"x-real-ip": "::ffff:not-an-ip"}, ipAddress: null},
            {headers: {}, ipAddress: null},
        ];
        for (const {headers, ipAddress} of visitorIpAddresses) {
            assert.equal(resolveUmamiVisitor(new Request(COLLECT_ENDPOINT_URL, {headers})).ipAddress, ipAddress, JSON.stringify(headers));
        }
    });

    it("reads the Umami session token the tracker sends", () => {
        const knownVisitorRequest = new Request(COLLECT_ENDPOINT_URL, {headers: {"x-umami-cache": "session-token"}});
        assert.equal(resolveUmamiVisitor(knownVisitorRequest).sessionToken, "session-token");
        assert.equal(resolveUmamiVisitor(new Request(COLLECT_ENDPOINT_URL)).sessionToken, null);
    });
});

describe("parseOwnWebsiteCollectRequest", () => {
    it("accepts performance requests only for this website", () => {
        const performanceRequest = {type: "performance", payload: {website: UMAMI_WEBSITE_ID, data: {lcp: 120}}};
        assert.deepEqual(parseOwnWebsiteCollectRequest(JSON.stringify(performanceRequest)), performanceRequest);
        assert.equal(parseOwnWebsiteCollectRequest(JSON.stringify({
            ...performanceRequest, payload: {...performanceRequest.payload, website: "another-website"},
        })), null);
    });

    it("removes reserved session properties from client identifies and keeps all other keys", () => {
        const data = {
            ip: "forged", ip_timezone: "forged", ip_: "forged", network_asn: "forged", network_: "forged",
            client_user_agent: "forged", client_: "forged", plan: "pro", network: "keep", client: "keep",
            ipAddress: "keep", source_ip: "keep", IP: "keep", count: 2,
        };
        const identify = {type: "identify", payload: {website: UMAMI_WEBSITE_ID, id: "visitor-id", data}};
        assert.deepEqual(parseOwnWebsiteCollectRequest(JSON.stringify(identify)), {
            ...identify,
            payload: {...identify.payload, data: {plan: "pro", network: "keep", client: "keep", ipAddress: "keep", source_ip: "keep", IP: "keep", count: 2}},
        });
        const event = {...identify, type: "event"};
        assert.deepEqual(parseOwnWebsiteCollectRequest(JSON.stringify(event)), event);
    });

    it("keeps identify data unchanged when it is not an object", () => {
        for (const data of [null, "visitor", 2]) {
            const identify = {type: "identify", payload: {website: UMAMI_WEBSITE_ID, data}};
            assert.deepEqual(parseOwnWebsiteCollectRequest(JSON.stringify(identify)), identify);
        }
    });
});

describe("buildUmamiSessionPropertiesRequest", () => {
    it("preserves string distinct ids and drops non-string ids", () => {
        for (const id of ["visitor-id", "", 42, null, undefined]) {
            const request = buildUmamiSessionPropertiesRequest({type: "event", payload: {id}}, {ip: "8.8.8.8"});
            assert.equal(request.type, "identify");
            assert.equal(request.payload.id, typeof id === "string" ? id : undefined);
            assert.deepEqual(request.payload.data, {ip: "8.8.8.8"});
        }
    });
});

describe("postToUmamiCollectEndpoint", () => {
    afterEach(() => mock.restoreAll());

    it("strips the payload fields that would override what Umami detects about the visitor", async () => {
        const fetchMock = mockUmamiResponse();
        const forgedPayload = {
            website: UMAMI_WEBSITE_ID,
            url: "/",
            title: "Home",
            data: {source: "test"},
            ip: "198.51.100.1",
            userAgent: "forged",
            browser: "forged",
            os: "forged",
            device: "forged",
            timestamp: 1,
        };
        await postToUmamiCollectEndpoint(UMAMI_SERVER_URL, {type: "event", payload: forgedPayload}, ANONYMOUS_VISITOR);
        const forwardedRequest = readForwardedRequest(fetchMock);
        assert.equal(forwardedRequest.url, "https://umami.example.com/api/send");
        assert.deepEqual(forwardedRequest.body, {
            type: "event",
            payload: {website: UMAMI_WEBSITE_ID, url: "/", title: "Home", data: {source: "test"}},
        });
    });

    it("sends only the content type, the visitor's user agent, the client IP header and the session token", async () => {
        const fetchMock = mockUmamiResponse();
        const visitorRequest = new Request(COLLECT_ENDPOINT_URL, {
            headers: {
                "user-agent": "Mozilla/5.0",
                "x-forwarded-for": "203.0.113.7",
                "content-type": "text/plain",
                "accept-language": "en-US",
                "x-umami-cache": "cache-token",
                "x-umami-website-id": UMAMI_WEBSITE_ID,
                cookie: "session=secret",
                authorization: "Bearer secret",
            },
        });
        const ownWebsiteEvent = {type: "event", payload: {website: UMAMI_WEBSITE_ID, url: "/"}};
        await postToUmamiCollectEndpoint(UMAMI_SERVER_URL, ownWebsiteEvent, resolveUmamiVisitor(visitorRequest));
        assert.deepEqual(readForwardedRequest(fetchMock).headers, {
            "content-type": "application/json",
            "user-agent": "Mozilla/5.0",
            "x-umami-client-ip": "203.0.113.7",
            "x-umami-cache": "cache-token",
        });
    });

    it("answers null when the Umami server cannot be reached", async () => {
        mock.method(globalThis, "fetch", async () => Promise.reject(new TypeError("fetch failed")));
        const ownWebsiteEvent = {type: "event", payload: {website: UMAMI_WEBSITE_ID, url: "/"}};
        assert.equal(await postToUmamiCollectEndpoint(UMAMI_SERVER_URL, ownWebsiteEvent, ANONYMOUS_VISITOR), null);
    });
});

describe("findNewUmamiSessionToken", () => {
    it("returns the session token Umami hands to a visitor that had none", () => {
        assert.equal(findNewUmamiSessionToken(ANONYMOUS_VISITOR, createUmamiAnswer('{"cache":"session-token"}')), "session-token");
    });

    it("returns null for known sessions, bots, failed requests and answers without a token", () => {
        const knownVisitor = {...ANONYMOUS_VISITOR, sessionToken: "session-token"};
        assert.equal(findNewUmamiSessionToken(knownVisitor, createUmamiAnswer('{"cache":"other-token"}')), null);
        const umamiAnswersWithoutNewToken = [
            createUmamiAnswer('{"beep":"boop"}'),
            createUmamiAnswer('{"cache":"session-token"}', 400),
            createUmamiAnswer('{"cache":1}'),
            createUmamiAnswer("not json"),
            createUmamiAnswer(""),
        ];
        for (const umamiAnswer of umamiAnswersWithoutNewToken) {
            assert.equal(findNewUmamiSessionToken(ANONYMOUS_VISITOR, umamiAnswer), null, umamiAnswer.body);
        }
    });
});
