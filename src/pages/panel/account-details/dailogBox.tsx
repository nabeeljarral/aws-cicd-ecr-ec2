import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog, {DialogProps} from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {Box, Grid} from '@mui/material';
import {useRouter} from 'next/router';
import {User} from '@/utils/interfaces/accountDetails.interface';
import {BankAccountStatusEnum} from '@/utils/enums/accountDetails.enums';
import {
    bankAccountStatusOptions,
    bankAccountStatusOptionsFilter,
    bankAccountStatusOptionsForProcessing,
    bankStatusOptionsExceptRTL,
    bankStatusOptionsHLO,
} from '@/components/filter/options';
import {EDIT_ACCOUNTS_DETAILS_ROUTE} from '@/utils/endpoints/routes';
import {IOptionItem} from '@/components/filter/main/filterSelect';
import {Link} from '@mui/material';
import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import HeaderContent from './components/DialogBoxContent/headerContent';
import StatusChangeModal from './components/DialogBoxContent/statusChangeModal';
import StatusActionContent from './components/DialogBoxContent/statusActionContent';
import KeyValueContent from './components/DialogBoxContent/keyValueContent';
import {IDailogBoxProps, QrItem} from '@/utils/interfaces/accountDetails.interface';

interface BankAmountRange {
    _id: string;
    name: string;
    from: number;
    to: number;
    __v: number;
}
const styleforStatus = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'max-content',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    borderRadius: '15px',
};

const DialogBoxMain = (props: IDailogBoxProps) => {
    const {
        popupData,
        open,
        formData,
        activeStep,
        anchorEl,
        completed,
        handleStep,
        handleClosePopover,
        openPopover,
        openStatus,
        handleInputChange,
        handleClick,
        setOpen,
        handleSelectChange,
        handleClose,
        validation,
        setRemarksAndAmount,
        handleDailogClose,
        OpenKeyValueViewDailog,
        handleTooltipClose,
        closingBalanceData,
        dailogAnchorEl,
        vendorsLoading,
        handleConfirm,
        handleDailogClick,
        handleViewDialogClose,
        openViewDialog,
    } = props;
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const [qrsList, setQrsList] = useState<QrItem[] | undefined>(popupData?.qrsList);
    const [bankAmountRange, setBankAmountRange] = useState<BankAmountRange | undefined>(
        popupData?.bankAmountRange,
    );

    const router = useRouter();
    const [scroll, setScroll] = useState<DialogProps['scroll']>('paper');
    useEffect(() => {
        if (popupData?.qrsList) {
            setQrsList(popupData.qrsList);
        }
        if (popupData?.bankAmountRange) {
            setBankAmountRange(popupData.bankAmountRange);
        }
    }, [popupData]);

    const EditAccount = (popupData: string) => {
        router.push(EDIT_ACCOUNTS_DETAILS_ROUTE(popupData));
    };

    const descriptionElementRef = React.useRef<HTMLElement>(null);
    React.useEffect(() => {
        if (open) {
            const {current: descriptionElement} = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    const getOptions = () => {
        let options = [];

        if (popupData.status === BankAccountStatusEnum.processing) {
            options = bankAccountStatusOptionsForProcessing;
        } else if (roles?.includes(RoleEnum.StatusHoldLiveOthers)) {
            options = bankStatusOptionsHLO;
        } else if (roles?.includes(RoleEnum.StatusExceptReadyToLive)) {
            options = bankStatusOptionsExceptRTL;
        } else {
            options = bankAccountStatusOptions;
        }

        if (!roles?.includes(RoleEnum.Admin)) {
            options = options.filter(
                (option) => option?.id !== BankAccountStatusEnum.permanentStop,
            );
        }

        return options;
    };

    const statusOptions = getOptions();
    const getStatusValue = (statusId: number | string) => {
        const statusOption = bankAccountStatusOptionsFilter.find((option) => option.id == statusId);
        return statusOption && statusOption.value;
    };
    const getAccountName = (statusId: any, options?: IOptionItem[]) => {
        const modalData = options?.find((option) => option.id === statusId);
        return modalData ? modalData.value : '';
    };
    const getRelatedToName = (names: User[]) => {
        return names?.map((name) => name?.username).join(', ');
    };

    const hasActiveDetails = popupData?.keyValueList?.some((item: any) => !item.isDeleted);
    return (
        <React.Fragment>
            <Dialog
                open={open}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                PaperProps={{
                    sx: {
                        maxWidth: {
                            xs: 'none',
                            sm: 'none',
                            md: 'none',
                            lg: 'none',
                            xl: '70%',
                        },
                    },
                }}
            >
                <HeaderContent
                    setOpen={setOpen}
                    popupData={popupData}
                    getStatusValue={getStatusValue}
                />
                <DialogContent
                    dividers={scroll === 'paper'}
                    sx={{maxWidth: 'none', p: '25px 0px 0px 0px'}}
                >
                    <Grid
                        container
                        spacing={2}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                        }}
                    >
                        <KeyValueContent
                            getAccountName={getAccountName}
                            popupData={popupData}
                            getRelatedToName={getRelatedToName}
                            closingBalanceData={closingBalanceData}
                            handleDailogClose={handleDailogClose}
                            handleDailogClick={handleDailogClick}
                            dailogAnchorEl={dailogAnchorEl}
                            openViewDialog={openViewDialog}
                            handleClose={handleClose}
                            handleViewDialogClose={handleViewDialogClose}
                        />
                        <StatusActionContent
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
                            formData={formData}
                            vendorsLoading={vendorsLoading}
                            handleSelectChange={handleSelectChange}
                            statusOptions={statusOptions}
                            handleConfirm={handleConfirm}
                            bankAmountRange={bankAmountRange}
                            qrsList={qrsList}
                            setQrsList={setQrsList}
                            hasActiveDetails={hasActiveDetails}
                            OpenKeyValueViewDailog={OpenKeyValueViewDailog}
                        />
                    </Grid>
                    <StatusChangeModal
                        setRemarksAndAmount={setRemarksAndAmount}
                        formData={formData}
                        validation={validation}
                        handleInputChange={handleInputChange}
                        openStatus={openStatus}
                        styleforStatus={styleforStatus}
                        handleClose={handleClose}
                    />
                </DialogContent>
                <DialogActions>
                    {(roles?.includes(RoleEnum.BankAccountUpdate) ||
                        roles?.includes(RoleEnum.BankAccountCustomUpdate)) && (
                        <Grid item spacing={2}>
                            <Box>
                                <Button
                                    variant="contained"
                                    sx={{
                                        px: 5,
                                        textTransform: 'capitalize',
                                    }}
                                    color="primary"
                                    onClick={() => {
                                        EditAccount(popupData?._id);
                                    }}
                                >
                                    Edit Account
                                </Button>
                            </Box>
                        </Grid>
                    )}
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};
export default DialogBoxMain;
