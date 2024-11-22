import {forwardRef} from 'react';
import Paper from '@mui/material/Paper';
import {DateFormatter} from '@/utils/functions/global';
import MainTable from '@/components/tables/mainTable';
import {ILogger} from '@/utils/interfaces/logger.interface';

interface Props {
    limit: number;
    loading: boolean;
    page: number;
    setLimit: (limit: number) => void;
    setPage: (page: number) => void;
    total: number;
    rows: ILogger[];
}

const LogsTable = forwardRef((props: Props, ref) => {
    const {loading, rows, limit, setLimit, total, setPage, page} = props;
    const columns = [
        {id: '_id', label: 'ID', minWidth: 100},
        {id: 'status', label: 'Status', minWidth: 200},
        {id: 'msg', label: 'Message', minWidth: 200},
        {id: 'data', label: 'Body Data', minWidth: 200},
        {
            id: 'createdAt',
            label: 'Date',
            minWidth: 200,
            format: (value: Date) => DateFormatter(value),
        },
    ];


    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <MainTable
                loading={loading}
                setPage={(page) => setPage(page)}
                setLimit={(limit) => setLimit(limit)}
                limit={limit}
                page={page}
                total={total}
                rows={rows}
                columns={columns} />
        </Paper>
    );
});

export default LogsTable;