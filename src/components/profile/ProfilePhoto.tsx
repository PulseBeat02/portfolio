import {Box, type SxProps, type Theme} from "@mui/material";
import Image from "next/image";
import profilePhoto from "../../../public/images/profile/selfie.webp";
import {profile} from "@/data/profile";
import {accentAlpha} from "@/theme/tokens";

export const WIDE_PHOTO_SIZE_PIXELS = 260;

export function ProfilePhoto({sizingStyles}: { sizingStyles: SxProps<Theme> }) {
    return (
        <Box className="fade-in" sx={[{
            position: 'relative',
            flexShrink: 0,
            aspectRatio: '1',
            borderRadius: '50%',
            overflow: 'hidden',
            border: `2px solid ${accentAlpha(0.45)}`,
        }, ...(Array.isArray(sizingStyles) ? sizingStyles : [sizingStyles])]}>
            <Image
                src={profilePhoto}
                alt={`Photo of ${profile.name}`}
                fill
                sizes={`(min-width: 1200px) ${WIDE_PHOTO_SIZE_PIXELS}px, 300px`}
                placeholder="blur"
                style={{objectFit: 'cover', objectPosition: 'center 30%'}}
            />
        </Box>
    );
}
