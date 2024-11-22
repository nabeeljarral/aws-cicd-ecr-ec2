import * as React from 'react';
import {Chip} from '@mui/material';
import {PayoutTransactionStatusEnum} from '@/utils/enums/transactionStatus';

interface Props {
    status: PayoutTransactionStatusEnum;
}

interface IChip {
    color: 'success' | 'error' | 'primary' | 'warning',
    label: string
}

export default function StatusChip2(prop: Props) {
    const chip: IChip =
        prop.status === PayoutTransactionStatusEnum.success ?
            {color: 'success', label: 'SUCCESS'} :
            prop.status === PayoutTransactionStatusEnum.pending ?
                {color: 'primary', label: prop.status.toUpperCase()} :
                prop.status === PayoutTransactionStatusEnum.returned || prop.status === PayoutTransactionStatusEnum.failed ?
                    {color: 'error', label: prop.status.toUpperCase()} :
                    prop.status === PayoutTransactionStatusEnum.initiate ?
                        {color: 'warning', label: 'INITIATE'} :
                        {color: 'warning', label: prop.status}  /*pending*/;


    return (
        <Chip
            color={chip.color}
            label={chip.label}
            sx={{
                borderRadios: '0 !important',
                textTransform: 'capitalize',
                minWidth: '90px',
                filter: 'drop-shadow(0 0 1px white)',
            }}
            variant="filled" />
    );
}
