import "@/app/globals.css";
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import React from "react";
import {AppProviders} from "@/components/providers/AppProviders";
import {SITE_URL, siteMetadata} from "@/data/site";
import {buildPersonStructuredData, serializeStructuredData} from "@/lib/structured-data";

const interFont = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

const RESET_SCROLL_ON_RELOAD_SCRIPT = "history.scrollRestoration='manual';scrollTo(0,0);";

export const metadata: Metadata = {
    title: {
        template: siteMetadata.titleTemplate,
        default: siteMetadata.siteName,
    },
    description: siteMetadata.description,
    keywords: [...siteMetadata.keywords],
    icons: {
        icon: siteMetadata.faviconPath,
        apple: siteMetadata.appleTouchIconPath,
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        type: 'website',
        locale: siteMetadata.locale,
        url: SITE_URL,
        siteName: siteMetadata.siteName,
    },
    metadataBase: new URL(SITE_URL),
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" className={interFont.variable}>
        <body>
        <script dangerouslySetInnerHTML={{__html: RESET_SCROLL_ON_RELOAD_SCRIPT}}/>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: serializeStructuredData(buildPersonStructuredData())}}
        />
        <AppProviders>
            {children}
        </AppProviders>
        </body>
        </html>
    );
}
