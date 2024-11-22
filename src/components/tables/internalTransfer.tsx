import {forwardRef, useEffect, useState} from 'react';
import Paper from '@mui/material/Paper';
import {useSelector} from 'react-redux';
import {IUser} from '@/utils/interfaces/user.interface';
import {RootState} from '@/store';
import {IColumn} from '@/utils/interfaces/table.interface';
import {addEllipsis, DateFormatter} from '@/utils/functions/global';
import MainTable from '@/components/tables/mainTable';
import {IBalanceHistory} from '@/utils/interfaces/balance.interface';
import {Box, Chip} from '@mui/material';
import {EditBalanceHistoryDialog} from '@/components/dialogs/EditBalanceHistoryDialog';
import {RoleEnum} from '@/utils/enums/role';

interface Props {
    limit: number;
    loading: boolean;
    page: number;
    setLimit: (limit: number) => void;
    setPage: (page: number) => void;
    total: number;
    balanceHistory: IBalanceHistory[];
    setBalanceHistory: (balances: IBalanceHistory[]) => void;
    formData?: any;
}

const InternalTransferTable = forwardRef((props: Props, ref) => {
    const {
        loading,
        balanceHistory,
        setBalanceHistory,
        formData,
        limit,
        setLimit,
        total,
        setPage,
        page,
    } = props;
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const userId = useSelector((state: RootState) => state.auth.user)?._id;

    const [columns, setColumns] = useState<IColumn[]>([
        {
            id: 'createdAt',
            label: 'Date',
            minWidth: 200,
            format: (value: Date) => DateFormatter(value),
        },
        {id: '_id', label: 'ID', minWidth: 100},
        {id: 'amount', label: 'Amount', minWidth: 100, passRow: true},
        {
            id: 'fromUser',
            label: 'Transferred From',
            minWidth: 150,
            format: (value: IUser | string) =>
                typeof value === 'string' ? value : value?.username || '',
        },
        {
            id: 'toUser',
            label: 'Transferred To',
            minWidth: 150,
            format: (value: IUser | string) =>
                typeof value === 'string' ? value : value?.username || '',
        },
        {
            id: 'remarks',
            label: 'Remarks',
            minWidth: 300,
            format: (note: string | undefined) => <Box title={note}>{addEllipsis(note, 100)}</Box>,
        },
    ]);
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
    const [selectedDeletedId, setSelectedDeletedId] = useState<string | undefined>();
    const [selectedId, setSelectedId] = useState<string | undefined>();

    const handleDeleteBalanceHistory = (id: string) => {
        setSelectedId(undefined);
        setSelectedDeletedId(undefined);
        if (balanceHistory) {
            const filteredBalances = balanceHistory.filter((b) => b._id !== id);
            setBalanceHistory(filteredBalances);
        }
    };

    const handleCloseDialog = (balanceH?: IBalanceHistory) => {
        setOpenEditDialog(false);
        setSelectedId(undefined);
        if (balanceH) {
            const updatedBalances = balanceHistory.map((b) =>
                b._id === balanceH._id
                    ? {...b, amount: balanceH.amount, remarks: balanceH.remarks}
                    : b,
            );
            setBalanceHistory(updatedBalances);
        }
    };


useEffect(() => {
    const hasTransactionTypeColumn = columns.some((c) => c.label === 'Transaction Type');
    let newColumns = [...columns];

    const shouldAddTransactionTypeColumn =
        formData?.relatedTo || !roles?.includes(RoleEnum.UserControl);

    if (shouldAddTransactionTypeColumn) {
        if (hasTransactionTypeColumn) {
            newColumns = newColumns.filter((c) => c.label !== 'Transaction Type');
        }
        newColumns.splice(-1, 0, {
            id: 'fromUser',
            label: 'Transaction Type',
            minWidth: 200,
            format: (value: any) =>
                typeof value === 'string' ? (
                    value
                ) : value?._id === (formData?.relatedTo || userId) ? (
                    <Chip
                        sx={{
                            color: 'red',
                            background: '#ffc2c2',
                            padding: '2px',
                        }}
                        label="Debited"
                    />
                ) : (
                    <Chip
                        sx={{
                            color: 'green',
                            background: '#c3f4c7',
                            padding: '2px',
                        }}
                        label="Credited"
                    />
                ),
        });
    } else if (hasTransactionTypeColumn) {
        newColumns = newColumns.filter((c) => c.label !== 'Transaction Type');
    }

    setColumns(newColumns);
}, [columns, roles, formData?.relatedTo, userId]);


    useEffect(() => {
        if (selectedDeletedId) handleDeleteBalanceHistory(selectedDeletedId);
    }, [selectedDeletedId]);

    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <EditBalanceHistoryDialog
                open={openEditDialog}
                onClose={handleCloseDialog}
                id={selectedId}
            />
            <MainTable
                loading={loading}
                setPage={(page) => setPage(page)}
                setLimit={(limit) => setLimit(limit)}
                limit={limit}
                page={page}
                total={total}
                rows={balanceHistory}
                columns={columns}
            />
        </Paper>
    );
});

export default InternalTransferTable;
