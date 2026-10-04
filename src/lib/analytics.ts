export const UMAMI_WEBSITE_ID = "95ba9f92-bbb9-4407-a8b1-13c7fcce3b90";

export const UMAMI_DASHBOARD_URL = `https://cloud.umami.is/analytics/us/websites/${UMAMI_WEBSITE_ID}`;

export const UMAMI_UPSTREAM_TRACKER_SCRIPT_URL = "https://cloud.umami.is/script.js";

export const UMAMI_UPSTREAM_COLLECT_ENDPOINT_URL = "https://gateway.umami.is/api/send";

export const ANALYTICS_PROXY_BASE_PATH = "/ux";

export const ANALYTICS_PROXY_ROUTES = {
    trackerScript: "script.js",
    collectEndpoint: "api/send",
} as const;

export const ANALYTICS_PROXY_TRACKER_SCRIPT_PATH = `${ANALYTICS_PROXY_BASE_PATH}/${ANALYTICS_PROXY_ROUTES.trackerScript}`;

const UMAMI_EVENT_ATTRIBUTE_NAME = "data-umami-event";

function toEventNameSlug(text: string): string {
    return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const analyticsEventNames = {
    resumeOpened: "resume-open",
    socialLinkClicked: (socialLinkLabel: string) => `social-${toEventNameSlug(socialLinkLabel)}`,
    projectLinkClicked: (projectTitle: string) => `project-${toEventNameSlug(projectTitle)}`,
} as const;

export function buildAnalyticsEventAttributes(eventName: string) {
    return {[UMAMI_EVENT_ATTRIBUTE_NAME]: eventName} as const;
}
