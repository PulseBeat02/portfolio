"use client";

import {createTheme} from '@mui/material/styles';
import {colors} from "@/theme/tokens";

const headingColor = {color: colors.textPrimary};
const bodyColor = {color: colors.textBody};

export const muiTheme = createTheme({
    typography: {
        fontFamily: 'var(--font-inter), system-ui, sans-serif',
        body1: bodyColor,
        body2: bodyColor,
        h1: headingColor,
        h2: headingColor,
        h3: headingColor,
        h4: headingColor,
        h5: headingColor,
        h6: headingColor,
    },
    palette: {
        mode: 'dark',
    },
});
