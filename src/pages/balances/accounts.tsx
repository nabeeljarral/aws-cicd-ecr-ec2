import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {CircularProgress, Grid} from '@mui/material';
import {theme} from '@/utils/theme';
import Typography from '@mui/material/Typography';
import {asset, PriceFormatter} from '@/utils/functions/global';
import {IBank, IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import {getBankAccountBalance} from '@/utils/services/balance';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {useRouter} from 'next/router';

const dangerNumber = 200_000;
const warningNumber = 180_000;
const playAudio = () => {
    const audioUrl = asset('audio/noice.mp3');
    const audio = new Audio(audioUrl);
    audio.play();
};

const BalancesCards = (props: {link: string, title: string}) => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<IBankAccount[]>([]);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();

    const bankName = (bankId: string | IBank) => typeof bankId === 'string' ? bankId : bankId?.name;
    const fetchBankAccounts = async (): Promise<IBankAccount[] | undefined> => {
        const res = await getBankAccountBalance(props.link);
        res?.forEach(b => {
            if (+(b.closing_balance ?? 0) > dangerNumber) {
                playAudio();
            }
        });
        return res;
    };

    useEffect(() => {
        setLoading(true);
        fetchBankAccounts()
            .then(res => {
                if (res) setItems(res);
            }).finally(() => {
            setLoading(false);
        });
        setInterval(() => {
            fetchBankAccounts()
                .then(res => {
                    if (res) setItems(res);
                });
        }, 15000);
    }, []);

    useEffect(() => {
        if (!roles?.length) router.push(LOGIN_ROUTE);
    }, [roles]);

    return <Box sx={{my: 2}}>
        <Typography variant="h5" sx={{mb: 2}}>{props.title}</Typography>
        <Grid container spacing={1}>
            {loading && <CircularProgress size={50} />}
            {!loading && !items?.length && <Typography sx={{ml: 2}}>No data Availible</Typography>}
            {
                !loading && items?.length && items?.map((b, i) => {
                    return <Grid item xs={6} md={4} key={i}>
                        <Box sx={{
                            // color:'white',
                            background: '#CBF1F5',
                            p: 2,
                            animation:
                                +(b?.closing_balance || 0) > dangerNumber ?
                                    'dropShadowAnimation 1s linear infinite' :
                                    '',

                            // border: `1px solid ${theme.palette.primary.main}60`,
                            borderRadius: theme.shape.borderRadius + 'px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                           <b>{bankName(b?.bankId ?? { name: 'Unknown Bank' })} | {b?.name || 'Null'}</b>

                            <br />
                            <Typography sx={{pt: 1, fontSize: 14}}>
                                Total Credit:&ensp;
                                <span style={{fontWeight: 'bold'}}>
                                     {b.total_credit ? PriceFormatter(b.total_credit) : 'Null'}
                                </span>
                            </Typography>
                            <Typography sx={{fontSize: 20}}>
                                Closing Balance:&ensp;
                                <span style={{
                                    fontWeight: 'bold',
                                    fontSize: 24,
                                    color:
                                        +(b?.closing_balance || 0) < warningNumber ?
                                            '#000' :
                                            '#E84545',
                                }}>
                                     {b.closing_balance ? PriceFormatter(b.closing_balance) : 'Null'}
                                </span>
                            </Typography>
                        </Box>
                    </Grid>;
                })
            }
        </Grid>
    </Box>;
};
const BalancesPage = () => {
    return <Box>
        <Box sx={{flexGrow: 1}}>
            <Typography variant="h5" sx={{m: 4, mb: 0, fontWeight: 'bold'}}>Bank Account Balance</Typography>
            <Container maxWidth="lg" sx={{mt: 6}}>
                <BalancesCards link="https://api.payz365.com" title="Payz365" />
                <BalancesCards link="https://api.zealappayments.com" title="Zelappayment" />
                <BalancesCards link="https://api.paymentcircles.com" title="PaymentCircles" />
                <BalancesCards link="https://api.swifttpay.com" title="SwifttPay" />
            </Container>
        </Box>
    </Box>;
};

export default BalancesPage;