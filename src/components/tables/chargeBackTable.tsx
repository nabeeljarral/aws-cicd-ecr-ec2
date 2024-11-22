import {forwardRef, useEffect, useState} from 'react';
import Paper from '@mui/material/Paper';
import {useSelector} from 'react-redux';
import {IUser} from '@/utils/interfaces/user.interface';
import {RootState} from '@/store';
import {IColumn} from '@/utils/interfaces/table.interface';
import {addEllipsis, DateFormatter} from '@/utils/functions/global';
import MainTable from '@/components/tables/mainTable';
import {IBalanceHistory} from '@/utils/interfaces/balance.interface';
import {Box, Typography} from '@mui/material';
import {EditBalanceHistoryDialog} from '@/components/dialogs/EditBalanceHistoryDialog';
import {BalanceTypeEnum} from '@/utils/enums/chargeBack-internalTransfer';
interface Props {
    limit: number;
    loading: boolean;
    page: number;
    setLimit: (limit: number) => void;
    setPage: (page: number) => void;
    total: number;
    balanceHistory: IBalanceHistory[];
    setBalanceHistory: (balances: IBalanceHistory[]) => void;
}

const ChargeBackTable = forwardRef((props: Props, ref) => {
    const {loading, balanceHistory, setBalanceHistory, limit, setLimit, total, setPage, page} =
        props;
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const [columns, setColumns] = useState<IColumn[]>([
        {
            id: 'createdAt',
            label: 'Date',
            minWidth: 200,
            format: (value: Date) => DateFormatter(value),
        },
        {id: '_id', label: 'ID', minWidth: 100},

        {id: 'order_id', label: 'Order ID', minWidth: 100},
        {
            id: 'amount',
            label: 'Amount',
            minWidth: 100,
            passRow: true,
            format: (value: IBalanceHistory) =>
    
                    value.userType === 'sender' ||
                        (value?.type as any) === BalanceTypeEnum?.ChargeBack
                        ? value?.amount
                        : '-',
             
        },

        {
            id: 'fromUser',
            label: 'Client Name',
            minWidth: 150,
            format: (value: IUser | string) =>
                typeof value === 'string' ? value : value?.username || '',
        },
        {
            id: 'remarks',
            label: 'Remarks',
            minWidth: 250,
            format: (note: string | undefined) => <Box title={note}>{addEllipsis(note, 50)}</Box>,
        }
    ]);
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
    const [selectedDeletedId, setSelectedDeletedId] = useState<string | undefined>();
    const [selectedId, setSelectedId] = useState<string | undefined>();

    const handleEditBalanceHistory = (id: string) => {
        setSelectedId(id);
        setOpenEditDialog(true);
    };
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
                    ? {
                          ...b,
                          amount: balanceH.amount,
                          remarks: balanceH.remarks,
                      }
                    : b,
            );
            setBalanceHistory(updatedBalances);
        }
    };

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

export default ChargeBackTable;
