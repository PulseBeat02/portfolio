import Providers from "@/app/providers";
import {inter} from "@/app/theme";
import "@/app/globals.css";
import React from "react";
import type {Metadata} from 'next';

export const metadata: Metadata = {
    title: {
        template: "%s | Brandon Li",
        default: "Brandon Li",
    },
    description: "Brandon Li's (PulseBeat02) portfolio showcasing projects, skills, and blog posts.",
    keywords: ['developer', 'software-engineer', 'portfolio', 'projects', 'blog', 'experience', 'PulseBeat02'],
    icons: {
        icon: 'favicon.ico?v=2'
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://brandonli.me',
        siteName: "Brandon Li",
        images: [
            {
                url: 'favicon.ico?v=2',
                width: 1200,
                height: 630,
                alt: "Brandon Li",
            }
        ],
    },
    metadataBase: new URL('https://brandonli.me')
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" className={inter.className}>
        <body>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}