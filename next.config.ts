import type {NextConfig} from "next";

const DOCUMENT_ALIASES = [
    {source: '/resume.pdf', destination: '/documents/resume.pdf'},
    {source: '/redacted.pdf', destination: '/documents/redacted.pdf'},
];

const nextConfig: NextConfig = {
    turbopack: {
        root: __dirname,
    },
    async rewrites() {
        return DOCUMENT_ALIASES;
    },
};

export default nextConfig;
