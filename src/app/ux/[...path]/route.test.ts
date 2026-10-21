import assert from "node:assert/strict";
import {afterEach, beforeEach, describe, it, mock} from "node:test";
// gives next/server the AsyncLocalStorage of a Next.js server, so it must load first
import "next/dist/server/node-environment-baseline.js";
import {NextRequest} from "next/server";
import {workAsyncStorage} from "next/dist/server/app-render/work-async-storage.external.js";
import {workUnitAsyncStorage} from "next/dist/server/app-render/work-unit-async-storage.external.js";
import {UMAMI_WEBSITE_ID} from "@/lib/analytics";
import {GET, POST} from "./route.ts";

const UMAMI_SERVER_URL = "https://umami.example.com";
const PROXY_URL = "http://localhost/ux";
const RECORDER_CONFIGURATION_ROUTE = `api/websites/${UMAMI_WEBSITE_ID}/recorder`;
const OTHER_WEBSITE_ID = "00000000-0000-0000-0000-000000000000";

const VISITOR_IP_ADDRESS = "203.0.113.7";
const UMAMI_SESSION_TOKEN = "session-token";
const NEW_SESSION_ANSWER = {cache: UMAMI_SESSION_TOKEN, sessionId: "session-id", visitId: "visit-id"};
const BOT_ANSWER = {beep: "boop"};

const OWN_WEBSITE_EVENT = JSON.stringify({type: "event", payload: {website: UMAMI_WEBSITE_ID, url: "/"}});
const OWN_WEBSITE_RECORDING = JSON.stringify({type: "record", payload: {website: UMAMI_WEBSITE_ID, events: [{type: 4}], timestamp: 1}});

type AfterTask = () => Promise<void>;

function createRouteContext(proxyRoute: string) {
    return {params: Promise.resolve({path: proxyRoute.split("/")})};
}

function getFromProxy(proxyRoute: string): Promise<Response> {
    return GET(new NextRequest(`${PROXY_URL}/${proxyRoute}`), createRouteContext(proxyRoute));
}

async function postToProxy(proxyRoute: string, requestBody: string, headers: HeadersInit = {}): Promise<Response> {
    const proxyRequest = new NextRequest(`${PROXY_URL}/${proxyRoute}`, {method: "POST", body: requestBody, headers});
    const afterTasks: AfterTask[] = [];
    // after() only runs inside a Next.js request scope
    const workStore = {afterContext: {after: (afterTask: AfterTask) => afterTasks.push(afterTask)}};
    const proxyResponse = await workAsyncStorage.run(workStore as never, () =>
        workUnitAsyncStorage.run({} as never, () => POST(proxyRequest, createRouteContext(proxyRoute))));
    await Promise.all(afterTasks.map((afterTask) => afterTask()));
    return proxyResponse;
}

function createRequestOfSize(type: string, requestBytes: number): string {
    const unpaddedRequest = JSON.stringify({type, payload: {website: UMAMI_WEBSITE_ID, padding: ""}});
    return JSON.stringify({type, payload: {website: UMAMI_WEBSITE_ID, padding: "x".repeat(requestBytes - unpaddedRequest.length)}});
}

function mockUmamiServer(umamiAnswer: (umamiUrl: string) => Response) {
    const fakeFetch: typeof fetch = async (input) => umamiAnswer(String(input));
    return mock.method(globalThis, "fetch", fakeFetch);
}

function readForwardedRequests(fetchMock: ReturnType<typeof mockUmamiServer>) {
    return fetchMock.mock.calls.map(({arguments: [forwardedUrl, forwardedInit]}) => ({
        url: String(forwardedUrl),
        headers: Object.fromEntries(new Headers(forwardedInit?.headers)),
        body: forwardedInit?.body === undefined ? undefined : JSON.parse(String(forwardedInit.body)),
        cache: forwardedInit?.cache,
    }));
}

async function assertAnalyticsIsOff(umamiServerUrlConfiguration: string) {
    for (const proxyRoute of ["script.js", "recorder.js", RECORDER_CONFIGURATION_ROUTE]) {
        assert.equal((await getFromProxy(proxyRoute)).status, 404, `${proxyRoute} with ${umamiServerUrlConfiguration}`);
    }
    assert.equal((await postToProxy("api/send", OWN_WEBSITE_EVENT)).status, 204, umamiServerUrlConfiguration);
    assert.equal((await postToProxy("api/record", OWN_WEBSITE_RECORDING)).status, 204, umamiServerUrlConfiguration);
}

afterEach(() => {
    mock.restoreAll();
    delete process.env.UMAMI_URL;
});

describe("analytics proxy without a usable UMAMI_URL", () => {
    it("serves no scripts or recorder configuration and drops events and recordings without any outbound request", async () => {
        const fetchMock = mockUmamiServer(() => Response.json({}));
        delete process.env.UMAMI_URL;
        await assertAnalyticsIsOff("unset");
        for (const unusableUmamiServerUrl of ["", "umami.example.com", "ftp://umami.example.com"]) {
            process.env.UMAMI_URL = unusableUmamiServerUrl;
            await assertAnalyticsIsOff(unusableUmamiServerUrl);
        }
        assert.equal(fetchMock.mock.callCount(), 0);
    });
});

describe("analytics proxy with UMAMI_URL", () => {
    beforeEach(() => {
        process.env.UMAMI_URL = UMAMI_SERVER_URL;
        delete process.env.IPINFO_TOKEN;
    });

    it("serves the tracker and recorder scripts of the Umami server", async () => {
        const fetchMock = mockUmamiServer((umamiUrl) => new Response(`// ${umamiUrl}`));
        for (const scriptRoute of ["script.js", "recorder.js"]) {
            const scriptResponse = await getFromProxy(scriptRoute);
            assert.equal(scriptResponse.status, 200);
            assert.equal(scriptResponse.headers.get("cache-control"), "public, max-age=86400");
            assert.equal(await scriptResponse.text(), `// https://umami.example.com/${scriptRoute}`);
        }
        assert.equal(fetchMock.mock.callCount(), 2);
    });

    it("passes the recorder configuration of this website through without caching it", async () => {
        const fetchMock = mockUmamiServer(() => Response.json({enabled: false}));
        const configurationResponse = await getFromProxy(RECORDER_CONFIGURATION_ROUTE);
        assert.equal(configurationResponse.status, 200);
        assert.equal(configurationResponse.headers.get("cache-control"), "no-store");
        assert.deepEqual(await configurationResponse.json(), {enabled: false});
        const [configurationRequest] = readForwardedRequests(fetchMock);
        assert.equal(configurationRequest.url, `https://umami.example.com/api/websites/${UMAMI_WEBSITE_ID}/recorder`);
        assert.equal(configurationRequest.cache, "no-store");
    });

    it("answers 404 for other websites and other proxy routes without any outbound request", async () => {
        const fetchMock = mockUmamiServer(() => Response.json({}));
        for (const proxyRoute of [`api/websites/${OTHER_WEBSITE_ID}/recorder`, "api/send", "api/record", "other.js"]) {
            assert.equal((await getFromProxy(proxyRoute)).status, 404, proxyRoute);
        }
        for (const proxyRoute of ["api/other", "script.js", RECORDER_CONFIGURATION_ROUTE]) {
            assert.equal((await postToProxy(proxyRoute, OWN_WEBSITE_EVENT)).status, 404, proxyRoute);
        }
        assert.equal(fetchMock.mock.callCount(), 0);
    });

    it("rejects everything but events and identifies of this website on the collect endpoint with 400", async () => {
        const fetchMock = mockUmamiServer(() => Response.json({}));
        const foreignCollectRequestBodies = [
            JSON.stringify({type: "event", payload: {website: OTHER_WEBSITE_ID, url: "/"}}),
            JSON.stringify({type: "event", payload: {url: "/"}}),
            JSON.stringify({type: "pageview", payload: {website: UMAMI_WEBSITE_ID}}),
            OWN_WEBSITE_RECORDING,
            JSON.stringify({payload: {website: UMAMI_WEBSITE_ID}}),
            JSON.stringify({type: "event"}),
            JSON.stringify([]),
            "not json",
        ];
        for (const foreignCollectRequestBody of foreignCollectRequestBodies) {
            assert.equal((await postToProxy("api/send", foreignCollectRequestBody)).status, 400, foreignCollectRequestBody);
        }
        assert.equal(fetchMock.mock.callCount(), 0);
    });

    it("rejects everything but recordings and heatmaps of this website on the record endpoint with 400", async () => {
        const fetchMock = mockUmamiServer(() => Response.json({}));
        const foreignRecordRequestBodies = [
            JSON.stringify({type: "record", payload: {website: OTHER_WEBSITE_ID, events: []}}),
            JSON.stringify({type: "heatmap", payload: {events: []}}),
            OWN_WEBSITE_EVENT,
            JSON.stringify({type: "record"}),
            "not json",
        ];
        for (const foreignRecordRequestBody of foreignRecordRequestBodies) {
            assert.equal((await postToProxy("api/record", foreignRecordRequestBody)).status, 400, foreignRecordRequestBody);
        }
        assert.equal(fetchMock.mock.callCount(), 0);
    });

    it("rejects bodies over the byte limit of each endpoint with 413", async () => {
        const fetchMock = mockUmamiServer(() => Response.json({}));
        const multibyteEvent = JSON.stringify({type: "event", payload: {website: UMAMI_WEBSITE_ID, title: "é".repeat(8 * 1024 + 1)}});
        assert.equal((await postToProxy("api/send", createRequestOfSize("event", 16 * 1024))).status, 200);
        assert.equal((await postToProxy("api/send", createRequestOfSize("event", 16 * 1024 + 1))).status, 413);
        assert.equal((await postToProxy("api/send", multibyteEvent)).status, 413);
        assert.equal((await postToProxy("api/record", createRequestOfSize("record", 1_000_000))).status, 200);
        assert.equal((await postToProxy("api/record", createRequestOfSize("record", 1_000_001))).status, 413);
        assert.equal(fetchMock.mock.callCount(), 2);
    });

    it("forwards recordings unchanged with only the allowed headers and passes Umami's answer through", async () => {
        const fetchMock = mockUmamiServer(() => new Response("recorded", {status: 202, headers: {"content-type": "text/plain"}}));
        const recordResponse = await postToProxy("api/record", OWN_WEBSITE_RECORDING, {
            "user-agent": "Mozilla/5.0",
            "x-forwarded-for": `${VISITOR_IP_ADDRESS}, 198.51.100.2`,
            "content-type": "text/plain",
            "accept-language": "en-US",
            "x-umami-cache": UMAMI_SESSION_TOKEN,
            "x-umami-website-id": UMAMI_WEBSITE_ID,
            cookie: "session=secret",
            authorization: "Bearer secret",
        });
        assert.equal(recordResponse.status, 202);
        assert.equal(await recordResponse.text(), "recorded");
        assert.deepEqual(readForwardedRequests(fetchMock), [{
            url: "https://umami.example.com/api/record",
            headers: {
                "content-type": "application/json",
                "user-agent": "Mozilla/5.0",
                "x-umami-client-ip": VISITOR_IP_ADDRESS,
                "x-umami-cache": UMAMI_SESSION_TOKEN,
            },
            body: JSON.parse(OWN_WEBSITE_RECORDING),
            cache: "no-store",
        }]);
    });

    it("forwards the sanitised event to the Umami server and passes its answer through", async () => {
        const fetchMock = mockUmamiServer(() => new Response("bad request", {status: 400, headers: {"content-type": "text/plain"}}));
        const forgedEvent = JSON.stringify({type: "event", payload: {website: UMAMI_WEBSITE_ID, url: "/", ip: "198.51.100.1", device: "forged"}});
        const collectResponse = await postToProxy("api/send", forgedEvent, {"x-forwarded-for": VISITOR_IP_ADDRESS});
        assert.equal(collectResponse.status, 400);
        assert.equal(await collectResponse.text(), "bad request");
        const [eventRequest] = readForwardedRequests(fetchMock);
        assert.equal(fetchMock.mock.callCount(), 1);
        assert.equal(eventRequest.url, "https://umami.example.com/api/send");
        assert.deepEqual(eventRequest.body, {type: "event", payload: {website: UMAMI_WEBSITE_ID, url: "/"}});
    });

    it("tags a new session with the visitor's IP address under the session token Umami answers with", async () => {
        const fetchMock = mockUmamiServer(() => Response.json(NEW_SESSION_ANSWER));
        const collectResponse = await postToProxy("api/send", OWN_WEBSITE_EVENT, {"user-agent": "Mozilla/5.0", "x-forwarded-for": VISITOR_IP_ADDRESS});
        assert.deepEqual(await collectResponse.json(), NEW_SESSION_ANSWER);
        const [eventRequest, identifyRequest] = readForwardedRequests(fetchMock);
        assert.equal(fetchMock.mock.callCount(), 2);
        assert.equal(eventRequest.headers["x-umami-cache"], undefined);
        assert.deepEqual(identifyRequest, {
            url: "https://umami.example.com/api/send",
            headers: {
                "content-type": "application/json",
                "user-agent": "Mozilla/5.0",
                "x-umami-client-ip": VISITOR_IP_ADDRESS,
                "x-umami-cache": UMAMI_SESSION_TOKEN,
            },
            body: {type: "identify", payload: {website: UMAMI_WEBSITE_ID, url: "/", data: {ip: VISITOR_IP_ADDRESS}}},
            cache: "no-store",
        });
    });

    it("sends no identify for known sessions, bots and visitors without a valid address", async () => {
        const visitorsWithoutIdentify: {umamiAnswer: object; headers: Record<string, string>}[] = [
            {umamiAnswer: NEW_SESSION_ANSWER, headers: {"x-forwarded-for": VISITOR_IP_ADDRESS, "x-umami-cache": UMAMI_SESSION_TOKEN}},
            {umamiAnswer: BOT_ANSWER, headers: {"x-forwarded-for": VISITOR_IP_ADDRESS}},
            {umamiAnswer: NEW_SESSION_ANSWER, headers: {"x-forwarded-for": "not-an-ip"}},
            {umamiAnswer: NEW_SESSION_ANSWER, headers: {}},
        ];
        for (const {umamiAnswer, headers} of visitorsWithoutIdentify) {
            const fetchMock = mockUmamiServer(() => Response.json(umamiAnswer));
            await postToProxy("api/send", OWN_WEBSITE_EVENT, headers);
            assert.equal(fetchMock.mock.callCount(), 1, JSON.stringify(headers));
            mock.restoreAll();
        }
    });

    it("tags every new session without remembering earlier ones", async () => {
        const fetchMock = mockUmamiServer(() => Response.json(NEW_SESSION_ANSWER));
        await postToProxy("api/send", OWN_WEBSITE_EVENT, {"x-forwarded-for": VISITOR_IP_ADDRESS});
        await postToProxy("api/send", OWN_WEBSITE_EVENT, {"x-forwarded-for": VISITOR_IP_ADDRESS});
        const identifyRequests = readForwardedRequests(fetchMock).filter(({body}) => body.type === "identify");
        assert.equal(identifyRequests.length, 2);
    });
});
