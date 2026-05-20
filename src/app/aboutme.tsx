import {Grid, Stack, Typography} from "@mui/material";
import {CustomLink, SectionHeading} from "@/app/common";

export default function AboutMe() {
    return (<Grid sx={{display: 'flex', justifyContent: 'center'}}>
        <Grid sx={{maxWidth: '600px', width: '100%'}}>
            <SectionHeading number={2} text="About Me"/>
            <Stack spacing={2}>
                <Typography variant="body1">
                    I&apos;m a college sophomore from Boston passionate about developing low-level software
                    for the open-source
                    community. I currently study Computer Science at the {" "}
                    <CustomLink href="https://www.ucla.edu/">
                        University of California, Los Angeles
                    </CustomLink>. You may find me online as <Typography component="span" sx={{
                    fontFamily: 'monospace',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    p: 0.5,
                    borderRadius: 1
                }}>PulseBeat02</Typography>.
                </Typography>
                <Typography variant="body1">
                    I've worked on some cool stuff, like
                    {" "} <CustomLink href="https://www.videolan.org/">VLC Media Player </CustomLink>
                    (traffic cone), and some of my own open-source projects that dive deep into multimedia systems.
                </Typography>
                <Typography variant="body1">
                    In my spare time, I enjoy playing clarinet in my university orchestra and wind ensemble, and
                    maintain my
                    {" "} <CustomLink href="https://www.youtube.com/@pulsebeat_02">YouTube channel</CustomLink>
                    , where I discuss some of
                    my technical projects in further depth.
                </Typography>
            </Stack>
        </Grid>
    </Grid>)
}