/*----TODO RENDER THIS PAGE ON SERVER SIDE----*/
import {useSelector} from 'react-redux';
import React, {useEffect} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import Typography from '@mui/material/Typography';

const EditSettingPage = () => {
    const router = useRouter();
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;

    useEffect(() => {
        if (!roles?.includes(RoleEnum.Reports)) router.push(LOGIN_ROUTE);
    }, [roles]);
    return <DashboardLayout>
        {/*<Head>*/}
        {/*    <title>Report Management</title>*/}
        {/*</Head>*/}
        <Typography sx={{mt: 4, ml: 4}} variant="h5">Error 404 Page Not Found</Typography>
        <Typography sx={{mt: 2, ml: 4}}>Hint: Select Statement Type from side menu To Continue</Typography>
    </DashboardLayout>;
};

export default EditSettingPage;