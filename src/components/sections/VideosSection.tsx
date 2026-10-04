import {Box, Typography} from "@mui/material";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import Image from "next/image";
import {SECTIONS} from "@/data/sections";
import {getVideoThumbnailPath, getVideoWatchUrl, videos, YOUTUBE_CHANNEL_URL, type VideoItem} from "@/data/videos";
import {Section} from "@/components/layout/Section";
import {Reveal} from "@/components/motion/Reveal";
import {VideoHoverPreview} from "@/components/sections/VideoHoverPreview";
import {EXTERNAL_LINK_ATTRIBUTES, ExternalLink} from "@/components/ui/ExternalLink";
import {dimSiblingsOnHover, metadataTextStyle} from "@/components/ui/styles";
import {formatPublishedDate} from "@/lib/format";
import {PREVIEW_PLAYING_DATA_ATTRIBUTE} from "@/lib/video-preview";
import {blackAlpha, colors, layout, whiteAlpha} from "@/theme/tokens";

const VIDEOS_PER_ROW = 2;
const VIDEO_TITLE_CLASS_NAME = "video-title";
const VIDEO_THUMBNAIL_CLASS_NAME = "video-thumbnail";
const VIDEO_PLAY_OVERLAY_CLASS_NAME = "video-play-overlay";

function PlayOverlay() {
    return (
        <Box className={VIDEO_PLAY_OVERLAY_CLASS_NAME} aria-hidden sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: blackAlpha(0.35),
            opacity: 0,
            transition: 'opacity 0.3s ease',
        }}>
            <PlayArrowRoundedIcon sx={{fontSize: 48, color: 'common.white'}}/>
        </Box>
    );
}

function VideoThumbnail({video}: { video: VideoItem }) {
    return (
        <Box className={VIDEO_THUMBNAIL_CLASS_NAME} sx={{
            position: 'relative',
            aspectRatio: '16 / 9',
            borderRadius: '12px',
            overflow: 'hidden',
            border: `1px solid ${whiteAlpha(0.1)}`,
            '& img': {transition: 'transform 0.3s ease'},
        }}>
            <Image
                src={getVideoThumbnailPath(video.id)}
                alt=""
                fill
                sizes={`(min-width: ${layout.twoColumnGridBreakpointPixels}px) 290px, 100vw`}
                style={{objectFit: 'cover'}}
            />
            <VideoHoverPreview videoId={video.id}/>
            <PlayOverlay/>
        </Box>
    );
}

function VideoCard({video, rowIndex}: { video: VideoItem; rowIndex: number }) {
    return (
        <Reveal as="li" pairIndex={rowIndex}>
            <Box
                component="a"
                href={getVideoWatchUrl(video.id)}
                {...EXTERNAL_LINK_ATTRIBUTES}
                sx={{
                    display: 'block',
                    color: 'inherit',
                    textDecoration: 'none',
                    [`&:hover .${VIDEO_TITLE_CLASS_NAME}`]: {color: colors.accent},
                    [`&:hover .${VIDEO_THUMBNAIL_CLASS_NAME} img`]: {transform: 'scale(1.04)'},
                    [`&:hover .${VIDEO_PLAY_OVERLAY_CLASS_NAME}`]: {opacity: 1},
                    [`&:hover [${PREVIEW_PLAYING_DATA_ATTRIBUTE}="true"] ~ .${VIDEO_PLAY_OVERLAY_CLASS_NAME}`]: {opacity: 0},
                    '&:focus-visible': {outline: `2px solid ${colors.accent}`, outlineOffset: 4, borderRadius: 2},
                }}
            >
                <VideoThumbnail video={video}/>
                <Typography component="h3" className={VIDEO_TITLE_CLASS_NAME} sx={{
                    color: colors.textPrimary,
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    lineHeight: 1.4,
                    mt: 1,
                    transition: 'color 0.2s ease',
                }}>
                    {video.title}
                </Typography>
                <Typography component="time" dateTime={video.publishedOn} sx={{...metadataTextStyle, display: 'block', mt: 0.25}}>
                    {formatPublishedDate(video.publishedOn)}
                </Typography>
            </Box>
        </Reveal>
    );
}

export function VideosSection() {
    return (
        <Section section={SECTIONS.videos}>
            <Box component="ul" sx={{
                listStyle: 'none',
                m: 0,
                p: 0,
                display: 'grid',
                gridTemplateColumns: {xs: '1fr', sm: `repeat(${VIDEOS_PER_ROW}, 1fr)`},
                gap: {xs: 2.5, sm: 2},
                ...dimSiblingsOnHover,
            }}>
                {videos.map((video, videoIndex) => (
                    <VideoCard key={video.id} video={video} rowIndex={Math.floor(videoIndex / VIDEOS_PER_ROW)}/>
                ))}
            </Box>
            <Reveal>
                <Typography variant="body2" sx={{mt: 2}}>
                    <ExternalLink href={YOUTUBE_CHANNEL_URL}>More on my YouTube channel →</ExternalLink>
                </Typography>
            </Reveal>
        </Section>
    );
}
