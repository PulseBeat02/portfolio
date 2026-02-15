import fs from "fs";
import {fileURLToPath} from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEX_PATH = path.join(__dirname, "..", "public", "resume.tex");
const PDF_PATH = path.join(__dirname, "..", "public", "resume.pdf");

const GITHUB_OWNER = "PulseBeat02";
const YT_STORAGE_REPO = "yt-media-storage";
const MCAV_REPO = "mcav";
const VIDEO_ID = "l03Os5uwWmk";

const GITHUB_API_URL = "https://api.github.com/repos";
const YOUTUBE_DATA_API_URL = "https://www.googleapis.com/youtube/v3/videos";
const LATEX_COMPILE_URL = "https://latex.ytotech.com/builds/sync";
const IMPRESSIONS_MULTIPLIER = 12;

const YT_STORAGE_STATS_REGEX = /\(\d+\+? stars, \d+\+? forks\) for encoding/;
const MCAV_STATS_REGEX = /\(\d+\+? stars, \d+\+? forks\) for building/;
const VIEWERS_REGEX = /over [\d.]+[kKmM]+ viewers/;
const IMPRESSIONS_REGEX = /over [\d.]+[kKmM]+ impressions/;

function formatGitHubStat(n) {
    const remainder = n % 10;
    if (remainder === 0) {
        return n.toString();
    }
    if (remainder < 5) {
        return `${Math.floor(n / 10) * 10}+`;
    }
    return `${Math.ceil(n / 10) * 10}`;
}

function formatLargeNumber(n, decimal = false) {
    if (n >= 1_000_000) {
        return decimal ? `${(n / 1_000_000).toFixed(1)}M` : `${Math.floor(n / 1_000_000)}M`;
    }
    if (n >= 100_000) {
        return decimal ? `${(n / 1_000_000).toFixed(1)}M` : `${Math.floor(n / 10_000) * 10}k`;
    }
    if (n >= 10_000) {
        return decimal ? `${(n / 1_000).toFixed(1)}k` : `${Math.floor(n / 1_000)}k`;
    }
    return n.toString();
}

async function fetchGitHubStats(owner, repo) {
    try {
        const res = await fetch(`${GITHUB_API_URL}/${owner}/${repo}`, {
            headers: {"User-Agent": "resume-compiler"},
        });
        if (!res.ok) {
            console.warn(`GitHub API error for ${owner}/${repo}: ${res.status}`);
            return null;
        }
        const data = await res.json();
        return {stars: data.stargazers_count, forks: data.forks_count};
    } catch (e) {
        console.warn(`Failed to fetch GitHub stats for ${owner}/${repo}:`, e.message);
        return null;
    }
}

async function fetchYouTubeStats(videoId) {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        console.warn("YOUTUBE_API_KEY not set, skipping YouTube stats");
        return null;
    }
    try {
        const url = `${YOUTUBE_DATA_API_URL}?part=statistics&id=${videoId}&key=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) {
            console.warn(`YouTube API error: ${res.status}`);
            return null;
        }
        const data = await res.json();
        if (!data.items?.[0]) return null;
        return {views: parseInt(data.items[0].statistics.viewCount, 10)};
    } catch (e) {
        console.warn("Failed to fetch YouTube stats:", e.message);
        return null;
    }
}

async function updateStats(content) {
    const [ytStorage, mcav, youtube] = await Promise.all([
        fetchGitHubStats(GITHUB_OWNER, YT_STORAGE_REPO),
        fetchGitHubStats(GITHUB_OWNER, MCAV_REPO),
        fetchYouTubeStats(VIDEO_ID),
    ]);
    if (ytStorage) {
        const stars = formatGitHubStat(ytStorage.stars);
        const forks = formatGitHubStat(ytStorage.forks);
        content = content.replace(YT_STORAGE_STATS_REGEX, `(${stars} stars, ${forks} forks) for encoding`);
    }

    if (mcav) {
        const stars = formatGitHubStat(mcav.stars);
        const forks = formatGitHubStat(mcav.forks);
        content = content.replace(MCAV_STATS_REGEX, `(${stars} stars, ${forks} forks) for building`);
    }

    if (youtube) {
        const views = formatLargeNumber(youtube.views);
        content = content.replace(VIEWERS_REGEX, `over ${views} viewers`);
        const impressions = formatLargeNumber(youtube.views * IMPRESSIONS_MULTIPLIER, true);
        content = content.replace(IMPRESSIONS_REGEX, `over ${impressions} impressions`);
    }

    return content;
}

async function resume() {
    let content = fs.readFileSync(TEX_PATH, "utf-8");

    content = await updateStats(content);
    fs.writeFileSync(TEX_PATH, content);

    const response = await fetch(LATEX_COMPILE_URL, {
        method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({
            compiler: "pdflatex", resources: [{main: true, content}],
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error("Resume compilation failed:\n", error);
        process.exit(1);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(PDF_PATH, buffer);
}

await resume();
