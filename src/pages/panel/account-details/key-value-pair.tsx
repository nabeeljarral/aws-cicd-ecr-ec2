import React from 'react';
import {Grid, Typography} from '@mui/material';

const KeyValuePair = (props: any) => {
    const {label, value} = props;
    return (
        <Grid container sx={{m: 1.5, alignItems: 'center'}} xs={5}>
            <Typography component="span" sx={{fontWeight: 600}}>
                {label}:
            </Typography>
            <Typography>{value || '-'}</Typography>
        </Grid>
    );
};

export default KeyValuePair;
