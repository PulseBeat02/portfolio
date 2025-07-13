import {createTheme} from '@mui/material/styles';
import {Inter} from 'next/font/google';

export const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
});

const theme = createTheme({
    typography: {
        fontFamily: inter.style.fontFamily,
        body1: {color: '#888999'},
        body2: {color: '#888999'},
        fontWeightBold: {color: "#ffffff"},
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