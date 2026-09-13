"use client";

import {Button, Grid, Stack, Typography, Modal, Box} from "@mui/material";
import {CustomLink, SectionHeading, TechChips, dimSiblingsOnHover} from "@/app/common";
import {useState} from "react";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {experiences, type ExperienceItem} from "@/data/experience";

function ExperienceCard({exp}: { exp: ExperienceItem }) {
    return (
        <Grid
            container
            sx={{
                padding: 2,
                flexDirection: 'column',
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
            <Grid>
                <Typography variant="h3" sx={{fontSize: '1.25rem'}}>
                    {exp.link ? <CustomLink href={exp.link}>{exp.company}</CustomLink> : exp.company}
                </Typography>
                <Typography variant="h4" color="#cccccc" sx={{fontSize: '1rem', marginTop: 0.75}}>
                    {exp.role}
                </Typography>
                <Typography variant="body2" sx={{marginTop: 1}}>
                    {exp.description}
                </Typography>
                {exp.technologies && <TechChips items={exp.technologies}/>}
            </Grid>
            <Grid sx={{textAlign: 'left', marginTop: 1}}>
                <Typography variant="body2" color="#888888">
                    {exp.period}
                </Typography>
            </Grid>
        </Grid>
    );
}

function ResumeButton() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button
                endIcon={<OpenInNewIcon/>}
                onClick={() => setOpen(true)}
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
                open={open}
                onClose={() => setOpen(false)}
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
                        src="/resume.pdf"
                        style={{width: '100%', height: '100%', border: 'none'}}
                        title="Brandon Li's Resume"
                    />
                </Box>
            </Modal>
        </>
    );
}

export default function Experience() {
    return (
        <div className="flex justify-center">
            <div style={{maxWidth: '600px', width: '100%'}}>
                <SectionHeading number={3} text="Experience"/>
                <Stack spacing={2}>
                    <Stack spacing={2} sx={dimSiblingsOnHover}>
                        {experiences.map((exp) => (
                            <ExperienceCard key={`${exp.company}-${exp.period}`} exp={exp}/>
                        ))}
                    </Stack>
                    <ResumeButton/>
                </Stack>
            </div>
        </div>
    );
}
