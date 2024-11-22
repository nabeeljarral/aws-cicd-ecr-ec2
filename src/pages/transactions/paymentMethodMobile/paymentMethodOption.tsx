import React from 'react';
import {Box, Typography, Radio, Button, Collapse, Card} from '@mui/material';
import {Google, Payment} from '@mui/icons-material';

interface PaymentMethodOptionProps {
    paymentAmount: number;
    icon?: React.ReactNode;
    methodName?: string;
    paymentValue?: string;
    selectedPayment?: string;
    expandedPayment?: string | null;
    handlePaymentChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    deepLinkPrefix?: string;
    qrCodeUrl?: string;
}

const PaymentMethodOption: React.FC<PaymentMethodOptionProps> = ({
    icon,
    methodName,
    paymentValue,
    selectedPayment,
    expandedPayment,
    handlePaymentChange,
    paymentAmount,
    deepLinkPrefix,
    qrCodeUrl,
}) => {
    const linkPrefix = (prefix: string, link: string) => {
        const deepLink = link.replace(prefix.includes('//') ? 'upi://' : 'upi', prefix);
        
        return deepLink;
    };
    const goToLink = (link2: string) => window.open(link2, '_self');
    return (
        <Card sx={{borderRadius: '10px', mb: 0, border: '1px solid #e9e9e9'}} elevation={0}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '2px 16px',
                }}
            >
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    {icon}
                    <Typography
                        sx={{marginLeft: 1, fontWeight: '500', color: '#595959', fontSize: '13px'}}
                    >
                        {methodName}
                    </Typography>
                </Box>
                <Radio
                    checked={selectedPayment === paymentValue}
                    onChange={handlePaymentChange}
                    value={paymentValue}
                    name="payment-method"
                    sx={{color: '#027FEE'}}
                />
            </Box>
            <Collapse in={expandedPayment === paymentValue} timeout="auto" unmountOnExit>
                <Box sx={{padding: '8px 16px', paddingTop: '0px'}}>
                    <Button
                        onClick={() => goToLink(linkPrefix(deepLinkPrefix || '', qrCodeUrl || ''))}
                        variant="contained"
                        fullWidth
                        sx={{
                            backgroundColor: '#34A853',
                            fontWeight: '500',
                            textTransform: 'none',
                            fontSize: '13px',
                            boxShadow:
                                '0px 5px 3px -1px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
                        }}
                    >
                        Proceed to Pay: ₹{paymentAmount.toFixed(2)}
                    </Button>
                </Box>
            </Collapse>
        </Card>
    );
};

export default PaymentMethodOption;
