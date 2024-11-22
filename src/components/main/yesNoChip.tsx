import * as React from 'react';
import {Chip} from '@mui/material';

interface Props {
    value: boolean;
}

export default function YesNoChip(prop: Props) {
    return (
        <Chip
            size="small"
            color={prop.value ? 'success' : 'error'}
            label={prop.value ? 'Yes' : 'No'}
            sx={{
                minWidth: '50px',
                filter: 'drop-shadow(0 0 1px white)',
            }}
            variant="filled" />
    );
}
