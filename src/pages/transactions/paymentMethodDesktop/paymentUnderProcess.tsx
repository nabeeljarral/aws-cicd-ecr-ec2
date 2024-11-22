import React from 'react';
import {Box, Button, Typography} from '@mui/material';
import {asset} from '@/utils/functions/global';
import styles from '../../../styles/styles';
import {ITransaction} from '@/utils/interfaces/transaction.interface';

interface PaymentMethodProps {
    $translate: any;
    transaction?: ITransaction;
}

const PaymentUnderProcessPage: React.FC<PaymentMethodProps> = ({$translate, transaction}) => {
    return (
        <Box sx={styles.paymentProcessingContainer}>
            <Box sx={styles.spinnerContainer}>
                <img src={asset(`img/SpinnerDone.png`)} alt={`Spinner Successful`} width={150} />
            </Box>

            <Box>
                <Typography variant="h6" sx={{fontWeight: '600', color: '#595959'}}>
                    {$translate('Under_Process')}
                </Typography>
                <Typography variant="body2" sx={{color: 'gray', textAlign: 'center', marginTop: 1}}>
                    {$translate('Upto1min')}
                    <br />
                    {$translate('transaction_number')}: {transaction?._id}
                </Typography>
            </Box>

            <Box sx={{marginTop: -5, textAlign: 'center'}}>
                <Typography variant="body1" sx={{color: '#595959', fontWeight: 600}}>
                    {$translate('Amount_paid')}{' '}
                    <Typography component="span" sx={{fontWeight: 'bold', color: '#001F6D'}}>
                        {transaction?.amount}
                    </Typography>
                </Typography>
            </Box>

            <Button
                variant="contained"
                sx={styles.backToWebsiteButton}
                // onClick={() => {
                //     // Add your redirect logic here
                //     window.location.href = '/'; // Example: Navigate back to home page
                // }}
            >
                {$translate('back_To_Site')}
            </Button>
        </Box>
    );
};

export default PaymentUnderProcessPage;
