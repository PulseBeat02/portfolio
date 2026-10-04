import {Link} from '@mui/material';
import React from "react";
import {colors} from "@/theme/tokens";

export const EXTERNAL_LINK_ATTRIBUTES = {target: "_blank", rel: "noopener noreferrer"} as const;

export function ExternalLink({href, children}: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            {...EXTERNAL_LINK_ATTRIBUTES}
            sx={{
                fontWeight: 'bold',
                color: colors.textPrimary,
                textDecoration: 'none',
                transition: 'color 0.3s',
                '&:hover': {color: colors.accent},
            }}
        >
            {children}
        </Link>
    );
}
