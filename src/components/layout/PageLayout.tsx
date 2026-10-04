import {Box, Grid} from "@mui/material";
import React from "react";
import {layout} from "@/theme/tokens";

const wideScreenStickyHeader = {
    [`@media (min-width: ${layout.wideBreakpointPixels}px) and (min-height: 720px)`]: {
        position: 'sticky',
        top: '2rem',
    },
};

const fullWidthUntilWide = {xs: 12, lg: "auto"} as const;

export function PageLayout({sidebar, children}: { sidebar: React.ReactNode; children: React.ReactNode }) {
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', p: {xs: 3, sm: 5}}}>
            <Grid
                container
                rowSpacing={0}
                columnSpacing={6}
                sx={{
                    mt: 5,
                    width: "100%",
                    justifyContent: {xs: "flex-start", lg: "center"},
                    maxWidth: {xs: `${layout.contentMaxWidthPixels}px`, lg: `${layout.pageMaxWidthPixels}px`},
                }}
            >
                <Grid size={fullWidthUntilWide}>
                    <Box component="header" sx={{width: '100%', ...wideScreenStickyHeader}}>
                        {sidebar}
                    </Box>
                </Grid>
                <Grid size={fullWidthUntilWide}>
                    <Box component="main" sx={{pb: {xs: 4, md: 6}}}>
                        {children}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
