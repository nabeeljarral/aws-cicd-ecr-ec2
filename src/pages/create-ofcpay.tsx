import * as React from 'react';
import {FormEvent, useEffect, useState} from 'react';
import FilterSelect from '@/components/filter/main/filterSelect';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import FilterInput from '@/components/filter/main/filterInput';
import Typography from '@mui/material/Typography';
import {useRouter} from 'next/router';
import {createOFCTransaction} from '@/utils/services/transactions';
import {HOME_ROUTE, SHOW_TRANSACTION_ROUTE} from '@/utils/endpoints/routes';
import {ICreateTransactionDto} from '@/utils/dto/transactions.dto';
export default function Test() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: ICreateTransactionDto = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });

        setLoading(true);
        const res = await createOFCTransaction(data)
            .then((res) => res)
            .catch((err) => err);
        if (res?._id) router.push(SHOW_TRANSACTION_ROUTE(res._id));
        else setLoading(false);
        return res;
    };
    
    //This Page will expire on 10th
    useEffect(() => {
        const nowDate = new Date(Date.now());
        if (nowDate > new Date('10 aug 2024')) {
            router.push(HOME_ROUTE);
        }
    }, []);
    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                my: 4,
                pl: 1,
                pr: 3,
                py: 2,
                pb: 4,
                width: '500px',
                mx: 'auto',
                background: 'white',
                borderRadius: '12px',
                boxShadow:
                    '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
            }}
        >
            <Box>
                <Typography variant="h5" sx={{ml: 2, mb: 2, mt: 2}}>
                    Transaction Form
                </Typography>
                <FilterInput required={true} width="100%" title="Amount" name="amount" />
                <FilterInput required={true} width="100%" title="OFC orderId" name="order_id" />

                <LoadingButton
                    sx={{px: 8, m: 1, width: '100%'}}
                    loading={loading}
                    className="rounded-2xl"
                    type="submit"
                    variant="contained"
                >
                    Submit
                </LoadingButton>
            </Box>
        </Box>
    );
}
