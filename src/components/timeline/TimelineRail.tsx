import {DrawLine} from "@/components/motion/DrawLine";
import {ChainedFadeIn} from "@/components/motion/ChainedFadeIn";
import {
    TIMELINE_END_DOT_COLOR,
    TIMELINE_END_DOT_SIZE_PIXELS,
    TIMELINE_NODE_SIZE_PIXELS,
    TIMELINE_RAIL_COLOR,
    TIMELINE_RAIL_GAP_PIXELS,
    TIMELINE_RAIL_WIDTH_PIXELS,
} from "@/components/timeline/constants";

export function TimelineRail({isLastEntry}: { isLastEntry: boolean }) {
    const railBottomPixels = isLastEntry
        ? TIMELINE_END_DOT_SIZE_PIXELS + TIMELINE_RAIL_GAP_PIXELS
        : TIMELINE_RAIL_GAP_PIXELS;
    return (
        <>
            <DrawLine style={{
                position: 'absolute',
                left: (TIMELINE_NODE_SIZE_PIXELS - TIMELINE_RAIL_WIDTH_PIXELS) / 2,
                width: TIMELINE_RAIL_WIDTH_PIXELS,
                top: TIMELINE_NODE_SIZE_PIXELS + TIMELINE_RAIL_GAP_PIXELS,
                bottom: railBottomPixels,
                background: TIMELINE_RAIL_COLOR,
            }}/>
            {isLastEntry && (
                <ChainedFadeIn style={{
                    position: 'absolute',
                    left: (TIMELINE_NODE_SIZE_PIXELS - TIMELINE_END_DOT_SIZE_PIXELS) / 2,
                    bottom: 0,
                    width: TIMELINE_END_DOT_SIZE_PIXELS,
                    height: TIMELINE_END_DOT_SIZE_PIXELS,
                    borderRadius: '50%',
                    background: TIMELINE_END_DOT_COLOR,
                }}/>
            )}
        </>
    );
}
