import * as React from 'react';
import {useEffect, useState} from 'react';
import {ITransaction} from '@/utils/interfaces/transaction.interface';
import {useRouter} from 'next/router';
import {
    getGeoInfo,
    getTransaction,
    getTransactionRedirectUrl,
    getTransactionStatusById,
    updateGeolocaion,
    updateTransaction,
} from '@/utils/services/transactions';
import moment from 'moment';
import awesomeAlert from '@/utils/functions/alert';
import {langEn, langHindi, langMalayalam, langTamil, langTelgu} from '@/utils/translation/lang';
import {AlertTypeEnum} from '@/utils/enums/alertType';
import {Grid, Typography} from '@mui/material';
import {IUpdateTransactionDto} from '@/utils/dto/transactions.dto';
import Box from '@mui/material/Box';
import {TransactionStatusEnum} from '@/utils/enums/transactionStatus';
import Hotjar from '@hotjar/browser';
import {BankTypesEnum} from '@/utils/enums/bankTypes.enum';
import {isUpiCollectFn} from '@/utils/functions/global';
import AmountContainer from './paymentMethodDesktop/amountContainer';
import PaymentMethodDesktop from './paymentMethodDesktop';
import PaymentUnderProcessPage from './paymentMethodDesktop/paymentUnderProcess';
// import {TimerAndLanguage} from './paymentMethods/timerandlanguage';
import {TimerAndLanguage} from '../../styles/timerAndLanguage';
import PaymentMethodMobile from './paymentMethodMobile';
import {DoneAll, HourglassDisabled} from '@mui/icons-material';
import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import {PaymentOptionsEnum} from '@/utils/enums/paymentMethod.enum';
import Spinner from './paymentMethodDesktop/spinner';
import {ITransactionGeoLocation} from '@/utils/interfaces/transactionGeoLocation.interface';

export default function TransactionShow() {
    const [selectedMethod, setSelectedMethod] = useState<PaymentOptionsEnum>(
        PaymentOptionsEnum.IMPS,
    );
    const [bankAccount, setBankAccount] = useState<IBankAccount>();
    const [loading, setLoading] = useState(false);
    const [succeeded, setSucceeded] = useState(false);
    const [timerIntervalId, setTimerIntervalId] = useState<NodeJS.Timer>();
    const [remainingTime, setRemainingTime] = useState(1800);
    const [transaction, setTransaction] = useState<ITransaction>();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [lang, setLang] = React.useState('Eng');
    const [geoData, setGeoData] = useState<ITransactionGeoLocation | undefined>(undefined);
    const openLang = Boolean(anchorEl);
    const bank_type = transaction?.bank_type ?? 0;
    const externalTransactionCondition =
        bank_type !== BankTypesEnum.nexapayUpiCollect &&
        bank_type !== BankTypesEnum.default &&
        transaction?.status !== TransactionStatusEnum.initiate;
    const isUpiCollect = isUpiCollectFn(bank_type);
    const router = useRouter();
    const {id} = router.query;
    const isOldStyle = process.env.NEXT_PUBLIC_STYLE === '1';
    const redirectTo = async (
        redirect_url: string | undefined,
        relatedTo: string | undefined,
    ): Promise<void> => {
        let transactionId: string = typeof id === 'string' ? id : ':id';
        let redirect = transaction?.redirect_url ?? redirect_url;

        if (!redirect) {
            redirect = (await getTransactionRedirectUrl(relatedTo || ':UserId'))?.redirectUrl;
        }
        if (redirect) {
            redirect = redirect.replace('{transactionId}', transactionId);
            await router.push(redirect || '');
        }
    };
    useEffect(() => {
        if (bankAccount?.paymentMethods?.includes(PaymentOptionsEnum.IMPS)) {
            setSelectedMethod(PaymentOptionsEnum.IMPS);
        } else if (bankAccount?.paymentMethods?.includes(PaymentOptionsEnum.UPI)) {
            setSelectedMethod(PaymentOptionsEnum.UPI);
        } else if (bankAccount?.paymentMethods?.includes(PaymentOptionsEnum.QR)) {
            setSelectedMethod(PaymentOptionsEnum.QR);
        }
    }, [bankAccount]);

    useEffect(() => {
        if (transaction?.bank_account) {
            setBankAccount(transaction?.bank_account as IBankAccount);
        }
    }, [transaction]);
    useEffect(() => {
        if (!geoData && id) {
            const fetchGeoData = async () => {
                const data = await getGeoInfo();
                setGeoData(data);

                // Call updateGeolocation with the id and fetched geoData
                if (data && typeof id === 'string') {
                    await updateGeolocaion(id, data);
                }
            };

            fetchGeoData();
        }
    }, [id]);

    const fetchTransaction: () => Promise<ITransaction | undefined> = async () => {
        const res = await getTransaction(typeof id === 'string' ? id : ':id');
        if (
            (res?.status !== TransactionStatusEnum.initiate && res) ||
            (remainingTime === 0 && res) ||
            res?.utr
        ) {
            setTimeout(async () => {
                await redirectTo(res.redirect_url, res.relatedTo);
            }, 6000);
        }

        return res;
    };

    const fetchTransactionStatus = (
        id: string,
        redirect_url: string | undefined,
        relatedTo: string | undefined,
    ) => {
        getTransactionStatusById(id)
            .then(async (res) => {
                if (res?.status !== TransactionStatusEnum.initiate) {
                    if (transaction && res?.status) {
                        setTransaction({...transaction, status: res?.status});
                    }
                    if (
                        res?.status === TransactionStatusEnum.failed ||
                        res?.status === TransactionStatusEnum.unfinished
                    )
                        awesomeAlert({msg: 'Transaction Failed', type: AlertTypeEnum.error});
                    if (res?.status === TransactionStatusEnum.success) setSucceeded(true);
                }
                if (isUpiCollectFn(res?.bank_type ?? BankTypesEnum.default)) {
                    if (
                        !(
                            res?.status === TransactionStatusEnum.initiate ||
                            res?.status === TransactionStatusEnum.pending
                        ) ||
                        remainingTime === 0
                    ) {
                        setTimeout(async () => {
                            await redirectTo(redirect_url, relatedTo);
                        }, 5000);
                    }
                } else {
                    if (
                        !(
                            res?.status === TransactionStatusEnum.initiate ||
                            res?.status === TransactionStatusEnum.pending
                        ) ||
                        remainingTime === 0
                    ) {
                        setTimeout(async () => {
                            await redirectTo(redirect_url, relatedTo);
                        }, 5000);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent the default form submission
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data: IUpdateTransactionDto = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });

        if (isUpiCollect) {
            if (data.upi_id) {
                updateTransaction(typeof id === 'string' ? id : ':id', {
                    upi_id: data.upi_id,
                    selectedPaymentMethod: selectedMethod,
                })
                    .then((res) => {
                        if (res?._id) {
                            awesomeAlert({
                                msg: 'Submission successfully',
                                type: AlertTypeEnum.success,
                            });
                            setTransaction(res);
                            setTimerIntervalId(
                                setInterval(() => {
                                    setLoading(false);

                                    const startAt = moment(res.updatedAt);
                                    const fiveMinutesAgo = moment().subtract(5, 'minutes');
                                    const diffInSeconds = fiveMinutesAgo.diff(startAt, 'seconds');
                                    const RTime = Math.max(0, -diffInSeconds);
                                    setRemainingTime(RTime);
                                    if (RTime <= 0) redirectTo(res?.redirect_url, res?.relatedTo);
                                }, 3000),
                            );
                            // @ts-ignore
                        } else if (typeof res?.message === 'string') {
                            // @ts-ignore
                            awesomeAlert({msg: res?.message, type: AlertTypeEnum.error});
                        }
                        return res;
                    })
                    .catch((err) => {
                        console.error(err);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } else {
                setLoading(false);
                awesomeAlert({msg: 'Enter the UPI ID', type: AlertTypeEnum.error});
            }
        } else {
            if (data.utr && data.utr.length === 12) {
                console.log(loading, 'loading');

                updateTransaction(typeof id === 'string' ? id : ':id', {
                    utr: data.utr,
                    selectedPaymentMethod: selectedMethod,
                })
                    .then((res) => {
                        if (res?.utr) {
                            setTimeout(() => {
                                setLoading(false);
                                setSucceeded(true);
                            }, 3000);
                            setTimeout(() => {
                                redirectTo(res?.redirect_url, res?.relatedTo);
                            }, 6000);
                            // @ts-ignore
                        } else if (typeof res?.message === 'string') {
                            setLoading(false);
                            // @ts-ignore
                            awesomeAlert({msg: res?.message, type: AlertTypeEnum.error});
                        }
                        return res;
                    })
                    .catch((err) => {
                        setLoading(false);
                        console.error(err);
                    });
            } else {
                setLoading(false);
                awesomeAlert({msg: 'UTR Must Be 12 Digit only', type: AlertTypeEnum.error});
            }
        }
        // setLoading(false);
        return;
    };
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (lang?: string) => {
        setAnchorEl(null);
        setLang(lang || '');
    };

    useEffect(() => {
        if (process.env.NEXT_PUBLIC_API_URL === 'https://api.payz365.com') {
            const siteId = 3631825;
            const hotjarVersion = 6;
            Hotjar.init(siteId, hotjarVersion);
        }
        let fetchStatusIntervalId: NodeJS.Timer;
        if (typeof id === 'string') {
            fetchTransaction()
                .then(async (res) => {
                    if (res) {
                        const bank_type = res.bank_type ?? BankTypesEnum.default;
                        if (!isUpiCollectFn(bank_type)) {
                            if (!res.initial_redirect) {
                                setTransaction(res);
                                if (
                                    res?.status !== TransactionStatusEnum.initiate ||
                                    remainingTime === 0
                                ) {
                                    setTimeout(async () => {
                                        await redirectTo(res.redirect_url, res.relatedTo);
                                    }, 3000);
                                }
                            } else if (res?.status === TransactionStatusEnum.initiate) {
                                await router.push(res.initial_redirect);
                            } else {
                                setTimeout(async () => {
                                    await redirectTo(res.redirect_url, res.relatedTo);
                                }, 5000);
                            }

                            if (
                                (res.qr_Link && res?.status === TransactionStatusEnum.initiate) ||
                                bank_type === BankTypesEnum.autoPayIn
                                // || bank_type === BankTypesEnum.default
                            )
                                fetchStatusIntervalId = setInterval(
                                    () =>
                                        fetchTransactionStatus(
                                            res._id,
                                            res.redirect_url,
                                            res.relatedTo,
                                        ),
                                    10000,
                                ); // Poll every 10 seconds
                            setTimerIntervalId(
                                setInterval(() => {
                                    const createdAt = moment(res?.createdAt);
                                    const fiveMinutesAgo = moment().subtract(10, 'minutes');
                                    const diffInSeconds = fiveMinutesAgo.diff(createdAt, 'seconds');
                                    const RTime = Math.max(0, -diffInSeconds);
                                    setRemainingTime(RTime);
                                    if (RTime <= 0) redirectTo(res?.redirect_url, res?.relatedTo);
                                }, 1000),
                            );
                        } else {
                            setTransaction(res);

                            fetchStatusIntervalId = setInterval(
                                () =>
                                    fetchTransactionStatus(
                                        res._id,
                                        res.redirect_url,
                                        res.relatedTo,
                                    ),
                                10000,
                            ); // Poll every 10 seconds
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        }
        return () => {
            clearInterval(fetchStatusIntervalId);
            clearInterval(timerIntervalId);
        };
    }, [id]);

    const isPageEpired =
        !loading &&
        (!transaction?.utr ||
            (transaction?.qr_Link && transaction?.status === TransactionStatusEnum.initiate)) &&
        remainingTime === 0;
    // Timer Part
    const $translate = (text: string) => {
        if (lang === 'தமிழ்') return langTamil[text];
        else if (lang === 'తెలుగు') return langTelgu[text];
        else if (lang === 'हिन्दी') return langHindi[text];
        else if (lang === 'മലയാളം') return langMalayalam[text];
        else return langEn[text];
    };
    if (transaction?.bank_type === BankTypesEnum.payTMe && transaction?.externalRedirectUrl)
        return (window.location.href = transaction?.externalRedirectUrl);
    return (
        <Grid
            container
            justifyContent="center"
            sx={{
                height: '100vh',
                width: '100%',
                padding: 0,
                margin: 0,
            }}
        >
            <Grid
                item
                xs={12}
                sm={7}
                md={5}
                lg={4}
                xl={3}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor: '#fff',
                    height: '100vh',
                    padding: 0,
                }}
            >
                {loading ? (
                    <Spinner />
                ) : !loading && (succeeded || externalTransactionCondition) ? (
                    <PaymentUnderProcessPage $translate={$translate} transaction={transaction} />
                ) : isPageEpired ? (
                    <Typography
                        variant="h5"
                        sx={{
                            m: 3,
                            p: 2,
                            pr: 4,
                            display: 'inline-block',
                            border: `2px double`,
                        }}
                    >
                        <HourglassDisabled color="error" sx={{mr: 1}} />
                        This page expired
                    </Typography>
                ) : (
                    <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                        <TimerAndLanguage
                            remainingTime={remainingTime}
                            handleClick={handleClick}
                            lang={lang}
                            anchorEl={anchorEl}
                            openLang={openLang}
                            handleClose={handleClose}
                            $translate={$translate}
                        />
                        <Box
                            sx={{
                                padding: 2,
                                background: '#D2DFE7',
                                flexGrow: 1,
                                overflowY: 'auto',
                            }}
                        >
                            <AmountContainer $translate={$translate} transaction={transaction} />
                            {/* For Gateway dont show the qr */}
                            {transaction?.isQRIntent ? (
                                <PaymentMethodMobile transaction={transaction} />
                            ) : (
                                <PaymentMethodDesktop
                                    $translate={$translate}
                                    onSubmit={handleSubmit}
                                    transaction={transaction}
                                    setSelectedMethod={setSelectedMethod}
                                    selectedMethod={selectedMethod}
                                    bankAccount={bankAccount}
                                />
                            )}
                            {!transaction?.isQRIntent && (
                                <Box sx={{textAlign: 'center', padding: 1}}>
                                    <Typography
                                        variant="body2"
                                        gutterBottom
                                        color="textSecondary"
                                        sx={{fontWeight: '500', color: '#777777'}}
                                    >
                                        <strong>Note:</strong>
                                        {$translate('ProceedIMPS_UPI_QR')}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}
            </Grid>
        </Grid>
    );
}
{
    /* <Box
                            sx={{
                                backgroundColor: '#001F6D',
                                color: 'white',
                                padding: '16px 0',
                                textAlign: 'center',
                                width: '100%',
                            }}
                        >
                            <Typography sx={{color: '#ffffff', fontSize: '12px', fontWeight: 200}}>
                                {$translate('Watch_Video')}
                            </Typography>
                        </Box> */
}
