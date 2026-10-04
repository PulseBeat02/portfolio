"use client";

import {Box} from "@mui/material";
import {useSyncExternalStore} from "react";
import {requestCommandMenuOpen} from "@/components/command-menu/events";
import {keyboardKeyStyle} from "@/components/ui/styles";
import {isApplePlatform} from "@/lib/browser";
import {colors} from "@/theme/tokens";

const subscribeToNothing = () => () => {};
const getPlatformModifierKey = () => (isApplePlatform() ? "⌘" : "Ctrl ");
const getServerModifierKey = () => "⌘";

export function CommandMenuHint() {
    const modifierKey = useSyncExternalStore(subscribeToNothing, getPlatformModifierKey, getServerModifierKey);
    return (
        <Box
            component="button"
            type="button"
            onClick={requestCommandMenuOpen}
            sx={{
                display: 'none',
                '@media (hover: hover) and (pointer: fine)': {display: 'inline-flex'},
                alignItems: 'center',
                gap: 0.75,
                mt: 2,
                p: 0,
                border: 0,
                bgcolor: 'transparent',
                color: colors.textMuted,
                fontSize: '0.75rem',
                fontFamily: 'inherit',
                cursor: 'pointer',
                '&:hover': {color: colors.textSubtle},
            }}
        >
            Press <Box component="kbd" sx={keyboardKeyStyle}>{modifierKey}K</Box> to jump to a section
        </Box>
    );
}
