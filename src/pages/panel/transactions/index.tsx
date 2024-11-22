import {useSelector} from 'react-redux';
import React, {FormEvent, useEffect, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {Grid} from '@mui/material';
import {ITransaction} from '@/utils/interfaces/transaction.interface';
import {transactionTable} from '@/utils/services/transactions';
import {IFilterTransactionDto} from '@/utils/dto/transactions.dto';
import {useRouter} from 'next/router';
import TransactionTable from '@/components/tables/transactionTable';
import MainFilter from '@/components/filter/mainFilter';
import {FilterEnums} from '@/utils/enums/filter';

const Index = () => {
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const userDetails = useSelector((state: RootState) => state.auth.user)
    const router = useRouter();
    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [limit, setLimit] = useState<number>(50);
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [filter, setFilter] = useState<IFilterTransactionDto>({
        show: true,
        relatedTo: userDetails?.isCompany !== false ? userDetails?._id : undefined,
    });
    const [loading, setLoading] = useState(false);

    const fetchTransactions = async (f?: IFilterTransactionDto) => {
        setLoading(true);
        let filter2 = {...(f || filter), show: true};
        if (roles?.includes(RoleEnum.UserControl))
            filter2 = {...filter2, show: true, showBankAccount: true};
        // if (roles?.includes(RoleEnum.Admin))
        //     filter2 = {...filter2, };
        const res = await transactionTable({page: page + 1, limit, filter: filter2});
        if (res) {
            setTransactions(res.transactions || []);
            setTotal(res.total);
        }
        setLoading(false);
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPage(0);
        const formData = new FormData(e.currentTarget);
        const data = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        setFilter({...data, show: true});
        await fetchTransactions(data);
    };

    useEffect(() => {
        if (userDetails?._id && !loading) fetchTransactions(filter).then(r => r);
    }, [page, limit, userDetails?._id]);

    useEffect(() => {
        if (!roles?.includes(RoleEnum.Transactions)) router.push(LOGIN_ROUTE);
        if (roles?.includes(RoleEnum.UserControl) && !loading) {
            setFilter({show: true});
            fetchTransactions({show: true}).then(r => r);
        }
    }, [roles]);
    return <DashboardLayout>
        <Box sx={{flexGrow: 1}}>
            <Container maxWidth="lg" sx={{mt: 4}}>
                <MainFilter
                    loading={loading}
                    onSubmit={handleSubmit}
                    filter={filter}
                    selectedFilters={[
                        FilterEnums.status,
                        FilterEnums.order_id,
                        FilterEnums.setting,
                        FilterEnums.transaction_id,
                        FilterEnums.amount,
                        FilterEnums.utr,
                        FilterEnums.date_range,
                        FilterEnums.external_ref,
                        ...(roles?.includes(RoleEnum.UserControl) ? [FilterEnums.bank_type] : []),

                    ]}
                />
                {/* {
                    roles?.includes(RoleEnum.PaymentPage) &&
                    <Box sx={{textAlign: 'right', mt: 2, mb: 2}}>
                        <Button color='primary' variant='contained'
                                sx={{textTransform: 'capitalize'}}
                                onClick={() => router.push(TEST_TRANSACTION_ROUTE)}>
                            Create Test Transaction
                        </Button>
                    </Box>
                } */}
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TransactionTable
                            loading={loading}
                            setPage={(page: number) => setPage(page)}
                            setLimit={(limit: number) => setLimit(limit)}
                            limit={limit}
                            page={page}
                            total={total}
                            transactions={transactions}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    </DashboardLayout>;
};

export default Index;