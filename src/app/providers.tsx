"use client";

import React from "react";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v16-appRouter";
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/app/theme";

export default function Providers({children}: { children: React.ReactNode }) {
    return (
        <AppRouterCacheProvider options={{key: "mui", enableCssLayer: true}}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
}
