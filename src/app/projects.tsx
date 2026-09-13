import {Box, Stack, Typography} from "@mui/material";
import {CustomLink, SectionHeading, TechChips, dimSiblingsOnHover} from "@/app/common";
import Image from "next/image";
import {projects, type ProjectItem} from "@/data/projects";

function ProjectCard({project}: { project: ProjectItem }) {
    return (
        <Box
            sx={{
                padding: 2,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                border: '1px solid rgba(57, 255, 20, 0.2)',
                '&:hover': {
                    boxShadow: '0 4px 20px rgba(57, 255, 20, 0.15)',
                    borderColor: 'rgba(57, 255, 20, 0.3)',
                    transform: 'translateY(-2px)'
                }
            }}
        >
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <div style={{flex: '1', paddingRight: '16px'}}>
                    <Typography sx={{fontSize: '1.25rem'}}>
                        {project.github ? <CustomLink href={project.github}>{project.title}</CustomLink> : project.title}
                    </Typography>
                    <Typography variant="body2" sx={{mt: 1}}>
                        {project.description}
                    </Typography>
                    <TechChips items={project.technologies} mt={2}/>
                </div>
                <div style={{
                    position: 'relative',
                    width: '128px',
                    height: '120px',
                    flexShrink: 0,
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}>
                    <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        sizes="128px"
                        style={{objectFit: "cover", objectPosition: "center"}}
                    />
                </div>
            </div>
        </Box>
    );
}

export default function Projects() {
    return (
        <div className="flex justify-center">
            <div style={{maxWidth: '600px', width: '100%'}}>
                <SectionHeading number={4} text="Projects"/>
                <Stack spacing={2} sx={{width: '100%', ...dimSiblingsOnHover}}>
                    {projects.map((project) => (
                        <ProjectCard key={project.title} project={project}/>
                    ))}
                </Stack>
            </div>
        </div>
    );
}
