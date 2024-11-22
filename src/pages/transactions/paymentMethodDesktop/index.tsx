import React, {useEffect, useState} from 'react';
import {Box, Typography, RadioGroup} from '@mui/material';
import PaymentMethod from './payMethodComponent';
import Imps from './paymentContainer/imps/imps';
import Upi from './paymentContainer/upi/upi';
import QR from './paymentContainer/qr/qr';
import {ITransaction} from '@/utils/interfaces/transaction.interface';
import {BankTypesEnum} from '@/utils/enums/bankTypes.enum';
import {PaymentOptionsEnum} from '@/utils/enums/paymentMethod.enum';
import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';

interface PaymentMethodProps {
    $translate: any;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    transaction?: ITransaction;
    setSelectedMethod: React.Dispatch<React.SetStateAction<PaymentOptionsEnum>>;
    selectedMethod: string;
    bankAccount?: IBankAccount;
}
const PaymentMethodDesktop: React.FC<PaymentMethodProps> = ({
    $translate,
    onSubmit,
    transaction,
    setSelectedMethod,
    bankAccount,
    selectedMethod,
}) => {
    const [copyTooltip, setCopyTooltip] = useState<string>('Copy');
    const handleMethodChange = (method: PaymentOptionsEnum) => {
        setSelectedMethod(method);
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopyTooltip('Copied!');
        setTimeout(() => setCopyTooltip('Copy'), 1500);
    };

    return (
        <Box sx={{paddingTop: 2}}>
            <Box sx={{padding: 0}}>
                <Typography
                    variant="body1"
                    gutterBottom
                    color="textSecondary"
                    sx={{fontWeight: '600', pb: 1}}
                >
                    {$translate('Payment_Methods')}
                </Typography>

                <RadioGroup value={selectedMethod}>
                    {bankAccount?.paymentMethods?.includes(PaymentOptionsEnum.IMPS) && (
                        <PaymentMethod
                            methodName="IMPS (Most Preferred)"
                            logo="/path-to-imps-logo.png"
                            value={PaymentOptionsEnum.IMPS}
                            selectedValue={selectedMethod || ''}
                            handleMethodChange={handleMethodChange}
                            MethodLogo={'img/IMPS.png'}
                            width={46}
                            details={
                                <Imps
                                    handleCopy={handleCopy}
                                    copyTooltip={copyTooltip}
                                    $translate={$translate}
                                    onSubmit={onSubmit}
                                    transaction={transaction}
                                    bankAccount={bankAccount}
                                />
                            }
                        />
                    )}
                    {bankAccount?.paymentMethods?.includes(PaymentOptionsEnum.UPI) && (
                        <PaymentMethod
                            methodName="UPI"
                            logo="/path-to-upi-logo.png"
                            value={PaymentOptionsEnum.UPI}
                            selectedValue={selectedMethod || ''}
                            handleMethodChange={handleMethodChange}
                            MethodLogo={'img/UPI.png'}
                            width={32}
                            details={
                                <Upi
                                    handleCopy={handleCopy}
                                    copyTooltip={copyTooltip}
                                    $translate={$translate}
                                    onSubmit={onSubmit}
                                    transaction={transaction}
                                    bankAccount={bankAccount}
                                />
                            }
                        />
                    )}
                    {bankAccount?.paymentMethods?.includes(PaymentOptionsEnum.QR) &&
                        transaction?.bank_type === BankTypesEnum.default &&
                        transaction?.upiqr_Link && (
                            <PaymentMethod
                                methodName="QR"
                                width={36}
                                logo="/path-to-qr-logo.png"
                                value={PaymentOptionsEnum.QR}
                                selectedValue={selectedMethod || ''}
                                MethodLogo={'img/QR.png'}
                                handleMethodChange={handleMethodChange}
                                details={
                                    <QR
                                        handleCopy={handleCopy}
                                        copyTooltip={copyTooltip}
                                        $translate={$translate}
                                        onSubmit={onSubmit}
                                        transaction={transaction}
                                        bankAccount={bankAccount}
                                    />
                                }
                            />
                        )}
                </RadioGroup>
            </Box>
        </Box>
    );
};

export default PaymentMethodDesktop;
