import {useSelector} from 'react-redux';
import * as React from 'react';
import {FormEvent, useEffect, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {checkWrongStatus, transactionResendCallback} from '@/utils/services/transactions';
import {IFilterTransactionDto} from '@/utils/dto/transactions.dto';
import {useRouter} from 'next/router';
import MainFilter from '@/components/filter/mainFilter';
import {FilterEnums} from '@/utils/enums/filter';
import awesomeAlert from '@/utils/functions/alert';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';

const TransactionsResendCallback = () => {
    const [filter, setFilter] = useState<IFilterTransactionDto>({});
    const [isLock2, setIsLock2] = useState(false);
    const [loading, setLoading] = useState(false);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();

    const changeOldStatus = () => {
        setIsLock2(true);
        checkWrongStatus()
            .then(res => res)
            .catch(err => {
                console.log(err);
            });
        awesomeAlert({msg: `Clicked Successfully. Please refrain from clicking on it for the next 30 minutes.`});
    };

    const sendPayinCallback = async (f?: IFilterTransactionDto) => {
        setLoading(true);
        const resendResponse = await transactionResendCallback({
            page: 1,
            limit: 100,
            filter: {
                ...(f || filter),
                show: true,
                unlimited: true,
            },
        });
        if (resendResponse !== undefined) {
            awesomeAlert({msg: 'This Transaction Sent Again'});
        }
        setLoading(false);
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        setFilter({...data, show: true});
        await sendPayinCallback(data);
    };

    useEffect(() => {
        if (!roles?.includes(RoleEnum.ResendCallback)) router.push(LOGIN_ROUTE);
    }, [roles]);

    return <DashboardLayout>
        <Box sx={{flexGrow: 1}}>
            <Container maxWidth="lg" sx={{mt: 4}}>
                <Typography variant="h5" sx={{py: 2}}>Resend Payin Callbacks</Typography>
                <MainFilter
                    loading={loading}
                    onSubmit={handleSubmit}
                    filter={filter}
                    isOpen={true}
                    selectedFilters={[
                        FilterEnums.status,
                        FilterEnums.setting,
                        FilterEnums.transaction_id,
                        FilterEnums.amount,
                        FilterEnums.utr,
                        FilterEnums.date_range,
                        FilterEnums.external_ref,
                    ]}
                    afterFilterBtn={
                        roles?.includes(RoleEnum.Admin) &&
                        <LoadingButton
                            sx={{
                                textTransform: 'capitalize',
                                px: 'auto',
                                m: 1,
                                mr: 'auto',
                            }}
                            color="error"
                            size="small"
                            disabled={isLock2}
                            onClick={() => changeOldStatus()}
                            className="rounded-2xl"
                            variant="contained">
                            Change All Wrong status
                        </LoadingButton>
                    }
                />
            </Container>
        </Box>
    </DashboardLayout>;
};

export default TransactionsResendCallback;