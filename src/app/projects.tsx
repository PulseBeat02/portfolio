import {Stack, Typography} from "@mui/material";
import {CustomLink, SectionHeading} from "@/app/common";
import {useState} from "react";
import Image from "next/image";

export default function Projects() {

    interface ProjectItem {
        title: string;
        description: string;
        thumbnail: string;
        technologies: string[];
        github?: string;
    }

    const projects: ProjectItem[] = [
        {
            title: "mcav",
            description: "A cross-platform multimedia framework (~100 stars) for building Java media applications. " +
                "Integrates with VLC and mpv for fast, native media playback alongside a self-written avcodec player. " +
                "Uses OpenCV for fast image processing, and contains several other built-in modules, such as an HTTP player " +
                "that uses Javalin to play audio through a web interface.",
            thumbnail: "/mcav.webp",
            technologies: ["Java", "Assembly", "Javalin", "FFmpeg", "OpenCV"],
            github: "https://github.com/PulseBeat02/mcav"
        },
        {
            title: "mpvj",
            description: "Java bindings for libmpv, the media player library used by mpv. Provides a native interface to access " +
                "media player features like control, playback, and rendering.",
            thumbnail: "/mpv.webp",
            technologies: ["Java", "JNA", "mpv"],
            github: "https://github.com/PulseBeat02/mpvj"
        },
        {
            title: "Murder Run",
            description: "A Bukkit gamemode for Minecraft servers with over 30k lines of code. Inspired by Dead by Daylight, " +
                "it contains several features like 100+ gadgets and abilities, easy map creation, and so much more. Uses " +
                "Hibernate ORM to store maps and configurations.",
            thumbnail: "/murderrun.webp",
            technologies: ["Java", "Hibernate", "Bukkit"],
            github: "https://github.com/PulseBeat02/murderrun"
        },
        {
            title: "Portfolio Website",
            description: "My portfolio website to showcase my projects and skills.",
            thumbnail: "/nextjs.webp",
            technologies: ["React", "Next.js", "TypeScript", "Material UI"],
            github: "https://github.com/PulseBeat02/developer-portfolio"
        }
    ];

    const ProjectsSection = () => {
        const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

        return (
            <Stack spacing={2} sx={{width: '100%'}}>
                {projects.map((project, index) => (
                    <div
                        key={index}
                        style={{
                            padding: 16,
                            borderRadius: 8,
                            transition: 'all 0.3s ease',
                            filter: hoveredIndex !== null && hoveredIndex !== index ? 'blur(2px)' : 'none',
                            opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.7 : 1,
                            border: '1px solid rgba(57, 255, 20, 0.2)',
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className="hover:shadow-[0_4px_20px_rgba(57,255,20,0.15)] hover:border-[rgba(57,255,20,0.3)] hover:translate-y-[-2px]"
                    >
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <div style={{flex: '1', paddingRight: '16px'}}>
                                <Typography fontWeight="bold" sx={{fontWeight: 'medium', fontSize: '1.25rem'}}>
                                    {project.github ? (
                                        <CustomLink href={project.github}>{project.title}</CustomLink>
                                    ) : (
                                        project.title
                                    )}
                                </Typography>
                                <Typography variant="body2" sx={{mt: 1}}>
                                    {project.description}
                                </Typography>
                                {project.technologies && (
                                    <Stack direction="row"
                                           sx={{mt: 1, flexWrap: 'wrap', gap: 0.5, marginTop: 2}}>
                                        {project.technologies.map((tech, techIndex) => (
                                            <Typography
                                                key={techIndex}
                                                variant="caption"
                                                sx={{
                                                    bgcolor: 'rgba(57, 255, 20, 0.1)',
                                                    color: '#39FF14',
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {tech}
                                            </Typography>
                                        ))}
                                    </Stack>
                                )}
                            </div>
                            <div style={{width: '128px', flexShrink: 0}}>
                                <div style={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '120px',
                                    borderRadius: '8px',
                                    overflow: 'hidden'
                                }}>
                                    <Image
                                        src={project.thumbnail}
                                        alt={project.title}
                                        fill
                                        sizes="150px"
                                        style={{
                                            objectFit: "cover",
                                            objectPosition: "center"
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Stack>
        );
    };

    return (
        <div className="flex justify-center">
            <div style={{maxWidth: '600px', width: '100%'}}>
                <SectionHeading number={4} text="Projects"/>
                <ProjectsSection/>
            </div>
        </div>
    );
}