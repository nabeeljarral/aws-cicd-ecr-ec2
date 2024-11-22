import {Button} from '@mui/material';
import {Lock} from '@mui/icons-material';
import * as React from 'react';

export const ActionButtonsByFunction = (props: {editAction: () => void}) => {
    return (
        <>
            <Button color="warning" variant="outlined" size="small"
                    sx={{textTransform: 'capitalize'}}
                    startIcon={<Lock />}
                    onClick={() => props.editAction()}>
                Block
            </Button>
        </>
    );
};