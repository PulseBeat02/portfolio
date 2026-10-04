export interface VideoItem {
    id: string;
    title: string;
    publishedOn: string;
}

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@pulsebeat_02";

export const videos: VideoItem[] = [
    {id: "Qmds7-mwCMg", title: "I Streamed My Hard Drive to the World", publishedOn: "2026-04-16"},
    {id: "l03Os5uwWmk", title: "Turning YouTube Into Cloud Storage", publishedOn: "2026-02-08"},
    {id: "vGSjC7RcWkg", title: "Coding Memory Into Minecraft (Because I’m Broke)", publishedOn: "2026-02-03"},
    {id: "5JuGYc4qjSo", title: "Making a C++ Video Player in 1K Lines of Code", publishedOn: "2026-01-31"},
];

export const getVideoWatchUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;

export const getVideoThumbnailPath = (videoId: string) => `/images/videos/${videoId}.webp`;

export const getVideoPreviewPath = (videoId: string) => `/images/videos/previews/${videoId}.webp`;
