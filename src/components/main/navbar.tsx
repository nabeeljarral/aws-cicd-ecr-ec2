import * as React from 'react';
import {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store';
import {ExitToApp} from '@mui/icons-material';
import {logout} from '@/store/auth/authThunk';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import {theme} from '@/utils/theme';

type Props = {
    children?: React.ReactNode;
    drawer: boolean;
    onChange: () => void
};

const MenuAppBar = (props: Props) => {
    const token = useSelector((state: RootState) => state.auth.token);
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const [drawerOpen, setDrawerOpen] = useState(props.drawer);
    const router = useRouter();

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
        props.onChange();
    };
    const handleLogout = () => {
        // @ts-ignore
        dispatch(logout());
        // awesomeAlert({msg: 'Logout Successfully, will redirect to login page'})
        router.push(LOGIN_ROUTE);
    };

    return (
        <AppBar sx={{
            zIndex: theme.zIndex.drawer + 1,
        }}>
            <Toolbar variant="dense" sx={{
                filter: 'drop-shadow(0 0 1px white)',
            }}>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{mr: 2}}
                    onClick={() => {
                        toggleDrawer();
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    {process.env.NEXT_PUBLIC_APP_NAME}
                </Typography>
                {!!token && (
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Typography>{user?.username}</Typography>

                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleLogout}
                            color="inherit"
                        >
                            <ExitToApp />
                        </IconButton>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default MenuAppBar;
