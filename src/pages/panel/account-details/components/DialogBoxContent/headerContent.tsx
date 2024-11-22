import {BankAccountStatusEnum} from '@/utils/enums/accountDetails.enums';
import {Box, DialogTitle, IconButton, Typography} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';

interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    popupData: any;
    getStatusValue: (statusId: number | string) => void | any;
}

const HeaderContent = (props: Props) => {
    const {setOpen, popupData, getStatusValue} = props;
    return (
        <>
            <DialogTitle id="scroll-dialog-title" sx={{pt: 2.5}}>
                <IconButton
                    aria-label="close"
                    onClick={() => {
                        setOpen(false);
                    }}
                    sx={{
                        position: 'absolute',
                        right: 3,
                        top: 0,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 500,
                            fontSize: '24px',
                        }}
                    >
                        Account Details
                    </Typography>
                    <Typography component="span">
                        <span
                            style={{
                                fontWeight: 600,
                                color: '#000',
                                borderRadius: '12px',
                                background: (() => {
                                    switch (popupData?.status) {
                                        case BankAccountStatusEnum.readyToLive:
                                            return '#fff';
                                        case BankAccountStatusEnum.freeze:
                                            return '#f9a293';
                                        case BankAccountStatusEnum.stop:
                                            return '#ffc5c5';
                                        case BankAccountStatusEnum.hold:
                                            return '#ffffaa7d';
                                        case BankAccountStatusEnum.live:
                                            return '#deffd3d9';
                                        case BankAccountStatusEnum.processing:
                                            return '#f7d8f7';
                                        case BankAccountStatusEnum.other:
                                            return '#c2deffd9';
                                        default:
                                            return '#fff';
                                    }
                                })(),
                                padding: '10px 16px 10px 16px',
                                marginRight: '24px',
                                boxShadow: 'inset rgb(0 0 0 / 26%) 0px 0px 6px 0px',
                            }}
                        >
                            {getStatusValue(popupData?.status)}
                        </span>
                    </Typography>
                </Box>
            </DialogTitle>
        </>
    );
};

export default HeaderContent;
