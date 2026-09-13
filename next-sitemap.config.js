/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: process.env.SITE_URL || 'https://brandonli.me',
    generateRobotsTxt: true
};

export default config;
