import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {
    ChangeEvent,
    Dispatch,
    forwardRef,
    SetStateAction,
    useImperativeHandle,
    useState,
} from 'react';
import {IColumn} from '@/utils/interfaces/table.interface';
import DataNotFoundTableRow from '@/components/alerts/DataNotFoundTableRow';
import {Checkbox} from '@mui/material';
import {PageLoader} from '../main/pageLoader';
import {SETTINGS_ROUTE} from '@/utils/endpoints/routes';
import { RowData } from '@/utils/interfaces/batch.interface';

interface Props {
    columns: IColumn[];
    limit: number;
    checkboxSelection?: boolean;
    loading: boolean;
    alwaysShowCheckboxSelection?: boolean;
    page: number;
    setLimit: (limit: number) => void;
    setPage: (page: number) => void;
    total: number;
    rows: (any & {_id: string})[];
    singleCheckBoxSelect?: boolean;
    setRowData?: Dispatch<SetStateAction<RowData | null>>;
    rowData?: RowData | null;
    height?: string;
    background?: any;
    disableHeaderCheckbox?: boolean;
}

const SingleSelectTable = forwardRef((props: Props, ref) => {
    const {
        columns,
        singleCheckBoxSelect,
        setRowData,
        rowData,
        rows,
        disableHeaderCheckbox,
    } = props;
    const [selectedRow, setSelectedRow] = useState<any | null>(rowData || null);

    useImperativeHandle(ref, () => ({
        resetRowData() {
            setSelectedRow(null);
            setRowData?.(null);
        },
    }));

    const handleChangePage = (event: unknown, newPage: number) => props.setPage(newPage);

    const handleRowSelect = (row: any) => {
        if (singleCheckBoxSelect) {
            const newSelection = selectedRow?._id === row._id ? null : row;
            setSelectedRow(newSelection);
            setRowData?.(newSelection);
        }
    };

    const isChecked = (row: any) => {
        return singleCheckBoxSelect && selectedRow?._id === row._id;
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        props.setLimit(+event.target.value);
        props.setPage(0);
    };

    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            {props.loading ? (
                <PageLoader />
            ) : (
                <>
                    <TableContainer
                        sx={{
                            maxHeight:
                                rows?.length > 0
                                    ? props.height !== 'maxHless'
                                        ? '70vh'
                                        : 350
                                    : props.height !== 'maxHless'
                                    ? '70vh'
                                    : 220,
                            minHeight:
                                rows?.length > 0
                                    ? props.height !== 'maxHless'
                                        ? 300
                                        : 350
                                    : props.height !== 'maxHless'
                                    ? 300
                                    : 220,
                        }}
                    >
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {props.checkboxSelection && (
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedRow !== null}
                                                onChange={() => {
                                                    const newSelection = selectedRow
                                                        ? null
                                                        : rows[0];
                                                    setSelectedRow(newSelection);
                                                    setRowData?.(newSelection);
                                                }}
                                                sx={{
                                                    visibility: disableHeaderCheckbox
                                                        ? 'hidden'
                                                        : undefined,
                                                }}
                                            />
                                        </TableCell>
                                    )}
                                    {columns.map((column, i) => (
                                        <TableCell
                                            key={i}
                                            align={column?.align}
                                            style={{minWidth: column.minWidth}}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {!!props.rows?.length &&
                                    props.rows?.map((row, i) => {
                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={i}
                                            >
                                                <TableCell key={'2' + i}>
                                                    {props.alwaysShowCheckboxSelection && (
                                                        <Checkbox
                                                            checked={isChecked(row)}
                                                            onChange={() => handleRowSelect(row)}
                                                            sx={{
                                                                visibility:
                                                                    row?.comments?.length > 0 ||
                                                                    row?.isSplitted === true
                                                                        ? 'hidden'
                                                                        : 'visible',
                                                            }}
                                                        />
                                                    )}
                                                </TableCell>

                                                {columns.map((column, i) => {
                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                    // @ts-ignore
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell
                                                            key={'2' + i}
                                                            align={column?.align}
                                                        >
                                                            {column.format
                                                                ? column.format(
                                                                      column.passRow ? row : value,
                                                                  )
                                                                : value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                                {!props.loading && !props.rows?.length && (
                                    <DataNotFoundTableRow colSpan={columns.length} />
                                )}
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
                </>
            )}
        </Paper>
    );
});

export default SingleSelectTable;
