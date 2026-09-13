import {Grid, Typography, Avatar, Link, Stack} from '@mui/material';
import React from "react";

const NumberAvatar = ({number}: { number: number }) => {
    return (
        <Avatar
            sx={{
                width: 32,
                height: 32,
                bgcolor: '#39FF14',
            }}
        >
            {number}
        </Avatar>
    );
};

export const SectionHeading = ({number, text}: { number: number; text: string }) => {
    return (
        <Grid container direction="row" spacing={2} sx={{
            alignItems: 'center',
            marginBottom: 3,
            borderRadius: 2,
            border: `1px solid #39FF14`,
            padding: 1.25,
            boxShadow: 1,
            width: 'fit-content'
        }}>
            <Grid>
                <NumberAvatar number={number}/>
            </Grid>
            <Grid>
                <Typography sx={{color: 'white', fontWeight: 'medium', fontSize: '1rem'}}>{text}</Typography>
            </Grid>
        </Grid>
    );
};

interface CustomLinkProps {
    href: string;
    children: React.ReactNode;
    isExternal?: boolean;
    variant?: 'default' | 'subtle';
}

const LINK_STYLES = {
    default: {
        fontWeight: 'bold',
        color: 'white',
        textDecoration: 'none',
        transition: 'color 0.3s'
    },
    subtle: {
        fontWeight: 'bold',
        color: '#cccccc',
        textDecoration: 'underline',
        transition: 'color 0.3s'
    }
} as const;

export const CustomLink = ({href, children, isExternal = true, variant = 'default'}: CustomLinkProps) => {
    return (
        <Link
            href={href}
            sx={{
                ...LINK_STYLES[variant],
                '&:hover': {color: '#39FF14'}
            }}
            {...(isExternal ? {target: "_blank", rel: "noopener noreferrer"} : {})}
        >
            {children}
        </Link>
    );
};

export const dimSiblingsOnHover = {
    '& > *:hover ~ *, & > *:has(~ *:hover)': {
        filter: 'blur(2px)',
        opacity: 0.7,
    },
} as const;

export const TechChips = ({items, mt = 1}: { items: string[]; mt?: number }) => (
    <Stack direction="row" sx={{mt, flexWrap: 'wrap', gap: 0.5}}>
        {items.map((tech) => (
            <Typography
                key={tech}
                variant="caption"
                sx={{
                    bgcolor: 'rgba(57, 255, 20, 0.1)',
                    color: '#39FF14',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    display: 'inline-block'
                }}
            >
                {tech}
            </Typography>
        ))}
    </Stack>
);
