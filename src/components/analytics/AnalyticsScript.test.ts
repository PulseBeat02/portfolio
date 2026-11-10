import assert from "node:assert/strict";
import {describe, it} from "node:test";
import Script from "next/script";
import type {ReactElement} from "react";
import {SITE_HOSTNAME} from "@/data/site";
import {buildAnalyticsEventAttributes, UMAMI_WEBSITE_ID} from "@/lib/analytics";
import {AnalyticsScript} from "./AnalyticsScript.tsx";

describe("AnalyticsScript", () => {
    it("loads the tracker and the session recorder through the analytics proxy", () => {
        const analyticsScripts: ReactElement[] = AnalyticsScript().props.children;
        assert.deepEqual(analyticsScripts.map(({type, props}) => ({type, props})), [
            {
                type: Script,
                props: {
                    src: "/ux/script.js",
                    "data-website-id": UMAMI_WEBSITE_ID,
                    "data-host-url": "/ux",
                    "data-domains": SITE_HOSTNAME,
                    "data-performance": "true",
                    strategy: "afterInteractive",
                },
            },
            {
                type: Script,
                props: {
                    src: "/ux/recorder.js",
                    "data-website-id": UMAMI_WEBSITE_ID,
                    "data-host-url": "/ux",
                    strategy: "afterInteractive",
                },
            },
        ]);
    });
});

describe("buildAnalyticsEventAttributes", () => {
    it("returns the event name without optional event data", () => {
        assert.deepEqual(buildAnalyticsEventAttributes("resume-open"), {"data-umami-event": "resume-open"});
        assert.deepEqual(buildAnalyticsEventAttributes("resume-open", {}), {"data-umami-event": "resume-open"});
    });

    it("adds one attribute for each event data entry", () => {
        assert.deepEqual(buildAnalyticsEventAttributes("resume-open", {url: "/resume.pdf", source: "profile", empty: ""}), {
            "data-umami-event": "resume-open",
            "data-umami-event-url": "/resume.pdf",
            "data-umami-event-source": "profile",
            "data-umami-event-empty": "",
        });
    });
});
