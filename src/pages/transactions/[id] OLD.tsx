import * as React from 'react';
import {FormEvent, useEffect, useState} from 'react';
import {ITransaction} from '@/utils/interfaces/transaction.interface';
import {useRouter} from 'next/router';
import {
    getTransaction,
    getTransactionRedirectUrl,
    getTransactionStatusById,
    updateTransaction,
} from '@/utils/services/transactions';
import moment from 'moment';
import {MainSection} from '@/components/test-transaction/mainSection';
import awesomeAlert from '@/utils/functions/alert';
import {AlertTypeEnum} from '@/utils/enums/alertType';
import {CircularProgress, Typography} from '@mui/material';
import {IUpdateTransactionDto} from '@/utils/dto/transactions.dto';
import Box from '@mui/material/Box';
import {MainSectionOld} from '@/components/test-transaction/mainSectionOld';
import {TransactionStatusEnum} from '@/utils/enums/transactionStatus';
import Hotjar from '@hotjar/browser';
import {DoneAll, HourglassDisabled} from '@mui/icons-material';
import {theme} from '@/utils/theme';
import {BankTypesEnum} from '@/utils/enums/bankTypes.enum';
import {isUpiCollectFn} from '@/utils/functions/global';

export default function TransactionShow() {
    const [loading, setLoading] = useState(false);
    const [timerIntervalId, setTimerIntervalId] = useState<NodeJS.Timer>();
    const [remainingTime, setRemainingTime] = useState(300);
    const [transaction, setTransaction] = useState<ITransaction>();
    const bank_type = transaction?.bank_type ?? 0;
    const externalTransactionCondition =
        (bank_type === BankTypesEnum.autoPayIn ||
            bank_type === BankTypesEnum.recopays ||
            bank_type === BankTypesEnum.pay365 ||
            bank_type === BankTypesEnum.tappay ||
            bank_type === BankTypesEnum.firstPe ||
            bank_type === BankTypesEnum.airpay ||
            bank_type === BankTypesEnum.xettle ||
            bank_type === BankTypesEnum.starpaisa ||
            bank_type === BankTypesEnum.payWing) &&
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
    const fetchTransaction: () => Promise<ITransaction | undefined> = async () => {
        setLoading(true);
        const res = await getTransaction(typeof id === 'string' ? id : ':id');
        if (
            (res?.status !== TransactionStatusEnum.initiate && res) ||
            (remainingTime === 0 && res) ||
            res?.utr
        ) {
            await redirectTo(res.redirect_url, res.relatedTo);
        }
        setLoading(false);
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
                    if (res?.status === TransactionStatusEnum.success)
                        awesomeAlert({msg: 'Transaction Success', type: AlertTypeEnum.success});
                }
                if (isUpiCollectFn(res?.bank_type ?? BankTypesEnum.default)) {
                    if (
                        !(
                            res?.status === TransactionStatusEnum.initiate ||
                            res?.status === TransactionStatusEnum.pending
                        ) ||
                        remainingTime === 0
                    ) {
                        await redirectTo(redirect_url, relatedTo);
                    }
                } else {
                    if (
                        !(
                            res?.status === TransactionStatusEnum.initiate ||
                            res?.status === TransactionStatusEnum.pending
                        ) ||
                        remainingTime === 0
                    ) {
                        await redirectTo(redirect_url, relatedTo);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data: IUpdateTransactionDto = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        if (isUpiCollect) {
            if (data.upi_id) {
                setLoading(true);
                updateTransaction(typeof id === 'string' ? id : ':id', {upi_id: data.upi_id})
                    .then((res) => {
                        if (res?._id) {
                            awesomeAlert({
                                msg: 'UPI submit successfully',
                                type: AlertTypeEnum.success,
                            });
                            setTransaction(res);
                            setTimerIntervalId(
                                setInterval(() => {
                                    const startAt = moment(res.updatedAt);
                                    const fiveMinutesAgo = moment().subtract(5, 'minutes');
                                    const diffInSeconds = fiveMinutesAgo.diff(startAt, 'seconds');
                                    const RTime = Math.max(0, -diffInSeconds);
                                    setRemainingTime(RTime);
                                    if (RTime <= 0) redirectTo(res?.redirect_url, res?.relatedTo);
                                }, 1000),
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
                awesomeAlert({msg: 'Enter the UPI ID', type: AlertTypeEnum.error});
            }
        } else {
            if (data.utr && data.utr.length === 12) {
                updateTransaction(typeof id === 'string' ? id : ':id', {utr: data.utr})
                    .then((res) => {
                        if (res?._id) {
                            awesomeAlert({
                                msg: 'UTR submit successfully',
                                type: AlertTypeEnum.success,
                            });
                            if (transaction?.redirect_url) {
                                window.location.href = transaction.redirect_url;
                            } else {
                                window.location.reload();
                            }
                            // @ts-ignore
                        } else if (typeof res?.message === 'string') {
                            // @ts-ignore
                            awesomeAlert({msg: res?.message, type: AlertTypeEnum.error});
                        }
                        return res;
                    })
                    .catch((err) => {
                        setLoading(false);
                        console.error(err);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } else {
                awesomeAlert({msg: 'UTR Must Be 12 Digit only', type: AlertTypeEnum.error});
            }
        }
        setLoading(false);
        return;
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
                                    await redirectTo(res.redirect_url, res.relatedTo);
                                }
                            } else if (res?.status === TransactionStatusEnum.initiate) {
                                await router.push(res.initial_redirect);
                            } else {
                                await redirectTo(res.redirect_url, res.relatedTo);
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
    useEffect(() => {}, [loading]);
    return (
        <>
            {loading && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <CircularProgress size={50} />
                </Box>
            )}
            {!loading &&
                (!transaction?.utr ||
                    (transaction?.qr_Link &&
                        transaction?.status === TransactionStatusEnum.initiate)) &&
                remainingTime === 0 && (
                    <Typography
                        variant="h5"
                        sx={{
                            m: 3,
                            p: 2,
                            pr: 4,
                            display: 'inline-block',
                            border: `2px double ${theme.palette.error.main}`,
                        }}
                    >
                        <HourglassDisabled color="error" sx={{mr: 1}} />
                        This page expired
                    </Typography>
                )}
            {!loading &&
                !isUpiCollect &&
                (!transaction?.utr || externalTransactionCondition) &&
                remainingTime > 0 &&
                !!transaction &&
                (isOldStyle ? (
                    <MainSectionOld
                        loading={loading}
                        transaction={transaction}
                        onSubmit={handleSubmit}
                    />
                ) : (
                    <MainSection
                        loading={loading}
                        transaction={transaction}
                        onSubmit={handleSubmit}
                    />
                ))}
            {!loading && isUpiCollect && remainingTime > 0 && !!transaction && (
                <MainSection loading={loading} transaction={transaction} onSubmit={handleSubmit} />
            )}
            {!loading && (!!transaction?.utr || externalTransactionCondition) && (
                <Typography
                    variant="h5"
                    sx={{
                        m: 3,
                        p: 2,
                        pr: 4,
                        display: 'inline-block',
                        border: `2px double ${theme.palette.success.main}`,
                    }}
                >
                    <DoneAll color="success" sx={{mr: 1}} />
                    Submission Successful
                </Typography>
            )}
        </>
    );
}
