import {fileURLToPath} from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const paths = {
    template: path.join(__dirname, "..", "public", "resume.tex"),
    pdf: path.join(__dirname, "..", "public", "resume.pdf"),
    redactedPdf: path.join(__dirname, "..", "public", "redacted.pdf"),
    cache: path.join(__dirname, "resume-cache.json"),
};

export const github = {
    owner: "PulseBeat02",
    ytStorageRepo: "yt-media-storage",
    mcavRepo: "mcav",
    apiUrl: "https://api.github.com/repos",
};

export const youtube = {
    videoId: "l03Os5uwWmk",
    apiUrl: "https://www.googleapis.com/youtube/v3/videos",
    impressionsMultiplier: 12,
};

export const latex = {
    compileUrl: "https://latex.ytotech.com/builds/sync",
    compiler: "pdflatex",
    maxAttempts: 4,
    retryDelayMs: 3000,
    timeoutMs: 120_000,
};

export const fetchTimeoutMs = 30_000;

export const staticPlaceholders = {
    GRAD_YEAR: "2028",
};

export const requiredPlaceholders = [
    "YT_STORAGE_STARS", "YT_STORAGE_FORKS",
    "MCAV_STARS", "MCAV_FORKS",
    "YT_VIEWERS", "YT_IMPRESSIONS",
];

export const redactionPatterns = [
    /Brandon Li/g,
    /978-245-5532/g,
    /jobs@brandonli\.me/g,
    /https:\/\/brandonli\.me/g,
    /brandonli\.me/g,
    /https:\/\/linkedin\.com\/in\/brandonli28/g,
    /linkedin\.com\/in\/brandonli28/g,
    /https:\/\/github\.com\/PulseBeat02\/yt-media-storage/g,
    /https:\/\/github\.com\/PulseBeat02\/mcav/g,
    /https:\/\/github\.com\/PulseBeat02\/video-player/g,
    /https:\/\/github\.com\/PulseBeat02/g,
    /github\.com\/PulseBeat02/g,
    /https:\/\/www\.youtube\.com\/watch\?v=l03Os5uwWmk/g,
    /VideoLAN/g,
    /Chelmsford Chinese Language School/g,
    /yt-media-storage/g,
    /\{mcav\}/g,
    /Pulse Media Player/g,
];

export const redactionMaxLength = 12;
