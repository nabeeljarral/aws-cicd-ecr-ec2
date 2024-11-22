import {useSelector} from 'react-redux';
import {FormEvent, useEffect, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {Grid} from '@mui/material';
import StatementRecordTable from '@/components/tables/statementRecordTable';
import MainFilter from '@/components/filter/mainFilter';
import {FilterEnums} from '@/utils/enums/filter';
import {bankTransactionTable} from '@/utils/services/bankTransactions';
import {IFilterBankTransactionDto} from '@/utils/dto/bankTransactions.dto';
import {IBankTransaction} from '@/utils/interfaces/bankTransaction.interface';

type Props = {
    initFilter?: IFilterBankTransactionDto,
    selectedFilters?: FilterEnums[]
    pageRole?: RoleEnum
}
const StatementRecords = (props: Props) => {
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const userId = useSelector((state: RootState) => state.auth.user)?._id;
    const router = useRouter();
    const initFilter: IFilterBankTransactionDto = {show: true, ...(props?.initFilter ?? {})};
    const pageRole: RoleEnum = props?.pageRole ?? RoleEnum.StatementRecords;
    const selectedFilters: FilterEnums[] = props?.selectedFilters ??
        [
            FilterEnums.bank,
            FilterEnums.bank_account,
            FilterEnums.is_claimed,
            FilterEnums.amount,
            FilterEnums.utr,
            FilterEnums.date_range,
        ];
    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [limit, setLimit] = useState<number>(50);
    const [transactions, setTransactions] = useState<IBankTransaction[]>([]);
    const [filter, setFilter] = useState<IFilterBankTransactionDto>(initFilter);
    const [loading, setLoading] = useState(false);

    const fetchTransactions = async (f?: IFilterBankTransactionDto) => {
        setLoading(true);
        const res = await bankTransactionTable({
            page: page + 1,
            limit,
            filter: f ?? filter,
        });
        if (res) {
            setTransactions(res.transactions ?? []);
            setTotal(res.total);
        }
        setLoading(false);
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPage(0);
        const formData = new FormData(e.currentTarget);
        const data = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        const filter2: IFilterBankTransactionDto = {
            ...initFilter,
            ...data,
        };
        setFilter(filter2);
        await fetchTransactions(filter2);
    };

    useEffect(() => {
        if (userId && roles?.includes(pageRole)) {
            const f = filter;
            if (!(roles?.includes(RoleEnum.UserControl))){
                f.relatedTo = userId
            }
            fetchTransactions(f).then(r => r);
            setFilter(f);
        }
    }, [userId]);

    useEffect(() => {
        if (!roles?.includes(pageRole)) router.push(LOGIN_ROUTE);
    }, [roles]);

    useEffect(() => {
        if (userId && roles?.includes(pageRole)) {
            let f: IFilterBankTransactionDto = filter;
            if (!(roles?.includes(RoleEnum.UserControl)))
                f = {
                    ...filter,
                    relatedTo: userId,
                };
            fetchTransactions(f).then(r => r);
        }
    }, [page, limit, userId]);

    return <DashboardLayout>
        <Box sx={{flexGrow: 1}}>
            <Container maxWidth="lg" sx={{mt: 4}}>
                <MainFilter
                    loading={loading}
                    onSubmit={handleSubmit}
                    filter={filter}
                    selectedFilters={selectedFilters}
                />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <StatementRecordTable
                            loading={loading}
                            setPage={(page: number) => setPage(page)}
                            setLimit={(limit: number) => setLimit(limit)}
                            limit={limit}
                            page={page}
                            total={total}
                            setTransactions={(transactions) => setTransactions(transactions)}
                            transactions={transactions}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    </DashboardLayout>;
};

export default StatementRecords;