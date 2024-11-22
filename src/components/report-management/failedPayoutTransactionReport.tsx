import React, {FormEvent, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {CloudDownloadOutlined} from '@mui/icons-material';
import MainFilter from '@/components/filter/mainFilter';
import {FilterEnums} from '@/utils/enums/filter';
import {IFilterPayoutTransaction} from '@/utils/dto/transactions.dto';
import {checkReportCompleted, downloadReport, failedPayoutTransactionReport} from '@/utils/services/reports';
import {RoleEnum} from '@/utils/enums/role';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {useRouter} from 'next/router';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {HttpStatusCode} from 'axios';

const FailedPayoutTransactionReport = () => {
    const [loading, setLoading] = useState(false);
    const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);
    const user = useSelector((state: RootState) => state.auth.user);
    const roles = user?.roles;
    const router = useRouter();
    useEffect(() => {
        if (!roles?.includes(RoleEnum.PayoutTransactionReport)) router.push(LOGIN_ROUTE);
    }, [roles]);
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
            const res = await failedPayoutTransactionReport(filter);
            if (res?.status === HttpStatusCode.Forbidden) {
                setLoading(false);
                throw new Error(res?.message);
            }
            if (res?._id) {
                const id = setInterval(() => {
                    checkReportCompleted(res._id).then(
                        (res) => {
                            if (res && res.fileAttached) {
                                if (id !== null) clearInterval(id);
                                if (res.fileAttached) 
                                    downloadReport(res._id, 'failed-payout-transaction-report').then((res) => {
                                        setLoading(false);
                                    });   
                            }
                        },
                    );
                }, 10000);
                setIntervalId(id);
            }
        } catch {
            setLoading(false);
        }
    };
    const [selectedFilter, setSelectedFilter] = useState<FilterEnums[]>([
        FilterEnums.date_range,
        FilterEnums.order_id,
        FilterEnums.account_number,
        FilterEnums.amount,
        FilterEnums.ifsc,
    ]);

    useEffect(() => {
        if (roles?.includes(RoleEnum.UserControl)) {
            setSelectedFilter((old) => [
                ...old,
                FilterEnums.payout_export_format,
                FilterEnums.vendor,
                FilterEnums.has_vendor,
                FilterEnums.batch_name,
                FilterEnums.ifsc,
            ]);
        }
    }, [roles]);
    useEffect(() => {
        return () => {
            if (intervalId !== null) clearInterval(intervalId);
        };
    }, [intervalId]);

    return (
        <Box sx={{flexGrow: 1}}>
            <Container maxWidth="lg" sx={{mt: 2}}>
                <MainFilter
                    isOpen={true}
                    loading={loading}
                    onSubmit={handleSubmit}
                    filter={{}}
                    submitText={
                        <>
                            <CloudDownloadOutlined sx={{mr: 1}} /> Generate Report
                        </>
                    }
                    selectedFilters={selectedFilter}
                />
            </Container>
        </Box>
    );
};

export default FailedPayoutTransactionReport;
