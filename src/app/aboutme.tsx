import {Grid, Stack, Typography} from "@mui/material";
import {CustomLink, SectionHeading} from "@/app/common";

export default function AboutMe() {
    return (<Grid sx={{display: 'flex', justifyContent: 'center'}}>
        <Grid sx={{maxWidth: '600px', width: '100%'}}>
            <SectionHeading number={2} text="About Me"/>
            <Stack spacing={2}>
                <Typography variant="body1">
                    I&apos;m a college sophomore from Boston passionate about constructing efficient high-end software
                    for the open-source
                    community. I currently study Computer Science at the {" "}
                    <CustomLink href="https://www.ucla.edu/">
                        University of California, Los Angeles
                    </CustomLink>, where I&apos;m taking courses in data structures, algorithms, and systems. You may find me online as <Typography component="span" sx={{
                    fontFamily: 'monospace',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    p: 0.5,
                    borderRadius: 1
                }}>PulseBeat02</Typography>.
                </Typography>
                <Typography variant="body1">
                    I contribute to bring new cool features to the multimedia ecosystem, like integrating computer
                    vision and machine learning into media playback with
                    {" "} <CustomLink href="https://github.com/facebookresearch/sam2">SAM2 </CustomLink> to segment
                    objects and draw faces in real-time.
                </Typography>
                <Typography variant="body1">
                    In my spare time, I enjoy playing clarinet in my university orchestra and wind ensemble, and
                    develop my own open-source projects.
                </Typography>
            </Stack>
        </Grid>
    </Grid>)
}