import {SxProps, Theme} from '@mui/material';

const styles: {[key: string]: SxProps<Theme>} = {
    container: {
        background: '#F5F5F5',
    },
    box: {
        marginTop: 0,
        border: '1px solid #e7e7e7',
        borderRadius: '10px',
        width: '100%',
        mb: 1,
        background: '#FFFFFF',
        textAlign: 'center',
        padding: '10px',
    },
    buttonDownload: {
        backgroundColor: '#001F6D',
        color: 'white',
        fontWeight: '500',
        fontSize: '12px',
        mb: 0.5,
        boxShadow: 'none',
        width: '149px',
    },
    qrCodeContainer: {
        padding: '10px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    noteText: {
        fontSize: '13px',
        mt: 0,
        color: 'textSecondary',
    },
    noteBox: {
        backgroundColor: '#001F6D',
        color: 'white',
        padding: '8px 16px',
        borderRadius: 0.8,
    },
    textField: {
        background: '#FFFFFF',
        borderRadius: '10px',
        fontSize: '13px',
    },
    label: {
        fontSize: '13px',
        color: '#555555',
        fontWeight: '600',
        display: 'flex',
        flexDirection: 'row',
        padding: '0px 14px',
    },
    submitButton: {
        backgroundColor: '#34A853',
        color: 'white',
        fontWeight: '200',
        boxShadow: '0px 3px 4px 1px #c9c9c9',
    },
    codeText: {
        fontWeight: 'bold',
        color: '#001F6D',
        fontSize: '13px',
    },
    finalNote: {
        fontSize: '13px',
        mt: 1,
    },
    tooltip: {
        cursor: 'pointer',
        fontSize: '13px',
        ml: 0.5,
    },

    amountContainer: {
        color: '#FFFFFF',
        fontSize: '13px',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
    },
    amountField: {
        color: '#FFFFFF',
        fontSize: '12px',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
    },
};

export default styles;
