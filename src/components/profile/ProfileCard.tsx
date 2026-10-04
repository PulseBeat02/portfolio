import {Box, Typography} from "@mui/material";
import {profile} from "@/data/profile";
import {Fade} from "@/components/motion/Fade";
import {ProfilePhoto, WIDE_PHOTO_SIZE_PIXELS} from "@/components/profile/ProfilePhoto";
import {ResumeButton} from "@/components/profile/ResumeButton";
import {SocialLinks} from "@/components/profile/SocialLinks";

const NARROW_PHOTO_SIZE = 'clamp(72px, calc(100cqi - 280px), min(45cqi, 240px))';
const STACKED_PHOTO_SIZE_PIXELS = 140;
const STACKED_LAYOUT_MAX_CARD_WIDTH_PIXELS = 400;
const TEXT_COLUMN_MAX_WIDTH_PIXELS = 320;

const whenStackedLayout = (styles: object) => ({
    '@media (max-width: 1199.95px)': {[`@container (max-width: ${STACKED_LAYOUT_MAX_CARD_WIDTH_PIXELS}px)`]: styles},
});

function ProfileText() {
    return (
        <Fade>
            <Typography variant="h3" component="h1">{profile.name}</Typography>
            <Typography variant="h4" component="p" sx={{fontSize: "1.25rem"}}>{profile.title}</Typography>
            <Typography variant="body1" sx={{mt: 1, maxWidth: '28ch'}}>{profile.tagline}</Typography>
            <ResumeButton/>
            <SocialLinks/>
        </Fade>
    );
}

export function ProfileCard() {
    return (
        <Box sx={{maxWidth: {xs: '600px', lg: 'none'}, width: {xs: '100%', lg: '350px'}, containerType: 'inline-size'}}>
            <Box sx={{
                display: 'flex',
                flexDirection: {xs: 'row', lg: 'column-reverse'},
                alignItems: {xs: 'center', lg: 'flex-start'},
                justifyContent: {xs: 'space-between', lg: 'flex-start'},
                gap: {xs: 'clamp(16px, 6cqi, 40px)', lg: 3},
                width: {lg: 'fit-content'},
                mx: {lg: 'auto'},
                ...whenStackedLayout({flexDirection: 'column-reverse', alignItems: 'flex-start', gap: 2}),
            }}>
                <Box sx={{
                    flex: {xs: 1, lg: 'none'},
                    minWidth: 0,
                    maxWidth: {xs: TEXT_COLUMN_MAX_WIDTH_PIXELS, lg: WIDE_PHOTO_SIZE_PIXELS + 40},
                    alignSelf: {lg: 'stretch'},
                    ...whenStackedLayout({flex: 'none', width: '100%'}),
                }}>
                    <ProfileText/>
                </Box>
                <ProfilePhoto sizingStyles={{
                    width: {xs: NARROW_PHOTO_SIZE, lg: `${WIDE_PHOTO_SIZE_PIXELS}px`},
                    alignSelf: {lg: 'flex-start'},
                    ...whenStackedLayout({width: `${STACKED_PHOTO_SIZE_PIXELS}px`}),
                }}/>
            </Box>
        </Box>
    );
}
