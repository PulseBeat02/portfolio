import {fileURLToPath} from "url";
import path from "path";

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRootDirectory = path.join(scriptsDirectory, "..");

export const paths = {
    texTemplateDirectory: path.join(projectRootDirectory, "tex"),
    pdfOutputDirectory: path.join(projectRootDirectory, "public", "documents"),
    statsCacheFile: path.join(scriptsDirectory, "resume-cache.json"),
};

export const documents = [
    {texTemplateFileName: "resume.tex", pdfFileName: "resume.pdf", redactedPdfFileName: "redacted.pdf"},
    {texTemplateFileName: "netflix.tex", pdfFileName: "netflix.pdf"},
];

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

// How stats on the resume are rounded, e.g. for 907 stars and 3,360,144 impressions:
// "up" (910, 3.4M), "nearest" (910, 3.4M; 113 forks -> "110+") or "down" (900+, 3.3M).
export const rounding = "up";

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
    /\bVLC\b/g,
];

export const redactionMaxLength = 12;
