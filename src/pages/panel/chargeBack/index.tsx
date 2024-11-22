import {useSelector} from 'react-redux';
import React, {FormEvent, useEffect, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {Button, Grid, Typography} from '@mui/material';
import {useRouter} from 'next/router';
import MainFilter from '@/components/filter/mainFilter';
import {FilterEnums} from '@/utils/enums/filter';
import {IBalanceHistory} from '@/utils/interfaces/balance.interface';
import {getBalanceHistoryTable, getInternalTransferTable} from '@/utils/services/balance';
import {BalanceTypeEnum} from '@/utils/enums/chargeBack-internalTransfer';
import ChargeBackTable from '@/components/tables/chargeBackTable';
import { transferReport } from '@/utils/services/transfer';
import { HttpStatusCode } from 'axios';
import { checkReportCompleted, downloadReport } from '@/utils/services/reports';
import { CloudDownload } from '@mui/icons-material';

const ChargeBackPage = (props: any) => {
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const userId = useSelector((state: RootState) => state.auth.user)?._id;
    const router = useRouter();
    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [limit, setLimit] = useState<number>(50);
    const [balanceHistory, setBalanceHistory] = useState<IBalanceHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>([]);
    const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);

    const fetchTransferHistory = async (f?: Partial<IBalanceHistory>) => {
        setLoading(true);
        let filter = f ?? {relatedTo: userId};
        if (roles?.includes(RoleEnum.UserControl) && f === undefined) {
            delete filter?.relatedTo;
        }
        // @ts-ignore
        filter = {...filter, type: {$in: [BalanceTypeEnum.ChargeBack]}};

        const res = await getInternalTransferTable({page: page + 1, limit, filter});
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
        setFormData(data)
        await fetchTransferHistory(data);
    };

    const exportReport = async () => {
        setLoading(true)
        const payload = {...formData,type:BalanceTypeEnum.ChargeBack,relatedTo:userId};
        try {
            const res = await transferReport(payload, `transfer-history`);
            if (res?.status === HttpStatusCode.Forbidden) {
                await fetchTransferHistory();
                setLoading(false);
                throw new Error(res?.message);
            }

            if (res?._id) {
                const id = setInterval(() => {
                    checkReportCompleted(res._id).then(async (res) => {
                        if (res && res.fileAttached) {
                            if (id !== null) clearInterval(id);
                            // if (!roles?.includes(RoleEnum.Admin))
                                downloadReport(res._id, `${BalanceTypeEnum.ChargeBack}`, 'batch').then(
                                    (res) => {
                                        setLoading(false);
                                    },
                                );
                        }
                    });
                }, 1000);
                setIntervalId(id);
            }
        } catch {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (intervalId !== null) clearInterval(intervalId);
        };
    }, [intervalId]);
    useEffect(() => {
        if (userId && !loading) {
            fetchTransferHistory().then((r) => r);
        }
    }, [page, limit, userId]);
    useEffect(() => {
        if (!roles?.includes(RoleEnum.ClientChargeBack)) router.push(LOGIN_ROUTE);
    }, [roles]);
    return (
        <DashboardLayout>
            <Box sx={{flexGrow: 1}}>
                <Typography sx={{mb: 3, fontWeight: '500', fontSize: '24px', ml: 1, mt: 3}}>
                  Charge Back History
                </Typography>
                <Container maxWidth="lg" sx={{mt: 4}}>
                    <MainFilter
                        loading={loading}
                        onSubmit={handleSubmit}
                        filter={{}}
                        selectedFilters={[
                            FilterEnums.date_range,
                        ]}
                    />
                    <Box sx={{pb:1, display: 'flex', justifyContent: 'flex-end'}}>
                         <Button variant='contained' endIcon={<CloudDownload />} onClick={() => exportReport()}>Export to Excel</Button>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
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
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </DashboardLayout>
    );
};

export default ChargeBackPage;
