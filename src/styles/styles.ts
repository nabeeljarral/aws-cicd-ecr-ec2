import {SxProps, Theme} from '@mui/material';

const styles: {[key: string]: SxProps<Theme>} = {
    paperStyles: {
        padding: '8px 16px',
        marginBottom: 2,
        background: '#001F6D',
        boxShadow: '0px 4px 9px rgba(0, 0, 0, 0.4)',
    },
    amountContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    paymentProcessingContainer:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        height: '100vh',
        backgroundColor: '#F5F5F5',
        padding: 2,
        pt: 8,
        pb: 0,
    },
    spinnerContainer:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    backToWebsiteButton:{
        backgroundColor: '#001F6D',
        color: 'white',
        borderRadius: '25px',
        padding: '10px 50px',
        fontWeight: '600',
        marginTop: 4,
        width: '100%',
        fontSize: '16px',
    },
    spinnerWrapper:{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100vh',
        background: '#001F6D',
        flexDirection: 'column',
        padding: '53px 0px 45px 0px',
    }
};

export default styles;
