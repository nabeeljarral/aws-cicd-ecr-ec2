import Container from '@mui/material/Container';
import {
    Box,
    Button,
    CircularProgress,
    Grid,
} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {theme} from '@/utils/theme';
import Typography from '@mui/material/Typography';
import {IBank, IBankAccount, IQRItem} from '@/utils/interfaces/bankAccount.interface';
import {IVendor} from '@/utils/interfaces/vendor.interface';
import {getVendors} from '@/utils/services/vendors';
import {getBanks} from '@/utils/services/bank';
import {createBankAccount, getBankAccount, updateBankAccount} from '@/utils/services/bankAccount';
import awesomeAlert from '@/utils/functions/alert';
import {ACCOUNTS_DETAILS_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {getBankAccountName} from '@/utils/services/bankAccount';
import {IOptionItem} from '@/components/filter/main/filterSelect';
import {
    BankAccountStatusEnum,
    BankAccountTypesEnum,
    ChannelsEnum,
} from '@/utils/enums/accountDetails.enums';
import {KeyValuePairArray} from '@/utils/interfaces/bankAccount.interface';
import {ArrowBack} from '@mui/icons-material';
import moment from 'moment';
import {IBankAmountRange} from './components/bankRangeDialog';
import MainForm from './components/Create form/mainForm';

const initialFormData: IBankAccount = {
    bankId: '',
    vendorId: '',
    merchant_id: '',
    name: '',
    upi_id: '',
    // number: 0,
    daily_limit: 0,
    is_active: false,
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
    // otpAccess:0,
    password: '',
    username: '',
    accountType: BankAccountTypesEnum.payin,
    websiteUrl: '',
    channel: ChannelsEnum.payz365,
    relatedTo: ['64ad21bcda56f512537a2636'],
    limit_percentage: '100',
    qrsList: [], //for multiple qr codes
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
    width: '50%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    borderRadius: '15px',
};
const EditCreateAccountDetails = (props: Props) => {
    const [vendors, setVendors] = React.useState<IBank[]>([]);
    const [banks, setBanks] = React.useState<IVendor[]>([]);
    const [keyValues, setKeyValues] = React.useState<KeyValuePairArray>([]);
    const [vendorsLoading, setVendorsLoading] = React.useState(false);
    const [banksLoading, setBanksLoading] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = useState(false);
    const [account, setAccount] = useState(BankAccountTypesEnum.payin);
    const [channelData, setChannelData] = useState(ChannelsEnum.payz365);
    const [bankAccountsLoading, setBankAccountsLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [bankAccountData, setBankAccountData] = useState<any[]>([]);
    const [formData, setFormData] = useState<IBankAccount>(initialFormData);
    const [previousStatus, setPreviousStatus] = useState(formData.status);
    const router = useRouter();
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const userId = useSelector((state: RootState) => state.auth.user)?._id;
    const [selectedRange, setSelectedRange] = useState<string | IBankAmountRange>({
        from: 0,
        to: 0,
        _id: '',
        name: '',
    }); // For storing selected range ID
    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);

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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            // setLoading(true);

            const form = new FormData(event.currentTarget);
            const data: Record<string, any> = {};
            form.forEach((value, key) => {
                if (value) data[key] = value;
            });

            const {relatedTo} = data as IBankAccount;
            const multiRelatedTo = relatedTo ? relatedTo.split(',') : ['64ad21bcda56f512537a2636'];
            const vendorName = vendorOptions.filter((n: any) => n.id === formData.vendorId)[0]
                .value;
            const bankName = bankOptions.filter((n: any) => n.id === formData.bankId)[0].value;
            const limitPercentage = formData.limit_percentage
                ? parseFloat(formData.limit_percentage)
                : 100;
            const percentage = (limitPercentage / 100).toFixed(2);
            let res;
            if (props.id) {
                const updateBankAccountModel = {
                    ...formData,
                    is_active:
                        formData?.status === BankAccountStatusEnum.live &&
                        formData?.channel === ChannelsEnum.payz365
                            ? true
                            : false,
                    global:
                        formData.accountType === BankAccountTypesEnum.payout
                            ? true
                            : multiRelatedTo[0] === 'global' ||
                              formData?.channel === 2 ||
                              formData?.channel === 3,
                    userIds: account == BankAccountTypesEnum.payin ? multiRelatedTo : undefined,
                    vendorName,
                    bankName,
                    is_live:
                        formData?.status === BankAccountStatusEnum.live &&
                        formData?.channel === ChannelsEnum.payz365
                            ? true
                            : false,
                    limit_percentage: percentage,
                    qrsList: qrCodes,
                    bankAmountRange: selectedRange || undefined,
                    paymentMethods: selectedPaymentMethods || undefined,
                };
                if (formData?.ifscCode) {
                    updateBankAccountModel.ifscCode = formData?.ifscCode;
                }
                res = await updateBankAccount(props.id, updateBankAccountModel);
            } else {
                delete formData.relatedTo;
                res = await createBankAccount({
                    ...formData,
                    createdBy: userId,
                    keyValueList: keyValues,
                    is_active:
                        formData?.status === BankAccountStatusEnum.live &&
                        formData?.channel === ChannelsEnum.payz365
                            ? true
                            : false,
                    global:
                        formData.accountType === BankAccountTypesEnum.payout
                            ? true
                            : multiRelatedTo[0] === 'global' ||
                              formData?.channel === ChannelsEnum.paymentCircle ||
                              formData?.channel === ChannelsEnum.zealApp,
                    // global:formData.accountType === BankAccountTypesEnum.payout ? false : true,
                    userIds:
                        account == BankAccountTypesEnum.payin
                            ? formData.channel === ChannelsEnum.payz365 && multiRelatedTo
                            : undefined,
                    upi_id: account !== BankAccountTypesEnum.payin ? 'N/A' : formData.upi_id,
                    status: formData?.status || BankAccountStatusEnum.processing,
                    vendorName,
                    bankName,
                    is_live:
                        formData?.status === BankAccountStatusEnum.live &&
                        formData?.channel === ChannelsEnum.payz365
                            ? true
                            : false,
                    limit_percentage: percentage,
                    openingBalance: {
                        balance: formData.openingBalance,
                        date: moment.tz('Asia/Kolkata').startOf('day').toDate(),
                    },
                    qrsList: qrCodes,
                    bankAmountRange: selectedRange || undefined,
                    paymentMethods: selectedPaymentMethods || undefined,
                    ifscCode: formData?.ifscCode || '',
                });

                if (res?.bankAmountRange) setSelectedRange(res.bankAmountRange);
                if (res?.paymentMethods) setSelectedPaymentMethods(res.paymentMethods);
            }

            // @ts-ignore
            if (res && !res?.message) {
                router.push(ACCOUNTS_DETAILS_ROUTE);
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
        if (
            name === 'status' &&
            value !== BankAccountStatusEnum.live &&
            value !== BankAccountStatusEnum.processing
        ) {
            setOpen(!open);
        }
        if (name === 'accountType') {
            setAccount(value);
        }
        if (name === 'channel') {
            setChannelData(value);
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

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: checked,
        }));
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

    const handleFormSubmit = (data: KeyValuePair[]) => {
        setKeyValues(data);
        setOpenDialog(false);
    };

    const OpenKeyValueDailog = () => {
        setOpenDialog(true);
    };

    const fetchBankAccount = async () => {
        try {
            if (!props.id) return;
            setLoading(true);
            const res = await getBankAccount({id: props.id});
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
                    relatedTo: !res.global ? res.relatedTo : 'global',
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
                    otpAccess: res.otpAccess,
                    qrsList: res.qrsList,
                    bankAmountRange: res?.bankAmountRange,
                    ifscCode: res?.ifscCode,
                });

                if (res?.bankAmountRange) setSelectedRange(res.bankAmountRange);
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

    useEffect(() => {
        fetchVendors().then((res) => res);
        fetchBanks().then((res) => res);
    }, []);

    useEffect(() => {
        if (props.id) fetchBankAccount();
    }, [props.id]);

    return (
        <Box>
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
                    mt: 8,
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
                                        account={account}
                                        formData={formData}
                                        banksLoading={banksLoading}
                                        bankOptions={bankOptions}
                                        handleInputChange={handleInputChange}
                                        vendorOptions={vendorOptions}
                                        bankAccountData={bankAccountData}
                                        OpenKeyValueDailog={OpenKeyValueDailog}
                                        handleFormSubmit={handleFormSubmit}
                                        openDialog={openDialog}
                                        setOpenDialog={setOpenDialog}
                                        selectedRange={selectedRange}
                                        setSelectedRange={setSelectedRange}
                                        selectedPaymentMethods={selectedPaymentMethods}
                                        setSelectedPaymentMethods={setSelectedPaymentMethods}
                                        qrCodes={qrCodes}
                                        setQrCodes={setQrCodes}
                                        prop={props}
                                        open={open}
                                        style={style}
                                        handleClose={handleClose}
                                    />
                                </form>
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};
export default EditCreateAccountDetails;
