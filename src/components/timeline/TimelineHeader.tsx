import {Box, Typography} from "@mui/material";
import React from "react";
import {TIMELINE_NODE_SIZE_PIXELS, TIMELINE_TITLE_LINE_HEIGHT} from "@/components/timeline/constants";
import {colors} from "@/theme/tokens";

interface TimelineHeaderProps {
    title: React.ReactNode;
    subtitle: React.ReactNode;
    metadata?: React.ReactNode;
}

export function TimelineHeader({title, subtitle, metadata}: TimelineHeaderProps) {
    return (
        <Box sx={{
            minHeight: TIMELINE_NODE_SIZE_PIXELS,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            columnGap: 2,
        }}>
            <Box sx={{minWidth: 0}}>
                <Typography variant="h3" sx={{fontSize: '1.15rem', fontWeight: 600, lineHeight: TIMELINE_TITLE_LINE_HEIGHT}}>
                    {title}
                </Typography>
                <Typography variant="h4" component="p" sx={{color: colors.textSecondary, fontSize: '0.9rem', lineHeight: 1.4}}>
                    {subtitle}
                </Typography>
            </Box>
            {metadata}
        </Box>
    );
}
