import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {describe, it} from "node:test";
import {DRAW_DOWN_KEYFRAMES, FADE_IN_KEYFRAMES} from "@/lib/motion/keyframes";
import {buildRevealAnimationStyle} from "./reveal-scheduler.ts";

const GLOBAL_STYLESHEET = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");

describe("buildRevealAnimationStyle", () => {
    it("plays the reveal as an inline css animation that holds its first frame through the delay and its last after", () => {
        const fadeIn = {keyframes: FADE_IN_KEYFRAMES, durationSeconds: 1.2, easing: "ease-out"};
        assert.equal(buildRevealAnimationStyle(fadeIn, 0.1 + 0.2, false), "reveal-fade-in 1200ms ease-out 300ms both");
    });

    it("keeps the fade but drops the movement when the visitor prefers reduced motion", () => {
        const fadeIn = {keyframes: FADE_IN_KEYFRAMES, durationSeconds: 1.2, easing: "ease-out"};
        const drawDown = {keyframes: DRAW_DOWN_KEYFRAMES, durationSeconds: 0.32, easing: "ease-out"};
        assert.equal(buildRevealAnimationStyle(fadeIn, 0, true), "reveal-fade-in 1200ms ease-out 0ms both");
        assert.equal(buildRevealAnimationStyle(drawDown, 0, true), "reveal-drawn 320ms ease-out 0ms both");
    });

    it("names only keyframes that the global stylesheet defines", () => {
        for (const {animationName, reducedMotionAnimationName} of [FADE_IN_KEYFRAMES, DRAW_DOWN_KEYFRAMES]) {
            for (const keyframesName of [animationName, reducedMotionAnimationName]) {
                assert.match(GLOBAL_STYLESHEET, new RegExp(`@keyframes ${keyframesName} \\{`), keyframesName);
            }
        }
    });
});
