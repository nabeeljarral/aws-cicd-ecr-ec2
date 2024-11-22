import {useState,useEffect} from 'react';
import Paper from '@mui/material/Paper';
import {IColumn} from '@/utils/interfaces/table.interface';
import MainTable from '@/components/tables/mainTable';
import { IPayInOutFilter } from '@/utils/interfaces/payInOut.interface';
import { RoleEnum } from '@/utils/enums/role';
import {RootState} from '@/store';
import { useSelector } from 'react-redux';

interface Props {
    limit: number;
    loading: boolean;
    page: number;
    setLimit: (limit: number) => void;
    setPage: (page: number) => void;
    total: number;
    payData: IPayInOutFilter[];
    payIn:string;
    height?:string;
}
const PayInOutFileTable = (props: Props) => {
    const {loading, payData, limit, setLimit, total, setPage, page,height,payIn} = props;
    const [columns,setColumns] = useState<IColumn[]>([])
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;

    

    useEffect(() => {
        const commonColumns = [
            { id: 'userName', label: 'Client Name', minWidth: 100 }
        ];

        const columnsForPayIn = [
            { id: 'successAmount', label: 'Total', minWidth: 150 },
            { id: 'successRate', label: 'Success Rate', minWidth: 100 },
            { id: 'successCount', label: 'Success', minWidth: 100 },
            { id: 'totalCount', label: 'Total Attempts', minWidth: 100 },
            { id: 'bankAccount', label: 'Account Name', minWidth: 100 }
        ];

        const columnsForOther = [
            { id: 'initiateAmount', label: 'Initiate Amount', minWidth: 150 },
            { id: 'successAmount', label: 'Success Amount', minWidth: 100 },
            { id: 'failedAmount', label: 'Failed Amount', minWidth: 150 },
        ];

        const roleCondition = roles?.includes(RoleEnum.AnalyticsAccountTotal);

        const selectedColumns = props.payIn === "payin" ? columnsForPayIn : columnsForOther;

        const filteredColumns = roleCondition 
            ? selectedColumns 
            : selectedColumns.filter(column => column.label !== 'Total');

        setColumns([
            ...commonColumns,
            ...filteredColumns
        ]);
    }, [props.payIn, roles]);
    

    return (<Paper sx={{width: '100%', overflow: 'hidden'}}>
        <MainTable
            loading={loading}
            checkboxSelection={false}
            alwaysShowCheckboxSelection={true}
            setPage={(page) => setPage(page)}
            setLimit={(limit) => setLimit(limit)}
            limit={limit}
            page={page}
            total={total}
            rows={payData}
            height={height}
            columns={columns} 
            payIn={payIn}
            />
    </Paper>);
};

export default PayInOutFileTable;