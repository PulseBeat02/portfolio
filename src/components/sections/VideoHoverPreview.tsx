"use client";

import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import {getVideoPreviewPath} from "@/data/videos";
import {hasFinePointer, prefersReducedMotion} from "@/lib/browser";
import {motionTimings} from "@/theme/motion";

const HOVER_INTENT_DELAY_MILLISECONDS = 250;

function useHoverIntent(targetElementRef: React.RefObject<HTMLElement | null>): boolean {
    const [isHoverIntended, setIsHoverIntended] = useState(false);

    useEffect(() => {
        const hoverTarget = targetElementRef.current?.closest("a");
        if (!hoverTarget || !hasFinePointer() || prefersReducedMotion()) return;

        let hoverIntentTimerId = 0;
        const handlePointerEnter = () => {
            hoverIntentTimerId = window.setTimeout(() => setIsHoverIntended(true), HOVER_INTENT_DELAY_MILLISECONDS);
        };
        const handlePointerLeave = () => {
            window.clearTimeout(hoverIntentTimerId);
            setIsHoverIntended(false);
        };

        hoverTarget.addEventListener("pointerenter", handlePointerEnter);
        hoverTarget.addEventListener("pointerleave", handlePointerLeave);
        return () => {
            window.clearTimeout(hoverIntentTimerId);
            hoverTarget.removeEventListener("pointerenter", handlePointerEnter);
            hoverTarget.removeEventListener("pointerleave", handlePointerLeave);
        };
    }, [targetElementRef]);

    return isHoverIntended;
}

export function VideoHoverPreview({videoId}: { videoId: string }) {
    const containerRef = useRef<HTMLSpanElement>(null);
    const isHoverIntended = useHoverIntent(containerRef);
    const [hasPreviewLoaded, setHasPreviewLoaded] = useState(false);
    const isPreviewVisible = isHoverIntended && hasPreviewLoaded;

    return (
        <span ref={containerRef} aria-hidden style={{position: "absolute", inset: 0, pointerEvents: "none"}}>
            {isHoverIntended && (
                <Image
                    src={getVideoPreviewPath(videoId)}
                    alt=""
                    fill
                    unoptimized
                    onLoad={() => setHasPreviewLoaded(true)}
                    style={{
                        objectFit: "cover",
                        opacity: isPreviewVisible ? 1 : 0,
                        transition: `opacity ${motionTimings.hoverPreviewFadeSeconds}s ease`,
                    }}
                />
            )}
        </span>
    );
}
