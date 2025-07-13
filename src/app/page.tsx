"use client";

import Contact from "@/app/contact";
import AboutMe from "@/app/aboutme";
import Experience from "@/app/experience";
import {Grid, Box, Typography} from "@mui/material";
import Projects from "@/app/projects";
import Blog from "@/app/blog";
import React, {useRef} from "react";
import Navbar from "@/app/navigation";
import {Fade} from '@/app/fade'
import {CustomLink} from "@/app/common";

export default function Home() {
    const aboutMeRef = useRef<HTMLDivElement>(null);
    const experienceRef = useRef<HTMLDivElement>(null);
    const projectsRef = useRef<HTMLDivElement>(null);
    const blogRef = useRef<HTMLDivElement>(null);
    return (
        <Box sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column', p: 5, alignItems: 'center'}}>
            <Grid
                container
                spacing={15}
                sx={{marginTop: 5, justifyContent: "center", maxWidth: "1200px"}}
            >
                <Grid>
                    <Box sx={{
                        position: {lg: 'sticky'},
                        top: {lg: '2rem'},
                        display: 'flex',
                        flexDirection: {xs: 'column', md: 'row', lg: 'column'},
                        alignItems: 'flex-start',
                        width: '100%',
                        gap: {md: 10, lg: 0}
                    }}>
                        <Fade delay={0.3}>
                            <Contact/>
                        </Fade>
                        <Box sx={{display: {xs: 'none', sm: 'none', md: 'block'}}}>
                            <Fade delay={0.4}>
                                <Navbar
                                    aboutMeRef={aboutMeRef as React.RefObject<HTMLDivElement>}
                                    experienceRef={experienceRef as React.RefObject<HTMLDivElement>}
                                    projectsRef={projectsRef as React.RefObject<HTMLDivElement>}
                                    blogRef={blogRef as React.RefObject<HTMLDivElement>}
                                />
                            </Fade>
                        </Box>
                    </Box>
                </Grid>
                <Grid>
                    <Box>
                        <Fade scrollTriggered delay={0.25}>
                            <Box ref={aboutMeRef} id="about">
                                <AboutMe/>
                            </Box>
                        </Fade>
                        <Fade scrollTriggered delay={0.25}>
                            <Box mt={12} ref={experienceRef} id="experience">
                                <Experience/>
                            </Box>
                        </Fade>
                        <Fade scrollTriggered delay={0.1}>
                            <Box mt={12} ref={projectsRef} id="projects">
                                <Projects/>
                            </Box>
                        </Fade>
                        <Fade scrollTriggered delay={0.1}>
                            <Box mt={12} ref={blogRef} id="blog">
                                <Blog/>
                            </Box>
                        </Fade>
                    </Box>
                    <Fade scrollTriggered>
                        <Box sx={{
                            width: '100%',
                            py: 4,
                            mt: 6,
                            maxWidth: '350px'
                        }}>
                            <Typography variant="body2" color="text.secondary">
                                Designed with 🧠, developed using <CustomLink
                                href="https://www.jetbrains.com/webstorm/">WebStorm IDE</CustomLink>.
                                Built using <CustomLink
                                href="https://reactjs.org/">React</CustomLink>, <CustomLink
                                href="https://nextjs.org/">Next.js</CustomLink>, <CustomLink
                                href="https://tailwindcss.com/">Tailwind</CustomLink>, and <CustomLink
                                href="https://mui.com/">Material-UI</CustomLink> components.
                            </Typography>
                        </Box>
                    </Fade>
                </Grid>
            </Grid>
        </Box>
    );
}