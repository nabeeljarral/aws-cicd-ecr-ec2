import {Inter} from 'next/font/google';
import {asset, isMobile} from '@/utils/functions/global';
import HomeLayout from '@/components/layouts/HomeLayout';
import Typography from '@mui/material/Typography';
import {Box} from '@mui/material';
import Image from 'next/image';

const inter = Inter({subsets: ['latin']});

export default function Home() {
    return (
        <HomeLayout>
            <Box
                sx={{
                    display: 'flex',
                    alignContent: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    alignItems: 'center',
                    p: isMobile ? 2 : 10,
                }}>

                <Typography
                    variant="h4"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        p: 3,
                        color: 'white',
                        fontWeight: 900,
                        letterSpacing: '2px',
                    }}>
                    {process.env.NEXT_PUBLIC_APP_NAME?.toUpperCase()}
                </Typography>
                <Box sx={{
                    minWidth: '300px',
                    maxWidth: '700px',
                    width: '100%',
                    mr: 7,
                    maxHeight: '100vh',
                    minHeight: '507px',
                    position: 'relative',
                }}>

                    <Image
                        layout="fill"
                        objectFit="contain"
                        src={asset('img/login-bg3.png')}
                        alt={'pc-and-game'} />
                </Box>
            </Box>
        </HomeLayout>
    );
}
