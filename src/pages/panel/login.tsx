import HomeLayout from '@/components/layouts/HomeLayout';
import {useDispatch, useSelector} from 'react-redux';
import React, {FormEvent, MouseEvent, useEffect, useState} from 'react';
import {FormControl, InputAdornment, InputLabel, OutlinedInput} from '@mui/material';
import {useRouter} from 'next/router';
import IconButton from '@mui/material/IconButton';
import {Email, Visibility, VisibilityOff} from '@mui/icons-material';
import Box from '@mui/material/Box';
import {login as storeLogin} from '@/store/auth/authThunk';
import {login} from '@/utils/services/auth';
import awesomeAlert from '@/utils/functions/alert';
import LoadingButton from '@mui/lab/LoadingButton';
import {RoleEnum} from '@/utils/enums/role';
import {DASHBOARD_ROUTE, SIGNUP_ROUTE} from '@/utils/endpoints/routes';
import { routeList } from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {asset, isMobile, isTablet} from '@/utils/functions/global';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import Link from 'next/link';

const Login = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const roles:any = useSelector((state: RootState) => state.auth.user)?.roles;
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const email = event.currentTarget.email.value;
        const password = event.currentTarget.password.value;
        setLoading(true);
        login({email, password})
            .then((res) => {
                setLoading(false);
                if (res.user && res.token) {
                    awesomeAlert({msg: `Login Successfully`});
                    // @ts-ignore
                    dispatch(storeLogin(res));
                    router.push(
            roles?.includes(RoleEnum.Dashboard) ? DASHBOARD_ROUTE :
            routeList.find(route => route.role.includes(roles[0] as RoleEnum))?.url ||
            DASHBOARD_ROUTE
        );
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
        if (!!token){
            router.push(
                roles?.includes(RoleEnum.Dashboard) ? DASHBOARD_ROUTE :
                routeList.find(route => route.role.includes(roles[0] as RoleEnum))?.url ||
                DASHBOARD_ROUTE
            );
        }      //  router.push(DASHBOARD_ROUTE);
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
                    height: '407px',
                    pt: 6,
                    pb: 10,
                    px: isMobile ? 2 : 5,
                }}
                     className="bg-white rounded-2xl">
                    <Typography variant="h4" color="primary" sx={{fontWeight: 'bold'}}>
                        {process.env.NEXT_PUBLIC_APP_NAME}
                    </Typography>
                    <FormControl fullWidth sx={{mt: 6}} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
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
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
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
                        Don't have an account yet?
                        <Link href={SIGNUP_ROUTE}> <b>Create one</b></Link>
                    </Typography>
                    <Box>
                        <LoadingButton
                            sx={{px: 4, mt: 3}}
                            loading={loading}
                            className="rounded-2xl"
                            type="submit"
                            variant="contained">Login</LoadingButton>
                    </Box>
                </Box>
            </Box>
        </form>
    </HomeLayout>;
};

export default Login;