import {Box, type SxProps, type Theme} from "@mui/material";
import React from "react";
import {Reveal} from "@/components/motion/Reveal";
import {TimelineRail} from "@/components/timeline/TimelineRail";
import {TIMELINE_NODE_CLASS_NAME, TIMELINE_NODE_SIZE_PIXELS} from "@/components/timeline/constants";
import {REVEAL_GROUP_ATTRIBUTE} from "@/lib/motion/reveal-scheduler";
import {motionTimings} from "@/theme/motion";
import {accentAlpha} from "@/theme/tokens";

interface TimelineItemProps {
    icon: React.ReactNode;
    children: React.ReactNode;
    isLastEntry: boolean;
    hoverStyles?: SxProps<Theme>;
}

export function TimelineItem({icon, children, isLastEntry, hoverStyles}: TimelineItemProps) {
    return (
        <Box
            component="li"
            {...{[REVEAL_GROUP_ATTRIBUTE]: true}}
            sx={[{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: `${TIMELINE_NODE_SIZE_PIXELS}px 1fr`,
                columnGap: 2,
                pb: 4,
                '&:last-of-type': {pb: 3},
                [`&:hover .${TIMELINE_NODE_CLASS_NAME}`]: {
                    boxShadow: `0 0 8px ${accentAlpha(0.25)}`,
                    transform: 'scale(1.12)',
                },
            }, ...(Array.isArray(hoverStyles) ? hoverStyles : [hoverStyles])]}
        >
            <TimelineRail isLastEntry={isLastEntry}/>
            <Reveal durationSeconds={motionTimings.timelineEntrySeconds} style={{position: 'relative', zIndex: 1}}>
                {icon}
            </Reveal>
            <Reveal durationSeconds={motionTimings.timelineEntrySeconds} style={{minWidth: 0}}>
                {children}
            </Reveal>
        </Box>
    );
}
