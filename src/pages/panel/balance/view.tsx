import {useSelector} from 'react-redux';
import React, {useEffect, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {BALANCES_ROUTE, LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {Button, CircularProgress, Grid} from '@mui/material';
import {theme} from '@/utils/theme';
import Typography from '@mui/material/Typography';
import {PriceFormatter} from '@/utils/functions/global';
import {IBalance} from '@/utils/interfaces/balance.interface';
import {getBalances} from '@/utils/services/balance';
import {ArrowBack} from '@mui/icons-material';
import {IUser} from '@/utils/interfaces/user.interface';

const BalancesPage = () => {
    const [loading, setLoading] = useState(false);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();
    const showCompanies = true;
    const [balances, setBalances] = useState<IBalance[]>([]);


    const fetchBalances = async (): Promise<IBalance[] | undefined> => {
        setLoading(true);
        const res = await getBalances();
        setLoading(false);
        return res;
    };

    useEffect(() => {
        if (!roles?.includes(RoleEnum.BalanceControl)) router.push(LOGIN_ROUTE);
        else fetchBalances().then(res => {
            if (res) setBalances(res);
        });
    }, [roles]);

    return <DashboardLayout>
        <Box sx={{flexGrow: 1}}>
            <Container maxWidth="lg" sx={{mt: 6}}>
                <Box sx={{mt: 2, mb: 2, display: 'flex', justifyContent: 'space-between'}}>
                    <Button color="primary" variant="contained"
                            sx={{textTransform: 'capitalize'}}
                            onClick={() => router.push(BALANCES_ROUTE)}>
                        <ArrowBack sx={{mr: 1}} />
                        Back to Balance table
                    </Button>
                </Box>
                <Grid container spacing={1}>
                    {loading && <CircularProgress size={50} />}
                    {
                        !loading && balances
                            ?.filter((b: IBalance) => (b.relatedTo as IUser)?.isCompany)
                            .map(b => {
                                const user = b.relatedTo as IUser;
                                return <Grid item xs={6} md={4} key={b._id}>
                                    <Box sx={{
                                        background: 'white',
                                        p: 2,
                                        border: `1px solid ${theme.palette.primary.main}60`,
                                        borderRadius: theme.shape.borderRadius + 'px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        <b>{user?.username || 'Null'}</b>
                                        <br />
                                        {user?.email || 'Null'}
                                        <br />
                                        <Typography sx={{pt: 1}}>
                                            Balance:&ensp;
                                            <span style={{fontWeight: 'bold'}}>
                                             {b.total ? PriceFormatter(b.total) : '0'}
                                        </span>
                                        </Typography>
                                    </Box>
                                </Grid>;
                            })
                    }
                </Grid>
            </Container>
        </Box>
    </DashboardLayout>;
};

export default BalancesPage;