export const SITE_URL = "https://brandonli.me";

export const SITE_HOSTNAME = new URL(SITE_URL).hostname;

export const siteMetadata = {
    siteName: "Brandon Li",
    titleTemplate: "%s | Brandon Li",
    description: "Brandon Li's (PulseBeat02) portfolio showcasing projects, skills, and experience.",
    keywords: ['developer', 'software-engineer', 'portfolio', 'projects', 'experience', 'PulseBeat02'],
    locale: 'en_US',
    faviconPath: '/favicon.ico?v=3',
    appleTouchIconPath: '/images/profile/apple-touch-icon.png',
    resumePath: '/documents/resume.pdf',
    sourceRepositoryUrl: 'https://github.com/PulseBeat02/portfolio',
    contactEmail: 'jobs@brandonli.me',
} as const;

export const SITE_LAST_UPDATED_DATE = new Date(process.env.SITE_LAST_UPDATED_ISO ?? Date.now());
