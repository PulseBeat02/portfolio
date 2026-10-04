import Script from "next/script";
import {SITE_HOSTNAME} from "@/data/site";
import {ANALYTICS_PROXY_BASE_PATH, ANALYTICS_PROXY_TRACKER_SCRIPT_PATH, UMAMI_WEBSITE_ID} from "@/lib/analytics";

export function AnalyticsScript() {
    return (
        <Script
            src={ANALYTICS_PROXY_TRACKER_SCRIPT_PATH}
            data-website-id={UMAMI_WEBSITE_ID}
            data-host-url={ANALYTICS_PROXY_BASE_PATH}
            data-domains={SITE_HOSTNAME}
            data-do-not-track="true"
            strategy="afterInteractive"
        />
    );
}
