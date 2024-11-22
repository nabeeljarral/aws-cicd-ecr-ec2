import {useSelector} from 'react-redux';
import React, {FormEvent, useEffect, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {CircularProgress, Grid} from '@mui/material';
import MainFilter from '@/components/filter/mainFilter';
import {FilterEnums} from '@/utils/enums/filter';
import {ICallbackLog} from '@/utils/interfaces/logger.interface';
import {getCallbackLogs} from '@/utils/services/logger';
import CallbackLogsTable from '@/components/tables/CallbackLogsTable';

const CallbackLogsPage = () => {
    const [logs, setLog] = useState<ICallbackLog[]>([]);
    const [loading, setLoading] = useState(false);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(50);

    const fetchLogs = async (filter?: Partial<ICallbackLog>): Promise<ICallbackLog[] | undefined> => {
        setLoading(true);
        const res = await getCallbackLogs({
            filter: filter || {},
            page: page + 1,
            limit,
        });
        if (res) {
            setTotal(res?.total);
            setLog(res?.transactions);
        }
        setLoading(false);
        return res?.transactions;
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        const {} = data as Partial<ICallbackLog>;
        const res = await fetchLogs(data);
        if (res) setLog(res);
        setLoading(false);
    };

    useEffect(() => {
        if (roles && !loading) fetchLogs().then(r => r);
    }, [page, limit, roles]);

    useEffect(() => {
        if (!roles?.includes(RoleEnum.Admin)) router.push(LOGIN_ROUTE);
    }, [roles]);

    return <DashboardLayout>
        <Box sx={{flexGrow: 1}}>
            <Container maxWidth="lg" sx={{mt: 4}}>
                <MainFilter
                    filter={{}}
                    loading={loading}
                    onSubmit={handleSubmit}
                    selectedFilters={[
                        FilterEnums.transactionId,
                    ]} />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {loading && <CircularProgress size={40} />}
                        {!loading && <CallbackLogsTable
                            loading={loading}
                            setPage={(page) => setPage(page)}
                            setLimit={(limit) => setLimit(limit)}
                            limit={limit}
                            page={page}
                            total={total}
                            rows={logs}
                        />}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    </DashboardLayout>;
};

export default CallbackLogsPage;