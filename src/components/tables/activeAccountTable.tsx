import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import YesNoChip from '@/components/main/yesNoChip';
import {EDIT_SETTING_ROUTE} from '@/utils/endpoints/routes';
import {ActionButtons} from '@/components/main/actionButtons';
import {PriceFormatter} from '@/utils/functions/global';
import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import {ISetting} from '@/utils/interfaces/settings.interface';
import {IColumn} from '@/utils/interfaces/table.interface';

const columns: readonly IColumn[] = [
    {id: 'category', label: 'Category', minWidth: 150},
    {
        id: 'active_upi_id',
        label: 'Active UPI ID',
        minWidth: 100,
        format: (value: IBankAccount) => value?.upi_id,
    },
    {
        id: 'active_upi_id',
        label: 'Active Account Name',
        minWidth: 100,
        format: (value: IBankAccount) => value?.name,
    },
    {
        id: 'active_upi_id',
        label: 'Today Incomes',
        minWidth: 100,
        format: (value: IBankAccount) => PriceFormatter(value.incomes_today || 0),
    },
    {
        id: 'active_upi_id',
        label: 'Max Daily Limit',
        minWidth: 100,
        format: (value: IBankAccount) => PriceFormatter(value.daily_limit || 0),
    },
    {
        id: 'is_active',
        label: 'Is Active',
        minWidth: 100,
        format: (value: boolean) => <YesNoChip value={value} />,
    },
    {
        id: '_id',
        label: 'Action',
        minWidth: 170,
        format: (value: string) => <ActionButtons editUrl={EDIT_SETTING_ROUTE(value)} />,
    },
];

type Props = {
    rows: ISetting[];
};

export default function ActiveAccountTable(props: Props) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <TableContainer sx={{maxHeight: '70vh', minHeight: 300}}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{minWidth: column.minWidth}}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, i) => {
                                
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                                        {columns.map((column) => {
                                            // @ts-ignore
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format ? column.format(value) : value}
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
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={props.rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
