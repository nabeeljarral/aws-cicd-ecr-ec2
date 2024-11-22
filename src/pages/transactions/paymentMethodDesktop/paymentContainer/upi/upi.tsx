import {ITransaction} from '@/utils/interfaces/transaction.interface';
import {ContentCopy} from '@mui/icons-material';
import {Box, Button, Grid, TextField, Tooltip, Typography} from '@mui/material';
import React, {useEffect, useState} from 'react';
import styles from '../../../../../styles/upiStyles'; // Import the styles
import awesomeAlert from '@/utils/functions/alert';
import {AlertTypeEnum} from '@/utils/enums/alertType';
import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';

interface PaymentMethodProps {
    handleCopy: (text: string) => void;
    copyTooltip: string;
    setCopyTooltip?: string;
    $translate?: any;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    transaction?: ITransaction;
    bankAccount?: IBankAccount;
}

const Upi: React.FC<PaymentMethodProps> = ({
    handleCopy,
    copyTooltip,
    $translate,
    onSubmit,
    transaction,
    bankAccount,
}) => {
    const [utr, setUtr] = useState<string>('');
    const [upiId, setUPIId] = useState<string>('--');
    const [bankName, setBankName] = useState<string>('--');

    const handleUtrChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUtr(event.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (utr?.trim() !== '') {
            onSubmit(e);
        } else {
            awesomeAlert({msg: 'Please enter a valid UTR', type: AlertTypeEnum.error});
        }
    };
    useEffect(() => {
        //Bank Related Transaction
        if (typeof transaction?.bank_account === 'object') {
            const bankAccount = transaction?.bank_account as IBankAccount;
            setUPIId(bankAccount?.upi_id);
            setBankName(bankAccount?.name);
        }
    }, []);
    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={styles.container}>
                <Box sx={styles.box}>
                    <Box sx={{padding: '10px 0px 5px 16px'}}>
                        <Typography sx={{color: '#001F6D', fontSize: '13px'}}>
                            <Typography fontSize={'inherit'} component={'span'} fontWeight={'bold'}>
                                UPI ID :
                            </Typography>
                            <Tooltip title={copyTooltip}>
                                <Typography
                                    fontSize={'inherit'}
                                    component={'span'}
                                    onClick={() => handleCopy(upiId || '')}
                                    sx={{ml: 0.4}}
                                >
                                    {upiId}
                                </Typography>
                            </Tooltip>
                            <Tooltip title={copyTooltip}>
                                <ContentCopy
                                    onClick={() => handleCopy(upiId)}
                                    sx={styles.tooltip}
                                />
                            </Tooltip>
                        </Typography>
                    </Box>

                    <Box sx={{padding: '0px 0px 5px 16px'}}>
                        <Typography sx={{fontSize: '13px'}} color="#001F6D">
                            <strong>{$translate('Name')} :</strong> {bankName || '--'}
                        </Typography>
                    </Box>
                </Box>

                <Box>
                    <Box sx={styles.noteBox}>
                        <Grid xs={12} container justifyContent="space-between">
                            <Grid item xs={7.5}>
                                <Typography sx={styles.noteText}>
                                    <strong>Note : </strong> {$translate('UPI_Note')}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} sx={styles.amountContainer}>
                                <Typography sx={styles.amountField}>
                                    <strong style={{marginRight: '5px'}}>
                                        {$translate('Amount')}:
                                    </strong>
                                    ₹{transaction?.amount.toFixed(2)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                <Box sx={{width: '100%', mt: 2}}>
                    <TextField
                        fullWidth
                        type="number"
                        label={$translate('Label_UPI_TextField')}
                        variant="outlined"
                        name="utr"
                        size="small"
                        value={utr}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (e.target.value.length <= 12) {
                                handleUtrChange(e);
                            }
                        }}
                        sx={styles.textField}
                        InputLabelProps={{
                            sx: styles.label,
                        }}
                    />
                </Box>

                <Box sx={{width: '100%', mt: 1}}>
                    <Button type="submit" fullWidth variant="contained" sx={styles.submitButton}>
                        {$translate('Submit')}
                    </Button>
                </Box>
            </Grid>
        </form>
    );
};

export default Upi;
