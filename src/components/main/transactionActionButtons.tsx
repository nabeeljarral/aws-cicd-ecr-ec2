import {Box, Button} from '@mui/material';
import {Edit, Preview} from '@mui/icons-material';
import * as React from 'react';
import {ITransaction} from '@/utils/interfaces/transaction.interface';

type  Props = {
    transaction: ITransaction,
    handleEditClick: (id: string) => void
    handleViewClick: (transaction: ITransaction) => void
}
export const TransactionActionButtons = (props: Props) => {
    return (
        <Box sx={{display: 'flex'}}>
            <Button color="secondary" variant="outlined" size="small"
                    sx={{textTransform: 'capitalize', mr: 1}}
                    startIcon={<Preview />}
                    onClick={() => props.handleViewClick(props.transaction)}>
                View
            </Button>
            <Button color="warning" variant="outlined" size="small"
                    sx={{textTransform: 'capitalize'}}
                    startIcon={<Edit />}
                    onClick={() => props.handleEditClick(props.transaction._id)}>
                Edit
            </Button>
        </Box>
    );
};