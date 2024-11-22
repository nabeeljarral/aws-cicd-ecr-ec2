import React from 'react';
import {Box, Typography, Card, Collapse, Radio, Paper} from '@mui/material';
import {asset} from '@/utils/functions/global';
import {PaymentOptionsEnum} from '@/utils/enums/paymentMethod.enum';

interface PaymentMethodProps {
    methodName: string;
    logo: string;
    details: React.ReactNode;
    value: PaymentOptionsEnum;
    selectedValue: string;
    handleMethodChange: (value: PaymentOptionsEnum) => void;
    MethodLogo: any;
    width: number;
    onSubmit?: any;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
    methodName,
    details,
    value,
    selectedValue,
    handleMethodChange,
    MethodLogo,
    width,
}) => {
    const isSelected = selectedValue === value;

    return (
        <Paper elevation={2} sx={{padding: 2, marginBottom: 2, background: '#F5F5F5'}}>
            <Box
                sx={{
                    marginBottom: isSelected ? 1 : 0,
                    // border: '1px solid #e7e7e7',
                    borderRadius: '8px',
                    padding: '1px 18px 0px 3px',
                    background: '#ffffff',
                }}
            >
                <Box sx={{marginBottom: 0, display: 'flex', width: '100%'}}>
                    <Radio
                        checked={isSelected}
                        onChange={() => handleMethodChange(value)}
                        value={value}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}
                    >
                        <Typography variant="h6" sx={{flex: 1, fontSize: '14px', color: '#606060'}}>
                            {methodName}
                        </Typography>

                        <img
                            src={asset(`${MethodLogo}`)}
                            alt={`${methodName} logo`}
                            width={width}
                        />
                    </Box>
                </Box>
            </Box>
            <Box>
                <Collapse in={isSelected} timeout="auto" unmountOnExit>
                    <Card sx={{padding: 2, pr: 0, pb: 0, background: '#F5F5F5'}} elevation={0}>
                        {details}
                    </Card>
                </Collapse>
            </Box>
        </Paper>
    );
};

export default PaymentMethod;
