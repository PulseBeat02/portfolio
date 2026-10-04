import {Box, Button, Typography} from "@mui/material";
import type {Metadata} from "next";
import {Fade} from "@/components/motion/Fade";
import {accentButtonStyle} from "@/components/ui/styles";
import {siteMetadata} from "@/data/site";
import {motionTimings} from "@/theme/motion";
import {colors} from "@/theme/tokens";

export const metadata: Metadata = {
    title: "Page Not Found",
};

const ACTION_BUTTONS_MAX_WIDTH_PIXELS = 220;

const fadeInDelaySecondsForPosition = (positionFromTop: number) => positionFromTop * motionTimings.notFoundStaggerSeconds;

export default function NotFoundPage() {
    return (
        <Box component="main" sx={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: 2,
            p: 3,
        }}>
            <Fade delaySeconds={fadeInDelaySecondsForPosition(0)}>
                <Typography component="p" sx={{
                    fontSize: '7rem',
                    fontWeight: 700,
                    lineHeight: 1,
                    color: colors.accent,
                    fontVariantNumeric: 'tabular-nums',
                }}>
                    404
                </Typography>
            </Fade>
            <Fade delaySeconds={fadeInDelaySecondsForPosition(1)}>
                <Typography variant="h4" component="h1" sx={{whiteSpace: 'nowrap'}}>
                    Page not found
                </Typography>
            </Fade>
            <Fade delaySeconds={fadeInDelaySecondsForPosition(2)}>
                <Typography variant="body1" sx={{maxWidth: '24ch', textWrap: 'balance'}}>
                    The page you&apos;re looking for doesn&apos;t exist or has moved.
                </Typography>
            </Fade>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                mt: 1,
                width: '100%',
                maxWidth: ACTION_BUTTONS_MAX_WIDTH_PIXELS,
            }}>
                <Fade delaySeconds={fadeInDelaySecondsForPosition(3)}>
                    <Button href="/" variant="outlined" fullWidth sx={accentButtonStyle}>
                        Back to home
                    </Button>
                </Fade>
                <Fade delaySeconds={fadeInDelaySecondsForPosition(4)}>
                    <Button href={siteMetadata.resumePath} variant="outlined" fullWidth sx={accentButtonStyle}>
                        View resume
                    </Button>
                </Fade>
            </Box>
        </Box>
    );
}
