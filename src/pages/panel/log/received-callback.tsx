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
import {IReceivedCallbackLog} from '@/utils/interfaces/logger.interface';
import {getReceivedCallbackLogs} from '@/utils/services/logger';
// import CallbackLogsTable from '@/components/tables/CallbackLogsTable';
import ReceivedCallbackTable from "@/components/tables/ReceivedCallbackTable"
import Typography from '@mui/material/Typography';

const ReceivedCallback = () => {
    const [logs, setLog] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(50);
    const [payData, setPayData] = useState<any>('payin');

    const fetchLogs = async (filter?: Partial<IReceivedCallbackLog>): Promise<any | undefined> => {
        setLoading(true);
        const modifiedFilter = {
            ...filter,
            transactionIds: typeof filter?.transactionIds === 'string' 
                ? filter.transactionIds.split(',') 
                : filter?.transactionIds,
            externalRefIds: typeof filter?.externalRefIds === 'string' 
                ? filter.externalRefIds.split(',') 
                : filter?.externalRefIds
        };   
        const res = await getReceivedCallbackLogs({
            filter: modifiedFilter || {},
            page: page + 1,
            limit,
        });
        if (res) {
            setTotal(res?.total);
            setLog(res?.logs);
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
        const {} = data as Partial<IReceivedCallbackLog>;
        console.log(data)
        const res = await fetchLogs(data);
        // if (res) setLog(res)/;
        setLoading(false);
    };

    const handleChange = (e:any) => {
        setPayData(e)
    }
    // useEffect(() => {
    //     if (roles && !loading) fetchLogs().then(r => r);
    // }, [page, limit, roles]);

    useEffect(() => {
        if (!roles?.includes(RoleEnum.Admin)) router.push(LOGIN_ROUTE);
    }, [roles]);

    return <DashboardLayout>
        <Box sx={{flexGrow: 1}}>
            <Container maxWidth="lg" sx={{mt: 6}}>
                <Typography sx={{mb:3,fontWeight:"500",fontSize:"24px",ml:1}}>
                    Received CallBack
                </Typography>
                <MainFilter
                    filter={{}}
                    loading={loading}
                    onSubmit={handleSubmit}
                    callback = {"callback"}
                    payData={payData}
                    handleChange={handleChange}
                    selectedFilters={[
                        FilterEnums.transactionIds,FilterEnums.external_ref_id,FilterEnums.noRelatedTo,FilterEnums.payment_action,FilterEnums.balancetype,FilterEnums.gateway
                    ]} />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {loading && <CircularProgress size={40} />}
                        {!loading && <ReceivedCallbackTable
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
export default ReceivedCallback;