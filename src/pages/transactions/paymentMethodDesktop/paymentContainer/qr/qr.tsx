import {ITransaction} from '@/utils/interfaces/transaction.interface';
import {ContentCopy, Download} from '@mui/icons-material';
import {Box, Button, Grid, TextField, Tooltip, Typography} from '@mui/material';
import QRCode from 'qrcode.react';
import React, {useEffect, useState} from 'react';
import styles from '../../../../../styles/qrStyles'; // Import the styles
import {BankTypesEnum} from '@/utils/enums/bankTypes.enum';
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

const QR: React.FC<PaymentMethodProps> = ({
    handleCopy,
    copyTooltip,
    $translate,
    onSubmit,
    transaction,
    bankAccount,
}) => {
    const [utr, setUtr] = useState<string>('');
    const [qrCodeUrl, setQRCodeUrl] = useState<string>('');

    const handleUtrChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUtr(event.target.value);
    };

    const handleDownload = () => {
        const canvas = document.querySelector('canvas'); // Select the canvas element created by QRCode
        if (canvas) {
            const qrCodeUrl = canvas.toDataURL('image/png'); // Convert canvas to image (PNG)
            const link = document.createElement('a');
            link.href = qrCodeUrl;
            link.setAttribute('download', 'qr_code.png'); // Set the filename for the downloaded image
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        
        e.preventDefault();
        if (utr?.trim() !== '') {
            onSubmit(e);
        } else {
            awesomeAlert({msg: 'Please enter a valid UTR', type: AlertTypeEnum.error});
        }
    };
    const qrCodeAddExtension = (qr: string) => {
        const tn = `&tn=gp${transaction?.external_ref ?? transaction?._id}`;
        const pnMatch = qr.match(/(pn=[^&]*)/);
        if (pnMatch) {
            const pnParameter = pnMatch[1];
            // Add 'tr' parameter after 'pn'
            return `${qr.trim().replace(pnParameter, pnParameter + tn)}&am=${transaction?.amount}`;
        }
        return `${qr.trim()}${tn}&am=${transaction?.amount}`;
    };

    useEffect(() => {
        //Bank Related Transaction
        if (transaction?.bank_type === BankTypesEnum.default && transaction?.upiqr_Link) {
            setQRCodeUrl(transaction?.upiqr_Link);
        } else {
            //Gateway|Intent Related Transaction
            const qrCode = transaction?.qr_Link;
            const qrCodeUrl =
                transaction?.bank_type !== BankTypesEnum.default &&
                qrCode &&
                qrCode?.trim().startsWith('upi') &&
                !qrCode?.includes('&am=')
                    ? qrCodeAddExtension(qrCode)
                    : qrCode;
            setQRCodeUrl(qrCodeUrl || '');
        }
    }, []);

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={styles.container}>
                <Box sx={styles.box}>
                    <Button variant="contained" onClick={handleDownload} sx={styles.buttonDownload}>
                        {$translate('Download_QR')} <Download sx={{fontSize: 20, ml: 0.5}} />
                    </Button>

                    <Box sx={styles.qrCodeContainer}>
                        <QRCode value={qrCodeUrl} size={149} />
                    </Box>

                    <Typography sx={styles.noteText}>{$translate('QR_Code_Note')}</Typography>
                </Box>

                <Box>
                    <Box sx={styles.noteBox}>
                        <Grid xs={12} container justifyContent="space-between">
                            <Grid item xs={7.5}>
                                <Typography sx={{color: '#FFFFFF', fontSize: '13px'}}>
                                    <strong>Note: </strong> {$translate('QR_Note')}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} sx={styles.amountContainer}>
                                <Typography sx={styles.amountField}>
                                    <strong style={{marginRight: '5px'}}>
                                        {$translate('Amount')}:{' '}
                                    </strong>{' '}
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
                        label={$translate('QR_Label_TextField')}
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

export default QR;
