import {useSelector} from 'react-redux';
import React, {useEffect, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE, USER_CREATE_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {Button, FormControlLabel, Grid, Switch} from '@mui/material';
import UsersTable from '@/components/tables/usersTable';
import {IUser} from '@/utils/interfaces/user.interface';
import {getUsers} from '@/utils/services/user';

const UsersPage = () => {
    const [loading, setLoading] = useState(false);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();
    const [showActiveCompany, setShowActiveCompany] = useState(true);
    const [showTestCompany, setShowTestCompany] = useState(false);
    const [showCompanies, setShowCompanies] = useState(true);
    const [users, setUsers] = useState<IUser[]>([]);

    const hideSettingDetails = !roles?.length ? true : !!roles?.includes(RoleEnum.HideSettingDetails);

    const fetchUsers = async (): Promise<IUser[] | undefined> => {
        setLoading(true);
        const res = await getUsers();
        setLoading(false);
        return res;
    };

    useEffect(() => {
        if (!roles?.includes(RoleEnum.Admin)) router.push(LOGIN_ROUTE);
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
                                checked={showCompanies}
                                onChange={() => setShowCompanies(!showCompanies)}
                            />}
                            sx={{ml: 1}}
                            label={showCompanies ? 'Companies' : 'Users'}
                        />
                        <FormControlLabel
                            control={<Switch
                                checked={showActiveCompany}
                                onChange={() => setShowActiveCompany(!showActiveCompany)}
                            />}
                            sx={{ml: 1}}
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
                            onClick={() => router.push(USER_CREATE_ROUTE)}>
                        Create new Company
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
                            } />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    </DashboardLayout>;
};

export default UsersPage;