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
import {EDIT_BANK_ACCOUNTS_ROUTE} from '@/utils/endpoints/routes';
import {ActionButtons} from '@/components/main/actionButtons';
import {PriceFormatter} from '@/utils/functions/global';
import {IBank, IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import {IVendor} from '@/utils/interfaces/vendor.interface';
import QRCode from 'qrcode.react';
import {IColumn} from '@/utils/interfaces/table.interface';

type Props = {
    rows: IBankAccount[]
    hideBankAccountDetails: boolean
}
export default function BankAccountTable(props: Props) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    let columns: IColumn[] = [
        // {id: '_id', label: 'ID', minWidth: 15},
        {id: 'bankId', label: 'Bank', minWidth: 150, format: (value: IBank) => value?.name},
        {id: 'upi_id', label: 'UPI ID', minWidth: 150},
        {id: 'name', label: 'Name', minWidth: 150},
        {id: 'number', label: 'Number', minWidth: 150},
        {
            id: 'vendorId',
            label: 'Vendor',
            minWidth: 150,
            format: (value: IVendor) => value?.name,
        },
        {
            id: 'incomes_today',
            label: 'Revenue',
            minWidth: 150,
            format: (value: number) => PriceFormatter(value),
        },
    ];

    if (!props.hideBankAccountDetails) {
        columns.push({
            id: 'daily_limit',
            label: 'Daily Limit',
            minWidth: 150,
            format: (value: number) => PriceFormatter(value),
        });
    }

    columns.push(
        {
            id: 'is_active',
            label: 'Is Active',
            align: 'center',
            minWidth: 100,
            format: (value: boolean) => <YesNoChip value={value} />,
        },
        {
            id: 'qrcode_url',
            label: 'QR Code',
            align: 'center',
            minWidth: 100,
            format: (value: string) => value ?
                <QRCode value={value} size={50} /> :
                'No IMG',
        },
        {
            id: '_id',
            label: 'Action',
            minWidth: 130,
            format: (id: string) => <ActionButtons editUrl={EDIT_BANK_ACCOUNTS_ROUTE(id)} />,
        },
    );

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
                                                    {column.format
                                                        ? column.format(value)
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
