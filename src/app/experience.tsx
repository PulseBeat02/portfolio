import {Button, Grid, Stack, Typography, Modal, Box} from "@mui/material";
import {CustomLink, SectionHeading} from "@/app/common";
import {useState} from "react";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function Experience() {

    interface ExperienceItem {
        company: string;
        role: string;
        description: string;
        period: string;
        technologies?: string[];
        link?: string;
    }

    const experiences: ExperienceItem[] = [
        {
            company: "Google",
            role: "Incoming Software Engineering Intern",
            description: "YouTube Infrastructure (Video Player Experience)",
            period: "Jun 2026 - Sep 2026",
            technologies: ["Java", "Android", "C++"],
            link: "https://www.videolan.org/"
        },
        {
            company: "VideoLAN",
            role: "Software Engineering Intern",
            description: "VLC Media Player",
            period: "Jun 2025 - Sep 2025",
            technologies: ["C", "C++", "OpenCV", "AI/ML", "Makefile", "Meson"],
            link: "https://www.videolan.org/"
        },
        {
            company: "Halvex",
            role: "Back End Developer",
            description: "Linked Roles Discord Bot",
            period: "Feb 2023 - June 2023",
            technologies: ["JavaScript", "TypeScript", "Express.js", "Node.js", "MongoDB"],
            link: "https://halvex.net/"
        },
        {
            company: "Chelmsford Chinese Language School",
            role: "Java Mentor",
            description: "Java Introduction Course Teacher",
            period: "Sep 2021 - Feb 2022",
            technologies: ["Java"],
            link: "https://ccls-ma.org/"
        },
    ];

    const ExperienceSection = () => {
        const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
        const [resumeOpen, setResumeOpen] = useState(false);
        const handleOpenResume = () => setResumeOpen(true);
        const handleCloseResume = () => setResumeOpen(false);
        return (
            <Stack spacing={2}>
                {experiences.map((exp, index) => (
                    <Grid
                        container
                        key={index}
                        sx={{
                            padding: 2,
                            flexDirection: 'column',
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            filter: hoveredIndex !== null && hoveredIndex !== index ? 'blur(2px)' : 'none',
                            opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.7 : 1,
                            border: '1px solid rgba(57, 255, 20, 0.2)',
                            '&:hover': {
                                boxShadow: '0 4px 20px rgba(57, 255, 20, 0.15)',
                                borderColor: 'rgba(57, 255, 20, 0.3)',
                                transform: 'translateY(-2px)'
                            }
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <Grid>
                            <Typography variant="h3" sx={{fontWeight: 'medium', fontSize: '1.25rem'}} fontWeight="bold">
                                {exp.link ? (
                                    <CustomLink href={exp.link}>{exp.company}</CustomLink>
                                ) : (
                                    exp.company
                                )}
                            </Typography>
                            <Typography
                                variant="h4"
                                color="#cccccc"
                                fontWeight="medium"
                                sx={{fontSize: '1rem', marginTop: 0.75}}
                            >
                                {exp.role}
                            </Typography>
                            <Typography variant="body2" sx={{mt: 1, marginTop: 1}}>
                                {exp.description}
                            </Typography>
                            {exp.technologies && (
                                <Stack direction="row" sx={{mt: 1, flexWrap: 'wrap', gap: 0.5}}>
                                    {exp.technologies.map((tech, techIndex) => (
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
                        </Grid>
                        <Grid sx={{textAlign: 'left', marginTop: 1}}>
                            <Typography variant="body2" color="#888888">
                                {exp.period}
                            </Typography>
                        </Grid>
                    </Grid>
                ))}

                <Button
                    endIcon={<OpenInNewIcon/>}
                    onClick={handleOpenResume}
                    sx={{
                        alignSelf: 'center',
                        mt: 2,
                        color: '#39FF14',
                        borderColor: 'rgba(57, 255, 20, 0.3)',
                        '&:hover': {
                            backgroundColor: 'rgba(57, 255, 20, 0.1)',
                            borderColor: 'rgba(57, 255, 20, 0.5)',
                        }
                    }}
                    variant="outlined"
                >
                    View Full Resume (PDF)
                </Button>
                <Modal
                    open={resumeOpen}
                    onClose={handleCloseResume}
                    aria-labelledby="resume-modal"
                    aria-describedby="full-resume-view"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: {xs: '90%', sm: '80%', md: '70%'},
                        height: '80%',
                        bgcolor: 'background.paper',
                        border: '2px solid rgba(57, 255, 20, 0.3)',
                        boxShadow: 24,
                        p: 1,
                        borderRadius: 2,
                        outline: 'none',
                        overflow: 'hidden'
                    }}>
                        <iframe
                            src="https://drive.google.com/file/d/1X7FQprSXGQ2vX4TKYBWlAJ5qKquGouP2/preview"
                            style={{width: '100%', height: '100%', border: 'none'}}
                            title="Resume"
                        />
                    </Box>
                </Modal>
            </Stack>
        );
    };

    return (<div className="flex justify-center">
        <div style={{maxWidth: '600px', width: '100%'}}>
            <SectionHeading number={3} text="Experience"/>
            <ExperienceSection/>
        </div>
    </div>);
}
