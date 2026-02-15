import fs from "fs";
import {fileURLToPath} from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const texPath = path.join(__dirname, "..", "public", "resume.tex");
const pdfPath = path.join(__dirname, "..", "public", "resume.pdf");

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

function formatLargeNumber(n) {
    if (n >= 1_000_000) {
        return `${Math.floor(n / 1_000_000)}M`;
    }
    if (n >= 100_000) {
        const tenKs = Math.floor(n / 10_000) * 10;
        return `${tenKs}k`;
    }
    if (n >= 10_000) {
        return `${Math.floor(n / 1_000)}k`;
    }
    return n.toString();
}

async function fetchGitHubStats(owner, repo) {
    try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
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
        const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`;
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
    const [ytStorage, mcav, youtube] = await Promise.all([fetchGitHubStats("PulseBeat02", "yt-media-storage"), fetchGitHubStats("PulseBeat02", "mcav"), fetchYouTubeStats("l03Os5uwWmk"),]);
    if (ytStorage) {
        const stars = formatGitHubStat(ytStorage.stars);
        const forks = formatGitHubStat(ytStorage.forks);
        content = content.replace(/\(\d+\+? stars, \d+\+? forks\) for encoding/, `(${stars} stars, ${forks} forks) for encoding`,);
    }

    if (mcav) {
        const stars = formatGitHubStat(mcav.stars);
        const forks = formatGitHubStat(mcav.forks);
        content = content.replace(/\(\d+\+? stars, \d+\+? forks\) for building/, `(${stars} stars, ${forks} forks) for building`,);
    }

    if (youtube) {
        const views = formatLargeNumber(youtube.views);
        content = content.replace(/over [\d.]+[kKmM]+ viewers/, `over ${views} viewers`,);
    }

    return content;
}

async function resume() {
    let content = fs.readFileSync(texPath, "utf-8");

    content = await updateStats(content);
    fs.writeFileSync(texPath, content);

    const response = await fetch("https://latex.ytotech.com/builds/sync", {
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
    fs.writeFileSync(pdfPath, buffer);
}

await resume();
