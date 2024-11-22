
import React from 'react';
import {Drawer, IconButton, Box, Typography, SxProps, Theme} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface CustomDrawerProps {
    open: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    sx?: SxProps<Theme>;
    title?: string; 
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({open, onClose, children, sx, title}) => {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: '100%',
                    maxWidth: 600,
                    ...sx,
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    padding: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 5,
                        alignItems: 'center',
                        borderBottom: '1px solid #d1c8c8',
                    }}
                >
                    <Typography variant="h6" gutterBottom >
                        {title}
                    </Typography>
                    <IconButton onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Box>
                {children}
            </Box>
        </Drawer>
    );
};

export default CustomDrawer;
