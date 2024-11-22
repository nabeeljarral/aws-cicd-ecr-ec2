import Container from '@mui/material/Container';
import {Box, Button, CircularProgress, Grid, TextField} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {theme} from '@/utils/theme';
import Typography from '@mui/material/Typography';
import {IBank, IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import {IVendor} from '@/utils/interfaces/vendor.interface';
import {getVendors} from '@/utils/services/vendors';
import {getBanks} from '@/utils/services/bank';
import {
    createBankAccountAPI,
    getBankAccount,
    updateBankAccountAPI,
} from '@/utils/services/bankAccount';
import awesomeAlert from '@/utils/functions/alert';
import {BANK_ACCOUNTS_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import {bankTypesOptions, booleanOptions} from '@/components/filter/options';
import RelatedToInput from '@/components/inputs/relatedToInput';
import FilterSelect, {IOptionItem} from '@/components/filter/main/filterSelect';
import {BankTypesEnum} from '@/utils/enums/bankTypes.enum';

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
};

type Props = {
    id?: string;
};
export const EditCreateBankAccount = (props: Props) => {
    const [vendors, setVendors] = React.useState<IBank[]>([]);
    const [banks, setBanks] = React.useState<IVendor[]>([]);
    const [vendorsLoading, setVendorsLoading] = React.useState(false);
    const [banksLoading, setBanksLoading] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    // const [value, setValue] = React.useState<File | undefined>(undefined)
    const [formData, setFormData] = useState<IBankAccount>(initialFormData);
    const router = useRouter();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            setLoading(true);

            const form = new FormData(event.currentTarget);
            const data = {};
            form.forEach((value, key) => {
                // @ts-ignore
                if (value) data[key] = value;
            });
            const {relatedTo, createdBy} = data as IBankAccount;

            let res;
            if (props.id) {
                res = await updateBankAccountAPI(props.id, {...formData, relatedTo});
            } else {
                res = await createBankAccountAPI({...formData, relatedTo, createdBy});
            }
            // @ts-ignore
            if (!res?.message) {
                awesomeAlert({msg: `${props.id ? 'Updated' : 'Created'} Successfully`});
                router.push(BANK_ACCOUNTS_ROUTE);
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
    };
    const bankOptions: IOptionItem[] = banks.map((bank: IBank, i) => ({
        id: bank._id,
        value: bank.name,
    }));
    const vendorOptions: IOptionItem[] = vendors.map((vendor: IVendor, i) => ({
        id: vendor._id,
        value: vendor.name,
    }));

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
                });
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
        <Box
            sx={{
                mt: 8,
                pb: 3,
                flexGrow: 1,
                background: 'white',
                borderRadius: theme.shape.borderRadius + 'px',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography sx={{my: 2}} variant="h5">
                            {props.id ? `Edit Bank Account ${props.id}` : 'Create New Bank Account'}
                        </Typography>
                        {loading && <CircularProgress size={50} />}
                        {!loading && (
                            <form onSubmit={handleSubmit}>
                                <FilterSelect
                                    marginType="normal"
                                    title="Bank Type"
                                    margin={'unset'}
                                    hideAllOption
                                    width="100%"
                                    defaultValue={formData.bank_type}
                                    loading={vendorsLoading}
                                    handleChange={(newValue: BankTypesEnum) =>
                                        handleSelectChange('bank_type', newValue)
                                    }
                                    options={bankTypesOptions}
                                    name="bank_type"
                                />
                                <Box sx={{mt: 2}}></Box>
                                <FilterSelect
                                    marginType="normal"
                                    title="Bank Name"
                                    required
                                    margin={'unset'}
                                    width="100%"
                                    defaultValue={formData.bankId}
                                    loading={banksLoading}
                                    handleChange={(newValue: string) =>
                                        handleSelectChange('bankId', newValue)
                                    }
                                    options={bankOptions}
                                    name="bankId"
                                />
                                {
                                    // Not Default Type
                                    (formData.bank_type === BankTypesEnum.recopays ||
                                        formData.bank_type === BankTypesEnum.payWing ||
                                        formData.bank_type === BankTypesEnum.tappay ||
                                        formData.bank_type === BankTypesEnum.nexapayUpiCollect ||
                                        formData.bank_type === BankTypesEnum.firstPe ||
                                        formData.bank_type === BankTypesEnum.airpay ||
                                        formData.bank_type === BankTypesEnum.xettle ||
                                        formData.bank_type === BankTypesEnum.pay365 ||
                                        formData.bank_type === BankTypesEnum.pay365New ||
                                        formData.bank_type === BankTypesEnum.heksaPay ||
                                        formData.bank_type === BankTypesEnum.letspe ||
                                        formData.bank_type === BankTypesEnum.payTMe ||
                                        formData.bank_type === BankTypesEnum.starpaisa ||
                                        formData.bank_type === BankTypesEnum.finopay ||
                                        formData.bank_type === BankTypesEnum.finopayStaticQR ||
                                        formData.bank_type === BankTypesEnum.OFCPAY ||
                                        formData.bank_type === BankTypesEnum.theUnionPay) && (
                                        <TextField
                                            size="small"
                                            fullWidth
                                            required={
                                                formData.bank_type === BankTypesEnum.finopay ||
                                                formData.bank_type ===
                                                    BankTypesEnum.finopayStaticQR ||
                                                formData.bank_type === BankTypesEnum.OFCPAY ||
                                                formData.bank_type === BankTypesEnum.theUnionPay
                                            }
                                            margin="normal"
                                            type="text"
                                            id="merchant_id"
                                            name="merchant_id"
                                            value={formData.merchant_id}
                                            onChange={handleInputChange}
                                            label={
                                                formData.bank_type === BankTypesEnum.pay365
                                                    ? 'Key Id'
                                                    : formData.bank_type === BankTypesEnum.pay365New
                                                    ? 'API Key'
                                                    : formData.bank_type === BankTypesEnum.heksaPay
                                                    ? 'Auth ID'
                                                    : formData.bank_type === BankTypesEnum.letspe
                                                    ? 'Ter No'
                                                    : formData.bank_type ===
                                                      BankTypesEnum.nexapayUpiCollect
                                                    ? 'Pay Id'
                                                    : formData.bank_type === BankTypesEnum.xettle ||
                                                      formData.bank_type ===
                                                          BankTypesEnum.finopay ||
                                                      formData.bank_type ===
                                                          BankTypesEnum.finopayStaticQR
                                                    ? 'Client-Id'
                                                    : formData.bank_type === BankTypesEnum.starpaisa
                                                    ? 'Username/Email'
                                                    : formData.bank_type === BankTypesEnum.recopays
                                                    ? 'Merchant Code'
                                                    : formData.bank_type === BankTypesEnum.OFCPAY
                                                    ? 'Merchant Code (AID)'
                                                    : formData.bank_type ===
                                                      BankTypesEnum.theUnionPay
                                                    ? 'Account ID'
                                                    : 'Merchant Id'
                                            }
                                        />
                                    )
                                }
                                {(formData.bank_type === BankTypesEnum.pay365 ||
                                    formData.bank_type === BankTypesEnum.pay365New ||
                                    formData.bank_type === BankTypesEnum.heksaPay ||
                                    formData.bank_type === BankTypesEnum.letspe ||
                                    formData.bank_type === BankTypesEnum.payTMe ||
                                    formData.bank_type === BankTypesEnum.firstPe ||
                                    formData.bank_type === BankTypesEnum.nexapayUpiCollect ||
                                    formData.bank_type === BankTypesEnum.xettle ||
                                    formData.bank_type === BankTypesEnum.airpay ||
                                    formData.bank_type === BankTypesEnum.payWing ||
                                    formData.bank_type === BankTypesEnum.recopays ||
                                    formData.bank_type === BankTypesEnum.starpaisa ||
                                    formData.bank_type === BankTypesEnum.finopay ||
                                    formData.bank_type === BankTypesEnum.finopayStaticQR ||
                                    formData.bank_type === BankTypesEnum.OFCPAY ||
                                    formData.bank_type === BankTypesEnum.theUnionPay) && (
                                    <TextField
                                        size="small"
                                        fullWidth
                                        required={
                                            formData.bank_type === BankTypesEnum.finopay ||
                                            formData.bank_type === BankTypesEnum.finopayStaticQR ||
                                            formData.bank_type === BankTypesEnum.OFCPAY
                                        }
                                        margin="normal"
                                        type="text"
                                        id="payin_secret_key"
                                        name="payin_secret_key"
                                        value={formData.payin_secret_key}
                                        onChange={handleInputChange}
                                        label={
                                            formData.bank_type === BankTypesEnum.pay365
                                                ? 'Secret Key'
                                                : formData.bank_type === BankTypesEnum.recopays
                                                ? 'Token'
                                                : formData.bank_type === BankTypesEnum.pay365New
                                                ? 'API Secret'
                                                : formData.bank_type === BankTypesEnum.heksaPay
                                                ? 'Auth Key'
                                                : formData.bank_type === BankTypesEnum.letspe
                                                ? 'Public Key'
                                                : formData.bank_type ===
                                                  BankTypesEnum.nexapayUpiCollect
                                                ? 'Merchant Hosted Encryption Key'
                                                : formData.bank_type === BankTypesEnum.xettle ||
                                                  formData.bank_type === BankTypesEnum.finopay ||
                                                  formData.bank_type ===
                                                      BankTypesEnum.finopayStaticQR
                                                ? 'Client-Secret'
                                                : formData.bank_type === BankTypesEnum.starpaisa
                                                ? 'Password'
                                                : formData.bank_type === BankTypesEnum.OFCPAY
                                                ? 'AKEY'
                                                : formData.bank_type === BankTypesEnum.theUnionPay
                                                ? 'Access Token'
                                                : 'Payin Secret Key'
                                        }
                                    />
                                )}
                                {(formData.bank_type === BankTypesEnum.finopay ||
                                    formData.bank_type === BankTypesEnum.finopayStaticQR) && (
                                    <>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            margin="normal"
                                            type="text"
                                            id="aes_encryption_iv"
                                            name="aes_encryption_iv"
                                            value={formData.aes_encryption_iv}
                                            onChange={handleInputChange}
                                            label="AES Encryption IV"
                                            required={
                                                formData.bank_type === BankTypesEnum.finopay ||
                                                formData.bank_type === BankTypesEnum.finopayStaticQR
                                            }
                                        />

                                        <TextField
                                            size="small"
                                            fullWidth
                                            margin="normal"
                                            type="text"
                                            id="aes_encryption_key"
                                            name="aes_encryption_key"
                                            value={formData.aes_encryption_key}
                                            onChange={handleInputChange}
                                            label="AES Encryption Key"
                                            required={
                                                formData.bank_type === BankTypesEnum.finopay ||
                                                formData.bank_type === BankTypesEnum.finopayStaticQR
                                            }
                                        />
                                        <TextField
                                            size="small"
                                            fullWidth
                                            margin="normal"
                                            type="text"
                                            id="kyc_mobile_number"
                                            name="kyc_mobile_number"
                                            value={formData.kyc_mobile_number}
                                            onChange={handleInputChange}
                                            label="Mobile Number (Provided during the KYC process)"
                                            required={
                                                formData.bank_type === BankTypesEnum.finopay ||
                                                formData.bank_type === BankTypesEnum.finopayStaticQR
                                            }
                                        />
                                    </>
                                )}
                                {(formData.bank_type === BankTypesEnum.airpay ||
                                    formData.bank_type === BankTypesEnum.starpaisa) && (
                                    <>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            margin="normal"
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            label="Username"
                                        />

                                        <TextField
                                            size="small"
                                            fullWidth
                                            margin="normal"
                                            type="text"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            label="Password"
                                        />
                                    </>
                                )}
                                {formData.bank_type === BankTypesEnum.nexapayUpiCollect && (
                                    <TextField
                                        size="small"
                                        fullWidth
                                        margin="normal"
                                        type="text"
                                        id="request_salt_key"
                                        name="request_salt_key"
                                        value={formData.request_salt_key}
                                        onChange={handleInputChange}
                                        label="Salt Key"
                                    />
                                )}
                                {(formData.bank_type === BankTypesEnum.tappay ||
                                    formData.bank_type === BankTypesEnum.pay365) && (
                                    <>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            margin="normal"
                                            type="text"
                                            id="request_hash_key"
                                            name="request_hash_key"
                                            value={formData.request_hash_key}
                                            onChange={handleInputChange}
                                            label="Request Hash Key"
                                        />
                                        <TextField
                                            size="small"
                                            fullWidth
                                            margin="normal"
                                            type="text"
                                            id="request_salt_key"
                                            name="request_salt_key"
                                            value={formData.request_salt_key}
                                            onChange={handleInputChange}
                                            label="Request Salt Key"
                                        />

                                        <TextField
                                            size="small"
                                            fullWidth
                                            margin="normal"
                                            type="text"
                                            id="response_hash_key"
                                            name="response_hash_key"
                                            value={formData.response_hash_key}
                                            onChange={handleInputChange}
                                            label="Response Hash Key"
                                        />
                                        <TextField
                                            size="small"
                                            fullWidth
                                            margin="normal"
                                            type="text"
                                            id="response_salt_key"
                                            name="response_salt_key"
                                            value={formData.response_salt_key}
                                            onChange={handleInputChange}
                                            label="Response Salt Key"
                                        />
                                    </>
                                )}
                                {formData.bank_type === BankTypesEnum.pay365 && (
                                    <>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            margin="normal"
                                            type="text"
                                            id="aes_request_key"
                                            name="aes_request_key"
                                            value={formData.aes_request_key}
                                            onChange={handleInputChange}
                                            label={'AES Request Key'}
                                        />

                                        <TextField
                                            size="small"
                                            fullWidth
                                            margin="normal"
                                            type="text"
                                            id="aes_response_key"
                                            name="aes_response_key"
                                            value={formData.aes_response_key}
                                            onChange={handleInputChange}
                                            label={'AES Request Key'}
                                        />
                                    </>
                                )}
                                {formData.bank_type === BankTypesEnum.pay365New && (
                                    <>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            margin="normal"
                                            type="text"
                                            id="request_hash_key"
                                            name="request_hash_key"
                                            value={formData.request_hash_key}
                                            onChange={handleInputChange}
                                            label="Request API Hash"
                                        />

                                        <TextField
                                            size="small"
                                            fullWidth
                                            margin="normal"
                                            type="text"
                                            id="response_hash_key"
                                            name="response_hash_key"
                                            value={formData.response_hash_key}
                                            onChange={handleInputChange}
                                            label={'Response API Hash'}
                                        />
                                    </>
                                )}
                                <TextField
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    label={
                                        formData.bank_type === BankTypesEnum.OFCPAY
                                            ? 'Bank Account Name (Business Name)'
                                            : 'Bank Account Name'
                                    }
                                />
                                {/*{*/}
                                {/*    !formData.bank_type && <>*/}
                                <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    margin="normal"
                                    id="number"
                                    name="number"
                                    value={formData.number}
                                    onChange={handleInputChange}
                                    label="Bank Account Number"
                                    // type="number"
                                />
                                <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    margin="normal"
                                    id="upi_id"
                                    name="upi_id"
                                    value={formData.upi_id}
                                    onChange={handleInputChange}
                                    label="UPI Id"
                                />
                                {/*</>*/}
                                {/*}*/}
                                <Box sx={{mt: 2}}></Box>
                                <FilterSelect
                                    marginType="normal"
                                    title="Vendor Name"
                                    required
                                    margin={'unset'}
                                    width="100%"
                                    defaultValue={formData.vendorId}
                                    loading={vendorsLoading}
                                    handleChange={(newValue: string) =>
                                        handleSelectChange('vendorId', newValue)
                                    }
                                    options={vendorOptions}
                                    name="bankId"
                                />
                                <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    margin="normal"
                                    type="number"
                                    id="daily_limit"
                                    name="daily_limit"
                                    value={formData.daily_limit}
                                    onChange={handleInputChange}
                                    label="Daily Limit"
                                />
                                <Box sx={{mt: 2}}></Box>
                                <FilterSelect
                                    marginType="normal"
                                    title="Is Active"
                                    required
                                    margin={'unset'}
                                    width="100%"
                                    defaultValue={formData.is_active}
                                    loading={vendorsLoading}
                                    handleChange={(newValue: boolean) =>
                                        handleSelectChange('is_active', newValue)
                                    }
                                    options={booleanOptions}
                                    name="bankId"
                                />
                                <Box sx={{mt: 2}}></Box>
                                <RelatedToInput
                                    globalOption
                                    relatedToInitialValue={formData.relatedTo}
                                />
                                <TextField
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    type="text"
                                    id="qrcode_url"
                                    name="qrcode_url"
                                    value={formData.qrcode_url}
                                    onChange={handleInputChange}
                                    label="Qr-Code Url"
                                />
                                <Box>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{px: 10, mt: 2, textTransform: 'capitalize'}}
                                        color="primary"
                                    >
                                        {props.id ? 'Update' : 'Submit'}
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};
