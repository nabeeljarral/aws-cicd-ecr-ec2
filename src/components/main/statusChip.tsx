import * as React from 'react';
import {Chip} from '@mui/material';
import {TransactionStatusEnum} from '@/utils/enums/transactionStatus';

interface Props {
    status: TransactionStatusEnum;
}

interface IChip {
    color: 'success' | 'error' | 'primary' | 'warning',
    label: string
}

export default function StatusChip(prop: Props) {
    const chip: IChip =
        prop.status === TransactionStatusEnum.success ?
            {color: 'success', label: 'SUCCESS'} :
            prop.status === TransactionStatusEnum.failed || prop.status === TransactionStatusEnum.unfinished ?
                {color: 'error', label: 'FAILED'} :
                prop.status === TransactionStatusEnum.pending ?
                    {color: 'primary', label: 'PROCESSING'} :
                    {
                        color: 'warning',
                        label: prop.status === TransactionStatusEnum.initiate ?
                            'PAGE_VIEWED' : prop.status,
                    };
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
