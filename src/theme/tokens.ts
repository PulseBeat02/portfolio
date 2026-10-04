const ACCENT_RGB = '74, 222, 128';

export const colors = {
    accent: `rgb(${ACCENT_RGB})`,
    textPrimary: '#ffffff',
    textSecondary: '#cccccc',
    textBody: '#888999',
    textMuted: '#8a8a8a',
    textSubtle: '#c8c8c8',
    surfaceRaised: '#161616',
    surfaceSocialCard: '#121212',
} as const;

export const accentAlpha = (alpha: number) => `rgba(${ACCENT_RGB}, ${alpha})`;

export const whiteAlpha = (alpha: number) => `rgba(255, 255, 255, ${alpha})`;

export const blackAlpha = (alpha: number) => `rgba(0, 0, 0, ${alpha})`;

export const easings = {
    overshoot: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const layout = {
    contentMaxWidthPixels: 600,
    pageMaxWidthPixels: 1200,
    wideBreakpointPixels: 1200,
    twoColumnGridBreakpointPixels: 600,
} as const;
