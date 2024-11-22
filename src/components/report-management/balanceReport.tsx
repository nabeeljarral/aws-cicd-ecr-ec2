import React, {FormEvent, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {CloudDownloadOutlined} from '@mui/icons-material';
import MainFilter from '@/components/filter/mainFilter';
import {FilterEnums} from '@/utils/enums/filter';
import {IFilterTransactionDto} from '@/utils/dto/transactions.dto';
import {balanceReport, checkReportCompleted, downloadReport} from '@/utils/services/reports';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {useRouter} from 'next/router';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {HttpStatusCode} from 'axios';

const BalanceReport = () => {
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);

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
            const res = await balanceReport(filter);
            if (res?.status === HttpStatusCode.Forbidden) {
                setLoading(false);
                throw new Error(res?.message);
            }
            if (res?._id) {
                const id = setInterval(() => {
                    checkReportCompleted(res._id).then((res) => {
                        if (res && res.fileAttached) {
                            if (id !== null) clearInterval(id);
                            downloadReport(res._id,  'balance-report').then((res) => {
                                setLoading(false);
                            });             
                        }
                    });
                }, 10000);
                setIntervalId(id);
            }
        } catch {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (!roles?.includes(RoleEnum.BalanceReport)) router.push(LOGIN_ROUTE);
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
                    selectedFilters={[FilterEnums.date_range]}
                />
            </Container>
        </Box>
    );
};

export default BalanceReport;
