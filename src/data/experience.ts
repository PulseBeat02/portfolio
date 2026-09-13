export interface ExperienceItem {
    company: string;
    role: string;
    description: string;
    period: string;
    technologies?: string[];
    link?: string;
}

export const experiences: ExperienceItem[] = [
    {
        company: "Amazon Web Services (AWS)",
        role: "Software Development Engineering Intern",
        description: "Task Management & Issues (Fall 2026)",
        period: "Sep 2026 - Dec 2026",
        technologies: ["Java", "Python", "JavaScript"],
        link: "https://aws.amazon.com/"
    },
    {
        company: "Google (YouTube)",
        role: "Software Engineering Intern",
        description: "Android Media Player, AV1 (Summer 2026)",
        period: "Jun 2026 - Sep 2026",
        technologies: ["Java", "Android", "C++"],
        link: "https://www.youtube.com/"
    },
    {
        company: "VideoLAN",
        role: "Open Source Contributer",
        description: "Various Tweaks",
        period: "Jan 2026 - Present",
        technologies: ["C", "C++", "OpenCV", "AI/ML", "Makefile", "Meson"],
        link: "https://www.videolan.org/"
    },
    {
        company: "VideoLAN",
        role: "Software Engineering Intern",
        description: "Video Filters & Tooling (Summer 2025)",
        period: "Jun 2025 - Sep 2025",
        technologies: ["C", "C++", "OpenCV", "AI/ML", "Makefile", "Meson"],
        link: "https://www.videolan.org/"
    }
];
