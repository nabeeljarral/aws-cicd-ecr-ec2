import {useSelector} from 'react-redux';
import React, {useEffect, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import {EditCreateSetting} from '@/components/settings/editCreateSetting';

const CreateSettingPage = () => {
    const [loading, setLoading] = useState(false);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();

    useEffect(() => {
        if (!roles?.includes(RoleEnum.Settings)) router.push(LOGIN_ROUTE);
    }, [roles]);
    return <DashboardLayout>
        {
            !loading && <EditCreateSetting />
        }
    </DashboardLayout>;
};

export default CreateSettingPage;