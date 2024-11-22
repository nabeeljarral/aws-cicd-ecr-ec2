/*----TODO RENDER THIS PAGE ON SERVER SIDE----*/
import {useSelector} from 'react-redux';
import {useEffect} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {CHECKING_ROUTE, LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import Typography from '@mui/material/Typography';

const EditSettingPage = () => {
    const router = useRouter();
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const CanAccess = (role: RoleEnum | RoleEnum[]) => {
        const condition = Array.isArray(role)
            ? !role.every((item) => !roles?.includes(item))
            : !roles?.includes(role);
        if (!condition) router.push(LOGIN_ROUTE);
        else router.push(`${CHECKING_ROUTE}/${RoleEnum.RelatedTransaction}`);
    };

    useEffect(() => {
        CanAccess([RoleEnum.ManualCheck, RoleEnum.RelatedTransaction]);
    }, [roles]);

    return (
        <DashboardLayout>
            {/*<Head>*/}
            {/*    <title>Checking Page</title>*/}
            {/*</Head>*/}
            <Typography sx={{mt: 4, ml: 4}} variant="h5">
                Error 404 Page Not Found
            </Typography>
            <Typography sx={{mt: 2, ml: 4}}>
                Hint: Select Checking Type from side menu To Continue
            </Typography>
        </DashboardLayout>
    );
};

export default EditSettingPage;
