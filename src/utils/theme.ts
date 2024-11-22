import {createTheme} from '@mui/material/styles';

const primaryMain = '#322653';
export const theme = createTheme({
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: 'Poppins, Arial, sans-serif',
      },
    palette: {
        primary: {
            light: '#8062d6',
            main: primaryMain,
            dark: '#9288f8',
            contrastText: '#fff',
        },
        secondary: {
            light: '#d68a8a',
            main: '#c2004e',
            dark: '#912626',
            contrastText: '#fff',
        },
        // secondary: {
        //     light: '#b27ad6',
        //     main: '#653e53',
        //     dark: '#b09cf8',
        //     contrastText: '#fff',
        // },
        error: {
            light: '#ff827d',
            main: '#e5003e',
            dark: '#a1193d',
            contrastText: '#fff',
        },
        success: {
            light: '#8bd08b',
            main: '#00a05e',
            dark: '#418141',
            contrastText: '#fff',
        },
        warning: {
            light: '#ffc95c',
            main: '#ff8200',
            dark: '#cc6600',
            contrastText: '#fff',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                },
                contained: {
                    boxShadow: 'none',
                },

                containedSecondary: {
                    backgroundColor: '#00bcd4',
                    '&:hover': {
                        backgroundColor: '#00838f',
                    },
                },
            },
        },

        // Add more global overrides for other components as needed
    },
});
