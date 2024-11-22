import Container from '@mui/material/Container';
import {Box, Button, CircularProgress, Grid, TextField} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {theme} from '@/utils/theme';
import Typography from '@mui/material/Typography';
import awesomeAlert from '@/utils/functions/alert';
import {useRouter} from 'next/router';
import {GATEWAY_ACCOUNTS_ROUTE} from '@/utils/endpoints/routes';
import {IGatewayAccount} from '@/utils/interfaces/gatewayAccount.interface';
import {
    createGatewayAccount,
    getGatewayAccount,
    updateGatewayAccount,
} from '@/utils/services/gatewayAccount';
import {BalanceAccountTypesEnum} from '@/utils/enums/balances.enum';
import FilterSelect from '@/components/filter/main/filterSelect';
import {BankTypesEnum} from '@/utils/enums/bankTypes.enum';
import {gatewayTypesOptions} from '@/components/filter/options';

const initialFormData: Partial<IGatewayAccount> = {};

type Props = {
    id?: string;
};

export const EditCreateGatewayAccount = (props: Props) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<IGatewayAccount>>(initialFormData);
    const router = useRouter();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const submitUpdateCreateGatewayAccount = async (payload: Partial<IGatewayAccount>) => {
        setLoading(true);
        const res = props.id
            ? await updateGatewayAccount(props.id ?? ':id', payload)
            : await createGatewayAccount(payload);
        setLoading(false);
        // @ts-ignore
        if (!res?.message) {
            awesomeAlert({msg: `Successfully ${props.id ? 'Updated' : 'Created'}`});
            await router.push(GATEWAY_ACCOUNTS_ROUTE);
        }
        return res;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await submitUpdateCreateGatewayAccount(formData);
    };

    const handleSelectChange = (name: string, value: any) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (!!props.id) {
            setLoading(true);
            getGatewayAccount(props.id).then((res) => {
                if (res) setFormData(res);
                setLoading(false);
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
                                    ? `Edit Gateway Account Id ${props.id}`
                                    : `Create New GatewayAccount`}
                            </Typography>

                            <form onSubmit={handleSubmit}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    id="name"
                                    name="name"
                                    label="Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                                <Box sx={{mt: 1}}>
                                    <FilterSelect
                                        marginType="normal"
                                        title="Type"
                                        margin={'unset'}
                                        hideAllOption
                                        width="100%"
                                        defaultValue={formData.type}
                                        handleChange={(newValue: BankTypesEnum) =>
                                            handleSelectChange('type', newValue)
                                        }
                                        options={gatewayTypesOptions}
                                        name="type"
                                    />
                                </Box>
                                {formData.type !== BalanceAccountTypesEnum.xettle &&
                                    formData.type !== BalanceAccountTypesEnum.starpaisa && (
                                        <TextField
                                            size="small"
                                            fullWidth
                                            margin="normal"
                                            id="merchant_id"
                                            name="merchant_id"
                                            required={
                                                formData.type === BalanceAccountTypesEnum.OFCPAY
                                            }
                                            label={
                                                formData.type === BalanceAccountTypesEnum.recopays
                                                    ? 'Merchant Code'
                                                    : formData.type ===
                                                      BalanceAccountTypesEnum.OFCPAY
                                                    ? 'Merchant Code (AID)'
                                                    : formData.type ===
                                                      BalanceAccountTypesEnum.theUnionPay
                                                    ? 'Account Id'
                                                    : formData.type ===
                                                      BalanceAccountTypesEnum.heksaPay
                                                    ? 'Auth ID'
                                                    : formData.type ===
                                                      BalanceAccountTypesEnum.letspe
                                                    ? 'Username'
                                                    : 'Merchant Id'
                                            }
                                            value={formData.merchant_id}
                                            onChange={handleInputChange}
                                        />
                                    )}

                                {(formData.type === BalanceAccountTypesEnum.payWing ||
                                    formData.type === BalanceAccountTypesEnum.recopays ||
                                    formData.type === BalanceAccountTypesEnum.heksaPay ||
                                    formData.type === BalanceAccountTypesEnum.letspe ||
                                    formData.type === BalanceAccountTypesEnum.payTMe ||
                                    formData.type === BalanceAccountTypesEnum.firstPe ||
                                    formData.type === BalanceAccountTypesEnum.xettle ||
                                    formData.type === BalanceAccountTypesEnum.starpaisa ||
                                    formData.type === BalanceAccountTypesEnum.OFCPAY ||
                                    formData.type === BalanceAccountTypesEnum.theUnionPay) && (
                                    <TextField
                                        size="small"
                                        fullWidth
                                        margin="normal"
                                        id="payout_key"
                                        name="payout_key"
                                        required={formData.type === BalanceAccountTypesEnum.OFCPAY}
                                        label={
                                            formData.type === BalanceAccountTypesEnum.recopays
                                                ? 'Token'
                                                : formData.type === BalanceAccountTypesEnum.xettle
                                                ? 'Client Id'
                                                : formData.type ===
                                                  BalanceAccountTypesEnum.starpaisa
                                                ? 'Username'
                                                : formData.type === BalanceAccountTypesEnum.OFCPAY
                                                ? 'AKEY'
                                                : formData.type ===
                                                  BalanceAccountTypesEnum.theUnionPay
                                                ? 'Secret Token'
                                                : formData.type === BalanceAccountTypesEnum.heksaPay
                                                ? 'Auth Key'
                                                : formData.type === BalanceAccountTypesEnum.letspe
                                                ? 'Password'
                                                : 'Api Key'
                                        }
                                        value={formData.payout_key}
                                        onChange={handleInputChange}
                                    />
                                )}
                                {(formData.type === BalanceAccountTypesEnum.pay365 ||
                                    formData.type === BalanceAccountTypesEnum.pay365New ||
                                    formData.type === BalanceAccountTypesEnum.xettle ||
                                    formData.type === BalanceAccountTypesEnum.starpaisa) && (
                                    <TextField
                                        size="small"
                                        fullWidth
                                        margin="normal"
                                        id="secret_key"
                                        name="secret_key"
                                        label={
                                            formData.type === BalanceAccountTypesEnum.xettle
                                                ? 'Client Secret'
                                                : formData.type ===
                                                  BalanceAccountTypesEnum.starpaisa
                                                ? 'Password'
                                                : 'Secret Key'
                                        }
                                        value={formData.secret_key}
                                        onChange={handleInputChange}
                                    />
                                )}
                                {(formData.type === BalanceAccountTypesEnum.pay365 ||
                                    formData.type === BalanceAccountTypesEnum.pay365New ||
                                    formData.type === BalanceAccountTypesEnum.tappay) && (
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
                                {formData.type === BalanceAccountTypesEnum.pay365 ||
                                    (formData.type === BalanceAccountTypesEnum.pay365New && (
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
                                    ))}
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
                                        {props.id ? 'Update' : 'Create'}
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
