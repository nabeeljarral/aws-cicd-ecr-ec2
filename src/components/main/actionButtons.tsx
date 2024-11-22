import {useRouter} from 'next/router';
import {Button} from '@mui/material';
import {Edit} from '@mui/icons-material';
import * as React from 'react';

export const ActionButtons = (props: {editUrl: string}) => {
    const router = useRouter();
    return (
        <>
            <Button color="warning" variant="outlined" size="small"
                    sx={{textTransform: 'capitalize'}}
                    startIcon={<Edit />}
                    onClick={() => router.push(props.editUrl)}>
                Edit
            </Button>
        </>
    );
};