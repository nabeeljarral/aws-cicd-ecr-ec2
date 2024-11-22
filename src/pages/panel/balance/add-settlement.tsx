import {useSelector} from 'react-redux';
import React, {useEffect} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import {AddSettlement} from '@/components/balance/addSettlement';

const AddSettlementPage = () => {
    const router = useRouter();
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;

    useEffect(() => {
        if (!roles?.includes(RoleEnum.AddSettlement)) router.push(LOGIN_ROUTE);
    }, [roles]);
    return <DashboardLayout>
        <AddSettlement />
    </DashboardLayout>;
};

export default AddSettlementPage;