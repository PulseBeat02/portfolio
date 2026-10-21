# Brandon's Developer Portfolio

This is my personal developer portfolio, written in Typescript with React and Next.js.

## Configuration

| Environment variable | Required | Purpose                                                                                                        |
|----------------------|----------|----------------------------------------------------------------------------------------------------------------|
| `UMAMI_URL`          | No       | Base URL of the Umami server that receives the site's analytics and session recordings, such as `https://umami.example.com`. Analytics are off while it is unset. |
| `IPINFO_TOKEN`       | No       | [IPinfo Lite](https://ipinfo.io/developers/lite-api) token. Tags analytics sessions with the visitor's network organization and hostname. |
| `GITHUB_TOKEN`       | No       | Raises the GitHub API rate limit for repository stats.                                                         |
