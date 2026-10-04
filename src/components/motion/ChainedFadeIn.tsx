"use client";

import React from "react";
import {useRevealAnimation} from "@/components/motion/useRevealAnimation";
import {FADE_IN_KEYFRAMES, HIDDEN_STYLE} from "@/lib/motion/keyframes";
import {motionTimings} from "@/theme/motion";

export function ChainedFadeIn({style}: { style: React.CSSProperties }) {
    const elementRef = useRevealAnimation<HTMLSpanElement>({
        keyframes: FADE_IN_KEYFRAMES,
        durationSeconds: motionTimings.timelineEndDotSeconds,
        isChainedToList: true,
    });
    return <span ref={elementRef} aria-hidden style={{display: 'block', ...HIDDEN_STYLE, ...style}}/>;
}
