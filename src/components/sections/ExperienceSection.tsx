import {Typography} from "@mui/material";
import {experiences, type ExperienceItem} from "@/data/experience";
import {SECTIONS} from "@/data/sections";
import {Section} from "@/components/layout/Section";
import {Timeline} from "@/components/timeline/Timeline";
import {TimelineHeader} from "@/components/timeline/TimelineHeader";
import {TimelineIcon} from "@/components/timeline/TimelineIcon";
import {TimelineItem} from "@/components/timeline/TimelineItem";
import {TIMELINE_TITLE_LINE_HEIGHT} from "@/components/timeline/constants";
import {ExternalLink} from "@/components/ui/ExternalLink";
import {TechChips} from "@/components/ui/TechChips";
import {metadataTextStyle} from "@/components/ui/styles";
import {formatDateRange} from "@/lib/format";
import {accentAlpha, whiteAlpha} from "@/theme/tokens";

const CURRENT_ROLE_BORDER_COLOR = accentAlpha(0.55);
const PAST_ROLE_BORDER_COLOR = whiteAlpha(0.15);

function EmploymentPeriod({period}: { period: string }) {
    return (
        <Typography variant="caption" component="p" sx={{...metadataTextStyle, lineHeight: TIMELINE_TITLE_LINE_HEIGHT}}>
            {formatDateRange(period)}
        </Typography>
    );
}

function ExperienceEntry({experience, isCurrentRole, isLastEntry}: {
    experience: ExperienceItem;
    isCurrentRole: boolean;
    isLastEntry: boolean;
}) {
    return (
        <TimelineItem
            isLastEntry={isLastEntry}
            icon={
                <TimelineIcon
                    imagePath={experience.logoPath}
                    imageFit="contain"
                    backgroundColor="common.white"
                    borderColor={isCurrentRole ? CURRENT_ROLE_BORDER_COLOR : PAST_ROLE_BORDER_COLOR}
                />
            }
        >
            <TimelineHeader
                title={<ExternalLink href={experience.websiteUrl}>{experience.company}</ExternalLink>}
                subtitle={experience.role}
                metadata={<EmploymentPeriod period={experience.period}/>}
            />
            <Typography variant="body2" sx={{mt: 1}}>{experience.description}</Typography>
            <TechChips technologies={experience.technologies} marginTop={1.5}/>
        </TimelineItem>
    );
}

export function ExperienceSection() {
    return (
        <Section section={SECTIONS.experience} sx={{mt: 6}}>
            <Timeline>
                {experiences.map((experience, entryIndex) => (
                    <ExperienceEntry
                        key={`${experience.company}-${experience.period}`}
                        experience={experience}
                        isCurrentRole={entryIndex === 0}
                        isLastEntry={entryIndex === experiences.length - 1}
                    />
                ))}
            </Timeline>
        </Section>
    );
}
