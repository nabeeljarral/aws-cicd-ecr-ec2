import {forwardRef, useEffect, useState} from 'react';
import Paper from '@mui/material/Paper';
import {useSelector} from 'react-redux';
import {IUser} from '@/utils/interfaces/user.interface';
import {RootState} from '@/store';
import {IColumn} from '@/utils/interfaces/table.interface';
import {addEllipsis, DateFormatter, PriceFormatter} from '@/utils/functions/global';
import MainTable from '@/components/tables/mainTable';
import {IBalanceHistory} from '@/utils/interfaces/balance.interface';
import {Box} from '@mui/material';
import {RoleEnum} from '@/utils/enums/role';
import {EditBalanceHistoryDialog} from '@/components/dialogs/EditBalanceHistoryDialog';
import {ActionButtonsMain} from '@/components/main/ActionButtonsMain';
import {deleteBalanceHistory} from '@/utils/services/balance';
import {BalanceTypeEnum} from '@/utils/enums/balances.enum';

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

const PayoutTransactionTable = forwardRef((props: Props, ref) => {
    const {loading, balanceHistory, setBalanceHistory, limit, setLimit, total, setPage, page} = props;
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const [columns, setColumns] = useState<IColumn[]>([
        {id: '_id', label: 'ID', minWidth: 100},
        {
            id: 'amount',
            label: 'Amount',
            minWidth: 100,
            format: (value: number) => PriceFormatter(value),
        },
        {id: 'type', label: 'type', minWidth: 100},
        {
            id: 'remarks',
            label: 'Remarks',
            minWidth: 100,
            format: (note: string | undefined) => <Box title={note}>{addEllipsis(note, 20)}</Box>,
        },
        {
            id: 'createdAt',
            label: 'Date',
            minWidth: 200,
            format: (value: Date) => DateFormatter(value),
        },
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
            const filteredBalances = balanceHistory.filter(b => b._id !== id);
            setBalanceHistory(filteredBalances);
        }
    };
    const handleCloseDialog = (balanceH?: IBalanceHistory) => {
        setOpenEditDialog(false);
        setSelectedId(undefined);
        if (balanceH) {
            const updatedBalances = balanceHistory.map(b =>
                b._id === balanceH._id ?
                    {
                        ...b,
                        amount: balanceH.amount,
                        remarks: balanceH.remarks,
                    } : b,
            );
            setBalanceHistory(updatedBalances);
        }
    };


    useEffect(() => {
            const hasLabel = columns.some(c => c.label === 'User Id');
            if (!hasLabel) {
                const newColumns = [...columns];
                newColumns.splice(-1, 0,
                    {
                        id: 'relatedTo',
                        label: 'User Id',
                        minWidth: 150,
                        format: (value: IUser | string) => typeof value === 'string' ? value : value?.username || '',
                    },
                );
                if (roles?.includes(RoleEnum.BalanceControl)) {
                    newColumns.push({
                        id: '_id',
                        label: 'Actions',
                        minWidth: 100,
                        passRow: true,
                        format: (b: IBalanceHistory) =>
                            <ActionButtonsMain
                                item={b._id}
                                showEdit={b.type === BalanceTypeEnum.ManualPayout}
                                showDelete={b.type === BalanceTypeEnum.ManualPayout}
                                deleteFunction={(id: string) => deleteBalanceHistory(id)}
                                handleEditClick={() => handleEditBalanceHistory(b._id)}
                                handleDeleteClick={(id) => setSelectedDeletedId(id)}
                            />,
                    });
                }
                setColumns(newColumns);
            }
        },
        [roles],
    );

    useEffect(() => {
        if (selectedDeletedId) handleDeleteBalanceHistory(selectedDeletedId);
    }, [selectedDeletedId]);

    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <EditBalanceHistoryDialog open={openEditDialog} onClose={handleCloseDialog} id={selectedId} />
            <MainTable
                loading={loading}
                setPage={(page) => setPage(page)}
                setLimit={(limit) => setLimit(limit)}
                limit={limit}
                page={page}
                total={total}
                rows={balanceHistory}
                columns={columns} />
        </Paper>
    );
});

export default PayoutTransactionTable;