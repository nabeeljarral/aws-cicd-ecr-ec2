import {BankAccountStatusEnum} from '@/utils/enums/accountDetails.enums';
import {
    Box,
    Button,
    ClickAwayListener,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Typography,
} from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    handleDailogClose: () => void;
    handleDailogClick: (e: any) => void;
    dailogAnchorEl: boolean;
    popupData: any;
}
const BeneficiaryContent = (props: Props) => {
    const {handleDailogClose, handleDailogClick, dailogAnchorEl, popupData} = props;
    return (
        <>
            <Grid container sx={{m: 1.2, mt: 0}} xs={5}>
                <ClickAwayListener onClickAway={handleDailogClose}>
                    <div
                        style={{
                            border: '2px solid #322653',
                            padding: '8px',
                            borderRadius: '12px',
                            boxShadow: 'inset rgb(5 0 75 / 26%) 0px 0px 9px 0px',
                        }}
                    >
                        <Button onClick={handleDailogClick}>Beneficiary Added</Button>

                        <Dialog
                            open={dailogAnchorEl}
                            onClose={handleDailogClose}
                            aria-describedby="alert-dialog-slide-description"
                        >
                            <DialogTitle
                                sx={{
                                    padding: '12px 24px 0px 24px',
                                    position: 'relative',
                                }}
                            >
                                {'Beneficiary Added'}
                                <IconButton
                                    aria-label="close"
                                    onClick={handleDailogClose}
                                    sx={{
                                        position: 'absolute',
                                        right: 8,
                                        top: 8,
                                        color: (theme) => theme.palette.grey[500],
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </DialogTitle>
                            <DialogContent>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        gap: '10px',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {popupData.beneficiaryAccounts.length ? (
                                        popupData.beneficiaryAccounts.map((n: any, index: any) => (
                                            <Grid item key={index} xs={12}>
                                                <Box
                                                    sx={{
                                                        padding: '15px',
                                                        border: '1px solid #959595',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        width: '100%',
                                                        height: '100%',
                                                        gap: '5px',
                                                        background: (() => {
                                                            switch (n?.status) {
                                                                case BankAccountStatusEnum.readyToLive:
                                                                    return '#fff';
                                                                case BankAccountStatusEnum.freeze:
                                                                    return '#ff9886';
                                                                case BankAccountStatusEnum.stop:
                                                                    return '#ffb5a8';
                                                                case BankAccountStatusEnum.hold:
                                                                    return '#ffffaa7d';
                                                                case BankAccountStatusEnum.live:
                                                                    return '#d3ffc5d9';
                                                                default:
                                                                    return '#fff';
                                                            }
                                                        })(),
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            mt: 0.5,
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            A/c Name:
                                                        </span>{' '}
                                                        {n?.name}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            mt: 0.5,
                                                            pl: 1,
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            A/c No:
                                                        </span>{' '}
                                                        {n?.number}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))
                                    ) : (
                                        <Box
                                            sx={{
                                                flexBasis: '100%',
                                                textAlign: 'center',
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: '#757575',
                                                    p: 2,
                                                    fontSize: '30px',
                                                }}
                                            >
                                                Sorry, there are no Beneficiary Details{' '}
                                                <SentimentVeryDissatisfiedIcon
                                                    sx={{
                                                        fontSize: '30px',
                                                        mt: -0.5,
                                                    }}
                                                />
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </DialogContent>
                        </Dialog>
                    </div>
                </ClickAwayListener>
            </Grid>
        </>
    );
};

export default BeneficiaryContent;
