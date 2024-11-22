import {useSelector} from 'react-redux';
import React, {FormEvent, useEffect, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {CREATE_BANK_ACCOUNTS_ROUTE, CREATE_VENDOR_ROUTE, LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {Button, CircularProgress, Grid} from '@mui/material';
import BankAccountTable from '@/components/tables/bankAccountTable';
import {getBankAccounts} from '@/utils/services/bankAccount';
import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import MainFilter from '@/components/filter/mainFilter';

const BankAccountPage = () => {
    const [bankAccounts, setBankAccounts] = useState<IBankAccount[]>([]);
    const [loading, setLoading] = useState(false);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();

    const fetchBankAccount = async (relatedTo?: string) => {
        setLoading(true);
        const res = await getBankAccounts(relatedTo ? {relatedTo} : {});
        setLoading(false);
        return res;
    };
    const hideBankAccountDetails = !roles?.length ? true : !!roles?.includes(RoleEnum.HideBankAccountDetails);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        const {relatedTo} = data as IBankAccount;
        const res = await fetchBankAccount(relatedTo);
        if (res) setBankAccounts(res);
    };

    useEffect(() => {
        fetchBankAccount()
            .then(res => {
                if (res) {
                    setBankAccounts(res);
                }
            })
            .catch(err => console.error(err));
    }, []);
    useEffect(() => {
        if (!roles?.includes(RoleEnum.BankAccounts)) router.push(LOGIN_ROUTE);
    }, [roles]);

    return <DashboardLayout>
        <Box sx={{flexGrow: 1}}>
            {/*<Head>*/}
            {/*    <title>Bank Accounts</title>*/}
            {/*</Head>*/}
            <Container maxWidth="lg" sx={{mt: 4}}>
                <MainFilter
                    filter={{}}
                    loading={false}
                    onSubmit={handleSubmit}
                    selectedFilters={[]} />
                <Box sx={{textAlign: 'right', mt: 2, mb: 2}}>
                    <Button color="primary" variant="contained"
                            sx={{textTransform: 'capitalize', mr: 3}}
                            onClick={() => router.push(CREATE_VENDOR_ROUTE)}>
                        Create Vendor
                    </Button>
                    <Button color="primary" variant="contained"
                            sx={{textTransform: 'capitalize'}}
                            onClick={() => router.push(CREATE_BANK_ACCOUNTS_ROUTE)}>
                        Create Bank Account
                    </Button>
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {loading && <CircularProgress size={40} />}
                        {!loading && <BankAccountTable
                            rows={
                                !hideBankAccountDetails ?
                                    bankAccounts :
                                    bankAccounts.filter(bankAccount => bankAccount.is_active)
                            }
                            hideBankAccountDetails={hideBankAccountDetails}
                        />
                        }
                    </Grid>
                </Grid>
            </Container>
        </Box>
    </DashboardLayout>;
};

export default BankAccountPage;