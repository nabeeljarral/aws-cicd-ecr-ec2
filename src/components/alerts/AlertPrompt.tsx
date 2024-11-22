import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

type Props = {
    open: boolean,
    onClose: () => void,
    onAccept: () => void,
    onReject: () => void,
    title: string,
    content?: string
    okText?: string
    cancelText?: string
}

function AlertPrompt(props: Props) {
    const {open, onClose, onAccept, onReject, title, content, okText, cancelText} = props;
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{content}</DialogContent>
            <DialogActions>
                <Button sx={{textTransform: 'capitalize'}} onClick={onAccept} color="primary">
                    {okText ?? 'OK'}
                </Button>
                <Button sx={{textTransform: 'capitalize'}} onClick={onReject} color="secondary">
                    {cancelText ?? 'Cancel'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AlertPrompt;
