import { SxProps, Theme } from '@mui/material';

const styles: { [key: string]: SxProps<Theme> } = {
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
    },
    textField: {
        background: '#FFFFFF',
        borderRadius: '10px',
        fontSize: '13px',
    },
    button: {
        backgroundColor: '#34A853',
        color: 'white',
        fontWeight: '200',
        boxShadow: '0px 3px 4px 1px #c9c9c9',
    },
    tooltip: {
        cursor: 'pointer',
        fontSize: '13px',
        ml: 0.5,
    },
    label: {
        fontSize: '13px',
        color: '#555555',
        fontWeight: '600',
        display: 'flex',
        flexDirection: 'row',
        padding: '0px 14px',
    },
    noteBox: {
        backgroundColor: '#001F6D',
        color: 'white',
        padding: '8px 16px',
        borderRadius: 0.8,
    },
    noteText: {
        color: '#FFFFFF',
        fontSize: '13px',
    },
    finalNote: {
        fontSize: '13px',
        mt: 1,
    },
    amountContainer:{
        color: '#FFFFFF',
        fontSize: '13px',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
    },
    amountField:{
        color: '#FFFFFF',
        fontSize: '13px',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
    },
    codeField:{fontWeight: 'bold', color: '#001F6D', fontSize: '14px'}
};

export default styles;
