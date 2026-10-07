import fs from "fs";
import path from "path";
import {setTimeout as sleep} from "timers/promises";
import {
    paths, documents, github, youtube, latex, fetchTimeoutMs, rounding,
    staticPlaceholders, requiredPlaceholders, redactionPatterns, redactionMaxLength,
} from "./resume.config.js";

const ROUNDING_MODES = {up: Math.ceil, nearest: Math.round, down: Math.floor};

function roundToStep(value, step) {
    if (!Object.hasOwn(ROUNDING_MODES, rounding)) {
        throw new Error(`Unknown rounding mode: ${rounding}`);
    }
    return ROUNDING_MODES[rounding](value / step) * step;
}

function formatGitHubStat(statCount) {
    const roundedCount = statCount < 10 && rounding !== "up" ? statCount : roundToStep(statCount, 10);
    return roundedCount < statCount ? `${roundedCount}+` : roundedCount.toString();
}

function formatLargeNumber(count, showDecimal = false) {
    if (count >= 1_000_000) {
        const millions = roundToStep(count, 100_000) / 1_000_000;
        return showDecimal || !Number.isInteger(millions) ? `${millions.toFixed(1)}M` : `${millions}M`;
    }
    if (count >= 100_000) {
        const roundedCount = roundToStep(count, 10_000);
        return roundedCount >= 1_000_000 ? formatLargeNumber(roundedCount, showDecimal) : `${roundedCount / 1_000}k`;
    }
    if (count >= 10_000) {
        const roundedCount = showDecimal ? roundToStep(count, 100) : roundToStep(count, 1_000);
        if (roundedCount >= 100_000) {
            return formatLargeNumber(roundedCount, showDecimal);
        }
        return showDecimal ? `${(roundedCount / 1_000).toFixed(1)}k` : `${roundedCount / 1_000}k`;
    }
    return count.toString();
}

function fetchWithTimeout(url, requestInit = {}, timeoutMs = fetchTimeoutMs) {
    return fetch(url, {...requestInit, signal: AbortSignal.timeout(timeoutMs)});
}

async function fetchGitHubStats(owner, repositoryName) {
    const requestHeaders = {"User-Agent": "resume-compiler", Accept: "application/vnd.github+json"};
    if (process.env.GITHUB_TOKEN) {
        requestHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    try {
        const response = await fetchWithTimeout(`${github.apiUrl}/${owner}/${repositoryName}`, {headers: requestHeaders});
        if (!response.ok) {
            console.warn(`GitHub API error for ${owner}/${repositoryName}: ${response.status}`);
            return null;
        }
        const repository = await response.json();
        return {stars: repository.stargazers_count, forks: repository.forks_count};
    } catch (error) {
        console.warn(`Failed to fetch GitHub stats for ${owner}/${repositoryName}:`, error.message);
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
        const queryParameters = new URLSearchParams({part: "statistics", id: videoId, key: apiKey});
        const response = await fetchWithTimeout(`${youtube.apiUrl}?${queryParameters}`);
        if (!response.ok) {
            console.warn(`YouTube API error: ${response.status} ${await response.text()}`);
            return null;
        }
        const videoList = await response.json();
        const viewCount = videoList.items?.[0]?.statistics?.viewCount;
        if (viewCount === undefined) return null;
        return {views: parseInt(viewCount, 10)};
    } catch (error) {
        console.warn("Failed to fetch YouTube stats:", error.message);
        return null;
    }
}

function loadStatsCache() {
    try {
        return JSON.parse(fs.readFileSync(paths.statsCacheFile, "utf-8"));
    } catch {
        return {};
    }
}

function saveStatsCache(statsCache) {
    fs.writeFileSync(paths.statsCacheFile, JSON.stringify(statsCache, null, 2) + "\n");
}

async function buildPlaceholders() {
    const [ytStorageStats, mcavStats, youtubeStats] = await Promise.all([
        fetchGitHubStats(github.owner, github.ytStorageRepo),
        fetchGitHubStats(github.owner, github.mcavRepo),
        fetchYouTubeStats(youtube.videoId),
    ]);
    const statsCache = loadStatsCache();
    if (ytStorageStats) statsCache.ytStorage = ytStorageStats;
    if (mcavStats) statsCache.mcav = mcavStats;
    if (youtubeStats) statsCache.youtube = youtubeStats;

    const placeholders = {...staticPlaceholders};
    if (statsCache.ytStorage) {
        placeholders.YT_STORAGE_STARS = formatGitHubStat(statsCache.ytStorage.stars);
        placeholders.YT_STORAGE_FORKS = formatGitHubStat(statsCache.ytStorage.forks);
    }
    if (statsCache.mcav) {
        placeholders.MCAV_STARS = formatGitHubStat(statsCache.mcav.stars);
        placeholders.MCAV_FORKS = formatGitHubStat(statsCache.mcav.forks);
    }
    if (statsCache.youtube) {
        placeholders.YT_VIEWERS = formatLargeNumber(statsCache.youtube.views);
        placeholders.YT_IMPRESSIONS = formatLargeNumber(statsCache.youtube.views * youtube.impressionsMultiplier, true);
    }

    const missingPlaceholderNames = requiredPlaceholders.filter((placeholderName) => !(placeholderName in placeholders));
    if (missingPlaceholderNames.length > 0) {
        throw new Error(`Missing placeholders with no cached fallback: ${missingPlaceholderNames.join(", ")}`);
    }

    saveStatsCache(statsCache);
    return placeholders;
}

function replacePlaceholders(texSource, placeholders) {
    return texSource.replace(/\{\{(\w+)}}/g, (placeholderToken, placeholderName) => {
        if (!(placeholderName in placeholders)) {
            throw new Error(`Unknown placeholder: ${placeholderToken}`);
        }
        return placeholders[placeholderName];
    });
}

function isRetryableStatus(httpStatus) {
    return httpStatus === 429 || httpStatus >= 500;
}

async function compileLatexToPdf(texSource, pdfLabel) {
    for (let attempt = 1; ; attempt++) {
        let responseStatus;
        let responseErrorBody;
        try {
            const response = await fetchWithTimeout(latex.compileUrl, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({compiler: latex.compiler, resources: [{main: true, content: texSource}]}),
            }, latex.timeoutMs);
            responseStatus = response.status;
            if (response.ok) {
                return Buffer.from(await response.arrayBuffer());
            }
            responseErrorBody = await response.text();
        } catch (error) {
            if (attempt >= latex.maxAttempts) throw error;
            console.warn(`Compile request for ${pdfLabel} failed (${error.message}), retrying...`);
            await sleep(latex.retryDelayMs * attempt);
            continue;
        }

        if (isRetryableStatus(responseStatus) && attempt < latex.maxAttempts) {
            console.warn(`Compile service returned ${responseStatus} for ${pdfLabel}, retrying...`);
            await sleep(latex.retryDelayMs * attempt);
            continue;
        }
        throw new Error(`LaTeX compilation failed for ${pdfLabel} (${responseStatus}):\n${responseErrorBody}`);
    }
}

function maskSensitiveText(sensitiveText) {
    const maskedText = sensitiveText.replace(/[a-zA-Z0-9]/g, "X");
    return maskedText.length > redactionMaxLength ? "X".repeat(redactionMaxLength) : maskedText;
}

function redactTexSource(texSource) {
    const redactedTexSource = redactionPatterns.reduce(
        (partiallyRedactedSource, redactionPattern) => partiallyRedactedSource.replace(redactionPattern, maskSensitiveText),
        texSource,
    );
    // Redacted URLs are not valid link targets, so render links as plain underlined text.
    return redactedTexSource.replace("\\begin{document}", "\\renewcommand{\\href}[2]{\\uline{#2}}\n\\begin{document}");
}

async function compileDocument(documentDefinition, placeholders) {
    const {texTemplateFileName, pdfFileName, redactedPdfFileName} = documentDefinition;
    const texTemplate = fs.readFileSync(path.join(paths.texTemplateDirectory, texTemplateFileName), "utf-8");
    const texSource = replacePlaceholders(texTemplate, placeholders);

    const compiledPdfs = [{fileName: pdfFileName, pdfBuffer: await compileLatexToPdf(texSource, pdfFileName)}];
    if (redactedPdfFileName) {
        const redactedPdfBuffer = await compileLatexToPdf(redactTexSource(texSource), redactedPdfFileName);
        compiledPdfs.push({fileName: redactedPdfFileName, pdfBuffer: redactedPdfBuffer});
    }
    return compiledPdfs;
}

async function compileAllDocuments() {
    const placeholders = await buildPlaceholders();
    const compiledPdfsPerDocument = await Promise.all(
        documents.map((documentDefinition) => compileDocument(documentDefinition, placeholders)),
    );
    fs.mkdirSync(paths.pdfOutputDirectory, {recursive: true});
    for (const {fileName, pdfBuffer} of compiledPdfsPerDocument.flat()) {
        fs.writeFileSync(path.join(paths.pdfOutputDirectory, fileName), pdfBuffer);
    }
}

try {
    await compileAllDocuments();
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
