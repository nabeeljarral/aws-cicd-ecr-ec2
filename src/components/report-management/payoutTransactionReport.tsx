import React, {FormEvent, useEffect, useRef, useState} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {CloudDownloadOutlined} from '@mui/icons-material';
import MainFilter from '@/components/filter/mainFilter';
import {FilterEnums} from '@/utils/enums/filter';
import {IFilterPayoutTransaction} from '@/utils/dto/transactions.dto';
import {
    checkReportCompleted,
    downloadReport,
    payoutTransactionReport,
} from '@/utils/services/reports';
import {RoleEnum} from '@/utils/enums/role';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {useRouter} from 'next/router';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {HttpStatusCode} from 'axios';
import InprogressTransactionsReports from './inprogressTransactionsReports';
import {ReportEnum} from '@/utils/enums/reports';
import {fetchReportFiles} from '@/utils/services/reportFiles';
import {IReportFileInfo} from '@/utils/interfaces/report.interface';

const PayoutTransactionReport = () => {
    const [loading, setLoading] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);
    const [downloadBtnLoading, setDownloadBtnLoading] = useState(false);
    const roles = user?.roles;
    const router = useRouter();
    const [reports, setReports] = useState<IReportFileInfo[]>([]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        const filter: IFilterPayoutTransaction = data;
        try {
            const res = await payoutTransactionReport(filter);
            if (res?.status === HttpStatusCode.Forbidden) {
                setLoading(false);
                throw new Error(res?.message);
            }
            if (res?._id) {
                fetchReports();
            }
        } catch {
            setLoading(false);
        }
    };
    const handleDownload = async (reportId: string) => {
        await downloadReport(reportId, 'payout-transaction-report');
    };
    const [selectedFilter, setSelectedFilter] = useState<FilterEnums[]>([
        FilterEnums.date_range,
        FilterEnums.order_id,
        FilterEnums.payout_status,
        FilterEnums.account_number,
        FilterEnums.amount,
        FilterEnums.ifsc,
    ]);

    useEffect(() => {
        if (!roles?.includes(RoleEnum.PayoutTransactionReport)) router.push(LOGIN_ROUTE);
    }, [roles]);
    useEffect(() => {
        if (roles?.includes(RoleEnum.UserControl)) {
            setSelectedFilter((old) => [
                ...old,
                FilterEnums.balanceType,
                FilterEnums.payout_export_format,
                FilterEnums.vendor,
                FilterEnums.has_vendor,
                FilterEnums.batch_name,
                FilterEnums.external_ref,
            ]);
        }
    }, [roles]);

    useEffect(() => {
        fetchReports();
    }, []);
    const fetchReports = async () => {
        try {
            const data = await fetchReportFiles(ReportEnum.PayoutTransactionReport);
            if (Array.isArray(data)) {
                setReports(data);
            } else {
                console.error('Fetched data is not an array:', data);
            }
        } catch (err: any) {
            console.error('Error:', err.message);
        }
    };
    useEffect(() => {
        if (reports.length > 0) {
            checkReportStatus();
        }
    }, [reports]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const checkReportStatus = () => {
        if (reports.length) {
            const reportInProgress = reports.some(
                (report) => report.reportInProgress && !report.fileAttached && !report?.error,
            );
            if (reportInProgress && intervalRef.current === null) {
                intervalRef.current = setInterval(() => {
                    fetchReports();
                }, 3000);
            } else if (!reportInProgress) {
                if (intervalRef.current != null) {
                    clearInterval(intervalRef.current);
                }
                setLoading(false);
                intervalRef.current = null;
            }
        }
    };
    return (
        <>
            <Box sx={{flexGrow: 1}}>
                <Container maxWidth="lg" sx={{mt: 2}}>
                    <MainFilter
                        isOpen={true}
                        loading={loading}
                        onSubmit={handleSubmit}
                        filter={{}}
                        submitText={<>Generate Report</>}
                        selectedFilters={selectedFilter}
                        isRestrictedPage={true}
                    />
                </Container>
            </Box>

            <InprogressTransactionsReports
                reports={reports}
                handleDownload={handleDownload}
                fetchReports={fetchReports}
            />
        </>
    );
};

export default PayoutTransactionReport;
