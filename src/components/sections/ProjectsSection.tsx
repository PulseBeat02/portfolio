import {Box} from "@mui/material";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import {projects, type ProjectItem} from "@/data/projects";
import {SECTIONS} from "@/data/sections";
import {Section} from "@/components/layout/Section";
import {RepositoryStatsLabel} from "@/components/sections/RepositoryStatsLabel";
import {Timeline} from "@/components/timeline/Timeline";
import {TimelineHeader} from "@/components/timeline/TimelineHeader";
import {TimelineIcon} from "@/components/timeline/TimelineIcon";
import {TimelineItem} from "@/components/timeline/TimelineItem";
import {EXTERNAL_LINK_ATTRIBUTES} from "@/components/ui/ExternalLink";
import {TechChips} from "@/components/ui/TechChips";
import {getRepositoryStats, type RepositoryStats} from "@/lib/github";
import {colors, whiteAlpha} from "@/theme/tokens";

const PROJECT_TITLE_CLASS_NAME = "project-title";
const PROJECT_ARROW_CLASS_NAME = "project-arrow";

const projectHoverStyles = {
    [`&:hover .${PROJECT_TITLE_CLASS_NAME}`]: {color: colors.accent},
    [`&:hover .${PROJECT_ARROW_CLASS_NAME}`]: {transform: 'translate(2px, -2px)'},
};

function ProjectTitleLink({project}: { project: ProjectItem }) {
    return (
        <Box
            component="a"
            href={project.repositoryUrl}
            {...EXTERNAL_LINK_ATTRIBUTES}
            className={PROJECT_TITLE_CLASS_NAME}
            sx={{
                color: colors.textPrimary,
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                '&::after': {content: '""', position: 'absolute', inset: 0, borderRadius: 2, zIndex: 2},
                '&:focus-visible': {outline: 'none'},
                '&:focus-visible::after': {outline: `2px solid ${colors.accent}`, outlineOffset: 4},
            }}
        >
            {project.title}
            <ArrowOutwardIcon className={PROJECT_ARROW_CLASS_NAME} aria-hidden sx={{
                fontSize: '1rem',
                ml: 0.5,
                verticalAlign: '-0.1em',
                transition: 'transform 0.2s ease',
            }}/>
        </Box>
    );
}

function ProjectEntry({project, repositoryStats, isLastEntry}: {
    project: ProjectItem;
    repositoryStats: RepositoryStats | null;
    isLastEntry: boolean;
}) {
    return (
        <TimelineItem
            isLastEntry={isLastEntry}
            hoverStyles={projectHoverStyles}
            icon={<TimelineIcon imagePath={project.iconPath} backgroundColor="background.default" borderColor={whiteAlpha(0.15)}/>}
        >
            <TimelineHeader
                title={<ProjectTitleLink project={project}/>}
                subtitle={project.description}
                metadata={repositoryStats && <RepositoryStatsLabel stats={repositoryStats}/>}
            />
            <TechChips technologies={project.technologies} marginTop={1.5}/>
        </TimelineItem>
    );
}

export async function ProjectsSection() {
    const repositoryStatsByProject = await Promise.all(projects.map((project) => getRepositoryStats(project.repositoryUrl)));
    return (
        <Section section={SECTIONS.projects}>
            <Timeline ordered={false}>
                {projects.map((project, entryIndex) => (
                    <ProjectEntry
                        key={project.title}
                        project={project}
                        repositoryStats={repositoryStatsByProject[entryIndex]}
                        isLastEntry={entryIndex === projects.length - 1}
                    />
                ))}
            </Timeline>
        </Section>
    );
}
