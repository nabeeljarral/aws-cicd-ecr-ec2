import React, {FormEvent, useEffect, useRef, useState} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import MainFilter from '@/components/filter/mainFilter';
import {FilterEnums} from '@/utils/enums/filter';
import {IFilterTransactionDto} from '@/utils/dto/transactions.dto';
import {downloadReport, transactionReport} from '@/utils/services/reports';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {useRouter} from 'next/router';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {HttpStatusCode} from 'axios';
import InprogressTransactionsReports from './inprogressTransactionsReports';
import {ReportEnum} from '@/utils/enums/reports';
import {fetchReportFiles} from '@/utils/services/reportFiles';
import {IReportFileInfo} from '@/utils/interfaces/report.interface';

const TransactionReport = () => {
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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
        const filter: IFilterTransactionDto = data;
        try {
            const res = await transactionReport(filter);
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
        if (!roles?.includes(RoleEnum.TransactionReport)) router.push(LOGIN_ROUTE);
    }, [roles]);

    useEffect(() => {
        fetchReports();
    }, []);
    const handleDownload = async (reportId: string) => {
        await downloadReport(reportId, 'transaction-report');
    };
    const fetchReports = async () => {
        try {
            const data = await fetchReportFiles(ReportEnum.TransactionReport);
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
                        selectedFilters={[
                            FilterEnums.setting,
                            FilterEnums.status,
                            FilterEnums.date_range,
                            ...(roles?.includes(RoleEnum.UserControl)
                                ? [FilterEnums.bank_type]
                                : []),
                        ]}
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
