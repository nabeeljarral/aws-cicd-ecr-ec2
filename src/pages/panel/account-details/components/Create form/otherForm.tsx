import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import {Box, Grid, TextField} from '@mui/material';
import React from 'react';

interface Props {
    formData: IBankAccount;
    handleInputChange: React.ChangeEvent<HTMLInputElement> | any;
}
const OtherFormDetails = (props: Props) => {
    const {formData, handleInputChange} = props;
    return (
        <>
            <Grid item xs={12} sm={6} md={4}>
                <Box sx={{mt: -1}}>
                    <TextField
                        size="small"
                        fullWidth
                        margin="normal"
                        id="loginId"
                        name="loginId"
                        value={formData?.loginId}
                        onChange={handleInputChange}
                        label="Login Id"
                    />
                </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Box sx={{mt: -1}}>
                    <TextField
                        size="small"
                        fullWidth
                        margin="normal"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        label="User Id"
                    />
                </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Box sx={{mt: -1}}>
                    <TextField
                        size="small"
                        fullWidth
                        margin="normal"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        label="Password"
                    />
                </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Box sx={{mt: -1}}>
                    <TextField
                        size="small"
                        fullWidth
                        margin="normal"
                        id="trxnPassword"
                        name="trxnPassword"
                        value={formData.trxnPassword}
                        onChange={handleInputChange}
                        label="Transaction Password"
                    />
                </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Box sx={{mt: -1}}>
                    <TextField
                        size="small"
                        fullWidth
                        margin="normal"
                        id="otpAccess"
                        name="otpAccess"
                        value={formData.otpAccess}
                        onChange={handleInputChange}
                        label="OTP Access"
                    />
                </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Box sx={{mt: -1}}>
                    <TextField
                        size="small"
                        fullWidth
                        margin="normal"
                        id="registeredPhoneNo"
                        name="registeredPhoneNo"
                        value={formData?.registeredPhoneNo}
                        onChange={handleInputChange}
                        label="Registered Phone No"
                    />
                </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Box sx={{mt: -1}}>
                    <TextField
                        size="small"
                        fullWidth
                        margin="normal"
                        id="securityQuestion"
                        name="securityQuestion"
                        value={formData.securityQuestion}
                        onChange={handleInputChange}
                        label="Security Question"
                    />
                </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Box sx={{mt: -1}}>
                    <TextField
                        size="small"
                        fullWidth
                        margin="normal"
                        id="securityAnswer"
                        name="securityAnswer"
                        value={formData.securityAnswer}
                        onChange={handleInputChange}
                        label="Security Answer"
                    />
                </Box>
            </Grid>
        </>
    );
};

export default OtherFormDetails;
