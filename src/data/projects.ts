export interface ProjectItem {
    title: string;
    description: string;
    thumbnail: string;
    technologies: string[];
    github?: string;
}

export const projects: ProjectItem[] = [
    {
        title: "yt-media-storage",
        description: "A tool to encode/decode files into uploadable videos. Check out the YouTube video linked.",
        thumbnail: "/yt-media-storage.webp",
        technologies: ["C++", "Assembly", "SIMD", "Encryption", "Coding Theory", "Compression"],
        github: "https://github.com/PulseBeat02/yt-media-storage"
    },
    {
        title: "mcav",
        description: "An advanced Java multimedia framework for building Java media applications.",
        thumbnail: "/mcav.webp",
        technologies: ["Java", "Spring Boot", "TypeScript", "CI/CD"],
        github: "https://github.com/PulseBeat02/mcav"
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
        description: "A Bukkit gamemode for Minecraft servers based on the game, Dead by Daylight.",
        thumbnail: "/murderrun.webp",
        technologies: ["Java", "Hibernate", "Bukkit"],
        github: "https://github.com/PulseBeat02/murderrun"
    }
];
