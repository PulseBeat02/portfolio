// names of @keyframes in src/app/globals.css
export interface RevealKeyframes {
    animationName: string;
    reducedMotionAnimationName: string;
}

export const FADE_IN_KEYFRAMES: RevealKeyframes = {animationName: 'reveal-fade-in', reducedMotionAnimationName: 'reveal-fade-in'};

export const DRAW_DOWN_KEYFRAMES: RevealKeyframes = {animationName: 'reveal-draw-down', reducedMotionAnimationName: 'reveal-drawn'};

export const HIDDEN_STYLE = {opacity: 0} as const;

export const UNDRAWN_STYLE = {transform: 'scaleY(0)', transformOrigin: 'top'} as const;
