import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import React, {FormEvent, useEffect, useRef, useState} from 'react';
import {FilterEnums} from '@/utils/enums/filter';
import {IFilterPayoutTransaction, IFilterTransactionDto, IPayoutTransaction} from '@/utils/dto/transactions.dto';
import {RoleEnum} from '@/utils/enums/role';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import MainFilter from '@/components/filter/mainFilter';
import PayoutTransactionTable from '@/components/tables/payoutTransactionTable';
import Box from '@mui/material/Box';
import {Alert, Button} from '@mui/material';
import Container from '@mui/material/Container';
import {getPayoutTransactions} from '@/utils/services/payoutTransactions';
import {PriceFormatter} from '@/utils/functions/global';
import {AssignmentInd, AssignmentReturn} from '@mui/icons-material';
import {EditGatewayDialog} from '@/components/dialogs/EditGatewayDialog';


export const PayoutTransactionsPage = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const userId = user?._id;
    const roles = user?.roles;
    const [page, setPage] = useState(0);
    const [transactions, setTransactions] = useState<IPayoutTransaction[]>([]);
    const [filter, setFilter] = useState<IFilterPayoutTransaction>({});
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(50);
    const [loading, setLoading] = useState(false);
    const [selectedTransactions, setSelectedTransactions] = useState<IPayoutTransaction[]>([]);
    const payoutTableRef = useRef<any>(null);
    const [selectedFilter, setSelectedFilter] = useState<FilterEnums[]>([
        FilterEnums.transaction_id,
        FilterEnums.date_range,
        FilterEnums.order_id,
        FilterEnums.account_number,
        FilterEnums.amount,
        FilterEnums.payout_status,
        FilterEnums.ifsc,
    ]);
    const [showEditGatewayDialog, setShowEditGatewayDialog] = useState(false);

    const callOpenEditDialog = () => {
        if (payoutTableRef.current) {
            payoutTableRef.current?.openEditDialog(selectedTransactions);
        }
    };
    const callOpenEditGatewayDialog = () => {
        setShowEditGatewayDialog(true);
    };
    const fetchTransactions = async (f?: IFilterPayoutTransaction) => {
        setLoading(true);
        const filters: Partial<IPayoutTransaction> = f || filter;
        if (!roles?.includes(RoleEnum.UserControl)) {
            filters.relatedTo = userId;
        }
        setFilter(filters);
        const res = await getPayoutTransactions({page: page + 1, limit, filter: filters});
        if (res) {
            setTransactions(res.transactions ?? []);
            setTotal(res.total ?? 0);
        }
        setLoading(false);
    };

    const closeEditGatewayDialog = () => {
        setSelectedTransactions([]);
        setShowEditGatewayDialog(false);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data: Partial<IPayoutTransaction> = {};
        formData.forEach((value, key) => {
            if (value) {
                // @ts-ignore
                data[key] = value;
            }
        });
        const filter: IFilterPayoutTransaction = data;
        await fetchTransactions(filter);
        setLoading(false);
    };

    useEffect(() => {
        if (userId && !loading) fetchTransactions().then(r => r);
    }, [page, limit, userId]);

    useEffect(() => {
        if (roles?.includes(RoleEnum.PayoutTransactions) && !loading) {
            setFilter({});
            fetchTransactions().then(r => r);
        }
        if (roles?.includes(RoleEnum.UserControl)) {
            setSelectedFilter(old => [
                    ...old,
                    FilterEnums.balanceType,
                    FilterEnums.external_ref,
                    FilterEnums.vendor,
                    FilterEnums.has_vendor,
                ],
            );
        }

    }, [roles]);

    return (
        <DashboardLayout>
            <EditGatewayDialog
                ids={selectedTransactions.map((t: IPayoutTransaction) => t._id)}
                open={showEditGatewayDialog}
                onClose={closeEditGatewayDialog}
                fetchTransactions={fetchTransactions}
            />
            <Container maxWidth="lg" sx={{mt: 2}}>
                <MainFilter
                    loading={loading}
                    onSubmit={handleSubmit}
                    filter={filter as IFilterTransactionDto}
                    selectedFilters={selectedFilter} />
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItem: 'center'}}>
                    <Box>
                        {
                            !!selectedTransactions.length && <Box sx={{display: 'flex'}}>
                                <Alert>
                                    Selected Transactions <b>{selectedTransactions.length}</b> |
                                    Total Amount: <b>{
                                    PriceFormatter(selectedTransactions.reduce((o, n) => n.amount + o, 0))
                                }</b>
                                </Alert>
                                {
                                    (
                                        roles?.includes(RoleEnum.EditPayoutTransactionsStatus)
                                        || roles?.includes(RoleEnum.EditPayoutTransactionsVendor)
                                    ) &&
                                    <Button color="success" variant="outlined" size="small"
                                            sx={{textTransform: 'capitalize', my: '5px', mx: 2, pl: 2, pr: 3}}
                                            startIcon={<AssignmentInd />}
                                            onClick={() => callOpenEditDialog()}>
                                        Assign to Vendor
                                    </Button>
                                }
                                {
                                    (
                                        roles?.includes(RoleEnum.EditPayoutTransactionsStatus)
                                        || roles?.includes(RoleEnum.SendPayoutTransactionsToGateway)
                                    ) &&
                                    <Button color="success" variant="outlined" size="small"
                                            sx={{textTransform: 'capitalize', my: '5px', pl: 2, pr: 3}}
                                            startIcon={<AssignmentReturn />}
                                            onClick={() => callOpenEditGatewayDialog()}>
                                        Send To Gateway
                                    </Button>
                                }
                            </Box>
                        }
                    </Box>

                    {/* {
                        roles?.includes(RoleEnum.CreatePayoutTransactions) &&
                        <Box sx={{textAlign: 'right', mt: 2, mb: 2}}>
                            <Button color='primary' variant='contained'
                                    sx={{textTransform: 'capitalize'}}
                                    onClick={() => router.push(TEST_PAYOUT_TRANSACTION_ROUTE)}>
                                Create Test Transaction
                            </Button>
                        </Box>
                    } */}
                </Box>
                <PayoutTransactionTable
                    ref={payoutTableRef}
                    loading={loading}
                    setSelectedTransactions={setSelectedTransactions}
                    selectedTransactions={selectedTransactions}
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
