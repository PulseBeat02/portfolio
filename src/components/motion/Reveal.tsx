"use client";

import React, {createElement} from "react";
import {useRevealAnimation} from "@/components/motion/useRevealAnimation";
import {FADE_IN_KEYFRAMES, HIDDEN_STYLE} from "@/lib/motion/keyframes";
import {REVEAL_PAIR_ATTRIBUTE} from "@/lib/motion/reveal-scheduler";
import {motionTimings} from "@/theme/motion";

interface RevealProps {
    children: React.ReactNode;
    as?: 'div' | 'li';
    durationSeconds?: number;
    pairIndex?: number;
    style?: React.CSSProperties;
}

export function Reveal({children, as = 'div', durationSeconds = motionTimings.revealFadeSeconds, pairIndex, style}: RevealProps) {
    const elementRef = useRevealAnimation<HTMLElement>({keyframes: FADE_IN_KEYFRAMES, durationSeconds});
    return createElement(as, {
        ref: elementRef,
        style: {...HIDDEN_STYLE, ...style},
        [REVEAL_PAIR_ATTRIBUTE]: pairIndex,
    }, children);
}
