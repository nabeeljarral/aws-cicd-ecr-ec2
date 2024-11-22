/*----TODO RENDER THIS PAGE ON SERVER SIDE----*/
import {useSelector} from 'react-redux';
import {useEffect} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import {EditCreateBankAccount} from '@/components/bank-account/editCreateBankAccount';

const EditBankAccountPage = () => {
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();
    const {id} = router.query;
    useEffect(() => {
        if (!roles?.includes(RoleEnum.BankAccounts)) router.push(LOGIN_ROUTE);
    }, [roles]);
    return <DashboardLayout>
        {
            !!id && <EditCreateBankAccount id={id?.toString()} />
        }
    </DashboardLayout>;
};

export default EditBankAccountPage;