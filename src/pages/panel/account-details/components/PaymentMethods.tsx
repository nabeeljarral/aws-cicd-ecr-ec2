import React from 'react';
import {
    Box,
    Grid,
    Checkbox,
    FormControlLabel,
    Typography,
    FormControl,
    TextField,
} from '@mui/material';
import {useSelector} from 'react-redux';
import {RoleEnum} from '@/utils/enums/role';
import {RootState} from '@/store';
import PaymentsTwoToneIcon from '@mui/icons-material/PaymentsTwoTone';
import {Check} from '@mui/icons-material';
import {BankAccountTypesEnum} from '@/utils/enums/accountDetails.enums';

interface PaymentMethodsProps {
    selectedPaymentMethods: string[];
    setSelectedPaymentMethods: React.Dispatch<React.SetStateAction<string[]>>;
    formData: any;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
    selectedPaymentMethods,
    setSelectedPaymentMethods,
    formData,
    handleInputChange,
}) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const roles = user?.roles as RoleEnum[];
    const isAllowedToChangePaymentMethod = roles?.includes(RoleEnum.BankAccountChangePaymentMethod);
    const isEditAccountOtherFields = roles?.includes(RoleEnum.EditAccountOtherFields);

    const paymentOptions = ['IMPS', 'UPI', 'QR']; // Available payment methods

    const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = event.target;
        if (checked) {
            setSelectedPaymentMethods((prev) => [...prev, name]);
            console.log(selectedPaymentMethods);
        } else {
            setSelectedPaymentMethods((prev) => prev.filter((method) => method !== name));
            console.log(selectedPaymentMethods);
        }
    };

    return (
        <Box sx={{px: 2, mt: 1, border: '1px solid #ccc', borderRadius: '8px', p: 2}}>
            <Typography sx={{mb: 2}}>
                <PaymentsTwoToneIcon /> Payment Methods:
            </Typography>
            {isAllowedToChangePaymentMethod ? (
                <>
                    <FormControl component="fieldset" fullWidth>
                        <Grid container spacing={1}>
                            {paymentOptions.map((method, index) => (
                                <Grid item key={index}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={
                                                    selectedPaymentMethods?.includes(method) ||
                                                    false
                                                }
                                                onChange={handleCheckBoxChange}
                                                name={method}
                                            />
                                        }
                                        label={method}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </FormControl>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                size="small"
                                fullWidth
                                required={selectedPaymentMethods?.includes('IMPS')}
                                margin="normal"
                                type="text"
                                id="ifscCode"
                                name="ifscCode"
                                value={formData.ifscCode}
                                onChange={handleInputChange}
                                label={'IFSC Code'}
                            />
                        </Grid>
                        {formData.accountType === BankAccountTypesEnum.payin && (
                            <Grid item xs={12} sm={6} md={4}>
                                <Box>
                                    <TextField
                                        size="small"
                                        required
                                        fullWidth
                                        margin="normal"
                                        id="upi_id"
                                        name="upi_id"
                                        value={formData.upi_id}
                                        onChange={handleInputChange}
                                        label="UPI Id"
                                        disabled={
                                            isEditAccountOtherFields ||
                                            (!roles?.includes(RoleEnum.Admin) &&
                                                !roles?.includes(RoleEnum.BankAccountUpdate))
                                        }
                                    />
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </>
            ) : (
                <Box>
                    {selectedPaymentMethods.map((method) => (
                        <Box key={method}>
                            <Check sx={{color: '#00C853'}} /> {method}
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default PaymentMethods;
