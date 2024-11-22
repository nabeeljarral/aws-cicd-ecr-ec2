import React, {useState, MouseEvent, ReactNode} from 'react';
import {Button, Popover, Typography, Box} from '@mui/material';

type PopconfirmProps = {
    onConfirm?: () => void;
    onCancel?: () => void;
    children: ReactNode;
    label:string;
    disabled?:boolean
};

const Popconfirm: React.FC<PopconfirmProps> = ({onConfirm, onCancel, children,label,disabled}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        handleClose();
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        handleClose();
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <Button
                size="medium"
                onClick={handleClick}
                sx={{minWidth: '40px', padding: '1px 0px'}}
                disabled={disabled}
            >
                {children}
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                sx={{mt:-1}}
            >
                <Box p={2}>
                    <Typography variant="body1">{label}</Typography>
                    <Box mt={1} display="flex" justifyContent="flex-end">
                        <Button onClick={handleCancel} style={{marginRight: 8}}>
                            No
                        </Button>
                        <Button onClick={handleConfirm} color="secondary" variant="contained">
                            Yes
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </div>
    );
};

export default Popconfirm;
