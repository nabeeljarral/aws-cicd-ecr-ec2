import {useSelector} from 'react-redux';
import React, {useEffect} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import {EditCreateUser} from '@/components/user/editCreateUser';

const EditUserPage = () => {
    const router = useRouter();
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const {id} = router.query;

    useEffect(() => {
        if (!roles?.includes(RoleEnum.Admin)) router.push(LOGIN_ROUTE);
    }, [roles]);
    return <DashboardLayout>
        <EditCreateUser id={id?.toString()} />
    </DashboardLayout>;
};

export default EditUserPage;