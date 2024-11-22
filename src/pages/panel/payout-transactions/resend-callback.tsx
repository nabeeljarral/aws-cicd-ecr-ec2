import {useSelector} from 'react-redux';
import * as React from 'react';
import {FormEvent, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {IFilterPayoutTransaction, IFilterTransactionDto} from '@/utils/dto/transactions.dto';
import {RootState} from '@/store';
import {useRouter} from 'next/router';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import MainFilter from '@/components/filter/mainFilter';
import {FilterEnums} from '@/utils/enums/filter';
import awesomeAlert from '@/utils/functions/alert';
import {payoutTransactionResendCallback} from '@/utils/services/payoutTransactions';
import Typography from '@mui/material/Typography';

const TransactionsResendCallback = () => {
    const [filter, setFilter] = useState<IFilterPayoutTransaction>({});
    const [loading, setLoading] = useState(false);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();
    const [selectedFilter, setSelectedFilter] = useState<FilterEnums[]>([
        FilterEnums.transaction_id,
        FilterEnums.date_range,
        FilterEnums.order_id,
        FilterEnums.account_number,
        FilterEnums.amount,
        FilterEnums.payout_status,
        FilterEnums.ifsc,
    ]);
    const sendPayoutCallback = async (f?: IFilterPayoutTransaction) => {
        setLoading(true);
        const resendResponse = await payoutTransactionResendCallback({
            page: 0,
            limit: 100,
            filter: {
                ...(f || filter),
                unlimited: true,
            },
        });
        if (resendResponse !== undefined) {
            awesomeAlert({msg: 'This Transaction Sent Again'});
        }
        setLoading(false);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        setFilter(data);
        await sendPayoutCallback(data ?? {});
    };

    useEffect(() => {
        if (!roles?.includes(RoleEnum.ResendCallback)) router.push(LOGIN_ROUTE);
        if (roles?.includes(RoleEnum.UserControl)) {
            setSelectedFilter(old => [
                    ...old,
                    FilterEnums.vendor,
                    FilterEnums.has_vendor,
                ],
            );
        }
    }, [roles]);

    return <DashboardLayout>
        <Box sx={{flexGrow: 1}}>
            <Container maxWidth="lg" sx={{mt: 4}}>
                <Typography variant="h5" sx={{py: 2}}>Resend Payout Callbacks</Typography>
                <MainFilter
                    loading={loading}
                    onSubmit={handleSubmit}
                    filter={filter as IFilterTransactionDto}
                    isOpen={true}
                    selectedFilters={selectedFilter}
                />
            </Container>
        </Box>
    </DashboardLayout>;
};

export default TransactionsResendCallback;