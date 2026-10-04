export interface ExperienceItem {
    company: string;
    role: string;
    description: string;
    period: string;
    technologies: string[];
    websiteUrl: string;
    logoPath: string;
}

export const experiences: ExperienceItem[] = [
    {
        company: "Amazon (Amazon Web Services)",
        role: "Software Development Engineer Intern",
        description: "MCPs & Agents for Internal Task Management (Fall 2026)",
        period: "Sep 2026 - Dec 2026",
        technologies: ["MCP", "AI Agents", "A2A", "Authentication", "AWS", "Testing"],
        websiteUrl: "https://aws.amazon.com/",
        logoPath: "/images/logos/aws.webp"
    },
    {
        company: "Google (YouTube)",
        role: "Software Engineering Intern",
        description: "Android Media Player, AV1 (Summer 2026)",
        period: "Jun 2026 - Sep 2026",
        technologies: ["C++", "ARM NEON/SIMD", "AV1", "dav1d", "Java", "Android", "OpenGL", "ExoPlayer"],
        websiteUrl: "https://www.youtube.com/",
        logoPath: "/images/logos/youtube.webp"
    },
    {
        company: "VideoLAN",
        role: "Software Engineering Intern",
        description: "Video Filters & Tooling (Summer 2025)",
        period: "Jun 2025 - Sep 2025",
        technologies: ["C", "C++", "OpenCV", "ggml", "SAM2/SAM3", "YuNet"],
        websiteUrl: "https://www.videolan.org/",
        logoPath: "/images/logos/videolan.webp"
    }
];
