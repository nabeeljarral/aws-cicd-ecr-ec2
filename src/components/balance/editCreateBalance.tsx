import Container from '@mui/material/Container';
import {Box, Button, CircularProgress, Grid, TextField} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {theme} from '@/utils/theme';
import Typography from '@mui/material/Typography';
import awesomeAlert from '@/utils/functions/alert';
import {useRouter} from 'next/router';
import {BALANCES_ROUTE} from '@/utils/endpoints/routes';
import {IBalance} from '@/utils/interfaces/balance.interface';
import {getBalance, updateBalance} from '@/utils/services/balance';
import FilterSelect from '@/components/filter/main/filterSelect';
import {BankTypesEnum} from '@/utils/enums/bankTypes.enum';
import {balanceAccountTypesOptions} from '@/components/filter/options';
import {BalanceAccountTypesEnum} from '@/utils/enums/balances.enum';
import {PriceFormatter} from '@/utils/functions/global';
import moment from 'moment';

const initialFormData: Partial<IBalance> = {
    accountType: BalanceAccountTypesEnum.default,
};

type Props = {
    id?: string;
};
export const EditCreateBalance = (props: Props) => {
    const [lockOpenBalance, setLockOpenBalance] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<IBalance>>(initialFormData);
    const router = useRouter();
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    const submitUpdateBalance = async (payload: Partial<IBalance>) => {
        setLoading(true);
        const res = await updateBalance(payload);
        setLoading(false);
        // @ts-ignore
        if (!res?.message) {
            awesomeAlert({msg: 'Successfully Updated'});
            await router.push(BALANCES_ROUTE);
        }
        return res;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (lockOpenBalance) {
            delete formData.open_balance_value;
            delete formData.open_balance_date;
        }
        await submitUpdateBalance({...formData, relatedTo: props.id || ':relatedTo'});
    };

    useEffect(() => {
        if (!!props.id) {
            getBalance(props.id).then((res) => {
                if (res) {
                    setFormData(res);
                    if (!!res.open_balance_date) {
                        setLockOpenBalance(true);
                    }
                }
            });
        }
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
                    {loading && <CircularProgress size={50} />}
                    {!loading && (
                        <Grid item xs={12}>
                            <Typography sx={{my: 2}} variant="h5">
                                {formData._id
                                    ? `Edit Balance for User Id ${props.id}`
                                    : `Create New Balance for User Id ${props.id}`}
                            </Typography>

                            {formData._id && (
                                <>
                                    <Box sx={{mb: 2}}>
                                        Total: {PriceFormatter(formData.total ?? 0)}
                                    </Box>

                                    <Box sx={{display: 'flex', gap: '15px'}}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            type="number"
                                            margin="normal"
                                            id="open_balance_value"
                                            name="open_balance_value"
                                            label="Open Balance"
                                            defaultValue={formData.open_balance_value}
                                            disabled={lockOpenBalance}
                                            onChange={handleInputChange}
                                        />

                                        <TextField
                                            size="small"
                                            fullWidth
                                            type="date"
                                            margin="normal"
                                            id="open_balance_date"
                                            name="open_balance_date"
                                            label="Date"
                                            disabled={lockOpenBalance}
                                            defaultValue={moment(
                                                formData.open_balance_date ?? undefined,
                                            ).format('yyyy-MM-DD')}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                    <hr style={{margin: '10px', marginBottom: 0}} />
                                    <Box sx={{display: 'flex', gap: '15px'}}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            type="number"
                                            margin="normal"
                                            id="add_manual_payout_amount"
                                            name="add_manual_payout_amount"
                                            label="Add Manual Payout"
                                            onChange={handleInputChange}
                                        />

                                        <TextField
                                            size="small"
                                            fullWidth
                                            margin="normal"
                                            id="add_manual_payout_remarks"
                                            name="add_manual_payout_remarks"
                                            label="Remarks"
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                    <hr style={{margin: '10px', marginBottom: 0}} />
                                    <Box sx={{display: 'flex', gap: '15px'}}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            type="number"
                                            margin="normal"
                                            id="add_manual_balance_amount"
                                            name="add_manual_balance_amount"
                                            label="Add Balance"
                                            onChange={handleInputChange}
                                        />

                                        <TextField
                                            size="small"
                                            fullWidth
                                            margin="normal"
                                            id="add_manual_balance_remarks"
                                            name="add_manual_balance_remarks"
                                            label="Remarks"
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                    <Box sx={{display: 'flex', gap: '15px'}}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            type="number"
                                            margin="normal"
                                            id="deduct_manual_balance_amount"
                                            name="deduct_manual_balance_amount"
                                            label="Deduct Balance"
                                            onChange={handleInputChange}
                                        />

                                        <TextField
                                            size="small"
                                            fullWidth
                                            margin="normal"
                                            id="deduct_manual_balance_remarks"
                                            name="deduct_manual_balance_remarks"
                                            label="Remarks"
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                    <hr style={{margin: '10px', marginBottom: '30px'}} />
                                </>
                            )}
                            <form onSubmit={handleSubmit}>
                                {formData._id && (
                                    <FilterSelect
                                        marginType="normal"
                                        title="Account Type"
                                        margin={'unset'}
                                        hideAllOption
                                        width="100%"
                                        defaultValue={formData.accountType}
                                        handleChange={(newValue: BankTypesEnum) =>
                                            handleSelectChange('accountType', newValue)
                                        }
                                        options={balanceAccountTypesOptions}
                                        name="accountType"
                                    />
                                )}
                                <Box sx={{mt: 1}}></Box>
                                {(formData.accountType === BalanceAccountTypesEnum.pay365 ||
                                    formData.accountType === BalanceAccountTypesEnum.recopays ||
                                    formData.accountType === BalanceAccountTypesEnum.heksaPay ||
                                    formData.accountType === BalanceAccountTypesEnum.letspe ||
                                    formData.accountType === BalanceAccountTypesEnum.payTMe ||
                                    formData.accountType === BalanceAccountTypesEnum.tappay ||
                                    formData.accountType === BalanceAccountTypesEnum.payWing) && (
                                    <>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            margin="normal"
                                            id="merchant_id"
                                            name="merchant_id"
                                            label={
                                                formData.accountType ===
                                                BalanceAccountTypesEnum.letspe
                                                    ? 'Username'
                                                    : formData.accountType ===
                                                      BalanceAccountTypesEnum.heksaPay
                                                    ? 'Auth ID'
                                                    : formData.accountType ===
                                                      BalanceAccountTypesEnum.recopays
                                                    ? 'Merchant Code'
                                                    : 'Merchant Id'
                                            }
                                            value={formData.merchant_id}
                                            onChange={handleInputChange}
                                        />
                                        {formData.accountType !==
                                            BalanceAccountTypesEnum.tappay && (
                                            <TextField
                                                size="small"
                                                fullWidth
                                                margin="normal"
                                                id="payout_key"
                                                name="payout_key"
                                                label={
                                                    formData.accountType ===
                                                    BalanceAccountTypesEnum.letspe
                                                        ? 'Password'
                                                        : formData.accountType ===
                                                          BalanceAccountTypesEnum.pay365
                                                        ? 'Secret Key'
                                                        : formData.accountType ===
                                                          BalanceAccountTypesEnum.recopays
                                                        ? 'Token'
                                                        : formData.accountType ===
                                                          BalanceAccountTypesEnum.heksaPay
                                                        ? 'Auth Key'
                                                        : 'Payout Secret Key'
                                                }
                                                value={formData.payout_key}
                                                onChange={handleInputChange}
                                            />
                                        )}
                                    </>
                                )}
                                {(formData.accountType === BalanceAccountTypesEnum.tappay ||
                                    formData.accountType === BalanceAccountTypesEnum.pay365) && (
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

                                        {formData.accountType !==
                                            BalanceAccountTypesEnum.tappay && (
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
                                                    label="AES Request Key"
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
                                                    label="AES Response Key"
                                                />
                                            </>
                                        )}
                                    </>
                                )}
                                <input
                                    type="hidden"
                                    name="relatedTo"
                                    id="relatedTo"
                                    value={props.id}
                                />

                                <Box>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{px: 10, mt: 3, textTransform: 'capitalize'}}
                                        color="primary"
                                    >
                                        Update
                                    </Button>
                                </Box>
                            </form>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};
