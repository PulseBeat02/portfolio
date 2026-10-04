import {Box} from "@mui/material";
import Image from "next/image";
import {TIMELINE_NODE_CLASS_NAME, TIMELINE_NODE_SIZE_PIXELS} from "@/components/timeline/constants";
import {easings} from "@/theme/tokens";

interface TimelineIconProps {
    imagePath: string;
    backgroundColor: string;
    borderColor: string;
    imageFit?: 'contain' | 'cover';
}

export function TimelineIcon({imagePath, backgroundColor, borderColor, imageFit = 'cover'}: TimelineIconProps) {
    return (
        <Box className={TIMELINE_NODE_CLASS_NAME} sx={{
            position: 'relative',
            width: TIMELINE_NODE_SIZE_PIXELS,
            height: TIMELINE_NODE_SIZE_PIXELS,
            borderRadius: '10px',
            overflow: 'hidden',
            bgcolor: backgroundColor,
            border: `2px solid ${borderColor}`,
            transition: `box-shadow 0.3s ease, transform 0.35s ${easings.overshoot}`,
        }}>
            <Image src={imagePath} alt="" fill sizes={`${TIMELINE_NODE_SIZE_PIXELS}px`} style={{objectFit: imageFit}}/>
        </Box>
    );
}
