import {accentAlpha, colors, whiteAlpha} from "@/theme/tokens";

export const dimSiblingsOnHover = {
    '@media (hover: hover)': {
        '& > *:hover ~ *, & > *:has(~ *:hover)': {
            filter: 'blur(2px)',
            opacity: 0.7,
        },
    },
} as const;

export const metadataTextStyle = {
    color: colors.textMuted,
    fontSize: '0.8rem',
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
} as const;

export const keyboardKeyStyle = {
    fontFamily: 'inherit',
    border: `1px solid ${whiteAlpha(0.15)}`,
    borderRadius: 1,
    px: 0.75,
    py: 0.125,
} as const;

export const accentButtonStyle = {
    color: colors.accent,
    borderColor: accentAlpha(0.3),
    '&:hover': {
        backgroundColor: accentAlpha(0.1),
        borderColor: accentAlpha(0.5),
    },
} as const;

export const visuallyHiddenClassName = "sr-only";
