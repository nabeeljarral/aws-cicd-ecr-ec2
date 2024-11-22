import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {CircularProgress, Grid} from '@mui/material';
import {theme} from '@/utils/theme';
import Typography from '@mui/material/Typography';
import {DateFormatter} from '@/utils/functions/global';
import {IBank, IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import {getBankAccountUploadTimeMoreThan2Min} from '@/utils/services/balance';
import {IUser} from '@/utils/interfaces/user.interface';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {useRouter} from 'next/router';


const BankAccountCards = (props: {link: string, title: string}) => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<IBankAccount[]>([]);
    const bankName = (bankId: string | IBank) => typeof bankId === 'string' ? bankId : bankId?.name;
    const username = (bankId: string | IUser) => typeof bankId === 'string' ? bankId : bankId?.username;
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();
    const fetchBankAccounts = async (): Promise<IBankAccount[] | undefined> => {
        return await getBankAccountUploadTimeMoreThan2Min(props.link);
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
        }, 20000);
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
                            // animation:
                            //     +(b?.closing_balance || 0) > dangerNumber ?
                            //         'dropShadowAnimation 1s linear infinite' :
                            //         '',

                            // border: `1px solid ${theme.palette.primary.main}60`,
                            borderRadius: theme.shape.borderRadius + 'px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                           <b>{bankName(b?.bankId ?? { name: 'Unknown Bank' })} | {b?.name || 'Null'}</b>

                            <br />
                            {username(b.relatedTo as (IUser | string)) || 'Null'}
                            <br />
                            <Typography sx={{pt: 1}}>
                                Last upload at:&ensp;
                                <span>
                                     {b.updatedAt ? DateFormatter(b.updatedAt) : 'Null'}
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
            <Typography variant="h5" sx={{m: 4, mb: 0, fontWeight: 'bold'}}>Upload History</Typography>
            <Container maxWidth="lg" sx={{mt: 6}}>
                <BankAccountCards link="https://api.payz365.com" title="Payz365" />
                <BankAccountCards link="https://api.zealappayments.com" title="Zelappayment" />
                <BankAccountCards link="https://api.paymentcircles.com" title="PaymentCircles" />
                <BankAccountCards link="https://api.swifttpay.com" title="SwifttPay" />
            </Container>
        </Box>
    </Box>;
};

export default BalancesPage;