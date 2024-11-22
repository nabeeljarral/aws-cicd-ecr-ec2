import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import React, {FormEvent, useEffect, useState} from 'react';
import {FilterEnums} from '@/utils/enums/filter';
import {RoleEnum} from '@/utils/enums/role';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import MainFilter from '@/components/filter/mainFilter';
import Box from '@mui/material/Box';
import {useRouter} from 'next/router';
import Container from '@mui/material/Container';
import {IBankStatementFile, IBankStatementFileFilter} from '@/utils/interfaces/bankStatementFile.interface';
import {downloadBankStatementFiles, getBankStatementFiles} from '@/utils/services/bankStatementFile';
import BankStatementFileTable from '@/components/tables/bankStatementFileTable';
import {SimCardDownload} from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';


export const PayoutTransactionsPage = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const userId = user?._id;
    const roles = user?.roles;
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [transactions, setTransactions] = useState<IBankStatementFile[]>([]);
    const [filter, setFilter] = useState<IBankStatementFileFilter>({});
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(50);
    const [loading, setLoading] = useState(false);
    const [selectedTransactions, setSelectedTransactions] = useState<IBankStatementFile[]>([]);
    const [selectedFilter] = useState<FilterEnums[]>([
        FilterEnums.date_range,
        FilterEnums.account_number,
        FilterEnums.bank_account,
        // FilterEnums.bank,
    ]);

    const fetchBankFiles = async (f?: IBankStatementFileFilter) => {
        setLoading(true);
        const filters: Partial<IBankStatementFileFilter> = f || filter;
        const res = await getBankStatementFiles({page: page + 1, limit, filter: filters});
        if (res) {
            setTransactions(res.transactions ?? []);
            setTotal(res.total ?? 0);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data: IBankStatementFileFilter = {};
        formData.forEach((value, key) => {
            if (value) {
                // @ts-ignore
                data[key] = value;
            }
        });
        await fetchBankFiles(data);
        setLoading(false);
    };
    const downloadFiles = () => {
        const ids = selectedTransactions.map(t => t._id);
        setLoading(true);
        downloadBankStatementFiles(ids)
            .finally(() => {
                setLoading(false);
            });
        setLoading(false);
    };

    useEffect(() => {
        if (userId && !loading) fetchBankFiles(filter).then(r => r);
    }, [page, limit, userId]);

    useEffect(() => {
        if (roles?.includes(RoleEnum.FileAccess) && !loading) {
            setFilter({});
            fetchBankFiles().then(r => r);
        }

    }, [roles]);

    return (
        <DashboardLayout>
            <Container maxWidth="lg" sx={{mt: 2}}>
                <MainFilter
                    loading={loading}
                    onSubmit={handleSubmit}
                    filter={{}}
                    selectedFilters={selectedFilter} />
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItem: 'center'}}>
                    {
                        !!selectedTransactions.length &&
                        <Box sx={{textAlign: 'right', mt: 2, mb: 2}}>
                            <LoadingButton loading={loading}
                                           color="primary"
                                           variant="contained"
                                           startIcon={<SimCardDownload />}
                                           sx={{textTransform: 'capitalize'}}
                                           onClick={downloadFiles}>
                                Download {selectedTransactions.length} file{selectedTransactions.length > 1 && 's'}
                            </LoadingButton>
                        </Box>
                    }
                </Box>
                <BankStatementFileTable
                    loading={loading}
                    setSelectedTransactions={setSelectedTransactions}
                    setPage={(page: number) => setPage(page)}
                    setLimit={(limit: number) => setLimit(limit)}
                    limit={limit}
                    page={page}
                    total={total}
                    transactions={transactions}
                />
            </Container>
        </DashboardLayout>
    );
};

export default PayoutTransactionsPage;
