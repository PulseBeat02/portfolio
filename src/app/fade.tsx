"use client";

import React from 'react';
import {motion} from 'motion/react';

interface FadeProps {
    children: React.ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    scrollTriggered?: boolean;
    duration?: number;
}

const OFFSETS = {
    up: {y: 20},
    down: {y: -20},
    left: {x: 20},
    right: {x: -20},
} as const;

const VISIBLE = {opacity: 1, x: 0, y: 0};

export function Fade({children, delay = 0, direction = 'up', scrollTriggered = false, duration = 0.5}: FadeProps) {
    const hidden = {opacity: 0, ...OFFSETS[direction]};
    return (
        <motion.div
            initial={hidden}
            {...(scrollTriggered
                ? {whileInView: VISIBLE, viewport: {once: true, amount: 0.1}}
                : {animate: VISIBLE})}
            transition={{duration, delay}}
        >
            {children}
        </motion.div>
    );
}
