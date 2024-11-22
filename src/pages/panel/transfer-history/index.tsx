import {useSelector} from 'react-redux';
import React, {FormEvent, useEffect, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {Grid, Typography} from '@mui/material';
import {useRouter} from 'next/router';
import MainFilter from '@/components/filter/mainFilter';
import {FilterEnums} from '@/utils/enums/filter';
import {IBalanceHistory} from '@/utils/interfaces/balance.interface';
import {getBalanceHistoryTable} from '@/utils/services/balance';
import {BalanceTypeEnum} from '@/utils/enums/chargeBack-internalTransfer';
import TransferHistoryTable from '@/components/tables/transferHistoryTable';
import ChargeBackTable from '@/components/tables/internalTransfer';

const TransferHistoryPage = (props: any) => {
    const {chargeBack, internalTransfer} = props;
    console.log(chargeBack);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const userId = useSelector((state: RootState) => state.auth.user)?._id;
    const router = useRouter();
    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [limit, setLimit] = useState<number>(50);
    const [balanceHistory, setBalanceHistory] = useState<IBalanceHistory[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTransferHistory = async (f?: Partial<IBalanceHistory>) => {
        setLoading(true);
        let filter = f ?? {relatedTo: userId};
        if (roles?.includes(RoleEnum.UserControl) && f === undefined) {
            delete filter?.relatedTo;
        }
        // @ts-ignore
        filter = {...filter, type: {$in: [BalanceTypeEnum.InternalTransfer, BalanceTypeEnum.ChargeBack]}};

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
        await fetchTransferHistory(data);
    };

    useEffect(() => {
        if (userId && !loading) {
            fetchTransferHistory().then((r) => r);
        }
    }, [page, limit, userId]);
    useEffect(() => {
        if (!roles?.includes(RoleEnum.BalanceHistory)) router.push(LOGIN_ROUTE);
    }, [roles]);
    return (
        <DashboardLayout>
            <Box sx={{flexGrow: 1}}>
                <Typography sx={{mb: 3, fontWeight: '500', fontSize: '24px', ml: 1, mt: 3}}>
                   Transfer History
                </Typography>
                <Container maxWidth="lg" sx={{mt: 4}}>
                    <MainFilter
                        loading={loading}
                        onSubmit={handleSubmit}
                        filter={{}}
                        selectedFilters={[
                            FilterEnums.transfer_from,
                            FilterEnums.transfer_to,
                            FilterEnums.date_range,
                            FilterEnums.transfer_type,
                            FilterEnums.user_type,
                        ]}
                    />

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            {chargeBack && (
                                <ChargeBackTable
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
                            )}
                            {internalTransfer && (
                                <ChargeBackTable
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
                            )}
                            {!chargeBack && !internalTransfer && (
                                <TransferHistoryTable
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
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </DashboardLayout>
    );
};

export default TransferHistoryPage;
