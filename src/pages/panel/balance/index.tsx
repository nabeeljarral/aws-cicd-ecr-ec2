import {useSelector} from 'react-redux';
import React, {useEffect, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {EDIT_BALANCE_ROUTE, LOGIN_ROUTE, SHOW_BALANCES_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {Button, FormControlLabel, Grid, Switch} from '@mui/material';
import UsersTable from '@/components/tables/usersTable';
import {IUser} from '@/utils/interfaces/user.interface';
import {getUsers} from '@/utils/services/user';

const BalancesPage = () => {
    const [loading, setLoading] = useState(false);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();
    const showCompanies = true;
    const [showActiveCompany, setShowActiveCompany] = useState(true);
    const [showTestCompany, setShowTestCompany] = useState(false);
    const [users, setUsers] = useState<IUser[]>([]);


    const fetchUsers = async (): Promise<IUser[] | undefined> => {
        setLoading(true);
        const res = await getUsers();
        setLoading(false);
        return res;
    };

    useEffect(() => {
        if (!roles?.includes(RoleEnum.BalanceControl)) router.push(LOGIN_ROUTE);
        else fetchUsers().then(res => {
            if (res) setUsers(res);
        });
    }, [roles]);

    return <DashboardLayout>
        <Box sx={{flexGrow: 1}}>
            <Container maxWidth="lg" sx={{mt: 4}}>
                <Box sx={{mt: 2, mb: 2, display: 'flex', justifyContent: 'space-between'}}>
                    <Box>
                        <FormControlLabel
                            control={<Switch
                                checked={showActiveCompany}
                                onChange={() => setShowActiveCompany(!showActiveCompany)}
                            />}
                            label={showActiveCompany ? 'Active' : 'Inactive'}
                        />
                        <FormControlLabel
                            control={<Switch
                                checked={!showTestCompany}
                                onChange={() => setShowTestCompany(!showTestCompany)}
                            />}
                            sx={{ml: 1}}
                            label={showTestCompany ? 'Test' : 'Prod'}
                        />
                    </Box>
                    <Button color="primary" variant="contained"
                            sx={{textTransform: 'capitalize'}}
                            onClick={() => router.push(SHOW_BALANCES_ROUTE)}>
                        Show Balances
                    </Button>
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <UsersTable
                            rows={
                                users.filter(u => (
                                            showCompanies ?
                                                u.isCompany :
                                                !u.isCompany
                                        ) &&
                                        u.isActive === showActiveCompany &&
                                        u.testMode === showTestCompany,
                                )
                            }
                            editPage={(_id) => EDIT_BALANCE_ROUTE(_id)}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    </DashboardLayout>;
};

export default BalancesPage;