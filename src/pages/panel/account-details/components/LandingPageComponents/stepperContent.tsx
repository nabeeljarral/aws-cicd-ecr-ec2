import {BankAccountStatusEnum} from '@/utils/enums/accountDetails.enums';
import {DateFormatter} from '@/utils/functions/global';
import {
    Box,
    Button,
    ClickAwayListener,
    Grid,
    Popover,
    Step,
    StepButton,
    StepContent,
    Stepper,
    Typography,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import React from 'react';

interface CompletionState {
    [key: number]: boolean;
}
interface Props {
    handleTooltipClose: () => void;
    popupData: any;
    handleClick: (e: any) => void;
    openPopover: boolean;
    anchorEl: HTMLElement | null;
    handleClosePopover: () => void;
    handleStep: (step: number) => void | any;
    activeStep: number;
    completed: CompletionState;
    getStatusValue: (statusId: number | string) => void | any;
}
const StepperContent = (props: Props) => {
    const {
        handleTooltipClose,
        popupData,
        handleClick,
        openPopover,
        anchorEl,
        handleClosePopover,
        handleStep,
        activeStep,
        completed,
        getStatusValue,
    } = props;
    return (
        <>
            <Grid item>
                <ClickAwayListener onClickAway={handleTooltipClose}>
                    <div>
                        <Button onClick={handleClick}>
                            <InfoIcon /> Status History
                        </Button>
                        <Popover
                            open={openPopover}
                            anchorEl={anchorEl}
                            onClose={handleClosePopover}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            PaperProps={{
                                sx: {
                                    borderRadius: '8px',
                                    // maxWidth: 370,
                                    width: 350,
                                    border: '1px solid grey',
                                    transition: 'none',
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    width: 350,
                                    p: 2,
                                    overflow: 'auto',
                                    maxHeight: '400px',
                                    minHeight: '370px',
                                }}
                            >
                                {popupData?.statusHistory?.length > 0 ? (
                                    <Stepper
                                        nonLinear
                                        activeStep={activeStep}
                                        orientation="vertical"
                                        sx={{pb: 1}}
                                    >
                                        {popupData?.statusHistory?.map((label: any, index: any) => (
                                            <Step key={index} completed={completed[index]}>
                                                <StepButton
                                                    color="inherit"
                                                    onClick={handleStep(index)}
                                                >
                                                    {label?.updatedBy?.username || 'Account Change'}
                                                </StepButton>
                                                <StepContent>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: 1,
                                                        }}
                                                    >
                                                        {label?.updatedStatus ==
                                                        BankAccountStatusEnum.freeze ? (
                                                            <Grid container xs={12}>
                                                                <Typography
                                                                    component="span"
                                                                    sx={{
                                                                        fontWeight: 600,
                                                                    }}
                                                                >
                                                                    Freeze Amount:{' '}
                                                                </Typography>
                                                                <Typography>
                                                                    {label?.freezeAmount}
                                                                </Typography>
                                                            </Grid>
                                                        ) : null}
                                                        {popupData?.statusHistory?.length ? (
                                                            <Grid container xs={12}>
                                                                <Typography
                                                                    component="span"
                                                                    sx={{
                                                                        fontWeight: 600,
                                                                    }}
                                                                >
                                                                    Reason:{' '}
                                                                </Typography>
                                                                <Typography>
                                                                    {label?.remark}
                                                                </Typography>
                                                            </Grid>
                                                        ) : null}
                                                        {popupData?.statusHistory?.length ? (
                                                            <Grid container xs={12}>
                                                                <Typography
                                                                    component="span"
                                                                    sx={{
                                                                        fontWeight: 600,
                                                                    }}
                                                                >
                                                                    Time:{' '}
                                                                </Typography>
                                                                <Typography>
                                                                    {DateFormatter(
                                                                        label?.date ?? undefined,
                                                                    )}
                                                                </Typography>
                                                            </Grid>
                                                        ) : null}
                                                        {popupData?.statusHistory?.length ? (
                                                            <Grid
                                                                container
                                                                xs={12}
                                                                sx={{
                                                                    mt: 1,
                                                                }}
                                                            >
                                                                <Typography component="span">
                                                                    <span
                                                                        style={{
                                                                            fontWeight: 600,
                                                                            color: '#000',
                                                                            borderRadius: '12px',
                                                                            background: (() => {
                                                                                const prevStatus =
                                                                                    Number(
                                                                                        label?.prevStatus,
                                                                                    );
                                                                                switch (
                                                                                    prevStatus
                                                                                ) {
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
                                                                            padding:
                                                                                '10px 16px 10px 16px',
                                                                            boxShadow:
                                                                                'inset rgb(0 0 0 / 26%) 0px 0px 6px 0px',
                                                                        }}
                                                                    >
                                                                        {' '}
                                                                        {getStatusValue(
                                                                            label?.prevStatus,
                                                                        )}
                                                                    </span>
                                                                </Typography>
                                                                <span
                                                                    style={{
                                                                        fontWeight: 'bold',
                                                                    }}
                                                                >
                                                                    {'->'}
                                                                </span>
                                                                <Typography component="span">
                                                                    <span
                                                                        style={{
                                                                            fontWeight: 600,
                                                                            color: '#000',
                                                                            borderRadius: '12px',
                                                                            background: (() => {
                                                                                const updatedStatus =
                                                                                    Number(
                                                                                        label?.updatedStatus,
                                                                                    );
                                                                                switch (
                                                                                    updatedStatus
                                                                                ) {
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
                                                                            padding:
                                                                                '10px 16px 10px 16px',
                                                                            boxShadow:
                                                                                'inset rgb(0 0 0 / 26%) 0px 0px 6px 0px',
                                                                        }}
                                                                    >
                                                                        {' '}
                                                                        {getStatusValue(
                                                                            label.updatedStatus,
                                                                        )}
                                                                    </span>
                                                                </Typography>
                                                            </Grid>
                                                        ) : null}
                                                    </Box>
                                                </StepContent>
                                            </Step>
                                        ))}
                                    </Stepper>
                                ) : (
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                textAlign: 'center',
                                                color: '#757575',
                                                p: 2,
                                                fontSize: '20px',
                                            }}
                                        >
                                            Sorry no status history available...
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Popover>
                    </div>
                </ClickAwayListener>
            </Grid>
        </>
    );
};

export default StepperContent;
