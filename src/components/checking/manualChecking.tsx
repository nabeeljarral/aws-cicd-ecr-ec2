import {useSelector} from 'react-redux';
import React, {FormEvent, useEffect, useState} from 'react';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {Rule} from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import MainFilter from '@/components/filter/mainFilter';
import {FilterEnums} from '@/utils/enums/filter';
import {transactionsChecking} from '@/utils/services/transactions';
import awesomeAlert from '@/utils/functions/alert';
import {IFilterTransactionDto} from '@/utils/dto/transactions.dto';

const ManualChecking = () => {
    const [loading, setLoading] = useState(false);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data: IFilterTransactionDto = {unlimited: true};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        const res = await transactionsChecking(data);
        setLoading(false);
        if (res) {
            awesomeAlert({msg: res});
        }
    };

    useEffect(() => {
        if (!roles?.includes(RoleEnum.ManualCheck)) router.push(LOGIN_ROUTE);
    }, [roles]);

    return (<Box sx={{flexGrow: 1}}>
        <Container maxWidth="lg" sx={{mt: 2}}>
            <MainFilter
                loading={loading}
                onSubmit={handleSubmit}
                filter={{}}
                isOpen={true}
                selectedFilters={[
                    FilterEnums.status,
                    FilterEnums.payout_status,
                    FilterEnums.check_by_getaway,
                    FilterEnums.payment_action,
                    FilterEnums.setting,
                    FilterEnums.transaction_id,
                    FilterEnums.amount,
                    FilterEnums.utr,
                    FilterEnums.date_range,
                    FilterEnums.external_ref,
                ]}
                submitText={<><Rule sx={{mr: 1}} /> Check Transactions</>}
                topChildren={<Typography variant="subtitle1" sx={{ml: 2}}>Filter by transaction</Typography>}
            />
        </Container>
    </Box>);

};

export default ManualChecking;