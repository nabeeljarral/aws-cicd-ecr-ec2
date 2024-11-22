import {BankAccountStatusEnum} from '@/utils/enums/accountDetails.enums';
import {Box, Button, Grid, Modal, TextField, Typography} from '@mui/material';
import {IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';

interface Props {
    setRemarksAndAmount: () => void;
    formData: any;
    validation: boolean;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement> | any) => void;
    openStatus: boolean;
    styleforStatus: any;
    handleClose: () => void;
}
const StatusChangeModal = (props: Props) => {
    const {
        setRemarksAndAmount,
        formData,
        validation,
        handleInputChange,
        openStatus,
        styleforStatus,
        handleClose,
    } = props;
    return (
        <>
            <Modal
                keepMounted
                open={openStatus}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <>
                    <Box sx={styleforStatus}>
                        <IconButton
                            aria-label="close"
                            onClick={() => {
                                handleClose();
                            }}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Box>
                            <Typography>
                                <Typography component="span" sx={{fontWeight: 500}}>
                                    Please add the reason for status change in remarks.
                                </Typography>
                            </Typography>
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    type="text"
                                    id="remark"
                                    name="remark"
                                    value={formData.remark}
                                    onChange={handleInputChange}
                                    required
                                    label="Remarks"
                                />
                            </Grid>
                            {formData.status === BankAccountStatusEnum.freeze && (
                                <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        margin="normal"
                                        type="text"
                                        id="freezeAmount"
                                        name="freezeAmount"
                                        value={formData.freezeAmount}
                                        onChange={handleInputChange}
                                        required
                                        label="Freeze Amount"
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Box sx={{mt: -2}} />
                                {validation && (
                                    <Typography sx={{color: 'red'}}>
                                        {' '}
                                        Please fill the Remarks{' '}
                                        {formData.status === BankAccountStatusEnum.freeze && (
                                            <>and Freeze Amount</>
                                        )}
                                    </Typography>
                                )}
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Box sx={{mt: -2}} />

                                <Box>
                                    <Button
                                        // type="submit"
                                        variant="contained"
                                        sx={{
                                            px: 10,
                                            textTransform: 'capitalize',
                                        }}
                                        color="primary"
                                        onClick={() => {
                                            setRemarksAndAmount();
                                        }}
                                    >
                                        Submit
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </>
            </Modal>
        </>
    );
};

export default StatusChangeModal;
