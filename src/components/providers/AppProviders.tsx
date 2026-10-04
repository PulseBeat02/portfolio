"use client";

import React from "react";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v16-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import {ThemeProvider} from "@mui/material/styles";
import {muiTheme} from "@/theme/muiTheme";

export function AppProviders({children}: { children: React.ReactNode }) {
    return (
        <AppRouterCacheProvider options={{key: "mui", enableCssLayer: true}}>
            <ThemeProvider theme={muiTheme}>
                <CssBaseline enableColorScheme/>
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
}
