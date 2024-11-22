import React, {FormEvent, useEffect, useRef, useState} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {CloudDownloadOutlined} from '@mui/icons-material';
import MainFilter from '@/components/filter/mainFilter';
import {FilterEnums} from '@/utils/enums/filter';
import {IFilterBankTransactionDto} from '@/utils/dto/bankTransactions.dto';
import {bankTransactionReport, downloadReport} from '@/utils/services/reports';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {useRouter} from 'next/router';
import {HttpStatusCode} from 'axios';
import {IReportFileInfo} from '@/utils/interfaces/report.interface';
import {ReportEnum} from '@/utils/enums/reports';
import {fetchReportFiles} from '@/utils/services/reportFiles';
import InprogressTransactionsReports from './inprogressTransactionsReports';

const TransactionReport = () => {
    const [loading, setLoading] = useState(false);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
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
        const filter: IFilterBankTransactionDto = {
            is_claimed: true,
            type: ReportEnum.StatementReport,
            ...data,
        };
        try {
            const res = await bankTransactionReport(filter);
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
    useEffect(() => {
        if (!roles?.includes(RoleEnum.StatementReport)) router.push(LOGIN_ROUTE);
    }, [roles]);

    useEffect(() => {
        fetchReports();
    }, []);
    const handleDownload = async (reportId: string) => {
        await downloadReport(reportId, 'statement-record-report');
    };
    const fetchReports = async () => {
        try {
            const data = await fetchReportFiles(ReportEnum.StatementReport);
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
                        loading={loading}
                        onSubmit={handleSubmit}
                        filter={{}}
                        isOpen={true}
                        submitText={
                            <>
                                <CloudDownloadOutlined sx={{mr: 1}} /> Generate Report
                            </>
                        }
                        selectedFilters={[FilterEnums.bank_account, FilterEnums.date_range]}
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

export default TransactionReport;
