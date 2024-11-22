import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import {Box, Grid, TextField} from '@mui/material';
import React from 'react';
import {useSelector} from 'react-redux';

interface Props {
    formData: IBankAccount;
    handleInputChange: React.ChangeEvent<HTMLInputElement> | any;
}
const OtherForm = (props: Props) => {
    const {formData, handleInputChange} = props;
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;

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
                        disabled={
                            !roles?.includes(RoleEnum.Admin) &&
                            !roles?.includes(RoleEnum.BankAccountUpdate)
                        }
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
                        disabled={
                            !roles?.includes(RoleEnum.Admin) &&
                            !roles?.includes(RoleEnum.BankAccountUpdate)
                        }
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
                        disabled={
                            !roles?.includes(RoleEnum.Admin) &&
                            !roles?.includes(RoleEnum.BankAccountUpdate)
                        }
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
                        disabled={
                            !roles?.includes(RoleEnum.Admin) &&
                            !roles?.includes(RoleEnum.BankAccountUpdate)
                        }
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
                        disabled={
                            !roles?.includes(RoleEnum.Admin) &&
                            !roles?.includes(RoleEnum.BankAccountUpdate)
                        }
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
                        disabled={
                            !roles?.includes(RoleEnum.Admin) &&
                            !roles?.includes(RoleEnum.BankAccountUpdate)
                        }
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
                        disabled={
                            !roles?.includes(RoleEnum.Admin) &&
                            !roles?.includes(RoleEnum.BankAccountUpdate)
                        }
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
                        disabled={
                            !roles?.includes(RoleEnum.Admin) &&
                            !roles?.includes(RoleEnum.BankAccountUpdate)
                        }
                    />
                </Box>
            </Grid>
        </>
    );
};

export default OtherForm;
