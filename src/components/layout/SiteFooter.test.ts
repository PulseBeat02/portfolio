import assert from "node:assert/strict";
import {describe, it} from "node:test";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {siteMetadata} from "@/data/site";
import {SiteFooter} from "./SiteFooter.tsx";

const STYLE_ELEMENT_PATTERN = /<style[^>]*>[\s\S]*?<\/style>/g;
const ELEMENT_TAG_PATTERN = /<[^>]+>/g;
const LINK_PATTERN = /<a [^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g;
const FOOTER_SEPARATOR = "·";

function renderFooterMarkup(): string {
    return renderToStaticMarkup(createElement(SiteFooter)).replace(STYLE_ELEMENT_PATTERN, "");
}

describe("SiteFooter", () => {
    it("links only to the source repository", () => {
        const footerLinks = [...renderFooterMarkup().matchAll(LINK_PATTERN)].map(([, href, label]) => ({href, label}));
        assert.deepEqual(footerLinks, [{href: siteMetadata.sourceRepositoryUrl, label: "Source"}]);
    });

    it("puts one separator between items and none after the last", () => {
        const footerText = renderFooterMarkup().replace(ELEMENT_TAG_PATTERN, "");
        const footerItems = footerText.split(FOOTER_SEPARATOR).map((footerItem) => footerItem.trim());
        assert.equal(footerItems.length, 3, footerText);
        assert.equal(footerItems.at(-1), "Source");
        assert.ok(footerItems.every((footerItem) => footerItem !== ""), footerText);
    });
});
