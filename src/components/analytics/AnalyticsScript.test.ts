import assert from "node:assert/strict";
import {describe, it} from "node:test";
import Script from "next/script";
import type {ReactElement} from "react";
import {SITE_HOSTNAME} from "@/data/site";
import {UMAMI_WEBSITE_ID} from "@/lib/analytics";
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
