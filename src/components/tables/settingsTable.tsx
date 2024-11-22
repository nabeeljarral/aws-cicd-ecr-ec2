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
import {ISetting} from '@/utils/interfaces/settings.interface';
import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {IColumn} from '@/utils/interfaces/table.interface';
import {IUser} from '@/utils/interfaces/user.interface';

const columns: IColumn[] = [
    // {id: '_id', label: 'ID', minWidth: 15},
    {id: 'category', label: 'Category', minWidth: 150},
    {
        id: 'relatedTo',
        label: 'Username',
        minWidth: 100,
        format: (value: IUser) => value?.username ?? '-',
    },
    {
        id: 'active_upis',
        label: 'Active UPI ID',
        minWidth: 100,
        format: (value: any) =>
            value?.length > 0 ? (
                <ul style={{listStyle: 'disc'}}>
                    {value?.map((upi: any) => upi && <li> {upi?.upi_id}</li>)}
                </ul>
            ) : (
                value?.upi_id
            ),
    },
    {
        id: 'active_upis',
        label: 'Account Name',
        minWidth: 100,
        format: (value: any) =>
            value?.length > 0 ? (
                <ul style={{listStyle: 'disc'}}>
                    {value?.map((upi: any) => upi && <li> {upi?.name}</li>)}
                </ul>
            ) : (
                value?.name
            ),
    },
    {
        id: 'active_upis',
        label: 'Account Number',
        minWidth: 100,
        format: (value: any) =>
            value?.length > 0 ? (
                <ul style={{listStyle: 'disc'}}>
                    {value?.map((upi: any) => upi && <li> {upi?.number}</li>)}
                </ul>
            ) : (
                value?.number
            ),
    },
    {
        id: 'active_upis',
        label: 'UPI IDs',
        minWidth: 100,
        format: (value: IBankAccount[]) => (
            <ul style={{listStyle: 'disc'}}>
                {value?.map((upi: any) => upi && <li> {upi?.upi_id}</li>)}
            </ul>
        ),
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
        format: (_id: string) => <ActionButtons editUrl={EDIT_SETTING_ROUTE(_id)} />,
    },
];

type Props = {
    rows: ISetting[];
};
export default function SettingsTable(props: Props) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const hideSettingDetails = !roles?.length
        ? true
        : !!roles?.includes(RoleEnum.HideSettingDetails);
    const filteredColumns: IColumn[] = columns.filter(
        (col) => !hideSettingDetails || !(col.id === 'active_upis' || col.id === '_id'),
    );
    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <TableContainer sx={{maxHeight: '70vh', minHeight: 300}}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {filteredColumns.map((column, i) => (
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
                                        {filteredColumns.map((column, i) => {
                                            let value;
                                            if (column.id === 'active_upis') {
                                                const active_upis = [];

                                                //If there are ranged-amount upis/banks then push
                                                row?.ranged_upi_list &&
                                                row?.ranged_upi_list?.length > 0
                                                    ? active_upis.push(...row?.ranged_upi_list)
                                                    : [];

                                                //If there are all-ranged-amount upis/banks then push
                                                row?.upi_ids && row?.upi_ids?.length > 0
                                                    ? active_upis.push(...row?.upi_ids)
                                                    : [];
                                                value = active_upis;
                                            } else {
                                                // @ts-ignore
                                                value = row[column.id];
                                            }
                                            return (
                                                <TableCell key={i} align={column.align}>
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
