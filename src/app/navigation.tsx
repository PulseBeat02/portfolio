"use client";

import {Box, Button, Stack} from "@mui/material";
import React, {useEffect, useState} from "react";

interface NavbarProps {
    aboutMeRef: React.RefObject<HTMLDivElement>;
    experienceRef: React.RefObject<HTMLDivElement>;
    projectsRef: React.RefObject<HTMLDivElement>;
    blogRef: React.RefObject<HTMLDivElement>;
}

export default function Navbar({aboutMeRef, experienceRef, projectsRef, blogRef}: NavbarProps) {

    const [activeSection, setActiveSection] = useState<string>('about');
    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const offsetTop = rect.top + window.scrollY;
            const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
            const offset = 2 * rootFontSize;
            window.scrollTo({
                top: offsetTop - offset,
                behavior: 'smooth'
            });
        }
    };

    const renderNavButton = (
        label: string,
        sectionId: string,
        ref: React.RefObject<HTMLDivElement>
    ) => (
        <Button
            variant="text"
            onClick={() => scrollToSection(ref)}
            sx={{
                borderRadius: 2,
                fontSize: '0.85rem',
                color: activeSection === sectionId ? '#39FF14' : '#9e9e9e',
                position: 'relative',
                pl: 6,
                justifyContent: 'flex-start',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: activeSection === sectionId ? '24px' : '16px',
                    height: '2px',
                    bgcolor: activeSection === sectionId ? '#39FF14' : '#9e9e9e',
                    transition: 'width 0.3s ease, background-color 0.3s ease'
                },
                textShadow: activeSection === sectionId ? '0 0 8px #39FF14' : 'none',
                transition: 'color 0.3s ease'
            }}
        >
            {label}
        </Button>
    );

    useEffect(() => {
        const handleScroll = () => {
            const aboutPos = aboutMeRef.current?.getBoundingClientRect();
            const expPos = experienceRef.current?.getBoundingClientRect();
            const projPos = projectsRef.current?.getBoundingClientRect();
            const blogPos = blogRef.current?.getBoundingClientRect();
            const threshold = 200;
            if (aboutPos && aboutPos.top < threshold && aboutPos.bottom > 0) {
                setActiveSection('about');
            } else if (expPos && expPos.top < threshold && expPos.bottom > 0) {
                setActiveSection('experience');
            } else if (projPos && projPos.top < threshold && projPos.bottom > 0) {
                setActiveSection('projects');
            } else if (blogPos && blogPos.top < threshold && blogPos.bottom > 0) {
                setActiveSection('blog');
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [aboutMeRef, experienceRef, projectsRef, blogRef]);

    return (
        <Box mt={4} sx={{
            borderRadius: 3,
            bgcolor: 'background.paper',
            boxShadow: 2,
            p: 2
        }}>
            <Stack spacing={2} alignItems="left">
                {renderNavButton('About Me', 'about', aboutMeRef)}
                {renderNavButton('Experience', 'experience', experienceRef)}
                {renderNavButton('Projects', 'projects', projectsRef)}
                {renderNavButton('Blog', 'blog', blogRef)}
            </Stack>
        </Box>
    );
}