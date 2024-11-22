import Container from '@mui/material/Container';
import {Box, Button, CircularProgress, Grid} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {theme} from '@/utils/theme';
import Typography from '@mui/material/Typography';
import {IBank, IBankAccount, IQRItem} from '@/utils/interfaces/bankAccount.interface';
import {IVendor} from '@/utils/interfaces/vendor.interface';
import {getVendors} from '@/utils/services/vendors';
import {getBanks} from '@/utils/services/bank';
import {
    bankAccountUpsertKeyValues,
    createBankAccount,
    getBankAccount,
    updateBankAccount,
} from '@/utils/services/bankAccount';
import awesomeAlert from '@/utils/functions/alert';
import {ACCOUNTS_DETAILS_ROUTE, BANK_ACCOUNTS_ROUTE} from '@/utils/endpoints/routes';
import {KeyValuePairArray} from '@/utils/interfaces/bankAccount.interface';
import {RoleEnum} from '@/utils/enums/role';
import {useRouter} from 'next/router';
import {RootState} from '@/store';
import {useSelector} from 'react-redux';
import {
    BankAccountStatusEnum,
    BankAccountTypesEnum,
    ChannelsEnum,
} from '@/utils/enums/accountDetails.enums';
import {
    bankAccountStatusOptions,
    bankAccountStatusOptionsForProcessing,
    bankStatusOptionsHLO,
    bankStatusOptionsExceptRTL,
} from '@/components/filter/options';
import {getBankAccountName} from '@/utils/services/bankAccount';
import {IOptionItem} from '@/components/filter/main/filterSelect';
import {ArrowBack} from '@mui/icons-material';
import moment from 'moment';
import {IBankAmountRange} from './components/bankRangeDialog';
import MainForm from './components/Edit form/mainForm';

const initialFormData: IBankAccount = {
    bankId: '',
    vendorId: '',
    merchant_id: '',
    name: '',
    upi_id: '',
    number: 0,
    daily_limit: 0,
    is_active: true,
    qrcode_url: '',
    payin_secret_key: '',
    request_hash_key: '',
    request_salt_key: '',
    aes_request_key: '',
    response_salt_key: '',
    response_hash_key: '',
    aes_response_key: '',
    bank_type: 0,
    aes_encryption_iv: '',
    aes_encryption_key: '',
    kyc_mobile_number: '',
    accountType: BankAccountTypesEnum.payin,
    limit_percentage: '100',
};

type Props = {
    id?: string;
};

interface KeyValuePair {
    key: string;
    value: string;
}
const style = {
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

const styleForView = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
    pt: 1,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    borderRadius: '15px',
    maxHeight: '530px',
    overflow: 'auto',
};
const EditAccountDetails = (props: Props) => {
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const [vendors, setVendors] = React.useState<IBank[]>([]);
    const [banks, setBanks] = React.useState<IVendor[]>([]);
    const [vendorsLoading, setVendorsLoading] = React.useState(false);
    const [banksLoading, setBanksLoading] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [validation, setValidation] = useState(false);
    const [open, setOpen] = useState(false);
    const [bankAccountsLoading, setBankAccountsLoading] = useState(false);
    const [bankAccountData, setBankAccountData] = useState<any[]>([]);
    const [formData, setFormData] = useState<IBankAccount>(initialFormData);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openViewDialog, setOpenViewDialog] = useState<boolean>(false);
    const [keyValueList, setKeyValueList] = useState<any>(formData?.keyValueList);
    const [finalKeyValueList, setFinalKeyValueList] = useState<any>(formData?.keyValueList);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [keyValues, setKeyValues] = React.useState<KeyValuePairArray>([]);
    const [newKeyValue, setNewKeyValue] = useState<any>({
        key: '',
        value: '',
    });
    const [account, setAccount] = useState(formData.accountType);
    const [editData, setEditData] = useState<IBankAccount>();

    const [previousStatus, setPreviousStatus] = useState(formData.status);
    const router = useRouter();
    const bankOptions: IOptionItem[] = banks.map((bank: IBank, i) => ({
        id: bank._id,
        value: bank.name,
    }));
    const vendorOptions: IOptionItem[] = vendors.map((vendor: IVendor, i) => ({
        id: vendor._id,
        value: vendor.name,
    }));
    const [qrCodes, setQrCodes] = useState<IQRItem[]>([
        {name: '', url: '', isActive: false, hits: 0, updatedAt: new Date(), createdAt: new Date()},
    ]);
    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
    const [selectedRange, setSelectedRange] = useState<string | IBankAmountRange>({
        from: 0,
        to: 0,
        _id: '',
        name: '',
    }); // For storing selected range ID

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();

            const form = new FormData(event.currentTarget);
            const data: Record<string, any> = {};
            form.forEach((value, key) => {
                if (value) data[key] = value;
            });

            const {relatedTo, createdBy} = data as IBankAccount;
            const multiRelatedTo = relatedTo ? relatedTo.split(',') : ['64ad21bcda56f512537a2636'];

            const vendorName = vendorOptions.filter((n: any) => n.id === formData.vendorId)[0]
                .value;
            const bankName = bankOptions.filter((n: any) => n.id === formData.bankId)[0].value;
            delete formData.relatedTo;

            const limitPercentage = formData.limit_percentage
                ? parseFloat(formData.limit_percentage)
                : 100;
            const percentage = (limitPercentage / 100).toFixed(2);
            let res;
            if (props.id) {
                res = await updateBankAccount(props.id, {
                    ...formData,
                    is_active: formData.status === BankAccountStatusEnum.live ? true : false,
                    global:
                        (formData.accountType === BankAccountTypesEnum.payout && true) ||
                        multiRelatedTo[0] === 'global' ||
                        formData.channel === ChannelsEnum.paymentCircle ||
                        formData.channel === ChannelsEnum.zealApp,
                    userIds:
                        account == BankAccountTypesEnum.payin
                            ? formData.channel === ChannelsEnum.payz365 && multiRelatedTo
                            : undefined,
                    vendorName,
                    bankName,
                    prevChannel: editData?.channel,
                    is_live: formData.status === BankAccountStatusEnum.live ? true : false,
                    limit_percentage: percentage,
                    status:
                        editData?.status === BankAccountStatusEnum.processing
                            ? BankAccountStatusEnum.readyToLive
                            : formData.status,
                    openingBalance: {
                        balance: formData.openingBalance,
                        date: moment.tz('Asia/Kolkata').startOf('day').toDate(),
                    },
                    qrsList: qrCodes,
                    bankAmountRange: selectedRange || undefined,
                    paymentMethods: selectedPaymentMethods || undefined,
                    ifscCode: data?.ifscCode || '',
                });
            } else {
                res = await createBankAccount({
                    ...formData,
                    is_active: formData.status === BankAccountStatusEnum.live ? true : false,
                    global:
                        formData.accountType === BankAccountTypesEnum.payout
                            ? true
                            : multiRelatedTo[0] === 'global',
                    userIds: account == BankAccountTypesEnum.payin ? multiRelatedTo : undefined,
                    createdBy,
                    vendorName,
                    bankName,
                    is_live: formData.status === 3 ? true : false,
                    limit_percentage: percentage,
                });
            }
            // @ts-ignore
            if (!res?.message) {
                awesomeAlert({msg: `${props.id ? 'Updated' : 'Created'} Successfully`});
                router.push(ACCOUNTS_DETAILS_ROUTE);
            }
            setLoading(false);
            return res;
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | any) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    const handleSelectChange = (name: string, value: any) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
        setPreviousStatus(formData.status);
        if (name === 'accountType') {
            setAccount(value);
        }
        if (name === 'channel' && editData?.status === BankAccountStatusEnum.processing) {
            const isValidChannel =
                value === ChannelsEnum.paymentCircle || value === ChannelsEnum.zealApp;
            if (isValidChannel) {
                setFormData((prev) => ({
                    ...prev,
                    status: BankAccountStatusEnum.readyToLive,
                }));
            }
        }
        if (
            name === 'status' &&
            value !== BankAccountStatusEnum.live &&
            value !== BankAccountStatusEnum.processing
        ) {
            setOpen(!open);
        }
        if (name === 'status' && value === BankAccountStatusEnum.readyToLive) {
            setFormData((prev) => ({
                ...prev,
                is_active: false,
                is_live: false,
            }));
        }
    };

    const handleEdit = (data?: any) => {
        handleFormSubmit(finalKeyValueList);
    };

    const handleEditClick = (index: number) => {
        setEditIndex(index);
        const keyValueListInner = keyValueList || formData.keyValueList;
        setNewKeyValue({
            key: keyValueListInner && keyValueListInner[index]?.key,
            value: keyValueListInner && keyValueListInner[index]?.value,
        });
    };

    const handleSaveEdit = () => {
        const updatedList = (keyValueList || formData.keyValueList)?.map((item: any, i: any) =>
            i === editIndex ? {...item, ...newKeyValue} : item,
        );

        setKeyValueList(updatedList);
        setEditIndex(null);
        setFinalKeyValueList(updatedList);
    };

    const handleDelete = (index: number) => {
        const updatedList = formData?.keyValueList?.map((item: any, i: any) =>
            i === index ? {...item, isDeleted: true} : item,
        );
        setKeyValueList(updatedList);
        setFinalKeyValueList(updatedList);
    };
    const handleUndo = (index: number) => {
        const updatedList = formData?.keyValueList?.map((item: any, i: any) =>
            i === index ? {...item, isDeleted: false} : item,
        );
        setKeyValueList(updatedList);
        setFinalKeyValueList(updatedList);
    };

    const fetchBankAccount = async () => {
        try {
            if (!props.id) return;
            setLoading(true);
            const res = await getBankAccount({id: props.id});
            setEditData(res);
            if (res) {
                setFormData({
                    bankId: typeof res.bankId === 'string' ? res.bankId : res.bankId?._id || '',
                    vendorId:
                        typeof res.vendorId === 'string' ? res.vendorId : res.vendorId?._id || '',
                    name: res.name,
                    upi_id: res.upi_id,
                    number: res.number,
                    daily_limit: res.daily_limit,
                    is_active: res.is_active,
                    qrcode_url: res.qrcode_url,
                    relatedTo: res.userIds?.length > 0 ? res.userIds : ['global'],
                    beneficiaryAccounts: res?.beneficiaryAccounts ?? [],
                    bank_type: res.bank_type,
                    merchant_id: res.merchant_id,
                    payin_secret_key: res.payin_secret_key,
                    request_hash_key: res.request_hash_key,
                    request_salt_key: res.request_salt_key,
                    aes_request_key: res.aes_request_key,
                    response_salt_key: res.response_salt_key,
                    response_hash_key: res.response_hash_key,
                    aes_response_key: res.aes_response_key,
                    aes_encryption_iv: res.aes_encryption_iv,
                    aes_encryption_key: res.aes_encryption_key,
                    kyc_mobile_number: res.kyc_mobile_number,
                    channel: res.channel,
                    status: res.status,
                    loginId: res.loginId,
                    username: res.username,
                    password: res.password,
                    trxnPassword: res.trxnPassword,
                    otpAccess: res.otpAccess,
                    registeredPhoneNo: res.registeredPhoneNo,
                    accountType: res.accountType || BankAccountTypesEnum.payin,
                    accountNature: res.accountNature,
                    customerID: res.customerID,
                    securityAnswer: res.securityAnswer,
                    securityQuestion: res.securityQuestion,
                    websiteUrl: res?.websiteUrl,
                    limit_percentage: (
                        (res.limit_percentage ? parseFloat(res?.limit_percentage) : 0) * 100
                    ).toFixed(0),
                    closing_balance: res?.closing_balance,
                    keyValueList: res?.keyValueList,
                    openingBalance: res?.openingBalance?.balance,
                    qrsList: res?.qrsList,
                    bankAmountRange: res?.bankAmountRange,
                    ifscCode: res?.ifscCode,
                });

                if (res?.bankAmountRange) setSelectedRange(res.bankAmountRange);
                if (res?.paymentMethods) setSelectedPaymentMethods(res.paymentMethods);
                if (res.qrsList) setQrCodes(res.qrsList);
            }
            setLoading(false);
            return res;
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };
    const fetchVendors = async (): Promise<IVendor[] | undefined> => {
        try {
            setVendorsLoading(true);
            const res = await getVendors();
            if (res) setVendors(res);
            setVendorsLoading(false);
            return res;
        } catch (err) {
            console.log(err);
            setVendorsLoading(false);
        }
    };
    const fetchBanks = async (): Promise<IBank[] | undefined> => {
        try {
            setBanksLoading(true);
            const res = await getBanks();
            if (res) setBanks(res);
            setBanksLoading(false);
            return res;
        } catch (err) {
            console.log(err);
            setBanksLoading(false);
        }
    };
    const fetchBankAccountName = async (): Promise<IBank[] | undefined> => {
        setBankAccountsLoading(true);
        const res = await getBankAccountName();
        setBankAccountsLoading(false);
        return res;
    };

    useEffect(() => {
        fetchBankAccountName().then((res) => {
            if (res?.length) {
                const options = res?.map((a) => ({
                    ...a,
                    id: a?._id,
                    value: a?.name,
                }));
                const payoutAccounts = options?.filter(
                    (n: any) => n.accountType === BankAccountTypesEnum.payout,
                );
                setBankAccountData(payoutAccounts);
            }
        });
    }, []);

    const setRemarksAndAmount = () => {
        if (open) {
            if (
                formData.status === BankAccountStatusEnum.freeze &&
                !(formData.remark && formData.freezeAmount)
            ) {
                setValidation(true);
            } else if (!formData.remark) {
                setValidation(true);
            } else {
                setOpen(false);
                setValidation(false);
                setFormData((prev) => ({
                    ...prev,
                    is_active: false,
                    is_live: false,
                }));
            }
        } else {
            setOpen(false);
            setValidation(false);
        }
    };

    const handleClose = () => {
        setFormData((prev) => ({
            ...prev,
            remark: '',
            freezeAmount: '',
            status: previousStatus,
        }));
        setOpen(false);
    };

    const handleFormSubmit = async (data: KeyValuePair[]) => {
        setKeyValues(data);
        const id = props?.id ?? '';
        const res = await bankAccountUpsertKeyValues(id, {
            keyValueList: data,
        });
        if (!res?.message) {
            awesomeAlert({msg: 'Successfully Updated'});
            fetchBankAccount();
        }
        setOpenDialog(false);
        setOpenViewDialog(false);
        setKeyValueList(null);
    };

    const OpenKeyValueDailog = () => {
        setOpenDialog(true);
    };

    const OpenKeyValueViewDailog = () => {
        setOpenViewDialog(true);
    };

    const handleViewDialogClose = () => {
        setOpenViewDialog(false);
    };

    useEffect(() => {
        fetchVendors().then((res) => res);
        fetchBanks().then((res) => res);
    }, []);

    useEffect(() => {
        if (props.id) fetchBankAccount();
    }, [props.id]);

    const getOptions = () => {
        let options = [];

        if (editData?.status === BankAccountStatusEnum.processing) {
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

    const hasActiveDetails = formData?.keyValueList?.some((item) => !item?.isDeleted);
    const isEditAccountOtherFields = roles?.includes(RoleEnum.EditAccountOtherFields);

    return (
        <>
            <Box sx={{mt: 2, mb: 2, display: 'flex', justifyContent: 'space-between'}}>
                <Button
                    color="primary"
                    variant="contained"
                    sx={{textTransform: 'capitalize'}}
                    onClick={() => router.push(ACCOUNTS_DETAILS_ROUTE)}
                >
                    <ArrowBack sx={{mr: 1}} />
                    Back To Account Details
                </Button>
            </Box>
            <Box
                sx={{
                    mt: 5,
                    pb: 3,
                    flexGrow: 1,
                    background: 'white',
                    borderRadius: theme.shape.borderRadius + 'px',
                }}
            >
                <Container maxWidth="xl">
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography sx={{my: 2}} variant="h5">
                                {props.id
                                    ? `Edit Bank Account ${props.id}`
                                    : 'Create New Bank Account'}
                            </Typography>
                            {loading && <CircularProgress size={50} />}
                            {!loading && (
                                <form onSubmit={handleSubmit}>
                                    <MainForm
                                        vendorsLoading={vendorsLoading}
                                        handleSelectChange={handleSelectChange}
                                        // account={account}
                                        formData={formData}
                                        banksLoading={banksLoading}
                                        bankOptions={bankOptions}
                                        handleInputChange={handleInputChange}
                                        vendorOptions={vendorOptions}
                                        bankAccountData={bankAccountData}
                                        OpenKeyValueDailog={OpenKeyValueDailog}
                                        isEditAccountOtherFields={isEditAccountOtherFields}
                                        editData={editData}
                                        statusOptions={statusOptions}
                                        hasActiveDetails={hasActiveDetails}
                                        OpenKeyValueViewDailog={OpenKeyValueViewDailog}
                                        openDialog={openDialog}
                                        setOpenDialog={setOpenDialog}
                                        handleClose={handleClose}
                                        handleViewDialogClose={handleViewDialogClose}
                                        keyValueList={keyValueList}
                                        editIndex={editIndex}
                                        newKeyValue={newKeyValue}
                                        setNewKeyValue={setNewKeyValue}
                                        handleSaveEdit={handleSaveEdit}
                                        setEditIndex={setEditIndex}
                                        handleEditClick={handleEditClick}
                                        handleDelete={handleDelete}
                                        handleUndo={handleUndo}
                                        handleEdit={handleEdit}
                                        openViewDialog={openViewDialog}
                                        prop={props}
                                        account={account}
                                        qrCodes={qrCodes}
                                        setQrCodes={setQrCodes}
                                        selectedPaymentMethods={selectedPaymentMethods}
                                        setSelectedPaymentMethods={setSelectedPaymentMethods}
                                        open={open}
                                        style={style}
                                        validation={validation}
                                        setRemarksAndAmount={setRemarksAndAmount}
                                        handleFormSubmit={handleFormSubmit}
                                        selectedRange={selectedRange}
                                        setSelectedRange={setSelectedRange}
                                    />
                                </form>
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

export default EditAccountDetails;
