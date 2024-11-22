import {useSelector} from 'react-redux';
import React, {useEffect} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import {EditCreateBalance} from '@/components/balance/editCreateBalance';

const EditUserPage = () => {
    const router = useRouter();
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const {id} = router.query;

    useEffect(() => {
        if (!roles?.includes(RoleEnum.Admin)) router.push(LOGIN_ROUTE);
    }, [roles]);
    return <DashboardLayout>
        <EditCreateBalance id={id?.toString()} />
    </DashboardLayout>;
};

export default EditUserPage;