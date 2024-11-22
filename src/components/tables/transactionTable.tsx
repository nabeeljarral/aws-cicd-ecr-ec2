import * as React from 'react';
import {useEffect, useState} from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import StatusChip from '@/components/main/statusChip';
import {ITransaction} from '@/utils/interfaces/transaction.interface';
import {TransactionStatusEnum} from '@/utils/enums/transactionStatus';
import {ISetting} from '@/utils/interfaces/settings.interface';
import {DateFormatter, PriceFormatter} from '@/utils/functions/global';
import {IColumn} from '@/utils/interfaces/table.interface';
import {TransactionActionButtons} from '@/components/main/transactionActionButtons';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {EditTransactionDialog} from '@/components/dialogs/editTransactionDialog';
import Box from '@mui/material/Box';
import {TransactionStatusDialog} from '@/components/dialogs/transactionStatusDialog';
import {IUser} from '@/utils/interfaces/user.interface';
import {BankTypesEnum, BankTypesEnumValue} from '@/utils/enums/bankTypes.enum';
import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';

interface Props {
    loading: boolean;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    page: number;
    total: number;
    limit: number;
    transactions: ITransaction[];
}

export default function TransactionTable(props: Props) {
    const [columns, setColumns] = useState<IColumn[]>([
        {id: '_id', label: 'ID', minWidth: 100},
        {id: 'utr', label: 'UTR', minWidth: 100},
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
            format: (value: TransactionStatusEnum) => <StatusChip status={value} />,
        },
        // {id: 'message', label: 'Message', minWidth: 100},
        {
            id: 'setting',
            label: 'Category',
            minWidth: 100,
            format: (value: ISetting) => value?.category,
        },
        {id: 'order_id', label: 'Order ID', minWidth: 100},
        {
            id: 'updatedAt',
            label: 'Updated at',
            minWidth: 200,
            passRow: true,
            format: (t: ITransaction) =>
                <Box sx={{cursor: 'pointer'}} onClick={() => openStatusUpdatesDialog(t)}>
                    {DateFormatter(t.updatedAt)}
                </Box>,
        },
        {
            id: 'createdAt',
            label: 'Date',
            minWidth: 200,
            format: (value: Date) => DateFormatter(value),
        },
    ]);

    const user = useSelector((state: RootState) => state.auth.user);
    const roles = user?.roles;
    const [selectedTransaction, setSelectedTransaction] = useState<ITransaction>();
    const [id, setId] = useState('');
    const [showStatusUpdatesDialog, setShowStatusUpdatesDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const handleChangePage = (event: unknown, newPage: number) => {
        props.setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setLimit(+event.target.value);
        props.setPage(0);
    };
    const openEditDialog = (id: string) => {
        setId(id);
        setShowEditDialog(true);
    };
    const closeEditDialog = (transaction?: ITransaction) => {
        if (transaction && props.transactions) {
            for (let i = 0; i < props.transactions.length; i++) {
                if (props.transactions[i]._id === transaction._id) {
                    props.transactions[i] = transaction;
                    break;
                }
            }
        }
        setId('');
        setShowEditDialog(false);
    };
    const openStatusUpdatesDialog = (transaction?: ITransaction) => {
        setSelectedTransaction(transaction);
        setShowStatusUpdatesDialog(true);
    };
    const closeStatusUpdatesDialog = () => {
        setSelectedTransaction(undefined);
        setShowStatusUpdatesDialog(false);
    };

    useEffect(() => {
            const hasActionLabel = columns.some(c => c.label === 'Action');
            if (!hasActionLabel) {

                const ourUsersData = !roles?.includes(RoleEnum.UserControl) ? [] : [
                    {id: 'external_ref', label: 'Ref.', minWidth: 100},
                    {
                        id: 'bank_type',
                        label: 'Bank Type',
                        minWidth: 150,
                        format: (value: BankTypesEnum) => `${BankTypesEnumValue[value ?? 0]}`,
                    },
                    {
                        id: 'bank_account',
                        label: 'Account Name',
                        minWidth: 150,
                        format: (value: IBankAccount) => `${value?.name}`,
                    },
                ];
                const editTransactionData = !roles?.includes(RoleEnum.EditTransactions) ? [] : [
                    {
                        id: '_id',
                        label: 'Action',
                        minWidth: 170,
                        passRow: true,
                        format: (transaction: ITransaction) => <TransactionActionButtons
                            transaction={transaction}
                            handleEditClick={(id) => openEditDialog(id)}
                            handleViewClick={(t) => openStatusUpdatesDialog(t)}
                        />,
                    },
                ];
                if (!user?.isCompany) {
                    setColumns([
                        {
                            id: 'relatedTo',
                            label: 'User Id',
                            minWidth: 150,
                            format: (value: IUser) => value?.username || '',
                        },
                        ...columns,
                        ...ourUsersData,
                        ...editTransactionData,
                    ]);
                } else {
                    setColumns([
                        ...columns,
                        ...ourUsersData,
                        ...editTransactionData,
                    ]);
                }
            }
        },
        [roles],
    );

    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <EditTransactionDialog
                id={id}
                open={showEditDialog}
                onClose={closeEditDialog}
            />
            <TransactionStatusDialog
                transaction={selectedTransaction}
                open={showStatusUpdatesDialog}
                onClose={closeStatusUpdatesDialog}
            />
            <TableContainer sx={{maxHeight: '70vh', minHeight: 300}}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column, i) => (
                                <TableCell
                                    key={i}
                                    align={column.align}
                                    style={{minWidth: column.minWidth}}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.transactions?.map((row, i) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                                    {columns.map((column, i) => {
                                        // @ts-ignore
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={i + '2'} align={column.align}>
                                                {
                                                    column.format
                                                        ? column.format(column.passRow ? row : value)
                                                        : value
                                                }
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={props.total}
                rowsPerPage={props.limit}
                page={props.page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
