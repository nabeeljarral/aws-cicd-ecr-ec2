import {ITransaction} from '@/utils/interfaces/transaction.interface';
import {Grid, Paper, Typography} from '@mui/material';
import React from 'react';
import styles from '../../../styles/styles';

interface PaymentMethodProps {
    $translate: any;
    transaction?: ITransaction;
}
const AmountContainer: React.FC<PaymentMethodProps> = ({$translate, transaction}) => {
    return (
        <div>
            <Paper elevation={2} sx={styles.paperStyles}>
                <Grid item>
                    <Grid sx={styles.amountContainer}>
                        <Typography variant="h6" sx={{color: '#ffffff'}}>
                            {$translate('Amount')}
                        </Typography>
                        <Typography variant="h6" sx={{color: '#ffffff'}}>
                            ₹{transaction?.amount.toFixed(2) || '0.00'}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
};

export default AmountContainer;
