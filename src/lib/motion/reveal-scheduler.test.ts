import assert from "node:assert/strict";
import {describe, it} from "node:test";
import {DRAW_DOWN_KEYFRAMES, FADE_IN_KEYFRAMES} from "@/lib/motion/keyframes";
import {buildCssKeyframes} from "./reveal-scheduler.ts";

describe("buildCssKeyframes", () => {
    it("turns the reveal keyframes into the same css keyframes", () => {
        assert.equal(buildCssKeyframes(FADE_IN_KEYFRAMES), "0%{opacity:0}100%{opacity:1}");
        assert.equal(buildCssKeyframes(DRAW_DOWN_KEYFRAMES), "0%{transform:scaleY(0)}100%{transform:scaleY(1)}");
    });

    it("keeps given offsets and writes css property names", () => {
        const keyframes = [{opacity: 0, transformOrigin: "top"}, {opacity: 0.5, offset: 0.25}, {opacity: 1}];
        assert.equal(buildCssKeyframes(keyframes), "0%{opacity:0;transform-origin:top}25%{opacity:0.5}100%{opacity:1}");
    });
});
