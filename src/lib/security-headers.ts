export interface HttpHeader {
    key: string;
    value: string;
}

export interface HeaderRule {
    source: string;
    headers: HttpHeader[];
}

type ContentSecurityPolicyDirectives = Record<string, readonly string[]>;

const SELF = "'self'";
const NONE = "'none'";
const UNSAFE_INLINE = "'unsafe-inline'";
const UNSAFE_EVAL = "'unsafe-eval'";

const ALL_PATHS_SOURCE = "/:path*";

const DISABLED_BROWSER_FEATURES = [
    "camera",
    "microphone",
    "geolocation",
    "payment",
    "usb",
    "browsing-topics",
    "interest-cohort",
] as const;

function buildPageContentSecurityPolicyDirectives(isDevelopment: boolean): ContentSecurityPolicyDirectives {
    return {
        "default-src": [SELF],
        "script-src": [SELF, UNSAFE_INLINE, ...(isDevelopment ? [UNSAFE_EVAL] : [])],
        "style-src": [SELF, UNSAFE_INLINE],
        "img-src": [SELF, "data:", "blob:"],
        "font-src": [SELF],
        "connect-src": [SELF, ...(isDevelopment ? ["ws:"] : [])],
        "media-src": [SELF],
        "frame-src": [SELF],
        "frame-ancestors": [SELF],
        "object-src": [NONE],
        "base-uri": [SELF],
        "form-action": [SELF],
    };
}

const DOCUMENT_CONTENT_SECURITY_POLICY_DIRECTIVES: ContentSecurityPolicyDirectives = {
    "frame-ancestors": [SELF],
};

export function serializeContentSecurityPolicy(directives: ContentSecurityPolicyDirectives): string {
    return Object.entries(directives)
        .map(([directiveName, directiveSources]) => [directiveName, ...directiveSources].join(" "))
        .join("; ");
}

function serializePermissionsPolicy(disabledFeatures: readonly string[]): string {
    return disabledFeatures.map((featureName) => `${featureName}=()`).join(", ");
}

const SITE_WIDE_SECURITY_HEADERS: readonly HttpHeader[] = [
    {key: "X-Content-Type-Options", value: "nosniff"},
    {key: "X-Frame-Options", value: "SAMEORIGIN"},
    {key: "Referrer-Policy", value: "strict-origin-when-cross-origin"},
    {key: "Cross-Origin-Opener-Policy", value: "same-origin"},
    {key: "Permissions-Policy", value: serializePermissionsPolicy(DISABLED_BROWSER_FEATURES)},
];

function buildContentSecurityPolicyHeader(directives: ContentSecurityPolicyDirectives): HttpHeader {
    return {key: "Content-Security-Policy", value: serializeContentSecurityPolicy(directives)};
}

export function buildSecurityHeaderRules({isDevelopment, documentPathSources}: {
    isDevelopment: boolean;
    documentPathSources: readonly string[];
}): HeaderRule[] {
    const pageContentSecurityPolicyHeader = buildContentSecurityPolicyHeader(buildPageContentSecurityPolicyDirectives(isDevelopment));
    const documentContentSecurityPolicyHeader = buildContentSecurityPolicyHeader(DOCUMENT_CONTENT_SECURITY_POLICY_DIRECTIVES);
    return [
        {source: ALL_PATHS_SOURCE, headers: [...SITE_WIDE_SECURITY_HEADERS, pageContentSecurityPolicyHeader]},
        ...documentPathSources.map((documentPathSource) => ({
            source: documentPathSource,
            headers: [documentContentSecurityPolicyHeader],
        })),
    ];
}
