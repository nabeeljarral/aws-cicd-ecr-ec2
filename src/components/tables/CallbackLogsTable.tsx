import {forwardRef} from 'react';
import Paper from '@mui/material/Paper';
import MainTable from '@/components/tables/mainTable';
import {IAttemptsResponsePayload, ICallbackLog} from '@/utils/interfaces/logger.interface';
import YesNoChip from '@/components/main/yesNoChip';
import {DateFormatter} from '@/utils/functions/global';

interface Props {
    limit: number;
    loading: boolean;
    page: number;
    setLimit: (limit: number) => void;
    setPage: (page: number) => void;
    total: number;
    rows: ICallbackLog[];
}

const LogsTable = forwardRef((props: Props, ref) => {
    const {loading, rows, limit, setLimit, total, setPage, page} = props;
    const columns = [
        {id: '_id', label: 'ID', minWidth: 100},
        {id: 'callbackUrl', label: 'callbackUrl', minWidth: 200},
        {id: 'transactionId', label: 'transactionId', minWidth: 200},
        {id: 'type', label: 'type', minWidth: 200},
        {id: 'requestPayload', label: 'requestPayload', minWidth: 200},
        {id: 'responsePayload', label: 'responsePayload', minWidth: 200},
        {id: 'success', label: 'Is Success', minWidth: 200, format: (value: boolean) => <YesNoChip value={value} />},
        {id: 'retryAttempts', label: 'retryAttempts', minWidth: 200},
        {
            id: 'attemptsResponsePayload',
            label: 'Attempts Response Payload',
            minWidth: 300,
            format: (res: IAttemptsResponsePayload[]) =>
                res && res.map((r) => <>{r.response} | {DateFormatter(r.date)},</>),
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