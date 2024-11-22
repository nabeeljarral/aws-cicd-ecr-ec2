import {
    Dispatch,
    forwardRef,
    SetStateAction,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import Paper from '@mui/material/Paper';
import {useSelector} from 'react-redux';
import {IUser} from '@/utils/interfaces/user.interface';
import {RootState} from '@/store';
import {IColumn} from '@/utils/interfaces/table.interface';
import {addEllipsis, DateFormatter, PriceFormatter} from '@/utils/functions/global';
import {RoleEnum} from '@/utils/enums/role';
import {TableActions} from '@/components/filter/main/TableActions';
import MainTable from '@/components/tables/mainTable';
import {UpdatesHistoryPayoutTransactionDialog} from '@/components/dialogs/updatesHistoryPayoutTransactionDialog';
import {EditPayoutTransactionDialog} from '@/components/dialogs/editPayoutTransactionDialog';
import StatusChip2 from '@/components/main/statusChip2';
import {IPayoutTransaction} from '@/utils/dto/transactions.dto';
import {IBatch} from '@/utils/interfaces/batch.interface';
import {IVendor} from '@/utils/interfaces/vendor.interface';
import {BalanceAccountTypesEnum, BalanceAccountTypesName} from '@/utils/enums/balances.enum';
import {IGatewayAccount} from '@/utils/interfaces/gatewayAccount.interface';

interface Props {
    limit: number;
    loading: boolean;
    page: number;
    setLimit: (limit: number) => void;
    setPage: (page: number) => void;
    setSelectedTransactions?: Dispatch<SetStateAction<IPayoutTransaction[]>>;
    selectedTransactions?: IPayoutTransaction[];
    total: number;
    transactions: IPayoutTransaction[];
}

const PayoutTransactionTable = forwardRef((props: Props, ref) => {
    const {
        loading,
        transactions,
        limit,
        setLimit,
        total,
        setPage,
        page,
        setSelectedTransactions,
        selectedTransactions,
    } = props;
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const [selectedTransaction, setSelectedTransaction] = useState<
        IPayoutTransaction | IPayoutTransaction[]
    >();
    const [showStatusUpdatesDialog, setShowStatusUpdatesDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [columns] = useState<IColumn[]>([
        {id: '_id', label: 'ID', minWidth: 100},
        {
            id: 'relatedTo',
            label: 'Client Name',
            minWidth: 150,
            format: (user: IUser | string) =>
                typeof user === 'string' ? user : user?.username || '',
        },
        {id: 'external_ref', label: 'Ref.'},
        {id: 'order_id', label: 'Order ID', minWidth: 200},
        {
            id: 'amount',
            label: 'Amount',
            minWidth: 100,
            format: (value: number) => PriceFormatter(value),
        },
        {
            id: 'status',
            label: 'Status',
            align: 'center',
            minWidth: 100,
            passRow: true,
            format: (row: IPayoutTransaction) => <StatusChip2 status={row.status} />,
        },
        // {id: 'username', label: 'Username', minWidth: 200, format: (v: string) => v ?? '--'},
        {
            id: 'account_holder_name',
            label: 'Account',
            minWidth: 200,
            passRow: true,
            format: (t: IPayoutTransaction) => (
                <>
                    <span>
                        {t.account_holder_name}
                        <br />
                        No. {t.account_number}
                    </span>
                </>
            ),
        },
        {
            id: 'bank_name',
            label: 'Bank',
            minWidth: 230,
            passRow: true,
            format: (t: IPayoutTransaction) => (
                <>
                    <span title={t.bank_name}>Name: {addEllipsis(t.bank_name, 20) || '--'}</span>
                    <br />
                    <span title={t.bank_branch}>
                        Branch: {addEllipsis(t.bank_branch, 20) || '--'}
                    </span>
                    <br />
                    <span title={t.bank_address}>
                        Address: {addEllipsis(t.bank_address, 20) || '--'}
                    </span>
                    <br />
                </>
            ),
        },
        {id: 'ifsc', label: 'IFSC', minWidth: 100},
        {id: 'utr', label: 'UTR', minWidth: 100},
        {
            id: 'updatedAt',
            label: 'Updated at',
            minWidth: 200,
            passRow: true,
            format: (t: IPayoutTransaction) => DateFormatter(t.updatedAt),
        },
        {
            id: 'createdAt',
            label: 'Created at',
            minWidth: 200,
            format: (value: Date) => DateFormatter(value),
        },
    ]);
    const mainTableRef = useRef(null);
    const haveUserControlPermission = roles?.includes(RoleEnum.UserControl);
    const haveEditVendorPermission = roles?.includes(RoleEnum.EditPayoutTransactionsVendor);
    const haveEditStatusPermission = roles?.includes(RoleEnum.EditPayoutTransactionsStatus);

    useImperativeHandle(ref, () => ({
        openEditDialog(selectedTransactions: IPayoutTransaction | IPayoutTransaction[]) {
            openEditDialog(selectedTransactions);
        },
    }));

    const openEditDialog = (t: IPayoutTransaction | IPayoutTransaction[]) => {
        setSelectedTransaction(t);
        setShowEditDialog(true);
    };

    const closeEditDialog = (transaction?: IPayoutTransaction | Partial<IPayoutTransaction>[]) => {
        if (transaction) {
            const isArr = Array.isArray(transaction);
            const updatedTransactions = isArr ? transaction : [transaction];
            if (updatedTransactions?.length && transactions) {
                for (const updatedTransaction of updatedTransactions) {
                    for (let i = 0; i < transactions.length; i++) {
                        if (transactions[i]._id === updatedTransaction._id) {
                            ``;
                            transactions[i] = {
                                ...transactions[i],
                                ...updatedTransaction,
                            };
                            break;
                        }
                    }
                }
            }
        }
        if (transaction && mainTableRef.current)
            (mainTableRef.current as any)?.resetSelectedTransactions();
        setSelectedTransaction([]);
        setShowEditDialog(false);
    };
    const openStatusUpdatesDialog = (transaction?: IPayoutTransaction) => {
        setSelectedTransaction(transaction);
        setShowStatusUpdatesDialog(true);
    };
    const closeStatusUpdatesDialog = () => {
        setSelectedTransaction(undefined);
        setShowStatusUpdatesDialog(false);
    };

    useEffect(() => {
        const hasActionLabel = columns.some((c) => c.label === 'Action');
        if (!hasActionLabel && haveUserControlPermission) {
            columns.splice(
                5,
                0,
                {
                    id: 'balanceType',
                    label: 'Method',
                    minWidth: 150,
                    format: (v: BalanceAccountTypesEnum) =>
                        v === BalanceAccountTypesEnum.default
                            ? BalanceAccountTypesName.Default
                            : v === BalanceAccountTypesEnum.payWing
                            ? BalanceAccountTypesName.PayWing
                            : v === BalanceAccountTypesEnum.tappay
                            ? BalanceAccountTypesName.Tappay
                            : v === BalanceAccountTypesEnum.firstPe
                            ? BalanceAccountTypesName.FirstPe
                            : v === BalanceAccountTypesEnum.pay365
                            ? BalanceAccountTypesName.Pay365
                            : v === BalanceAccountTypesEnum.starpaisa
                            ? BalanceAccountTypesName.Starpaisa
                            : v === BalanceAccountTypesEnum.xettle
                            ? BalanceAccountTypesName.Xettle
                            : v === BalanceAccountTypesEnum.recopays
                            ? BalanceAccountTypesName.Recopays
                            : v === BalanceAccountTypesEnum.heksaPay
                            ? BalanceAccountTypesName.HeksaPay
                            : v === BalanceAccountTypesEnum.letspe
                            ? BalanceAccountTypesName.LETSPE
                            : v === BalanceAccountTypesEnum.payTMe
                            ? BalanceAccountTypesName.PayTMe
                            : v,
                },
                {
                    id: 'gatewayId',
                    label: 'Gateway',
                    passRow: true,
                    minWidth: 100,
                    format: (
                        row: IPayoutTransaction & {
                            gatewayId: string | IVendor;
                        },
                    ) => (
                        <>
                            {typeof row.gatewayId === 'string'
                                ? row.gatewayId
                                : (row.gatewayId as IGatewayAccount)?.name || ''}
                        </>
                    ),
                },
            );
            columns.splice(
                -2,
                0,
                {
                    id: 'vendorId',
                    label: 'Vendor',
                    passRow: true,
                    minWidth: 100,
                    format: (
                        row: IPayoutTransaction & {
                            vendorId: string | IVendor;
                        },
                    ) => (
                        <>
                            {typeof row.vendorId === 'string'
                                ? row.vendorId
                                : (row.vendorId as IVendor)?.name || ''}
                            {row.vendor_bank && (
                                <>
                                    <br />
                                    B: {row.vendor_bank}
                                </>
                            )}
                        </>
                    ),
                },
                {
                    id: 'batchId',
                    label: 'Batch',
                    minWidth: 200,
                    format: (b: IBatch | string) => (typeof b === 'string' ? b : b?.name || ''),
                },
            );
            columns.push({
                id: 'id',
                label: 'Action',
                minWidth: 170,
                passRow: true,
                format: (transaction: IPayoutTransaction) => (
                    <TableActions
                        item={transaction}
                        hideEdit={!roles?.includes(RoleEnum.EditPayoutTransactions)}
                        handleEditClick={(t: IPayoutTransaction) => openEditDialog(t)}
                        handleViewClick={(t: IPayoutTransaction) => openStatusUpdatesDialog(t)}
                    />
                ),
            });
        }
    }, [roles]);

    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <EditPayoutTransactionDialog
                id={
                    !selectedTransaction
                        ? ''
                        : Array.isArray(selectedTransaction)
                        ? selectedTransaction.map((t: IPayoutTransaction) => t._id)
                        : selectedTransaction?._id
                }
                open={showEditDialog}
                onClose={closeEditDialog}
            />
            {selectedTransaction !== undefined && !Array.isArray(selectedTransaction) && (
                <UpdatesHistoryPayoutTransactionDialog
                    transaction={selectedTransaction}
                    open={showStatusUpdatesDialog}
                    onClose={closeStatusUpdatesDialog}
                />
            )}
            <MainTable
                ref={mainTableRef}
                loading={loading}
                checkboxSelection={haveEditVendorPermission || haveEditStatusPermission}
                setSelectedTransactions={setSelectedTransactions}
                selectedTransactions={selectedTransactions}
                setPage={(page) => setPage(page)}
                setLimit={(limit) => setLimit(limit)}
                limit={limit}
                page={page}
                total={total}
                rows={transactions}
                columns={columns}
            />
        </Paper>
    );
});

export default PayoutTransactionTable;
