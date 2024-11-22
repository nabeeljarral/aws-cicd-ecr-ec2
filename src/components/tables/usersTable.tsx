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
import {EDIT_USER_ROUTE} from '@/utils/endpoints/routes';
import {ActionButtons} from '@/components/main/actionButtons';
import {IColumn} from '@/utils/interfaces/table.interface';
import {IUser} from '@/utils/interfaces/user.interface';

type Props = {
    rows: IUser[]
    editPage?: (id: string) => string
}
export default function UsersTable(props: Props) {
    const columns: IColumn[] = [
        {id: '_id', label: 'ID', minWidth: 50},
        {id: 'email', label: 'Email', minWidth: 150},
        {id: 'username', label: 'Username', minWidth: 100},
        {
            id: 'isActive',
            label: 'Is Active',
            minWidth: 100,
            format: (value: boolean) => <YesNoChip value={value} />,
        },
        {
            id: '_id',
            label: 'Action',
            minWidth: 170,
            format: (_id: string) => <ActionButtons
                editUrl={props?.editPage ? props.editPage(_id) : EDIT_USER_ROUTE(_id)} />,
        },
    ];
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
                            {columns.map((column, i) => (
                                <TableCell
                                    key={i}
                                    align={column.align}
                                    // style={{minWidth: column.minWidth}}
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
                                        {columns.map((column, i) => {
                                            // @ts-ignore
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={i} align={column.align}>
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
