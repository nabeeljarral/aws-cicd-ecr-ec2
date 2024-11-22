import {useSelector} from 'react-redux';
import React, {useEffect} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import {EditCreateUser} from '@/components/user/editCreateUser';

const CreateUserPage = () => {
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();

    useEffect(() => {
        if (!roles?.includes(RoleEnum.Admin)) router.push(LOGIN_ROUTE);
    }, [roles]);
    return <DashboardLayout>
        <EditCreateUser />
    </DashboardLayout>;
};

export default CreateUserPage;