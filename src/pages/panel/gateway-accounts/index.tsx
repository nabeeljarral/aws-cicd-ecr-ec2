import {useSelector} from 'react-redux';
import React, {useEffect, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {CREATE_GATEWAY_ACCOUNTS_ROUTE, LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {Button, CircularProgress, Grid} from '@mui/material';
import {IGatewayAccount} from '@/utils/interfaces/gatewayAccount.interface';
import {getGatewayAccounts} from '@/utils/services/gatewayAccount';
import GatewayAccountsTable from '@/components/tables/GatewayAccountsTable';
import MainFilter from '@/components/filter/mainFilter';

const GatewayAccountsPage = () => {
    const [loading, setLoading] = useState(false);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();
    const [gatewayAccounts, setGatewayAccounts] = useState<IGatewayAccount[]>([]);
    const [filter, setFilter] = useState<Partial<IGatewayAccount>>({});

    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [limit, setLimit] = useState<number>(100);

    const fetchGatewayAccounts = async (f?: Partial<IGatewayAccount>) => {
        setLoading(true);
        const res = await getGatewayAccounts({filter: f ?? filter, page: page, limit: limit});
        setLoading(false);
        return res;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            setLoading(true);

            const form = new FormData(event.currentTarget);
            const data = {};
            form.forEach((value, key) => {
                // @ts-ignore
                if (value) data[key] = value;
            });
            const res = await fetchGatewayAccounts(data);
            if (res?.transactions) {
                setPage(res.pages);
                setTotal(res.total);
                setGatewayAccounts(res.transactions);
            }

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!roles?.includes(RoleEnum.GatewayAccounts)) router.push(LOGIN_ROUTE);
        else fetchGatewayAccounts().then(res => {
            if (res?.transactions) {
                setPage(res.pages);
                setTotal(res.total);
                setGatewayAccounts(res.transactions);
            }
        });
    }, [roles, setPage, setLimit]);

    return <DashboardLayout>
        <Box sx={{flexGrow: 1}}>
            <Container maxWidth="lg" sx={{mt: 4}}>
                <Box sx={{mt: 2, mb: 2, display: 'flex', justifyContent: 'space-between'}}>
                    <Button color="primary" variant="contained"
                            sx={{textTransform: 'capitalize'}}
                            onClick={() => router.push(CREATE_GATEWAY_ACCOUNTS_ROUTE)}>
                        Create New Gateway Accounts
                    </Button>
                </Box>
                <MainFilter
                    filter={filter}
                    loading={false}
                    onSubmit={handleSubmit}
                    selectedFilters={[]} />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {loading && <CircularProgress size={50} />}
                        {!loading &&
                            <GatewayAccountsTable
                                setPage={setPage}
                                page={page}
                                total={total}
                                loading={loading}
                                limit={limit}
                                setLimit={setLimit}
                                rows={gatewayAccounts} />
                        }
                    </Grid>
                </Grid>
            </Container>
        </Box>
    </DashboardLayout>;
};

export default GatewayAccountsPage;