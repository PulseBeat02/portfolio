export interface ProjectItem {
    title: string;
    description: string;
    iconPath: string;
    technologies: string[];
    repositoryUrl: string;
}

export const projects: ProjectItem[] = [
    {
        title: "yt-media-storage",
        description: "Stores any file as a YouTube video.",
        iconPath: "/images/logos/yt-media-storage.webp",
        technologies: ["C++", "FFmpeg", "SIMD", "OpenMP", "Qt 6", "libsodium", "Wirehair"],
        repositoryUrl: "https://github.com/PulseBeat02/yt-media-storage"
    },
    {
        title: "mcav",
        description: "A real-time Java multimedia framework.",
        iconPath: "/images/logos/mcav.webp",
        technologies: ["Java", "GLSL", "libVLC", "OpenCV", "QEMU", "VNC", "TeamCity", "Maven"],
        repositoryUrl: "https://github.com/PulseBeat02/mcav"
    },
    {
        title: "Pulse Media Player",
        description: "A media player in 1K lines of C++.",
        iconPath: "/images/logos/mpv.webp",
        technologies: ["C++", "OpenGL", "OpenAL", "FFmpeg"],
        repositoryUrl: "https://github.com/PulseBeat02/video-player"
    },
    {
        title: "Murder Run",
        description: "A Dead by Daylight gamemode for Minecraft.",
        iconPath: "/images/logos/murderrun.webp",
        technologies: ["Java", "Hibernate", "Bukkit"],
        repositoryUrl: "https://github.com/PulseBeat02/murderrun"
    }
];
