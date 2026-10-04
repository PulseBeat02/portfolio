import {Box} from "@mui/material";
import React from "react";
import {dimSiblingsOnHover} from "@/components/ui/styles";

export function Timeline({ordered = true, children}: { ordered?: boolean; children: React.ReactNode }) {
    return (
        <Box component={ordered ? 'ol' : 'ul'} sx={{listStyle: 'none', m: 0, p: 0, ...dimSiblingsOnHover}}>
            {children}
        </Box>
    );
}
