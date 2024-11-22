import * as React from 'react';
import {useState} from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import YesNoChip from '@/components/main/yesNoChip';
import {DateFormatter, PriceFormatter} from '@/utils/functions/global';
import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import {IBankTransaction} from '@/utils/interfaces/bankTransaction.interface';
import {IColumn} from '@/utils/interfaces/table.interface';
import {RootState} from '@/store';
import {useSelector} from 'react-redux';
import {RoleEnum} from '@/utils/enums/role';
import {ActionButtonsByFunction} from '@/components/main/actionButtonsByFunction';
import awesomeAlert from '@/utils/functions/alert';
import {IUpdateBankTransaction, updateBankTransaction} from '@/utils/services/bankTransactions';
import {ClaimTransactionDialog} from '@/components/dialogs/ClaimTransactionDialog';
import {HttpStatusCode} from 'axios';

interface Props {
    loading: boolean;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setTransactions?: (limit: IBankTransaction[]) => void;
    page: number;
    total: number;
    limit: number;
    transactions: IBankTransaction[];
}

export default function StatementRecordTable(props: Props) {
    let columns: IColumn[] = [
        {id: 'id', label: 'ID', minWidth: 15},
        // {
        //     id: 'bank',
        //     label: 'Bank Name',
        //     minWidth: 150,
        //     format: (value: { name: BanksEnum }) => value?.name
        // },
        {
            id: 'bank_account',
            label: 'Account Name',
            minWidth: 200,
            format: (value: IBankAccount) => value?.name,
        },
        {
            id: 'transaction',
            label: 'Transaction Date',
            minWidth: 200,
            format: (value: {_id: string; date: Date; info: string}) => DateFormatter(value.date),
        },
        {id: 'utr', label: 'UTR', minWidth: 200},
        {
            id: 'transaction',
            label: 'Transaction',
            minWidth: 400,
            format: (value: {_id: string; date: Date; info: string}) => value.info,
        },
        {
            id: 'amount',
            label: 'Amount',
            minWidth: 100,
            format: (value: number) => PriceFormatter(value),
        },
        {
            id: 'is_claimed',
            label: 'Is Claimed',
            minWidth: 100,
            format: (value: boolean) => <YesNoChip value={value} />,
        },
        // {id: 'reason', label: 'Reason', minWidth: 100},
        {
            id: 'createdAt',
            label: 'Date',
            minWidth: 200,
            format: (value: Date) => DateFormatter(value),
        },
    ];
    const [claimTransactionDialog, setClaimTransactionDialog] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    if (roles && roles?.includes(RoleEnum.ControlBankTransaction)) {
        columns = [
            ...columns,
            {id: 'related_transaction_id', label: 'Related T ID', minWidth: 100},
            {
                id: 'id',
                label: 'Action',
                minWidth: 100,
                passRow: true,
                format: (bt: IBankTransaction) =>
                    !bt.is_claimed && (
                        <ActionButtonsByFunction
                            editAction={() => openClaimTransactionDialog(bt.id)}
                        />
                    ),
            },
        ];
    }
    const openClaimTransactionDialog = (id: string) => {
        console.log({id});
        setClaimTransactionDialog(true);
        setTransactionId(id);
    };
    const closeClaimTransactionDialog = (payload: IUpdateBankTransaction) => {
        setClaimTransactionDialog(false);
        const {
            id,
            crete_dummy_transaction,
            category = 'P1',
            related_transaction_id,
            relatedTo,
            orderId,
        } = payload;
        if (related_transaction_id || crete_dummy_transaction) {
            const payloadData = crete_dummy_transaction
                ? {id, crete_dummy_transaction, relatedTo, category, orderId}
                : {id, related_transaction_id};

            updateBankTransaction(payloadData)
                .then(async (res) => {
                    if (
                        res.related_transaction_id === related_transaction_id ||
                        (crete_dummy_transaction && res.status != HttpStatusCode.Conflict)
                    ) {
                        if(res?.related_transaction_id) {
                            awesomeAlert({
                                msg: `Blocked Successfully, Transaction Id ${res.related_transaction_id}`,
                            });
                            const newTransactions = props.transactions?.map((t) =>
                                t.id === id
                                    ? {
                                        ...t,
                                        is_claimed: true,
                                        related_transaction_id: res.related_transaction_id,
                                    }
                                    : t,
                            );

                            if (props.setTransactions) {
                                props.setTransactions(newTransactions);
                            }
                        }
                    }
                })
                .catch((err) => err);
        }
    };
    const handleChangePage = (event: unknown, newPage: number) => {
        props.setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setLimit(+event.target.value);
        props.setPage(0);
    };

    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <ClaimTransactionDialog
                transactionId={transactionId}
                open={claimTransactionDialog}
                onClose={closeClaimTransactionDialog}
            />
            <TableContainer sx={{maxHeight: '70vh', minHeight: 300}}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column, i) => (
                                <TableCell
                                    key={column.id + i}
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
                                            <TableCell key={i + column.id} align={column.align}>
                                                {column.format
                                                    ? column.format(column.passRow ? row : value)
                                                    : value}
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
