import {useSelector} from 'react-redux';
import React, {useEffect} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import {ReportEnum} from '@/utils/enums/reports';
import Typography from '@mui/material/Typography';
import StatementReport from '@/components/report-management/statementReport';
import TransactionReport from '@/components/report-management/transactionReport';
import UnclaimedReport from '@/components/report-management/unclaimedReport';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import VendorReport from '@/components/report-management/vendorReport';
import ReconReport from '@/components/report-management/reconReport';
import PayoutTransactionReport from '@/components/report-management/payoutTransactionReport';
import BalanceReport from '@/components/report-management/balanceReport';
import FailedPayoutTransactionReport from '@/components/report-management/failedPayoutTransactionReport';

const EditSettingPage = () => {
    const router = useRouter();
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const {name} = router.query;
    const reportType: string = name?.toString() || '';


    useEffect(() => {
        if (!roles?.includes(RoleEnum.Reports)) router.push(LOGIN_ROUTE);
    }, [roles]);
    return <DashboardLayout>
        {/*<Head>*/}
        {/*    <title>{reportType}</title>*/}
        {/*</Head>*/}
        <Box sx={{flexGrow: 1}}>
            <Container maxWidth="lg" sx={{mt: 4}}>
                <Typography variant="h5">{reportType}</Typography>
            </Container>
        </Box>
        {
            reportType === ReportEnum.StatementReport ?
                <StatementReport /> :
                reportType === ReportEnum.TransactionReport ?
                    <TransactionReport /> :
                    reportType === ReportEnum.PayoutTransactionReport ?
                        <PayoutTransactionReport /> :
                        reportType === ReportEnum.FailedPayoutTransactionReport ?
                            <FailedPayoutTransactionReport /> :
                            reportType === ReportEnum.UnclaimedReport ?
                                <UnclaimedReport /> :
                                reportType === ReportEnum.VendorReport ?
                                    <VendorReport /> :
                                    reportType === ReportEnum.ReconReport ?
                                        <ReconReport /> :
                                        reportType === ReportEnum.BalanceReport ?
                                            <BalanceReport /> :
                                            /*Missing Type*/
                                            <Typography variant="h5" sx={{m: 4}}>
                                                Error 404 Page Not Found <br />
                                                <sub>Missing Report Type</sub>
                                            </Typography>
        }
    </DashboardLayout>;
};

export default EditSettingPage;