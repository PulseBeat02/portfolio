"use client";

import {useEffect, useRef} from "react";
import type {RevealKeyframes} from "@/lib/motion/keyframes";
import {revealScheduler} from "@/lib/motion/reveal-scheduler";

interface RevealAnimationOptions {
    keyframes: RevealKeyframes;
    durationSeconds: number;
    easing?: string;
    isChainedToList?: boolean;
}

export function useRevealAnimation<ElementType extends HTMLElement>(options: RevealAnimationOptions) {
    const elementRef = useRef<ElementType>(null);
    const optionsRef = useRef(options);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;
        const {keyframes, durationSeconds, easing = 'ease-out', isChainedToList = false} = optionsRef.current;
        return revealScheduler.register({element, keyframes, durationSeconds, easing, isChainedToList});
    }, []);

    return elementRef;
}
