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
            description: "A cross-platform Java multimedia framework (130 stars) for building Java media applications.",
            thumbnail: "/mcav.webp",
            technologies: ["Java", "Spring Boot", "TypeScript", "CI/CD"],
            github: "https://github.com/PulseBeat02/mcav"
        },
        {
            title: "yt-media-storage",
            description: "A tool to encode/decode files into YouTube videos. Check out the YouTube video linked.",
            thumbnail: "/yt-media-storage.webp",
            technologies: ["C++", "Assembly", "SIMD", "Encryption", "Coding Theory", "Compression"],
            github: "https://github.com/PulseBeat02/yt-media-storage"
        },
        {
            title: "Pulse Media Player",
            description: "A robust media player written in 1K lines of C++ code. Check out the YouTube video linked.",
            thumbnail: "/mpv.webp",
            technologies: ["C++", "OpenGL", "OpenAL", "FFmpeg"],
            github: "https://github.com/PulseBeat02/video-player"
        },
        {
            title: "Murder Run",
            description: "A Bukkit gamemode for Minecraft servers with over 30k lines of code.",
            thumbnail: "/murderrun.webp",
            technologies: ["Java", "Hibernate", "Bukkit"],
            github: "https://github.com/PulseBeat02/murderrun"
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