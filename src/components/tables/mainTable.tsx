import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {ChangeEvent, Dispatch, forwardRef, SetStateAction, useImperativeHandle} from 'react';
import {IColumn} from '@/utils/interfaces/table.interface';
import DataNotFoundTableRow from '@/components/alerts/DataNotFoundTableRow';
import {Checkbox} from '@mui/material';
import {IPayoutTransaction} from '@/utils/dto/transactions.dto';
import {PayoutTransactionStatusEnum} from '@/utils/enums/transactionStatus';
import {PageLoader} from '../main/pageLoader';
import {useRouter} from 'next/router';
import {SETTINGS_ROUTE} from '@/utils/endpoints/routes';

interface Props {
    columns: IColumn[];
    limit: number;
    checkboxSelection?: boolean;
    setSelectedRows?: (t: (any & {_id: string})[]) => void;
    loading: boolean;
    alwaysShowCheckboxSelection?: boolean;
    page: number;
    setLimit: (limit: number) => void;
    setPage: (page: number) => void;
    total: number;
    rows: (any & {_id: string})[];
    setSelectedTransactions?: Dispatch<SetStateAction<IPayoutTransaction[]>>;
    selectedTransactions?: IPayoutTransaction[];
    height?: string;
    payIn?: string;
    background?: any;
}

const MainTable = forwardRef((props: Props, ref) => {
    const {columns, setSelectedTransactions, selectedTransactions, rows, payIn, background} = props;
    // const [selectedTransactions, setSelectedTransactions] = useState<IPayoutTransaction[]>([]);
    const router = useRouter();
    useImperativeHandle(ref, () => ({
        resetSelectedTransactions() {
            if (setSelectedTransactions) {
                setSelectedTransactions([]);
            }
            props?.setSelectedRows && props?.setSelectedRows([]);
        },
    }));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const handleChangePage = (event, newPage: number) => props.setPage(newPage);
    const handleRowSelect = (row: IPayoutTransaction) => {
        if (setSelectedTransactions) {
            setSelectedTransactions((old) => {
                let newVal: IPayoutTransaction[] = [];
                if (old.some((selectedRow) => selectedRow._id === row._id)) {
                    newVal = old.filter((selectedRow) => selectedRow._id !== row._id);
                } else {
                    newVal = [...old, row];
                }
                // if(props?.setSelectedRows) props?.setSelectedRows(newVal)
                return newVal;
            });
        }
    };
    const handleRowsSelect = () => {
        if (setSelectedTransactions) {
            setSelectedTransactions((old) => {
                let newVal: IPayoutTransaction[] = old;
                const allSelected2 = allSelected();
                for (const row of initiateRows) {
                    const rowSelected = old.some((selectedRow) => selectedRow._id === row._id);
                    if (allSelected2 && rowSelected) {
                        newVal = newVal.filter((selectedRow) => selectedRow._id !== row._id);
                    } else if (!allSelected2 && !rowSelected) {
                        newVal = [...newVal, row];
                    }
                }
                // if(props?.setSelectedRows) props?.setSelectedRows(newVal)
                return newVal;
            });
        }
    };
    const hasRow = (row: IPayoutTransaction) => {
        return selectedTransactions?.some(
            (selectedRow) => selectedRow._id === (row as IPayoutTransaction)?._id,
        );
    };
    const initiateTransactions = (rows: any[]) =>
        props.checkboxSelection
            ? props.rows?.filter(
                  (row) =>
                      props.alwaysShowCheckboxSelection ||
                      (row.status === PayoutTransactionStatusEnum.initiate && !row.is_processing),
              )
            : [];
    const initiateRows = props.checkboxSelection ? initiateTransactions(props.rows) : [];
    const allSelected: () => boolean = () => {
        const selectedIds = selectedTransactions?.map((t) => t._id);
        return (
            !!initiateRows.length &&
            initiateRows.every((row: IPayoutTransaction) => selectedIds?.includes(row?._id))
        );
    };
    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        props.setLimit(+event.target.value);
        props.setPage(0);
    };

    const tableRowData = (row: any) => {
        if (payIn === 'payin') {
            localStorage.setItem('id', row?.userId);
            // router.push(SETTINGS_ROUTE,'_blank')
            window.open(SETTINGS_ROUTE, '_blank');
        }
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
                                                checked={allSelected()}
                                                onChange={() => handleRowsSelect()}
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
                                                style={{cursor: payIn ? 'pointer' : ''}}
                                                onClick={() => tableRowData(row)}
                                            >
                                                {props.checkboxSelection && (
                                                    <TableCell key={'2' + i}>
                                                        {(props.alwaysShowCheckboxSelection ||
                                                            (row.status ===
                                                                PayoutTransactionStatusEnum.initiate &&
                                                                !row.is_processing)) && (
                                                            <Checkbox
                                                                checked={hasRow(row)}
                                                                onChange={() =>
                                                                    handleRowSelect(
                                                                        row as IPayoutTransaction,
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </TableCell>
                                                )}
                                                {columns.map((column, i) => {
                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                    // @ts-ignore
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell
                                                            key={'2' + i}
                                                            align={column?.align}
                                                            sx={{
                                                                // color:'white',
                                                                background: props.background
                                                                    ? row.status === 1
                                                                        ? '#fff'
                                                                        : row.status === 2
                                                                        ? '#b4ffd3' // Light green
                                                                        : row.status === 3
                                                                        ? '#ffd1d5' // Light red
                                                                        : parseFloat(
                                                                              row.successRate,
                                                                          ) < 30
                                                                        ? '#CBF1F5'
                                                                        : ''
                                                                    : parseFloat(row.successRate) <
                                                                      30
                                                                    ? '#CBF1F5'
                                                                    : '',
                                                                p:
                                                                    parseFloat(row.successRate) < 30
                                                                        ? 2
                                                                        : null,
                                                                animation:
                                                                    parseFloat(row.successRate) < 30
                                                                        ? 'dropShadowAnimation 1s linear infinite'
                                                                        : '',
                                                            }}
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
export default MainTable;
