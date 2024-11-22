import {useSelector} from 'react-redux';
import {useEffect} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import EditCreateAccountDetails from './editCreateAccountDetails';

const CreateBankAccountPage = () => {
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();

    useEffect(() => {
        if (!roles?.includes(RoleEnum.AccountDetails)) router.push(LOGIN_ROUTE);
    }, [roles]);
    return <DashboardLayout>
        <EditCreateAccountDetails />
    </DashboardLayout>;
};

export default CreateBankAccountPage;