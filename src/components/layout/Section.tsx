import {Box, type SxProps, type Theme} from "@mui/material";
import React from "react";
import type {SectionDefinition} from "@/data/sections";
import {visuallyHiddenClassName} from "@/components/ui/styles";
import {layout} from "@/theme/tokens";

interface SectionProps {
    section: SectionDefinition;
    children: React.ReactNode;
    sx?: SxProps<Theme>;
}

export function Section({section, children, sx}: SectionProps) {
    const headingId = `${section.id}-heading`;
    return (
        <Box component="section" id={section.id} aria-labelledby={headingId} sx={sx}>
            <Box sx={{maxWidth: layout.contentMaxWidthPixels, width: '100%', mx: 'auto'}}>
                <h2 id={headingId} className={visuallyHiddenClassName}>{section.title}</h2>
                {children}
            </Box>
        </Box>
    );
}
