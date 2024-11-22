import {Box, Button, Grid, IconButton, Modal, Typography} from '@mui/material';
import React from 'react';
import CreateForm from './createForm';
import OtherFormDetails from './otherForm';
import DynamicFormKeyValue from '@/components/dialogs/DynamicKeyValueDailog';
import BankAmountRanges from '../bankAmountRanges';
import PaymentMethods from '../PaymentMethods';
import {BankAccountTypesEnum} from '@/utils/enums/accountDetails.enums';
import QRCodeForm from '../QRForm';
import {IBankAccount, IQRItem} from '@/utils/interfaces/bankAccount.interface';
import {IOptionItem} from '@/components/filter/main/filterSelect';
import {IBankAmountRange} from '../bankRangeDialog';

interface KeyValuePair {
    key: string;
    value: string;
}
interface Props {
    vendorsLoading: boolean;
    handleSelectChange: (name: string, value: any) => void;
    account: BankAccountTypesEnum;
    formData: IBankAccount;
    banksLoading: boolean;
    bankOptions: IOptionItem[];
    handleInputChange: React.ChangeEvent<HTMLInputElement> | any;
    vendorOptions: IOptionItem[];
    bankAccountData: any;
    OpenKeyValueDailog: () => void;
    handleFormSubmit: (data: KeyValuePair[]) => void;
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
    selectedRange: string | IBankAmountRange;
    setSelectedRange: React.Dispatch<React.SetStateAction<string | IBankAmountRange>>;
    selectedPaymentMethods: string[];
    setSelectedPaymentMethods: React.Dispatch<React.SetStateAction<string[]>>;
    qrCodes: IQRItem[];
    setQrCodes: React.Dispatch<React.SetStateAction<IQRItem[]>>;
    prop: any;
    open: boolean;
    style: {};
    handleClose: () => void;
}
const MainForm = (props: Props) => {
    const {
        vendorsLoading,
        handleSelectChange,
        account,
        formData,
        banksLoading,
        bankOptions,
        handleInputChange,
        vendorOptions,
        bankAccountData,
        OpenKeyValueDailog,
        handleFormSubmit,
        openDialog,
        setOpenDialog,
        selectedRange,
        setSelectedRange,
        selectedPaymentMethods,
        setSelectedPaymentMethods,
        qrCodes,
        setQrCodes,
        prop,
    } = props;

    return (
        <>
            <Grid container spacing={1.5}>
                <CreateForm
                    vendorsLoading={vendorsLoading}
                    handleSelectChange={handleSelectChange}
                    account={account}
                    formData={formData}
                    banksLoading={banksLoading}
                    bankOptions={bankOptions}
                    handleInputChange={handleInputChange}
                    vendorOptions={vendorOptions}
                    bankAccountData={bankAccountData}
                    OpenKeyValueDailog={OpenKeyValueDailog}
                />

                <OtherFormDetails formData={formData} handleInputChange={handleInputChange} />

                <DynamicFormKeyValue
                    onSubmit={handleFormSubmit}
                    initialValues={[{key: '', value: ''}]}
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                />
                {account === BankAccountTypesEnum.payin && (
                    <BankAmountRanges
                        selectedRange={selectedRange}
                        setSelectedRange={setSelectedRange}
                    />
                )}
                {account === BankAccountTypesEnum.payin && (
                    <Grid item xs={12}>
                        <PaymentMethods
                            selectedPaymentMethods={selectedPaymentMethods}
                            setSelectedPaymentMethods={setSelectedPaymentMethods}
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />
                    </Grid>
                )}
                {account === BankAccountTypesEnum.payin && (
                    <Grid item xs={12}>
                        <QRCodeForm qrCodes={qrCodes} setQrCodes={setQrCodes} />
                    </Grid>
                )}

                <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{mt: -1}}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                px: 10,
                                mt: 2,
                                textTransform: 'capitalize',
                            }}
                            color="primary"
                        >
                            {prop.id ? 'Update' : 'Create'}
                        </Button>
                    </Box>
                    {/* <Modal
                                                keepMounted
                                                open={open}
                                                aria-labelledby="keep-mounted-modal-title"
                                                aria-describedby="keep-mounted-modal-description"
                                            >
                                                <>
                                                    <Box sx={style}>
                                                        <IconButton
                                                            aria-label="close"
                                                            onClick={() => {
                                                                handleClose();
                                                            }}
                                                            sx={{
                                                                position: 'absolute',
                                                                right: 8,
                                                                top: 8,
                                                                color: (theme) =>
                                                                    theme.palette.grey[500],
                                                            }}
                                                        >
                                                            <CloseIcon />
                                                        </IconButton>
                                                        <Box>
                                                            <Typography>
                                                                <Typography
                                                                    component="span"
                                                                    sx={{fontWeight: 500}}
                                                                >
                                                                    Please add the reason for status
                                                                    change in remarks.
                                                                </Typography>
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </>
                                            </Modal> */}
                </Grid>
            </Grid>
        </>
    );
};

export default MainForm;
