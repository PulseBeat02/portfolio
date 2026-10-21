export const UMAMI_WEBSITE_ID = "95ba9f92-bbb9-4407-a8b1-13c7fcce3b90";

export const ANALYTICS_PROXY_BASE_PATH = "/ux";

export const ANALYTICS_PROXY_ROUTES = {
    trackerScript: "script.js",
    recorderScript: "recorder.js",
    collectEndpoint: "api/send",
    recordEndpoint: "api/record",
    recorderConfiguration: `api/websites/${UMAMI_WEBSITE_ID}/recorder`,
} as const;

export const ANALYTICS_PROXY_TRACKER_SCRIPT_PATH = `${ANALYTICS_PROXY_BASE_PATH}/${ANALYTICS_PROXY_ROUTES.trackerScript}`;
export const ANALYTICS_PROXY_RECORDER_SCRIPT_PATH = `${ANALYTICS_PROXY_BASE_PATH}/${ANALYTICS_PROXY_ROUTES.recorderScript}`;

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
