import {Box, type SxProps, type Theme} from "@mui/material";
import {Reveal} from "@/components/motion/Reveal";
import {whiteAlpha} from "@/theme/tokens";

export function SoftDivider({sx}: { sx?: SxProps<Theme> }) {
    return (
        <Reveal>
            <Box aria-hidden sx={[{
                height: '1px',
                my: 4.5,
                background: `linear-gradient(90deg, transparent, ${whiteAlpha(0.14)}, transparent)`,
            }, ...(Array.isArray(sx) ? sx : [sx])]}/>
        </Reveal>
    );
}
