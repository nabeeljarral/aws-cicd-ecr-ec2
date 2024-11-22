import {useSelector} from 'react-redux';
import React, {FormEvent, useEffect, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {BALANCE_ADD_SETTLEMENT_ROUTE, LOGIN_ROUTE} from '@/utils/endpoints/routes';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {Button, Grid} from '@mui/material';
import {useRouter} from 'next/router';
import MainFilter from '@/components/filter/mainFilter';
import {FilterEnums} from '@/utils/enums/filter';
import BalanceHistoryTable from '@/components/tables/balanceHistoryTable';
import {IBalanceHistory} from '@/utils/interfaces/balance.interface';
import {getBalanceHistoryTable} from '@/utils/services/balance';
import {BalanceTypeEnum} from '@/utils/enums/balances.enum';

const BalanceHistoryPage = () => {
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const userId = useSelector((state: RootState) => state.auth.user)?._id;
    const router = useRouter();
    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [limit, setLimit] = useState<number>(50);
    const [balanceHistory, setBalanceHistory] = useState<IBalanceHistory[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchBalanceHistory = async (f?: Partial<IBalanceHistory>) => {
        setLoading(true);
        let filter = f ?? {relatedTo: userId};
        if (roles?.includes(RoleEnum.UserControl) && f === undefined) {
            delete filter?.relatedTo;
        }
        // @ts-ignore
        filter = {...filter, type: {$in: [BalanceTypeEnum.Settlement, BalanceTypeEnum.ManualPayout]}};
        const res = await getBalanceHistoryTable({page: page + 1, limit, filter});
        if (res) {
            setBalanceHistory(res.transactions || []);
            setTotal(res.total);
        }
        setLoading(false);
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPage(0);
        const formData = new FormData(e.currentTarget);
        const data: Partial<IBalanceHistory> = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        await fetchBalanceHistory(data);
    };

    useEffect(() => {
        if (userId && !loading) fetchBalanceHistory().then(r => r);
    }, [page, limit, userId]);
    useEffect(() => {
        if (!roles?.includes(RoleEnum.BalanceHistory)) router.push(LOGIN_ROUTE);
    }, [roles]);
    return <DashboardLayout>
        <Box sx={{flexGrow: 1}}>
            <Container maxWidth="lg" sx={{mt: 4}}>
                <MainFilter
                    loading={loading}
                    onSubmit={handleSubmit}
                    filter={{}}
                    selectedFilters={[
                        FilterEnums.amount,
                        FilterEnums.date_range,
                    ]}
                />
                {
                    roles?.includes(RoleEnum.AddSettlement) &&
                    <Box sx={{textAlign: 'right', mt: 2, mb: 2}}>
                        <Button color="primary" variant="contained"
                                sx={{textTransform: 'capitalize'}}
                                onClick={() => router.push(BALANCE_ADD_SETTLEMENT_ROUTE)}>
                            Add Settlement
                        </Button>
                    </Box>
                }
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <BalanceHistoryTable
                            loading={loading}
                            setPage={(page: number) => setPage(page)}
                            setLimit={(limit: number) => setLimit(limit)}
                            limit={limit}
                            page={page}
                            total={total}
                            balanceHistory={balanceHistory}
                            setBalanceHistory={(balanceHistory) => {
                                setBalanceHistory(balanceHistory);
                            }}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    </DashboardLayout>;
};

export default BalanceHistoryPage;
