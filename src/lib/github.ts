import resumeCache from "../../scripts/resume-cache.json";

export interface RepositoryStats {
    stars: number;
    forks: number;
}

interface GitHubRepositoryResponse {
    stargazers_count?: unknown;
    forks_count?: unknown;
}

const GITHUB_API_BASE_URL = "https://api.github.com/repos";
const REVALIDATE_SECONDS = 24 * 60 * 60;
const REQUEST_TIMEOUT_MILLISECONDS = 5_000;

const cachedStatsByRepository: Record<string, RepositoryStats | undefined> = {
    "PulseBeat02/yt-media-storage": resumeCache.ytStorage,
    "PulseBeat02/mcav": resumeCache.mcav,
};

function toRepositoryPath(repositoryUrl: string): string {
    return new URL(repositoryUrl).pathname.replace(/^\/|\/$/g, "");
}

function buildRequestHeaders(): HeadersInit {
    const headers: Record<string, string> = {Accept: "application/vnd.github+json"};
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    return headers;
}

function parseRepositoryStats(response: GitHubRepositoryResponse): RepositoryStats | null {
    const {stargazers_count: stars, forks_count: forks} = response;
    return typeof stars === "number" && typeof forks === "number" ? {stars, forks} : null;
}

async function fetchRepositoryStats(repositoryPath: string): Promise<RepositoryStats | null> {
    const response = await fetch(`${GITHUB_API_BASE_URL}/${repositoryPath}`, {
        headers: buildRequestHeaders(),
        next: {revalidate: REVALIDATE_SECONDS},
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MILLISECONDS),
    });
    if (!response.ok) return null;
    return parseRepositoryStats(await response.json());
}

export async function getRepositoryStats(repositoryUrl: string): Promise<RepositoryStats | null> {
    const repositoryPath = toRepositoryPath(repositoryUrl);
    const fallbackStats = cachedStatsByRepository[repositoryPath] ?? null;
    try {
        return (await fetchRepositoryStats(repositoryPath)) ?? fallbackStats;
    } catch {
        return fallbackStats;
    }
}
