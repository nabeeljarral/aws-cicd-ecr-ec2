import {ITransaction} from '@/utils/interfaces/transaction.interface';
import {ContentCopy} from '@mui/icons-material';
import {Box, Button, Grid, TextField, Tooltip, Typography} from '@mui/material';
import React, {useState} from 'react';
import styles from '../../../../../styles/impsStyles'; // Import the styles
import awesomeAlert from '@/utils/functions/alert';
import {AlertTypeEnum} from '@/utils/enums/alertType';
import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';

interface PaymentMethodProps {
    handleCopy: (text: string) => void;
    copyTooltip: string;
    $translate: any;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    transaction?: ITransaction;
    bankAccount?: IBankAccount;
}

const Imps: React.FC<PaymentMethodProps> = ({
    handleCopy,
    copyTooltip,
    $translate,
    onSubmit,
    transaction,
    bankAccount,
}) => {
    const [utr, setUtr] = useState<string>('');

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

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={styles.container}>
                <Box sx={styles.box}>
                    <Box sx={{padding: '10px 0px 5px 16px'}}>
                        <Typography sx={{color: '#001F6D', fontSize: '13px'}}>
                            <strong>{$translate('Account_Holders_Name')}</strong>{' '}
                            {bankAccount?.name}
                        </Typography>
                    </Box>

                    <Box sx={{padding: '0px 0px 5px 16px'}}>
                        <Typography sx={{color: '#001F6D', fontSize: '13px'}}>
                            <strong>{$translate('Account_Number')}</strong>{' '}
                            <Tooltip title={copyTooltip}>
                                <Typography
                                    fontSize={'inherit'}
                                    component={'span'}
                                    onClick={() =>
                                        handleCopy(bankAccount?.number?.toString() || '')
                                    }
                                >
                                    {bankAccount?.number || ''}
                                </Typography>
                            </Tooltip>
                            <Tooltip title={copyTooltip}>
                                <ContentCopy
                                    onClick={() =>
                                        handleCopy(bankAccount?.number?.toString() || '')
                                    }
                                    sx={styles.tooltip}
                                />
                            </Tooltip>
                        </Typography>
                    </Box>

                    <Box sx={{padding: '0px 0px 5px 16px'}}>
                        <Typography sx={{color: '#001F6D', fontSize: '13px'}}>
                            <strong>IFSC: </strong>
                            <Tooltip title={copyTooltip}>
                                <Typography
                                    fontSize={'inherit'}
                                    component={'span'}
                                    onClick={() =>
                                        handleCopy(bankAccount?.ifscCode?.toString() || '')
                                    }
                                >
                                    {bankAccount?.ifscCode || ''}
                                </Typography>
                            </Tooltip>
                            <Tooltip title={copyTooltip}>
                                <ContentCopy
                                    onClick={() =>
                                        handleCopy(bankAccount?.ifscCode?.toString() || '')
                                    }
                                    sx={styles.tooltip}
                                />
                            </Tooltip>
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{width: '100%'}}>
                    <Box sx={styles.noteBox}>
                        <Grid xs={12} container justifyContent="space-between">
                            <Grid item xs={7.5}>
                                <Typography sx={styles.noteText}>
                                    <strong>Note:</strong> {$translate('IMPS_Note')}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} sx={styles.amountContainer}>
                                <Typography sx={styles.amountField}>
                                    <Typography
                                        component={'p'}
                                        sx={{fontSize: 'inherit', marginRight: '5px'}}
                                    >
                                        {$translate('Amount')}:
                                    </Typography>
                                    <Typography sx={{fontSize: 'inherit', marginRight: '5px'}}>
                                        ₹{transaction?.amount.toFixed(2)}
                                    </Typography>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                <Box sx={{width: '100%', mt: 2}}>
                    <TextField
                        fullWidth
                        name="utr"
                        type="number"
                        label={$translate('Label_IMPS_Textfield')}
                        variant="outlined"
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
                    <Button fullWidth type="submit" variant="contained" sx={styles.button}>
                        {$translate('Submit')}
                    </Button>
                </Box>

                <Box>
                    <Typography variant="caption" color="textSecondary" sx={styles.finalNote}>
                        NOTE: {$translate('IMPS_Final_Note')}
                    </Typography>
                </Box>
            </Grid>
        </form>
    );
};

export default Imps;
