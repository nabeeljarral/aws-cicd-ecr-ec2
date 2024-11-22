import FilterSelect from '@/components/filter/main/filterSelect';
import Popconfirm from '@/components/filter/main/popConfirm';
import {BankAccountStatusEnum, BankAccountTypesEnum} from '@/utils/enums/accountDetails.enums';
import {RoleEnum} from '@/utils/enums/role';
import {Box, Button, Grid, Typography} from '@mui/material';
import React from 'react';
import StepperContent from '../LandingPageComponents/stepperContent';
import QRCodeList from '../QRCodeList';
import {RootState} from '@/store';
import {useSelector} from 'react-redux';
import {QrItem} from '@/utils/interfaces/accountDetails.interface';

interface CompletionState {
    [key: number]: boolean;
}
interface BankAmountRange {
    _id: string;
    name: string;
    from: number;
    to: number;
    __v: number;
}
interface Props {
    handleTooltipClose: () => void;
    popupData: any;
    handleClick: (e: any) => void;
    openPopover: boolean;
    anchorEl: HTMLElement | null;
    handleClosePopover: () => void;
    handleStep: (step: number) => void;
    activeStep: number;
    completed: CompletionState;
    getStatusValue: (statusId: number | string) => void;
    formData: any;
    vendorsLoading: boolean;
    handleSelectChange: (name: string, value: any) => void;
    statusOptions: any;
    handleConfirm: () => void;
    bankAmountRange: BankAmountRange | undefined;
    qrsList: QrItem[] | any;
    setQrsList: React.Dispatch<React.SetStateAction<QrItem[] | any>>;
    hasActiveDetails: boolean;
    OpenKeyValueViewDailog: () => void;
}
const StatusActionContent = (props: Props) => {
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
        formData,
        vendorsLoading,
        handleSelectChange,
        statusOptions,
        handleConfirm,
        bankAmountRange,
        qrsList,
        setQrsList,
        hasActiveDetails,
        OpenKeyValueViewDailog,
    } = props;
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;

    return (
        <>
            <Grid
                xs={3.5}
                sx={{
                    // borderRight: '2px dashed',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    justifyContent: 'center',
                    ml: 2,
                }}
            >
                <Grid
                    spacing={2}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'baseline',
                        // gap: 2.5,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,

                            borderRadius: '10px',
                            mt: 2,
                        }}
                    >
                        <Box>
                            {roles?.includes(RoleEnum.BankAccountStatusUpdate) && (
                                <Grid
                                    container
                                    xs={12}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 2,
                                    }}
                                >
                                    <FilterSelect
                                        marginType="normal"
                                        title="Status"
                                        required
                                        margin={'unset'}
                                        hideAllOption={true}
                                        defaultValue={
                                            formData.status ||
                                            popupData.status ||
                                            BankAccountStatusEnum.readyToLive
                                        }
                                        loading={vendorsLoading}
                                        handleChange={(newValue: boolean) =>
                                            handleSelectChange('status', newValue)
                                        }
                                        options={statusOptions}
                                        name="status"
                                        disabled={
                                            (popupData.status ===
                                                BankAccountStatusEnum.processing &&
                                                !roles?.includes(RoleEnum.Admin)) ||
                                            popupData.status === BankAccountStatusEnum.hold
                                        }
                                    />

                                    <Popconfirm
                                        onConfirm={handleConfirm}
                                        // onCancel={handleCancel}
                                        label="Are you sure to change the status ?"
                                        disabled={
                                            (popupData.status ===
                                                BankAccountStatusEnum.processing &&
                                                !roles?.includes(RoleEnum.Admin)) ||
                                            popupData.status === BankAccountStatusEnum.hold
                                        }
                                    >
                                        <Button
                                            variant="contained"
                                            size="medium"
                                            disabled={
                                                (popupData.status ===
                                                    BankAccountStatusEnum.processing &&
                                                    !roles?.includes(RoleEnum.Admin)) ||
                                                popupData.status === BankAccountStatusEnum.hold
                                            }
                                        >
                                            Update
                                        </Button>
                                    </Popconfirm>
                                </Grid>
                            )}
                        </Box>
                        {roles?.includes(RoleEnum.AccountPersonalDetails) && (
                            <StepperContent
                                handleTooltipClose={handleTooltipClose}
                                handleClick={handleClick}
                                openPopover={openPopover}
                                anchorEl={anchorEl}
                                handleClosePopover={handleClosePopover}
                                popupData={popupData}
                                handleStep={handleStep}
                                completed={completed}
                                getStatusValue={getStatusValue}
                                activeStep={activeStep}
                            />
                        )}
                    </Box>
                    <Box sx={{mt: 1}}>
                        {popupData.accountType == BankAccountTypesEnum.payin && (
                            <Grid
                                spacing={2}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1.5,
                                }}
                            >
                                <Typography component="span" sx={{fontWeight: 600}}>
                                    Bank Amount Range:
                                </Typography>

                                {bankAmountRange ? (
                                    <Typography>{bankAmountRange.name}</Typography>
                                ) : (
                                    <Typography color={'red'}>No range selected</Typography>
                                )}
                            </Grid>
                        )}
                    </Box>

                    {roles?.includes(RoleEnum.AccountLoginDetails) && (
                        <Box sx={{mt: 1}}>
                            {popupData.accountType == BankAccountTypesEnum.payin && (
                                <Grid
                                    spacing={2}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1.5,
                                    }}
                                >
                                    <Typography component="span" sx={{fontWeight: 600}}>
                                        Active QR Codes:
                                    </Typography>

                                    {qrsList?.length ? (
                                        <QRCodeList qrsList={qrsList} setQrsList={setQrsList} />
                                    ) : (
                                        <Typography>No QR Codes Available</Typography>
                                    )}
                                </Grid>
                            )}
                        </Box>
                    )}

                    {roles?.includes(RoleEnum.ViewAccountOtherFields) && hasActiveDetails && (
                        <Grid container sx={{mb: 2, mt: 5}} xs={12}>
                            <Button
                                onClick={OpenKeyValueViewDailog}
                                variant="outlined"
                                sx={{
                                    px: 2,
                                    // mt: 2,
                                    // ml:2,
                                    textTransform: 'capitalize',
                                }}
                                color="secondary"
                                disabled={!roles?.includes(RoleEnum.BankAccountUpdateKeyValue)}
                            >
                                View Added Details
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default StatusActionContent;
