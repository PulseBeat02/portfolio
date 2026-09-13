"use client";

import {createTheme} from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: 'var(--font-inter), system-ui, sans-serif',
        body1: {color: '#888999'},
        body2: {color: '#888999'},
        h1: {color: '#ffffff'},
        h2: {color: '#ffffff'},
        h3: {color: '#ffffff'},
        h4: {color: '#ffffff'},
        h5: {color: '#ffffff'},
        h6: {color: '#ffffff'},
    },
    palette: {
        mode: 'dark'
    },
});

export default theme;
