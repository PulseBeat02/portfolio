export const FADE_IN_KEYFRAMES: Keyframe[] = [{opacity: 0}, {opacity: 1}];

export const DRAW_DOWN_KEYFRAMES: Keyframe[] = [{transform: 'scaleY(0)'}, {transform: 'scaleY(1)'}];

export const HIDDEN_STYLE = {opacity: 0} as const;

export const UNDRAWN_STYLE = {transform: 'scaleY(0)', transformOrigin: 'top'} as const;
