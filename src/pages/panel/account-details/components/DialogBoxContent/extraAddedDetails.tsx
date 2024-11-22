import {Box, Dialog, DialogTitle, Grid, Typography} from '@mui/material';
import {IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';

interface Props {
    openViewDialog: boolean;
    popupData: any;
    handleClose: () => void;
    handleViewDialogClose: () => void;
}
const ExtraAddedDetails = (props: Props) => {
    const {openViewDialog, popupData, handleClose, handleViewDialogClose} = props;
    return (
        <>
            <Dialog open={openViewDialog} onClose={handleClose}>
                <Box sx={{padding: 2, minWidth: '545px'}}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <DialogTitle sx={{p: '2px 0px'}}>Extra Added Details</DialogTitle>
                        <IconButton aria-label="close" onClick={handleViewDialogClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{padding: 2}}>
                        <Grid container spacing={2} sx={{textAlign: 'center'}}>
                            <Grid
                                container
                                item
                                xs={12}
                                alignItems="center"
                                sx={{
                                    borderBottom: '1px dashed black',
                                    paddingBottom: '5px',
                                }}
                            >
                                <Grid item xs={6}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: 600,
                                            textAlign: 'left',
                                            color: '#9e00af',
                                        }}
                                    >
                                        Key
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: 400,
                                            color: '#0a6f12',
                                            textAlign: 'left',
                                        }}
                                    >
                                        Value
                                    </Typography>
                                </Grid>
                            </Grid>
                            {popupData.keyValueList
                                ?.filter((n: any) => n.isDeleted !== true)
                                .map((item: any, index: any) => (
                                    <Grid container item xs={12} key={index} alignItems="center">
                                        <Grid item xs={6}>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: 600,
                                                    textAlign: 'left',
                                                    textDecoration: `${
                                                        item.isDeleted &&
                                                        '3px #ff4747 line-through '
                                                    }`,
                                                }}
                                            >
                                                {item.key}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: 400,
                                                    textAlign: 'left',
                                                    textDecoration: `${
                                                        item.isDeleted &&
                                                        '3px #ff4747 line-through '
                                                    }`,
                                                }}
                                            >
                                                {item.value}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                ))}
                        </Grid>
                    </Box>
                </Box>
            </Dialog>
        </>
    );
};

export default ExtraAddedDetails;
