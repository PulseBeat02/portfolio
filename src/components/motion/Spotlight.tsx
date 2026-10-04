"use client";

import {useEffect, useRef} from 'react';
import {hasFinePointer, prefersReducedMotion} from "@/lib/browser";
import {accentAlpha} from "@/theme/tokens";

const SPOTLIGHT_RADIUS_PIXELS = 600;
const SPOTLIGHT_INTENSITY = 0.01;

function moveSpotlight(spotlightElement: HTMLElement, pointerX: number, pointerY: number): void {
    spotlightElement.style.setProperty('--spotlight-x', `${pointerX}px`);
    spotlightElement.style.setProperty('--spotlight-y', `${pointerY}px`);
    spotlightElement.style.opacity = '1';
}

export function Spotlight() {
    const spotlightRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const spotlightElement = spotlightRef.current;
        if (!spotlightElement || !hasFinePointer() || prefersReducedMotion()) return;

        let pendingFrameId = 0;
        let latestPointerX = 0;
        let latestPointerY = 0;

        const handlePointerMove = (event: PointerEvent) => {
            latestPointerX = event.clientX;
            latestPointerY = event.clientY;
            if (pendingFrameId) return;
            pendingFrameId = requestAnimationFrame(() => {
                pendingFrameId = 0;
                moveSpotlight(spotlightElement, latestPointerX, latestPointerY);
            });
        };

        window.addEventListener('pointermove', handlePointerMove, {passive: true});
        return () => {
            cancelAnimationFrame(pendingFrameId);
            window.removeEventListener('pointermove', handlePointerMove);
        };
    }, []);

    return (
        <div
            ref={spotlightRef}
            aria-hidden
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: -1,
                pointerEvents: 'none',
                opacity: 0,
                transition: 'opacity 0.6s ease',
                background: `radial-gradient(${SPOTLIGHT_RADIUS_PIXELS}px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), ${accentAlpha(SPOTLIGHT_INTENSITY)}, transparent 70%)`,
            }}
        />
    );
}
