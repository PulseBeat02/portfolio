import {Box} from "@mui/material";
import {socialLinks, type SocialLink} from "@/data/profile";
import {EXTERNAL_LINK_ATTRIBUTES} from "@/components/ui/ExternalLink";
import {dimSiblingsOnHover} from "@/components/ui/styles";
import {analyticsEventNames, buildAnalyticsEventAttributes} from "@/lib/analytics";
import {easings} from "@/theme/tokens";

const SOCIAL_ICON_SIZE_PIXELS = 24;

function SocialIconLink({Icon, href, label}: SocialLink) {
    return (
        <Box
            component="a"
            href={href}
            {...EXTERNAL_LINK_ATTRIBUTES}
            aria-label={label}
            {...buildAnalyticsEventAttributes(analyticsEventNames.socialLinkClicked(label))}
            sx={{
                display: 'inline-flex',
                color: 'inherit',
                textDecoration: 'none',
                transition: `filter 0.3s, opacity 0.3s, transform 0.35s ${easings.overshoot}`,
                '&:hover, &:focus-visible': {filter: 'brightness(1.3)', transform: 'scale(1.25)'},
            }}
        >
            <Icon style={{fontSize: SOCIAL_ICON_SIZE_PIXELS}}/>
        </Box>
    );
}

export function SocialLinks() {
    return (
        <Box sx={{mt: 2.5, display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-between', gap: 1, ...dimSiblingsOnHover}}>
            {socialLinks.map((socialLink) => (
                <SocialIconLink key={socialLink.label} {...socialLink}/>
            ))}
        </Box>
    );
}
