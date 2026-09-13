"use client";

import {Box, Button, Stack} from "@mui/material";
import React, {useEffect, useState} from "react";

type SectionRef = React.RefObject<HTMLDivElement | null>;

interface NavbarProps {
    aboutMeRef: SectionRef;
    experienceRef: SectionRef;
    projectsRef: SectionRef;
}

type SectionId = 'about' | 'experience' | 'projects';

const ACTIVE_THRESHOLD = 200;

function scrollToSection(ref: SectionRef) {
    const el = ref.current;
    if (!el) return;
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 2 * rootFontSize,
        behavior: 'smooth',
    });
}

export default function Navbar({aboutMeRef, experienceRef, projectsRef}: NavbarProps) {
    const [activeSection, setActiveSection] = useState<SectionId>('about');

    useEffect(() => {
        const sections: [SectionId, SectionRef][] = [
            ['about', aboutMeRef],
            ['experience', experienceRef],
            ['projects', projectsRef],
        ];
        let frame = 0;
        const update = () => {
            frame = 0;
            for (const [id, ref] of sections) {
                const rect = ref.current?.getBoundingClientRect();
                if (rect && rect.top < ACTIVE_THRESHOLD && rect.bottom > 0) {
                    setActiveSection(id);
                    return;
                }
            }
        };
        const schedule = () => {
            if (frame === 0) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener('scroll', schedule, {passive: true});
        window.addEventListener('resize', schedule, {passive: true});
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
        };
    }, [aboutMeRef, experienceRef, projectsRef]);

    const renderNavButton = (label: string, sectionId: SectionId, ref: SectionRef) => {
        const active = activeSection === sectionId;
        return (
            <Button
                variant="text"
                onClick={() => scrollToSection(ref)}
                sx={{
                    borderRadius: 2,
                    fontSize: '0.85rem',
                    color: active ? '#39FF14' : '#9e9e9e',
                    position: 'relative',
                    pl: 6,
                    justifyContent: 'flex-start',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: active ? '24px' : '16px',
                        height: '2px',
                        bgcolor: active ? '#39FF14' : '#9e9e9e',
                        transition: 'width 0.3s ease, background-color 0.3s ease'
                    },
                    textShadow: active ? '0 0 8px #39FF14' : 'none',
                    transition: 'color 0.3s ease'
                }}
            >
                {label}
            </Button>
        );
    };

    return (
        <Box sx={{
            borderRadius: 3,
            bgcolor: 'background.paper',
            boxShadow: 2,
            p: 2
        }}>
            <Stack spacing={2} sx={{alignItems: "left", marginTop: 3}}>
                {renderNavButton('About Me', 'about', aboutMeRef)}
                {renderNavButton('Experience', 'experience', experienceRef)}
                {renderNavButton('Projects', 'projects', projectsRef)}
            </Stack>
        </Box>
    );
}
