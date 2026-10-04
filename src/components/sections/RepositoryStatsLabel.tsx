import {Box} from "@mui/material";
import type {IconType} from "react-icons";
import {GoRepoForked, GoStar} from "react-icons/go";
import {TIMELINE_TITLE_LINE_HEIGHT} from "@/components/timeline/constants";
import {metadataTextStyle, visuallyHiddenClassName} from "@/components/ui/styles";
import {formatCompactCount} from "@/lib/format";
import type {RepositoryStats} from "@/lib/github";

function StatCount({Icon, accessibleLabel, count}: { Icon: IconType; accessibleLabel: string; count: number }) {
    return (
        <Box component="span" sx={{display: 'inline-flex', alignItems: 'center', gap: 0.5}}>
            <Icon aria-hidden/>
            <span className={visuallyHiddenClassName}>{accessibleLabel}: </span>
            {formatCompactCount(count)}
        </Box>
    );
}

export function RepositoryStatsLabel({stats}: { stats: RepositoryStats }) {
    return (
        <Box component="p" sx={{
            ...metadataTextStyle,
            m: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            lineHeight: TIMELINE_TITLE_LINE_HEIGHT,
        }}>
            <StatCount Icon={GoStar} accessibleLabel="Stars" count={stats.stars}/>
            <StatCount Icon={GoRepoForked} accessibleLabel="Forks" count={stats.forks}/>
        </Box>
    );
}
