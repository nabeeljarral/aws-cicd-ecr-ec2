import {useSelector} from 'react-redux';
import React, {FormEvent, useEffect, useState} from 'react';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {Divider, Skeleton} from '@mui/material';
import {Preview} from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import TransactionTable from '@/components/tables/transactionTable';
import StatementRecordTable from '@/components/tables/statementRecordTable';
import MainFilter from '@/components/filter/mainFilter';
import {FilterEnums} from '@/utils/enums/filter';
import {ITransaction} from '@/utils/interfaces/transaction.interface';
import {IBankTransaction} from '@/utils/interfaces/bankTransaction.interface';
import {
    getRelatedTransactions,
    IRelatedTransactionsFilter,
    transactionsChecking,
} from '@/utils/services/transactions';
import awesomeAlert from '@/utils/functions/alert';
import {AlertTypeEnum} from '@/utils/enums/alertType';
import LoadingButton from '@mui/lab/LoadingButton';
import {IFilterTransactionDto} from '@/utils/dto/transactions.dto';

const RelatedTransaction = () => {
    const [bankTransactions, setBankTransactions] = useState<IBankTransaction[]>([]);
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [loadingCheck, setLoadingCheck] = useState(false);
    const [filter, setFilter] = useState<IRelatedTransactionsFilter>({});
    const [loading, setLoading] = useState(false);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();
    const [showTables, setShowTables] = useState(false);

    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(50);

    const [page2, setPage2] = useState<number>(0);
    const [limit2, setLimit2] = useState<number>(50);
    const handleManualCheck = async () => {
        setLoadingCheck(true);
        let data: IFilterTransactionDto = {};
        // @ts-ignore
        const _id: HTMLInputElement = document.getElementById('Transaction Id-input-helper');
        // @ts-ignore
        const utr: HTMLInputElement = document.getElementById('UTR-input-helper');

        if (_id?.value || utr?.value) {
            if (_id?.value) {
                data = {...data, _id: _id?.value};
            }
            if (utr?.value) {
                data = {...data, utr: utr?.value};
            }
            data = {...filter, ...data};

            const res = await transactionsChecking(data);
            if (res) {
                awesomeAlert({msg: res});
            }
            setLoadingCheck(false);
        } else {
            awesomeAlert({type: AlertTypeEnum.error, msg: 'Please provide at least one input.'});
            setLoadingCheck(false);
        }
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPage(0);
        setPage2(0);
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data: IRelatedTransactionsFilter = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        setFilter(data);
        if (!data.utr && !data._id) {
            setLoading(false);
            awesomeAlert({type: AlertTypeEnum.error, msg: 'Please provide at least one input.'});
            return;
        }
        delete data.relatedTo;
        const res = await getRelatedTransactions(data);
        if (res) {
            setTransactions(res.transactions || []);
            setBankTransactions(res.bankTransactions || []);
        }
        setLoading(false);
        setShowTables(true);
    };
    const callBackFunction = async (value: any) => {
        setShowTables(false);
    };
    useEffect(() => {
        if (!roles?.includes(RoleEnum.RelatedTransaction)) router.push(LOGIN_ROUTE);
    }, [roles]);

    return (
        <>
            <Box sx={{flexGrow: 1}}>
                <Container maxWidth="lg" sx={{mt: 2}}>
                    <MainFilter
                        loading={loading}
                        onSubmit={handleSubmit}
                        filter={{}}
                        isOpen={true}
                        selectedFilters={[
                            FilterEnums.transaction_id,
                            FilterEnums.utr,
                            FilterEnums.date_range,
                            FilterEnums.check_by_getaway,
                        ]}
                        callBackFunction={callBackFunction}
                        handleChange={callBackFunction}
                        submitText={
                            <>
                                <Preview sx={{mr: 1}} /> Show Related Records
                            </>
                        }
                        afterFilterBtn={
                            <LoadingButton
                                sx={{
                                    textTransform: 'capitalize',
                                    m: 1,
                                    ml: 2,
                                    mr: 'auto',
                                }}
                                color="success"
                                className="rounded-2xl"
                                variant="contained"
                                type={'button'}
                                onClick={handleManualCheck}
                                loading={!showTables && loadingCheck}
                                disabled={!showTables}
                            >
                                Check Transactions
                            </LoadingButton>
                        }
                    />
                </Container>
            </Box>
            {loading && showTables && (
                <Box sx={{flexGrow: 1, mt: 5, mx: 3}}>
                    <Skeleton variant="rounded" width="100%" height={130} />
                    <Skeleton sx={{mt: 1}} variant="rounded" width="100%" height={130} />
                </Box>
            )}
            {!loading && showTables && (
                <Box sx={{flexGrow: 1, mt: 5}}>
                    <Container maxWidth="lg" sx={{mt: 2}}>
                        <Typography variant="h5" sx={{mb: 2}}>
                            Transactions
                        </Typography>
                        <TransactionTable
                            transactions={transactions}
                            loading={loading}
                            setPage={(page: number) => setPage(page)}
                            setLimit={(limit: number) => setLimit(limit)}
                            limit={limit}
                            page={page}
                            total={transactions?.length}
                        />
                        <Divider sx={{mt: 6, mb: 2}} />
                        <Typography variant="h5" sx={{mb: 2}}>
                            Statement Record
                        </Typography>
                        <StatementRecordTable
                            setTransactions={(transactions) => setBankTransactions(transactions)}
                            transactions={bankTransactions}
                            loading={loading}
                            setPage={(page: number) => setPage2(page)}
                            setLimit={(limit: number) => setLimit2(limit)}
                            limit={limit2}
                            page={page2}
                            total={bankTransactions.length}
                        />
                    </Container>
                </Box>
            )}
        </>
    );
};

export default RelatedTransaction;
