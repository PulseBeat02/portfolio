import {execFileSync} from "node:child_process";
import type {NextConfig} from "next";

const DOCUMENT_ALIASES = [
    {source: '/resume', destination: '/documents/resume.pdf'},
    {source: '/resume.pdf', destination: '/documents/resume.pdf'},
    {source: '/redacted.pdf', destination: '/documents/redacted.pdf'},
];

function resolveLastCommitDateIso(): string {
    try {
        const lastCommitDateIso = execFileSync("git", ["log", "-1", "--format=%cI"], {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"],
        });
        return lastCommitDateIso.trim() || new Date().toISOString();
    } catch {
        return new Date().toISOString();
    }
}

const nextConfig: NextConfig = {
    turbopack: {
        root: __dirname,
    },
    env: {
        SITE_LAST_UPDATED_ISO: resolveLastCommitDateIso(),
    },
    async rewrites() {
        return DOCUMENT_ALIASES;
    },
};

export default nextConfig;
