import assert from "node:assert/strict";
import {describe, it} from "node:test";
import {buildSecurityHeaderRules, serializeContentSecurityPolicy, type HeaderRule} from "./security-headers.ts";

const DOCUMENT_PATH_SOURCES = ["/documents/:path*", "/resume"];

function findHeaderValue(headerRule: HeaderRule, headerKey: string): string | undefined {
    return headerRule.headers.find((header) => header.key === headerKey)?.value;
}

describe("serializeContentSecurityPolicy", () => {
    it("joins directives and their sources", () => {
        assert.equal(
            serializeContentSecurityPolicy({"default-src": ["'self'"], "img-src": ["'self'", "data:"]}),
            "default-src 'self'; img-src 'self' data:",
        );
    });
});

describe("buildSecurityHeaderRules", () => {
    it("applies a strict page policy to every path in production", () => {
        const [siteWideRule] = buildSecurityHeaderRules({isDevelopment: false, documentPathSources: DOCUMENT_PATH_SOURCES});
        const contentSecurityPolicy = findHeaderValue(siteWideRule, "Content-Security-Policy") ?? "";
        assert.equal(siteWideRule.source, "/:path*");
        assert.match(contentSecurityPolicy, /object-src 'none'/);
        assert.match(contentSecurityPolicy, /frame-ancestors 'self'/);
        assert.doesNotMatch(contentSecurityPolicy, /unsafe-eval/);
        assert.equal(findHeaderValue(siteWideRule, "X-Content-Type-Options"), "nosniff");
    });

    it("allows eval and websockets only in development", () => {
        const [siteWideRule] = buildSecurityHeaderRules({isDevelopment: true, documentPathSources: []});
        const contentSecurityPolicy = findHeaderValue(siteWideRule, "Content-Security-Policy") ?? "";
        assert.match(contentSecurityPolicy, /script-src [^;]*'unsafe-eval'/);
        assert.match(contentSecurityPolicy, /connect-src [^;]*ws:/);
    });

    it("overrides the page policy for documents so the PDF viewer is unrestricted", () => {
        const [, ...documentRules] = buildSecurityHeaderRules({isDevelopment: false, documentPathSources: DOCUMENT_PATH_SOURCES});
        assert.deepEqual(documentRules.map((documentRule) => documentRule.source), DOCUMENT_PATH_SOURCES);
        for (const documentRule of documentRules) {
            assert.equal(findHeaderValue(documentRule, "Content-Security-Policy"), "frame-ancestors 'self'");
        }
    });
});
