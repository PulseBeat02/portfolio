import {Box, Link} from "@mui/material";
import {Fragment} from "react";
import {Reveal} from "@/components/motion/Reveal";
import {profile} from "@/data/profile";
import {SITE_LAST_UPDATED_DATE, siteMetadata} from "@/data/site";
import {EXTERNAL_LINK_ATTRIBUTES} from "@/components/ui/ExternalLink";
import {UMAMI_DASHBOARD_URL} from "@/lib/analytics";
import {formatShortUtcDate} from "@/lib/format";
import {colors} from "@/theme/tokens";

interface FooterLink {
    label: string;
    href: string;
}

const FOOTER_LINKS: readonly FooterLink[] = [
    {label: "Source", href: siteMetadata.sourceRepositoryUrl},
    {label: "Analytics", href: UMAMI_DASHBOARD_URL},
];

const footerLinkStyle = {
    color: 'inherit',
    textDecorationColor: 'currentColor',
    textUnderlineOffset: '0.2em',
    transition: 'color 0.2s ease',
    '&:hover, &:focus-visible': {color: colors.accent},
} as const;

function FooterSeparator() {
    return (
        <Box component="span" aria-hidden sx={{fontSize: '1.4rem', lineHeight: 0, fontWeight: 700}}>
            ·
        </Box>
    );
}

function CopyrightNotice() {
    return <span>© {SITE_LAST_UPDATED_DATE.getUTCFullYear()} {profile.name}</span>;
}

function LastUpdatedNotice() {
    return (
        <span>
            Last updated{' '}
            <time dateTime={SITE_LAST_UPDATED_DATE.toISOString()}>{formatShortUtcDate(SITE_LAST_UPDATED_DATE)}</time>
        </span>
    );
}

function FooterExternalLink({label, href}: FooterLink) {
    return (
        <Link href={href} {...EXTERNAL_LINK_ATTRIBUTES} sx={footerLinkStyle}>
            {label}
        </Link>
    );
}

export function SiteFooter() {
    const footerItems = [
        <CopyrightNotice key="copyright"/>,
        <LastUpdatedNotice key="last-updated"/>,
        ...FOOTER_LINKS.map((footerLink) => <FooterExternalLink key={footerLink.label} {...footerLink}/>),
    ];
    return (
        <Reveal>
            <Box component="footer" sx={{
                maxWidth: 600,
                mx: 'auto',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                columnGap: 1.5,
                rowGap: 0.5,
                color: colors.textMuted,
                fontSize: '0.8rem',
            }}>
                {footerItems.map((footerItem, footerItemIndex) => (
                    <Fragment key={footerItem.key}>
                        {footerItemIndex > 0 && <FooterSeparator/>}
                        {footerItem}
                    </Fragment>
                ))}
            </Box>
        </Reveal>
    );
}
