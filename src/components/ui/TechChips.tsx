import {Stack, Typography} from '@mui/material';
import {accentAlpha, colors, whiteAlpha} from "@/theme/tokens";

interface TechChipsProps {
    technologies: string[];
    marginTop?: number;
}

export function TechChips({technologies, marginTop = 1}: TechChipsProps) {
    return (
        <Stack
            component="ul"
            direction="row"
            aria-label="Technologies"
            sx={{mt: marginTop, mb: 0, p: 0, listStyle: 'none', flexWrap: 'wrap', gap: 0.5}}
        >
            {technologies.map((technology) => (
                <Typography
                    key={technology}
                    component="li"
                    variant="caption"
                    sx={{
                        color: colors.textSubtle,
                        fontSize: '0.65rem',
                        fontWeight: 500,
                        lineHeight: 1,
                        letterSpacing: '0.02em',
                        px: 1,
                        py: 0.5,
                        borderRadius: 999,
                        border: `1px solid ${whiteAlpha(0.12)}`,
                        bgcolor: whiteAlpha(0.03),
                        transition: 'color 0.2s ease, border-color 0.2s ease',
                        '&:hover': {color: colors.accent, borderColor: accentAlpha(0.4)},
                    }}
                >
                    {technology}
                </Typography>
            ))}
        </Stack>
    );
}
