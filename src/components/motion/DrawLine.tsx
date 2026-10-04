"use client";

import React from "react";
import {useRevealAnimation} from "@/components/motion/useRevealAnimation";
import {DRAW_DOWN_KEYFRAMES, UNDRAWN_STYLE} from "@/lib/motion/keyframes";
import {motionTimings} from "@/theme/motion";

export function DrawLine({style}: { style: React.CSSProperties }) {
    const elementRef = useRevealAnimation<HTMLSpanElement>({
        keyframes: DRAW_DOWN_KEYFRAMES,
        durationSeconds: motionTimings.timelineRailSeconds,
        isChainedToList: true,
    });
    return <span ref={elementRef} aria-hidden style={{display: 'block', ...UNDRAWN_STYLE, ...style}}/>;
}
