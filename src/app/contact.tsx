import {Box, Grid, Typography} from "@mui/material";
import {SectionHeading} from "@/app/common";
import {profile, socialLinks, type SocialLink} from "@/data/contact";

function SocialIcon({Icon, href, label}: SocialLink) {
    return (
        <Grid>
            <Box
                component="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                sx={{
                    display: 'inline-flex',
                    color: 'inherit',
                    textDecoration: 'none',
                    transition: 'filter 0.3s',
                    '&:hover': {filter: 'brightness(1.3)'},
                }}
            >
                <Icon style={{fontSize: 28}}/>
            </Box>
        </Grid>
    );
}

export default function Contact() {
    return (
        <Grid sx={{maxWidth: '350px', width: '100%'}}>
            <SectionHeading number={1} text="Contact"/>
            <Grid>
                <Typography variant="h3">{profile.name}</Typography>
                <Typography variant="h4" sx={{fontSize: "1.25rem"}}>{profile.title}</Typography>
                <Typography sx={{marginTop: 1}} variant="body1">
                    {profile.tagline}
                </Typography>
            </Grid>
            <Grid container spacing={2} sx={{marginTop: 3, maxWidth: '700px'}}>
                {socialLinks.map((link) => (
                    <SocialIcon key={link.label} {...link}/>
                ))}
            </Grid>
        </Grid>
    );
}
