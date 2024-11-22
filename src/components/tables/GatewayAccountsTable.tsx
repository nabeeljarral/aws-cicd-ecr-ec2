import * as React from 'react';
import {useState} from 'react';
import Paper from '@mui/material/Paper';
import {IColumn} from '@/utils/interfaces/table.interface';
import {DateFormatter} from '@/utils/functions/global';
import MainTable from '@/components/tables/mainTable';
import {IGatewayAccount} from '@/utils/interfaces/gatewayAccount.interface';
import {EDIT_GATEWAY_ACCOUNTS_ROUTE} from '@/utils/endpoints/routes';
import {ActionButtons} from '@/components/main/actionButtons';

interface Props {
    limit: number;
    loading: boolean;
    page: number;
    setLimit: (limit: number) => void;
    setPage: (page: number) => void;
    total: number;
    rows: IGatewayAccount[];
}

const GatewayAccountsTable = (props: Props) => {
    const {loading, rows, limit, setLimit, total, setPage, page} = props;
    const [columns] = useState<IColumn[]>([
        {id: '_id', label: 'ID', minWidth: 100},
        {id: 'name', label: 'Name', minWidth: 100},
        {
            id: 'createdAt',
            label: 'Created at',
            minWidth: 200,
            format: (value: Date) => DateFormatter(value),
        },
        {
            id: '_id',
            label: 'Action',
            minWidth: 170,
            format: (id: string) => <ActionButtons editUrl={EDIT_GATEWAY_ACCOUNTS_ROUTE(id)} />,
        },
    ]);


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
};

export default GatewayAccountsTable;