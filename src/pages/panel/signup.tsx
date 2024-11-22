import HomeLayout from '@/components/layouts/HomeLayout';
import {useSelector} from 'react-redux';
import React, {FormEvent, MouseEvent, useEffect, useState} from 'react';
import {FormControl, InputAdornment, InputLabel, OutlinedInput} from '@mui/material';
import {useRouter} from 'next/router';
import IconButton from '@mui/material/IconButton';
import {Email, Phone, Visibility, VisibilityOff} from '@mui/icons-material';
import Box from '@mui/material/Box';
import AccountCircle from '@mui/icons-material/AccountCircle';
import {signup} from '@/utils/services/auth';
import awesomeAlert from '@/utils/functions/alert';
import LoadingButton from '@mui/lab/LoadingButton';
import {DASHBOARD_ROUTE, LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {RootState} from '@/store';
import {asset, isMobile, isTablet} from '@/utils/functions/global';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import Link from 'next/link';

const Signup = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const email = event.currentTarget.email.value;
        const password = event.currentTarget.password.value;
        const username = event.currentTarget.username.value;
        setLoading(true);
        signup({email, password, username})
            .then((res) => {
                setLoading(false);
                if (res._id) {
                    awesomeAlert({msg: `Successfully Registered`});
                    router.push(LOGIN_ROUTE);
                }
            })
            .catch((error) => {
                setLoading(false);
            });
    };
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const token = useSelector((state: RootState) => state.auth.token);


    useEffect(() => {
        if (!!token) router.push(DASHBOARD_ROUTE);
    }, [token]);

    return <HomeLayout>
        <form onSubmit={handleSubmit}>
            <Box
                sx={{
                    display: 'flex',
                    alignContent: 'center',
                    flexWrap: isTablet ? 'wrap' : 'nowrap',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    alignItems: 'center',
                    p: isMobile ? 2 : 10,
                }}>
                <Box sx={{
                    minWidth: '300px',
                    width: '100%',
                    maxWidth: isTablet ? '400px' : '700px',
                    maxHeight: '100vh',
                    minHeight: isTablet ? '400px' : '507px',
                    mr: isTablet ? 0 : 7,
                    position: 'relative',
                }}>

                    <Image
                        layout="fill"
                        objectFit="contain"
                        src={asset('img/login-bg3.png')}
                        alt={'pc-and-game'} />
                </Box>
                <Box sx={{
                    maxWidth: '400px',
                    minWidth: '350px',
                    width: '400px',
                    height: '527px',
                    pt: 6,
                    pb: 10,
                    px: isMobile ? 2 : 5,
                }}
                     className="bg-white rounded-2xl">
                    <Typography variant="h4" color="primary" sx={{fontWeight: 'bold'}}>
                        SignUp
                    </Typography>
                    <FormControl fullWidth sx={{mt: 6}} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-username">Company Name *</InputLabel>
                        <OutlinedInput
                            required
                            endAdornment={
                                <InputAdornment position="end">
                                    <AccountCircle />
                                </InputAdornment>
                            }
                            type="username"
                            name="username"
                            id="outlined-adornment-username"
                            label="Company Name"
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{mt: 2}} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-email">Email *</InputLabel>
                        <OutlinedInput
                            required
                            endAdornment={
                                <InputAdornment position="end">
                                    <Email />
                                </InputAdornment>
                            }
                            type="email"
                            name="email"
                            id="outlined-adornment-email"
                            label="Email"
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{mt: 2}} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-phone">Phone *</InputLabel>
                        <OutlinedInput
                            required
                            endAdornment={
                                <InputAdornment position="end">
                                    <Phone />
                                </InputAdornment>
                            }
                            type="phone"
                            name="phone"
                            id="outlined-adornment-phone"
                            label="Phone"
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{mt: 2}} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password *</InputLabel>
                        <OutlinedInput
                            required
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                    <Typography sx={{pt: 1, pl: 1}} typography={'caption'}>
                        Already have an account?
                        <Link href={LOGIN_ROUTE}> <b>Login</b></Link>
                    </Typography>
                    <Box>
                        <LoadingButton
                            sx={{px: 4, mt: 3}}
                            loading={loading}
                            className="rounded-2xl"
                            type="submit"
                            variant="contained">Submit</LoadingButton>
                    </Box>
                </Box>
            </Box>
        </form>
    </HomeLayout>;
};

export default Signup;