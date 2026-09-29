import fs from "fs";
import {setTimeout as sleep} from "timers/promises";
import {
    paths, github, youtube, latex, fetchTimeoutMs, rounding,
    staticPlaceholders, requiredPlaceholders, redactionPatterns, redactionMaxLength,
} from "./resume.config.js";

const ROUNDING_MODES = {up: Math.ceil, nearest: Math.round, down: Math.floor};

function roundTo(n, step) {
    const round = ROUNDING_MODES[rounding];
    if (!round) {
        throw new Error(`Unknown rounding mode: ${rounding}`);
    }
    return round(n / step) * step;
}

function formatGitHubStat(n) {
    const rounded = n < 10 && rounding !== "up" ? n : roundTo(n, 10);
    return rounded < n ? `${rounded}+` : rounded.toString();
}

function formatLargeNumber(n, decimal = false) {
    if (n >= 1_000_000) {
        return decimal ? `${(roundTo(n, 100_000) / 1_000_000).toFixed(1)}M` : `${roundTo(n, 1_000_000) / 1_000_000}M`;
    }
    if (n >= 100_000) {
        const rounded = roundTo(n, 10_000);
        return rounded >= 1_000_000 ? formatLargeNumber(rounded, decimal) : `${rounded / 1_000}k`;
    }
    if (n >= 10_000) {
        const rounded = decimal ? roundTo(n, 100) : roundTo(n, 1_000);
        if (rounded >= 100_000) {
            return formatLargeNumber(rounded, decimal);
        }
        return decimal ? `${(rounded / 1_000).toFixed(1)}k` : `${rounded / 1_000}k`;
    }
    return n.toString();
}

function fetchWithTimeout(url, init = {}, timeoutMs = fetchTimeoutMs) {
    return fetch(url, {...init, signal: AbortSignal.timeout(timeoutMs)});
}

async function fetchGitHubStats(owner, repo) {
    const headers = {"User-Agent": "resume-compiler", Accept: "application/vnd.github+json"};
    if (process.env.GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    try {
        const res = await fetchWithTimeout(`${github.apiUrl}/${owner}/${repo}`, {headers});
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
        const params = new URLSearchParams({part: "statistics", id: videoId, key: apiKey});
        const res = await fetchWithTimeout(`${youtube.apiUrl}?${params}`);
        if (!res.ok) {
            console.warn(`YouTube API error: ${res.status} ${await res.text()}`);
            return null;
        }
        const data = await res.json();
        const viewCount = data.items?.[0]?.statistics?.viewCount;
        if (viewCount === undefined) return null;
        return {views: parseInt(viewCount, 10)};
    } catch (e) {
        console.warn("Failed to fetch YouTube stats:", e.message);
        return null;
    }
}

function loadCache() {
    try {
        return JSON.parse(fs.readFileSync(paths.cache, "utf-8"));
    } catch {
        return {};
    }
}

function saveCache(cache) {
    fs.writeFileSync(paths.cache, JSON.stringify(cache, null, 2) + "\n");
}

async function buildPlaceholders() {
    const [ytStorage, mcav, yt] = await Promise.all([
        fetchGitHubStats(github.owner, github.ytStorageRepo),
        fetchGitHubStats(github.owner, github.mcavRepo),
        fetchYouTubeStats(youtube.videoId),
    ]);
    const cache = loadCache();
    if (ytStorage) cache.ytStorage = ytStorage;
    if (mcav) cache.mcav = mcav;
    if (yt) cache.youtube = yt;

    const placeholders = {...staticPlaceholders};
    if (cache.ytStorage) {
        placeholders.YT_STORAGE_STARS = formatGitHubStat(cache.ytStorage.stars);
        placeholders.YT_STORAGE_FORKS = formatGitHubStat(cache.ytStorage.forks);
    }
    if (cache.mcav) {
        placeholders.MCAV_STARS = formatGitHubStat(cache.mcav.stars);
        placeholders.MCAV_FORKS = formatGitHubStat(cache.mcav.forks);
    }
    if (cache.youtube) {
        placeholders.YT_VIEWERS = formatLargeNumber(cache.youtube.views);
        placeholders.YT_IMPRESSIONS = formatLargeNumber(cache.youtube.views * youtube.impressionsMultiplier, true);
    }

    const missing = requiredPlaceholders.filter(k => !(k in placeholders));
    if (missing.length > 0) {
        throw new Error(`Missing placeholders with no cached fallback: ${missing.join(", ")}`);
    }

    saveCache(cache);
    return placeholders;
}

function replacePlaceholders(content, placeholders) {
    return content.replace(/\{\{(\w+)}}/g, (match, key) => {
        if (!(key in placeholders)) {
            throw new Error(`Unknown placeholder: ${match}`);
        }
        return placeholders[key];
    });
}

function isRetryable(status) {
    return status === 429 || status >= 500;
}

async function compile(content, label) {
    for (let attempt = 1; ; attempt++) {
        let status;
        let error;
        try {
            const response = await fetchWithTimeout(latex.compileUrl, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({compiler: latex.compiler, resources: [{main: true, content}]}),
            }, latex.timeoutMs);
            status = response.status;
            if (response.ok) {
                return Buffer.from(await response.arrayBuffer());
            }
            error = await response.text();
        } catch (e) {
            if (attempt >= latex.maxAttempts) throw e;
            console.warn(`Compile request for ${label} failed (${e.message}), retrying...`);
            await sleep(latex.retryDelayMs * attempt);
            continue;
        }

        if (isRetryable(status) && attempt < latex.maxAttempts) {
            console.warn(`Compile service returned ${status} for ${label}, retrying...`);
            await sleep(latex.retryDelayMs * attempt);
            continue;
        }
        throw new Error(`Resume compilation failed for ${label} (${status}):\n${error}`);
    }
}

function redactContent(content) {
    const x = (s) => {
        const redacted = s.replace(/[a-zA-Z0-9]/g, "X");
        return redacted.length > redactionMaxLength ? "X".repeat(redactionMaxLength) : redacted;
    };
    const redacted = redactionPatterns.reduce((r, pattern) => r.replace(pattern, x), content);
    // Redacted URLs are not valid link targets, so render links as plain underlined text.
    return redacted.replace("\\begin{document}", "\\renewcommand{\\href}[2]{\\uline{#2}}\n\\begin{document}");
}

async function resume() {
    const template = fs.readFileSync(paths.template, "utf-8");
    const placeholders = await buildPlaceholders();
    const content = replacePlaceholders(template, placeholders);
    const pdf = await compile(content, "resume.pdf");
    const redactedPdf = await compile(redactContent(content), "redacted.pdf");
    fs.writeFileSync(paths.pdf, pdf);
    fs.writeFileSync(paths.redactedPdf, redactedPdf);
}

try {
    await resume();
} catch (e) {
    console.error(e.message);
    process.exit(1);
}
