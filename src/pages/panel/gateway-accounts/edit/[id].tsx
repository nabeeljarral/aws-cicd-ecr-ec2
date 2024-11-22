import {useSelector} from 'react-redux';
import React, {useEffect} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import {EditCreateGatewayAccount} from '@/components/gateway-account/editCreateGatewayAccount';

const EditGatewayAccountsPage = () => {
    const router = useRouter();
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const {id} = router.query;

    useEffect(() => {
        if (!roles?.includes(RoleEnum.GatewayAccounts)) router.push(LOGIN_ROUTE);
    }, [roles]);
    return <DashboardLayout>
        <EditCreateGatewayAccount id={id?.toString()} />
    </DashboardLayout>;
};

export default EditGatewayAccountsPage;