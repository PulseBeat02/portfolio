import {Stack, Typography} from "@mui/material";
import {profile} from "@/data/profile";
import {SECTIONS} from "@/data/sections";
import {YOUTUBE_CHANNEL_URL} from "@/data/videos";
import {Section} from "@/components/layout/Section";
import {Fade} from "@/components/motion/Fade";
import {CommandMenuHint} from "@/components/command-menu/CommandMenuHint";
import {ExternalLink} from "@/components/ui/ExternalLink";
import {colors, whiteAlpha} from "@/theme/tokens";

function OnlineHandle() {
    return (
        <Typography component="span" sx={{
            fontFamily: 'monospace',
            color: colors.textSubtle,
            backgroundColor: whiteAlpha(0.08),
            p: 0.5,
            borderRadius: 1,
        }}>
            {profile.handle}
        </Typography>
    );
}

export function AboutSection() {
    return (
        <Section section={SECTIONS.about}>
            <Fade>
                <Stack spacing={2}>
                    <Typography variant="body1">
                        I&apos;m a college junior from Boston passionate about developing low-level software for the
                        open-source community. I currently study Computer Science at the{" "}
                        <ExternalLink href="https://www.ucla.edu/">{profile.university} (UCLA)</ExternalLink>.
                        You may find me online as <OnlineHandle/>.
                    </Typography>
                    <Typography variant="body1">
                        I currently work and have worked on some cool stuff, like{" "}
                        <ExternalLink href="https://www.youtube.com/">YouTube</ExternalLink>,{" "}
                        <ExternalLink href="https://www.videolan.org/">VLC Media Player</ExternalLink> (traffic cone),
                        and some of my own open-source projects like{" "}
                        <ExternalLink href="https://github.com/PulseBeat02/yt-media-storage/">yt-media-storage</ExternalLink>{" "}
                        that dive deep into multimedia systems.
                    </Typography>
                    <Typography variant="body1">
                        In my spare time, I practice clarinet in my university orchestra and wind ensemble, and upload
                        videos on my <ExternalLink href={YOUTUBE_CHANNEL_URL}>YouTube channel</ExternalLink>, where I
                        discuss some of my fun projects in further depth.
                    </Typography>
                </Stack>
                <CommandMenuHint/>
            </Fade>
        </Section>
    );
}
