import {Dispatch, SetStateAction, useState} from 'react';
import Paper from '@mui/material/Paper';
import {IColumn} from '@/utils/interfaces/table.interface';
import {DateFormatter, PriceFormatter} from '@/utils/functions/global';
import MainTable from '@/components/tables/mainTable';
import {IBankStatementFile} from '@/utils/interfaces/bankStatementFile.interface';
import {IBank} from '@/utils/interfaces/bankAccount.interface';

interface Props {
    limit: number;
    loading: boolean;
    page: number;
    setLimit: (limit: number) => void;
    setPage: (page: number) => void;
    setSelectedTransactions: Dispatch<SetStateAction<any[]>>;
    total: number;
    transactions: IBankStatementFile[];
}

const BankStatementFileTable = (props: Props) => {
    const {loading, transactions, limit, setLimit, total, setPage, page} = props;
    const [columns] = useState<IColumn[]>([
        {id: '_id', label: 'ID', minWidth: 100},
        {
            id: 'filename',
            label: 'File Name',
            minWidth: 150,
        },
        {id: 'bankId', label: 'Bank', minWidth: 100, format: (value: IBank) => value.name},
        {id: 'account_number', label: 'Account Number', minWidth: 150},
        {id: 'size', label: 'Size', minWidth: 100, format: (value: number) => PriceFormatter(value)},
        {id: 'url', label: 'URL', align: 'center', minWidth: 100},
        {id: 'type', label: 'Type', minWidth: 150},
        {
            id: 'updatedAt',
            label: 'Updated at',
            minWidth: 200,
            passRow: true,
            format: (t: IBankStatementFile) => DateFormatter(t.updatedAt),
        },
        {
            id: 'createdAt', label: 'Created at', minWidth: 200, format: (value: Date) => DateFormatter(value),
        },
    ]);

    return (<Paper sx={{width: '100%', overflow: 'hidden'}}>
        <MainTable
            loading={loading}
            checkboxSelection={true}
            alwaysShowCheckboxSelection={true}
            setSelectedTransactions={props.setSelectedTransactions}
            setPage={(page) => setPage(page)}
            setLimit={(limit) => setLimit(limit)}
            limit={limit}
            page={page}
            total={total}
            rows={transactions}
            columns={columns} />
    </Paper>);
};

export default BankStatementFileTable;