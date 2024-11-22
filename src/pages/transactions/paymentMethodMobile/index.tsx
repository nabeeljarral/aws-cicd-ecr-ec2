import React, {useState} from 'react';
import {Box, Paper, Typography} from '@mui/material';
// import PaymentMethodOption from './PaymentMethodOption';
import PaymentMethodOption from './paymentMethodOption';
import {Google, Payment} from '@mui/icons-material';
import {asset} from '@/utils/functions/global';
import {ITransaction} from '@/utils/interfaces/transaction.interface';

interface PaymentMethodProps {
    transaction: ITransaction;
}
const PaymentMethodMobile = ({transaction}: PaymentMethodProps) => {
    const [selectedPayment, setSelectedPayment] = useState<string>('googlePay');
    const [expandedPayment, setExpandedPayment] = useState<string | null>('googlePay');

    const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPayment(event.target.value);
        setExpandedPayment(event.target.value);
    };

    const isAndroid = /android/i.test(navigator.userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

    return (
        <>
            <Box sx={{marginBottom: 2}}>
                <Typography
                    variant="body1"
                    sx={{fontWeight: '500', mb: 2, mt: 3.5, color: '#595959', fontSize: '14px'}}
                >
                    Preferred mode
                </Typography>
                <Paper elevation={2} sx={{padding: 2, marginBottom: 2, background: '#FFF'}}>
                    <Box>
                        <Box sx={{mb: 1}}>
                            <PaymentMethodOption
                                icon={
                                    <img src={asset(`img/gpay.png`)} alt={`gpay logo`} width={24} />
                                }
                                methodName="Google Pay"
                                paymentValue="googlePay"
                                selectedPayment={selectedPayment}
                                expandedPayment={expandedPayment}
                                handlePaymentChange={handlePaymentChange}
                                paymentAmount={transaction?.amount || 0}
                                deepLinkPrefix="gpay://upi/"
                                qrCodeUrl={transaction.qr_Link}
                            />
                        </Box>

                        <Box sx={{mb: 1}}>
                            <PaymentMethodOption
                                icon={
                                    <img
                                        src={asset(`img/phonepe.png`)}
                                        alt={`phonepe logo`}
                                        width={24}
                                        style={{color: '#FFC107', fontSize: '30px'}}
                                    />
                                }
                                paymentAmount={transaction?.amount || 0}
                                methodName="PhonePe"
                                paymentValue="phonePe"
                                selectedPayment={selectedPayment}
                                expandedPayment={expandedPayment}
                                handlePaymentChange={handlePaymentChange}
                                deepLinkPrefix="phonepe"
                                qrCodeUrl={transaction.qr_Link}
                            />
                        </Box>
                        <Box sx={{mb: 1}}>
                            <PaymentMethodOption
                                icon={
                                    <img
                                        src={asset(`img/paytm.png`)}
                                        alt={`paytm logo`}
                                        width={24}
                                        style={{color: '#FFC107', fontSize: '30px'}}
                                    />
                                }
                                paymentAmount={transaction?.amount || 0}
                                methodName="Paytm"
                                paymentValue="paytm"
                                selectedPayment={selectedPayment}
                                expandedPayment={expandedPayment}
                                handlePaymentChange={handlePaymentChange}
                                deepLinkPrefix="paytmmp"
                                qrCodeUrl={transaction.qr_Link}
                            />
                        </Box>
                        {!isIOS && (
                            <Box>
                                <PaymentMethodOption
                                    icon={
                                        <img
                                            src={asset(`img/bhim.png`)}
                                            alt={`gpay logo`}
                                            width={24}
                                            style={{color: '#FFC107', fontSize: '30px'}}
                                        />
                                    }
                                    paymentAmount={transaction?.amount || 0}
                                    methodName="BHIM UPI"
                                    paymentValue="bhim"
                                    selectedPayment={selectedPayment}
                                    expandedPayment={expandedPayment}
                                    handlePaymentChange={handlePaymentChange}
                                    deepLinkPrefix="upi"
                                    qrCodeUrl={transaction.qr_Link}
                                />
                            </Box>
                        )}
                    </Box>
                </Paper>

                {isIOS && (
                    <Box>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: '500',
                                mb: 2,
                                mt: 3.5,
                                color: '#595959',
                                fontSize: '14px',
                            }}
                        >
                            Other UPI Apps
                        </Typography>

                        <PaymentMethodOption
                            icon={<Payment sx={{fontSize: '30px', color: '#1A73E8'}} />}
                            methodName="Other"
                            paymentValue="other"
                            selectedPayment={selectedPayment}
                            expandedPayment={expandedPayment}
                            handlePaymentChange={handlePaymentChange}
                            paymentAmount={transaction?.amount || 0}
                            deepLinkPrefix="upi"
                            qrCodeUrl={transaction.qr_Link}
                        />
                    </Box>
                )}
            </Box>
        </>
    );
};

export default PaymentMethodMobile;
