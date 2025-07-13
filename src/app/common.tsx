import {Grid, Typography, Avatar, Link} from '@mui/material';
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
        <Grid container direction="row" alignItems="center" spacing={2} sx={{
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

export const CustomLink = ({href, children, isExternal = true, variant = 'default'}: CustomLinkProps) => {
    const styles = {
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
    };

    return (
        <Link
            href={href}
            sx={{
                ...styles[variant],
                '&:hover': {color: '#39FF14'}
            }}
            {...(isExternal ? {target: "_blank", rel: "noopener noreferrer"} : {})}
        >
            {children}
        </Link>
    );
};