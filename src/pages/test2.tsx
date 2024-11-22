import * as React from 'react';
import {FormEvent, useEffect, useState} from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import FilterInput from '@/components/filter/main/filterInput';
import Typography from '@mui/material/Typography';
import {useRouter} from 'next/router';
import {HOME_ROUTE} from '@/utils/endpoints/routes';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import RelatedToInput from '@/components/inputs/relatedToInput';
import {IPayWingCreateTransaction} from '@/utils/interfaces/paywing.interface';
import awesomeAlert from '@/utils/functions/alert';
import {createPayoutTransaction} from '@/utils/services/payoutTransactions';
import FilterSelect from '@/components/filter/main/filterSelect';
import {IPayoutTransaction} from '@/utils/dto/transactions.dto';
import {OptionsFromArray} from '@/utils/functions/global';
import {PaymentMethodEnum} from '@/utils/enums/paymentMethod.enum';


export default function Index() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const paymentMethodOptions = OptionsFromArray(PaymentMethodEnum);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: IPayWingCreateTransaction | {} = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });

        setLoading(true);

        const res = await createPayoutTransaction(data as IPayoutTransaction)
            .then(res => res)
            .catch(err => err);
        if (res?._id) {
            awesomeAlert({msg: `Transaction sent successfully, ID ${res?._id}`});
        } else {
            // awesomeAlert({
            //     msg: `Transaction Failed: ${res?.msg}`,
            //     type: AlertTypeEnum.error
            // })
        }
        setLoading(false);
        return res;
    };

    useEffect(() => {
        if (!roles?.includes(RoleEnum.CreatePayoutTransactions)) router.push(HOME_ROUTE);
    }, [roles]);

    return (
        <Box sx={{
            backgroundColor: '#159895',
            py: 4,
            px: 2,
            minHeight: '100vh',
        }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    pl: 1,
                    pr: 3,
                    py: 2,
                    pb: 4,
                    width: '500px',
                    maxWidth: '100%',
                    mx: 'auto',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
                }}>
                <Box>
                    <Typography variant="h5" sx={{ml: 2, mb: 2, mt: 2}}>Payout - Transaction Form</Typography>
                    <FilterInput required={true} width="100%" title="Amount" name="amount" />
                    <FilterInput required={true} width="100%" title="Order ID" name="order_id" />

                    <FilterInput width="100%" title="Beneficiary Email" name="beneficiary_email" />
                    <FilterInput width="100%" title="Beneficiary Phone" name="beneficiary_phone" />

                    <FilterSelect width="100%" name="payment_method" title="Payment Method"
                                  hideAllOption options={paymentMethodOptions} />

                    <FilterInput required={true} width="100%" title="Account Holder Name" name="account_holder_name" />
                    <FilterInput required={true} width="100%" title="Account Number" name="account_number" />

                    <FilterInput required={true} width="100%" title="Bank Name" name="bank_name" />
                    <FilterInput width="100%" title="Bank Branch" name="bank_branch" />
                    <FilterInput width="100%" title="Bank Address" name="bank_address" />

                    <FilterInput required={true} width="100%" title="IFSC" name="ifsc" />

                    <Box sx={{ml: 1, my: 1}}>
                        <RelatedToInput hideAllOption />
                    </Box>

                    {/*<FilterInput width='100%' title='remarks' name='remarks'/>*/}

                    <LoadingButton
                        sx={{px: 8, m: 1, width: '100%'}}
                        loading={loading}
                        className="rounded-2xl"
                        type="submit"
                        variant="contained">Submit</LoadingButton>
                </Box>
            </Box>
        </Box>

    );
}
