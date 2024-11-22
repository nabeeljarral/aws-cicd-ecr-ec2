import {forwardRef, useEffect, useState,SetStateAction,Dispatch } from 'react';
import Paper from '@mui/material/Paper';
import {IColumn} from '@/utils/interfaces/table.interface';
import {DateFormatter, PriceFormatter} from '@/utils/functions/global';
import {TableActions} from '@/components/filter/main/TableActions';
import {IBatch, RowData} from '@/utils/interfaces/batch.interface';
import {CloudDownload} from '@mui/icons-material';
import {IComment} from '@/utils/dto/transactions.dto';
import {CommentActions} from '@/components/main/CommentActions';
import {CommentsDialog} from '@/components/dialogs/CommentsDialog';
import {RoleEnum} from '@/utils/enums/role';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import SingleSelectTable from './singleSelectTable';

interface Props {
    limit: number;
    loading: boolean;
    page: number;
    setLimit: (limit: number) => void;
    setPage: (page: number) => void;
    total: number;
    rows: IBatch[];
    exportReport: (batch: IBatch) => void;
    setRowData?: Dispatch<SetStateAction<RowData | null>>;
    rowData?: RowData | null;
}

const BatchesTable = forwardRef((props: Props, ref) => {
    const {loading, rows, limit, setLimit, total, setPage, page,setRowData,rowData} = props;
    const [batch, setBatch] = useState<IBatch>();
    const [comments, setComments] = useState<IComment[]>();
    const [showComments, setShowComments] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);
    const roles = user?.roles;
    const [columns, setColumns] = useState<IColumn[]>([
        {id: '_id', label: 'ID', minWidth: 100},
        {id: 'name', label: 'Name', minWidth: 100},
        {id: 'amount', label: 'Amount', minWidth: 100, format: (a: string) => PriceFormatter(a)},
        {id: 'transactionCount', label: 'Count', minWidth: 100},
        {
            id: 'relatedTo',
            label: 'Username',
            align: 'center',
            minWidth: 200,
            passRow: true,
            format: (row: {relatedTo?: {username?: string}}) => row.relatedTo?.username ?? '',
        },
        {
            id: 'createdAt',
            label: 'Created at',
            minWidth: 200,
            format: (value: Date) => DateFormatter(value),
        },
        {
            id: 'comments',
            label: 'Comment',
            align: 'center',
            minWidth: 200,
            passRow: true,
            format: (row: IBatch) => <CommentActions batch={row} onShow={openShowComments} />,
        },
        {
            id: 'id',
            label: 'Action',
            minWidth: 170,
            passRow: true,
            format: (item: IBatch) =>
                (!item.isExported || roles?.includes(RoleEnum.CanExportUnlimitedBatches) ) && (
                    <TableActions
                        item={item}
                        viewIcon={<CloudDownload />}
                        viewText="Export"
                        hideEdit
                        handleViewClick={(t) => setBatch(t)}
                        disabled={!roles?.includes(RoleEnum.AddCommentBatch)}
                    />
                ),
        },
    ]);

    const openShowComments = (comments?: IComment[]) => {
        setComments(comments);
        setShowComments(true);
    };
    const closeShowComments = () => {
        setComments(undefined);
        setShowComments(false);
    };

    useEffect(() => {
        if (batch) props.exportReport(batch);
    }, [batch]);

    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <CommentsDialog
                comments={comments ?? []}
                open={showComments}
                onClose={closeShowComments}
            />
            <SingleSelectTable
                loading={loading}
                setPage={(page) => setPage(page)}
                setLimit={(limit) => setLimit(limit)}
                limit={limit}
                page={page}
                total={total}
                rows={rows}
                columns={columns}
                alwaysShowCheckboxSelection={true}
                checkboxSelection
                singleCheckBoxSelect={true}
                setRowData={setRowData}
                rowData={rowData}
                disableHeaderCheckbox
            />
        </Paper>
    );
});

export default BatchesTable;
