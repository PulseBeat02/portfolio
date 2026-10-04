import React from 'react';
import {motionTimings} from "@/theme/motion";

interface FadeProps {
    children: React.ReactNode;
    delaySeconds?: number;
    durationSeconds?: number;
}

export function Fade({children, delaySeconds = 0, durationSeconds = motionTimings.introFadeSeconds}: FadeProps) {
    return (
        <div className="fade-in" style={{animationDelay: `${delaySeconds}s`, animationDuration: `${durationSeconds}s`}}>
            {children}
        </div>
    );
}
