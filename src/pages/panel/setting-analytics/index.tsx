import {useSelector} from 'react-redux';
import React, {FormEvent, useEffect, useState, useRef} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import Box from '@mui/material/Box';
import {
    Button,
    Chip,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Tooltip,
    Typography,
} from '@mui/material';
import MainFilter from '@/components/filter/mainFilter';
import {FilterEnums} from '@/utils/enums/filter';
import moment from 'moment';
import {IFilterTransactionDto} from '@/utils/dto/transactions.dto';
import {getTransactionStatistics} from '@/utils/services/transactions';
import {
    getTransactionAnalytics,
    getTransactionAnalyticsPayCircle,
    getTransactionAnalyticsZelapp,
} from '@/utils/services/transactions';
import {getpayoutTransactionAnalytics} from '@/utils/services/payoutTransactions';
import DateRangePicker2 from '@/components/filter/main/dateRangePicker2';
import PayInOutFileTable from '@/components/tables/payInOut';
import {ITable, ITransaction, IGetAnalytics} from '@/utils/interfaces/transaction.interface';
import {IStatistics, IFilterTransactionStatistics} from '@/utils/interfaces/transaction.interface';
import {IpayInOut} from '@/utils/interfaces/payInOut.interface';
import awesomeAlert from '@/utils/functions/alert';
import {PageLoader} from '@/components/main/pageLoader';
import {FormControlLabel, Switch} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import {SETTINGS_ANALYTICS_ROUTE, SETTINGS_ROUTE} from '@/utils/endpoints/routes';
import {getBankAccounts} from '@/utils/services/bankAccount';
import {BankTypesEnum} from '@/utils/enums/bankTypes.enum';
import {RoleEnum} from '@/utils/enums/role';
import {IOptionItem} from '@/components/filter/main/filterSelect';
import {ISetting, ISettingDto} from '@/utils/interfaces/settings.interface';
import UpdateUPIDialogue from './components/updateUPIDialogue';
import BankAmountRanges from '@/pages/panel/account-details/components/bankAmountRanges';
import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import {TransactionStatusEnum} from '@/utils/enums/transactionStatus';
import {BankAccountStatusEnum, BankAccountTypesEnum} from '@/utils/enums/accountDetails.enums';

let interval: NodeJS.Timeout | null = null;
export type IUpiItem = IOptionItem & {type: BankTypesEnum};
const initialFormData: any = {
    upi_ids: '',
    relatedTo: '',
};

const SettingsAnalytics = () => {
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const userId = useSelector((state: RootState) => state.auth.user)?._id;
    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [limit, setLimit] = useState<number>(50);
    const [handle, setHandle] = useState<any>('payin');
    const [popupData, setPopupData] = useState<any>('');
    const [filter, setFilter] = useState<IFilterTransactionStatistics>({});
    const [zelAppdata, setZelAppdata] = useState<any>({});
    const [payCircleAppdata, setpayCircleAppdata] = useState<any>({});
    const [startDate, setStartDate] = useState<moment.Moment>(moment());
    const [startTime, setStartTime] = useState<moment.Moment>(moment().startOf('day'));
    const [endDate, setEndDate] = useState<moment.Moment>(moment().add(1, 'day').second(0));
    const [endTime, setEndTime] = useState<moment.Moment>(moment().startOf('day').second(0));
    const [payData, setPayData] = useState<IStatistics[] | any>([]);
    const [openViewDialog, setOpenViewDialog] = useState<boolean>(false);
    const [payIn, setPayIn] = useState<any>('payin');
    const [statistics, setStatistics] = useState<any>({});
    const [data1, setData1] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [statisticsLoader, setStatisticsloader] = useState(false);
    const [showTestCompany, setShowTestCompany] = useState(false);
    const [upis, setUpis] = useState<IUpiItem[]>([]);
    const [formData, setFormData] = useState<any>(initialFormData);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchAnalyticsData = async (f?: Partial<IStatistics>, updatedPayIn?: string) => {
        setLoading(true);
        const filters: Partial<IStatistics> = f || filter;
        try {
            let res: ITable<ITransaction[]> | undefined;
            let res2: IGetAnalytics[] | {} = {};
            let res3: IGetAnalytics[] | {} = {};
            if (handle === 'payin') {
                const [data, analyticsZelapp, analyticsPayCircle] = await Promise.all([
                    getTransactionAnalytics({page: page + 1, limit, filter: filters}),
                    getTransactionAnalyticsZelapp({filter: filters}),
                    getTransactionAnalyticsPayCircle({filter: filters}),
                ]);
                const transactions: any = data?.transactions?.map((item) => ({
                    ...item,
                    successRate: Number.isInteger(item.successRate)
                        ? item?.successRate?.toFixed(0) + '%'
                        : item?.successRate?.toFixed(2) + '%',
                }));
                const {pages = 0, total = 0} = data || {};
                res = {
                    pages,
                    total,
                    transactions,
                };
                res2 = analyticsZelapp;
                res3 = analyticsPayCircle;
            } else {
                res = await getpayoutTransactionAnalytics({page: page + 1, limit, filter: filters});
            }
            if (res) {
                setPayData(res.transactions ?? []);
                setTotal(res.total ?? 0);
            }
            if (res2) {
                const data: any = res2;
                const modifiedSuccessRate = Number.isInteger(data?.successRate)
                    ? data?.successRate.toFixed(0) + '%'
                    : data?.successRate.toFixed(2) + '%';

                setZelAppdata({...data, successRate: modifiedSuccessRate});
            }
            if (res3) {
                const data: any = res3;
                const modifiedSuccessRate = Number.isInteger(data?.successRate)
                    ? data?.successRate.toFixed(0) + '%'
                    : data?.successRate.toFixed(2) + '%';

                setpayCircleAppdata({...data, successRate: modifiedSuccessRate});
            }
        } catch (error) {
            console.error('Error fetching transaction analytics:', error);
        }
        setLoading(false);
    };

    const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
        if (handle !== 'payout') {
            setDateToLast15Min(false);
        }
        setPayData([]);
        e?.preventDefault();
        setPage(0);
        const formData = new FormData(e?.currentTarget);
        const data: Partial<IpayInOut> = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        const updatedPayIn = data.payment_action;
        setPayIn(updatedPayIn);
        setData1(data);

        const {payment_action, ...filteredData} = data;
        if (handle === 'payin') {
            getStatistics(filteredData);
        }
        await fetchAnalyticsData(data, updatedPayIn);
    };

    useEffect(() => {
        setPayData([]);
        setDateToLast15Min(false);
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [handle]);

    const setDateToLast15Min = async (loading15: boolean) => {
        if (handle !== 'payin') {
            setPayData([]);
        }
        if (handle === 'payin' && loading15) {
            awesomeAlert({msg: 'Auto Refresh Started'});
        }
        const indiaTime = new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
        const todayFormatter = moment(indiaTime);
        const todayAfter15Min = moment(indiaTime).subtract(15, 'minutes');
        if (loading15) {
            setStartDate(todayFormatter);
            setStartTime(todayAfter15Min);
            setEndDate(todayFormatter);
            setEndTime(todayFormatter);
        }
        if (handle === 'payout') {
            setStartDate(todayFormatter);
            setStartTime(todayAfter15Min);
            setEndDate(todayFormatter);
            setEndTime(todayFormatter);
        }
        let startDate = todayFormatter.format('YYYY-MM-DD');
        let startTime = todayAfter15Min.format('HH:mm:ss');
        let endDate = todayFormatter.format('YYYY-MM-DD');
        let endTime = moment(indiaTime).format('HH:mm:ss');

        let data = {
            startDate: `${startDate} ${startTime}`,
            endDate: `${endDate} ${endTime}`,
        } as Partial<IStatistics>;

        const fetchAndUpdate = () => {
            const indiaTimeNow = new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
            const todayFormatter = moment(indiaTimeNow);
            const todayAfter15Min = moment(indiaTimeNow).subtract(15, 'minutes');
            startDate = todayFormatter.format('YYYY-MM-DD');
            startTime = todayAfter15Min.format('HH:mm:ss');
            endDate = todayFormatter.format('YYYY-MM-DD');
            endTime = todayFormatter.format('HH:mm:ss');
            setStartDate(todayFormatter);
            setStartTime(todayAfter15Min);
            setEndDate(todayFormatter);
            setEndTime(todayFormatter);
            awesomeAlert({msg: 'Refreshed'});
            data = {
                startDate: `${startDate} ${startTime}`,
                endDate: `${endDate} ${endTime}`,
            } as Partial<IStatistics>;
            getStatistics(data);
            fetchAnalyticsData(data, payIn);
        };

        if (loading15 && !intervalRef.current) {
            getStatistics(data);
            fetchAnalyticsData(data, payIn);
        }

        if (loading15 && !intervalRef.current) {
            intervalRef.current = setInterval(() => {
                fetchAndUpdate();
            }, 30000);
        } else if (!loading15 && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            awesomeAlert({msg: 'Auto Refresh Stopped'});
        }

        if (handle === 'payout') {
            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            };
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    };

    const OpenKeyValueViewDailog = () => {
        setOpenViewDialog(true);
    };

    const getStatistics = async (filter?: IFilterTransactionDto | any) => {
        const filters = filter || {
            startDate: moment().startOf('day').toDate(),
        };
        setStatisticsloader(true);

        const res = await getTransactionStatistics({
            filter: filters,
        }).then((res) => {
            if (res) {
                const {data, ...statistics} = res;
                const modifiedSuccessRate = Number.isInteger(statistics?.successRate)
                    ? statistics?.successRate?.toFixed(0) + '%'
                    : statistics?.successRate?.toFixed(2) + '%';
                setStatistics({
                    ...statistics,
                    successRate: modifiedSuccessRate,
                });
            }
        });

        setStatisticsloader(false);
    };
    useEffect(() => {
        getStatistics();
    }, []);

    useEffect(() => {
        if (userId && !loading) fetchAnalyticsData(data1, payIn).then((r) => r);
    }, [page, limit, userId]);

    const handleChange = (data: any) => {
        setHandle(data);
    };

    const fetchBankAccounts = async (relatedTo?: string): Promise<any[]> => {
        const filter: Partial<IBankAccount> = !roles?.includes(RoleEnum.UserControl)
            ? {relatedTo: userId}
            : relatedTo
            ? {relatedTo}
            : {};
        filter.accountType = BankAccountTypesEnum.payin;

        const res: IBankAccount[] | undefined = await getBankAccounts(filter);

        if (res) {
            const liveBankAccounts = res
                ?.filter(
                    (a) =>
                        (a.bank_type !== BankTypesEnum.default || //if gateway
                            (a.bank_type === BankTypesEnum.default &&
                                a.status === BankAccountStatusEnum.live)) &&
                        a.is_active,
                )
                ?.map((account) => ({
                    id: account._id,
                    value: (
                        <>
                            <Typography component={'span'} sx={{fontWeight: 600, mr: 1}}>
                                {account.bank_type === BankTypesEnum.default
                                    ? 'Bank:'
                                    : ' Gateway:'}
                            </Typography>
                            <Typography component={'span'}>
                                {account.upi_id} | {account.name}
                            </Typography>
                        </>
                    ),
                    type: account.bank_type as BankTypesEnum,
                    upi_id: account.upi_id,
                    name: account.name,
                    bankAmountRange: account.bankAmountRange,
                    status: account.status,
                }));

            return liveBankAccounts;
        }
        return [];
    };

    const handleRouter = (data: any) => {
        if (payIn === 'payin') {
            localStorage.setItem('id', data?.userId);
            OpenKeyValueViewDailog();
            setPopupData(data);
            fetchBankAccounts(data?.userId).then((res) => setUpis(res));
            setFormData(data);
        }
    };

    return (
        <DashboardLayout>
            <Box sx={{flexGrow: 1, mb: 2, pb: 2}}>
                {/* <Container maxWidth="lg" sx={{mt: 4,}} style={{paddingBottom:"2rem"}} > */}
                <Typography
                    variant="h5"
                    sx={{mb: 2, mt: 4, fontWeight: '500', fontSize: '30px', ml: 3}}
                >
                    Analytics
                </Typography>

                <MainFilter
                    loading={false}
                    filter={{}}
                    onSubmit={handleSubmit}
                    selectedFilters={[FilterEnums.payment_action, FilterEnums.noRelatedTo]}
                    handleChange={handleChange}
                    afterFilterBtn={
                        <Button
                            variant="contained"
                            onClick={() => setDateToLast15Min(handle === 'payin' ? true : false)}
                            sx={{textTransform: 'capitalize', m: 1, ml: 2, px: 2}}
                            color="success"
                        >
                            Select last 15 min
                        </Button>
                    }
                >
                    <DateRangePicker2
                        startDate2={startDate}
                        endDate2={endDate}
                        startTime2={startTime}
                        endTime2={endTime}
                    />
                </MainFilter>
                <UpdateUPIDialogue
                    fetchAnalyticsData={fetchAnalyticsData}
                    openViewDialog={openViewDialog}
                    setLoading={setLoading}
                    setOpenViewDialog={setOpenViewDialog}
                    payIn={payIn}
                    popupData={popupData}
                    formData={formData}
                    data1={data1}
                    upis={upis}
                    setFormData={setFormData}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={!showTestCompany}
                            onChange={() => setShowTestCompany(!showTestCompany)}
                        />
                    }
                    sx={{ml: 1}}
                    label={!showTestCompany ? 'Card View' : 'Table View'}
                />
                <div>
                    {showTestCompany ? (
                        <div>
                            {handle === 'payin' && (
                                <>
                                    {parseFloat(statistics?.successRate) < 30 &&
                                        statistics?.earnings !== 0 && (
                                            <div>
                                                <Typography variant="h6" sx={{mt: 2, ml: 2}}>
                                                    Payz365
                                                </Typography>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12}>
                                                        <Box
                                                            sx={{
                                                                borderRadius: '12px',
                                                                boxShadow:
                                                                    '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                                background:
                                                                    parseFloat(
                                                                        statistics?.successRate,
                                                                    ) < 30
                                                                        ? '#6ed875'
                                                                        : '#6e2345',
                                                                animation:
                                                                    parseFloat(
                                                                        statistics?.successRate,
                                                                    ) < 30
                                                                        ? 'dropShadowAnimation 1s linear infinite'
                                                                        : '',
                                                            }}
                                                        >
                                                            <Grid
                                                                container
                                                                spacing={3}
                                                                sx={{
                                                                    textAlign: 'center',
                                                                    mt: 2,
                                                                    justifyContent: 'space-between',
                                                                    flexFlow: 'nowrap',
                                                                }}
                                                            >
                                                                <Grid sx={{mt: 2, mb: 2}} xs={2}>
                                                                    Payz365
                                                                </Grid>
                                                                {roles?.includes(
                                                                    RoleEnum.EarningTotal,
                                                                ) && (
                                                                    <Grid
                                                                        sx={{mt: 2, mb: 2}}
                                                                        xs={2}
                                                                    >
                                                                        Total -{' '}
                                                                        {statistics?.earnings}
                                                                    </Grid>
                                                                )}
                                                                <Grid sx={{mt: 2, mb: 2}} xs={2}>
                                                                    SucessRate -{' '}
                                                                    {statistics?.successRate}
                                                                </Grid>
                                                                <Grid sx={{mt: 2, mb: 2}} xs={2}>
                                                                    Success - {statistics?.success}
                                                                </Grid>
                                                                <Grid sx={{mt: 2, mb: 2}} xs={2}>
                                                                    Total Attempts -{' '}
                                                                    {statistics?.total}
                                                                </Grid>
                                                            </Grid>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        )}
                                    {parseFloat(zelAppdata.successRate) < 30 &&
                                        zelAppdata.successAmount !== 0 && (
                                            <div>
                                                <Typography variant="h6" sx={{mt: 2, ml: 2}}>
                                                    Zelappayment
                                                </Typography>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12}>
                                                        <Box
                                                            sx={{
                                                                borderRadius: '12px',
                                                                boxShadow:
                                                                    '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                                background:
                                                                    parseFloat(
                                                                        zelAppdata.successRate,
                                                                    ) < 30
                                                                        ? '#6ed875'
                                                                        : '#6ed9d4',
                                                                animation:
                                                                    parseFloat(
                                                                        zelAppdata.successRate,
                                                                    ) < 30
                                                                        ? 'dropShadowAnimation 1s linear infinite'
                                                                        : '',
                                                            }}
                                                        >
                                                            <Grid
                                                                container
                                                                spacing={3}
                                                                sx={{
                                                                    textAlign: 'center',
                                                                    mt: 2,
                                                                    justifyContent: 'space-between',
                                                                }}
                                                            >
                                                                <Grid sx={{m: 2}} xs={3}>
                                                                    Zelappayment
                                                                </Grid>
                                                                {roles?.includes(
                                                                    RoleEnum.EarningTotal,
                                                                ) && (
                                                                    <Grid sx={{m: 2}} xs={3}>
                                                                        Total -{' '}
                                                                        {zelAppdata?.successAmount}
                                                                    </Grid>
                                                                )}
                                                                <Grid sx={{m: 2}} xs={4}>
                                                                    SucessRate -{' '}
                                                                    {zelAppdata?.successRate}
                                                                </Grid>
                                                                <Grid sx={{m: 2}} xs={4}>
                                                                    Success -{' '}
                                                                    {zelAppdata?.successCount}
                                                                </Grid>
                                                                <Grid sx={{m: 2}} xs={4}>
                                                                    Total Attempts -{' '}
                                                                    {zelAppdata?.totalCount}
                                                                </Grid>
                                                            </Grid>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        )}
                                    {parseFloat(payCircleAppdata.successRate) < 30 &&
                                        payCircleAppdata.successAmount !== 0 && (
                                            <div>
                                                <Typography variant="h6" sx={{m: 2, mb: 0}}>
                                                    PaymentCircles
                                                </Typography>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12}>
                                                        <Box
                                                            sx={{
                                                                background:
                                                                    parseFloat(
                                                                        payCircleAppdata.successRate,
                                                                    ) < 30
                                                                        ? '#6ed875'
                                                                        : '#6ed883',
                                                                borderRadius: '12px',
                                                                boxShadow:
                                                                    '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                                animation:
                                                                    parseFloat(
                                                                        payCircleAppdata.successRate,
                                                                    ) < 30
                                                                        ? 'dropShadowAnimation 1s linear infinite'
                                                                        : '',
                                                            }}
                                                        >
                                                            <Grid
                                                                container
                                                                spacing={3}
                                                                sx={{
                                                                    textAlign: 'center',
                                                                    mb: 2,
                                                                    mt: 2,
                                                                    justifyContent: 'space-between',
                                                                }}
                                                            >
                                                                <Grid sx={{m: 2}} xs={3}>
                                                                    Payment Circle
                                                                </Grid>
                                                                {roles?.includes(
                                                                    RoleEnum.EarningTotal,
                                                                ) && (
                                                                    <Grid
                                                                        sx={{mt: 2, mb: 2}}
                                                                        xs={2}
                                                                    >
                                                                        Total -{' '}
                                                                        {
                                                                            payCircleAppdata?.successAmount
                                                                        }
                                                                    </Grid>
                                                                )}
                                                                <Grid sx={{mt: 2, mb: 2}} xs={2}>
                                                                    SuccessRate -{' '}
                                                                    {payCircleAppdata?.successRate}
                                                                </Grid>
                                                                <Grid sx={{mt: 2, mb: 2}} xs={2}>
                                                                    Success -{' '}
                                                                    {payCircleAppdata?.successCount}
                                                                </Grid>
                                                                <Grid sx={{mt: 2, mb: 2}} xs={2}>
                                                                    Total Attempts -{' '}
                                                                    {payCircleAppdata?.totalCount}
                                                                </Grid>
                                                            </Grid>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        )}
                                </>
                            )}

                            <div>
                                <Typography variant="h6" sx={{m: 2}}>
                                    Payz365
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <PayInOutFileTable
                                            loading={loading}
                                            setPage={(page: number) => setPage(page)}
                                            setLimit={(limit: number) => setLimit(limit)}
                                            limit={limit}
                                            page={page}
                                            total={total}
                                            payData={payData}
                                            payIn={handle}
                                            height={'maxHless'}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            {handle === 'payin' && (
                                <>
                                    {(!(parseFloat(statistics?.successRate) < 30) ||
                                        statistics?.earnings === 0) && (
                                        <div>
                                            <Typography
                                                variant="h6"
                                                sx={{mt: 2, ml: 2}}
                                            ></Typography>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <Box
                                                        sx={{
                                                            borderRadius: '12px',
                                                            boxShadow:
                                                                '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                            background:
                                                                parseFloat(
                                                                    statistics?.successRate,
                                                                ) < 30
                                                                    ? '#CD5C5C'
                                                                    : '#322653',
                                                            color: 'white',
                                                        }}
                                                    >
                                                        {statisticsLoader ? (
                                                            <PageLoader />
                                                        ) : (
                                                            <Grid
                                                                container
                                                                spacing={3}
                                                                sx={{
                                                                    textAlign: 'center',
                                                                    mt: 2,
                                                                    justifyContent: 'space-between',
                                                                    flexFlow: 'nowrap',
                                                                }}
                                                            >
                                                                {statistics?.earnings !== 0 &&
                                                                Object?.keys(statistics).length !==
                                                                    0 ? (
                                                                    <>
                                                                        <Grid sx={{m: 2}} xs={3}>
                                                                            Payz365
                                                                        </Grid>
                                                                        {roles?.includes(
                                                                            RoleEnum.EarningTotal,
                                                                        ) && (
                                                                            <Grid
                                                                                sx={{m: 2}}
                                                                                xs={3}
                                                                            >
                                                                                Total -{' '}
                                                                                {
                                                                                    statistics?.earnings
                                                                                }
                                                                            </Grid>
                                                                        )}
                                                                        <Grid sx={{m: 2}} xs={4}>
                                                                            SucessRate -{' '}
                                                                            {
                                                                                statistics?.successRate
                                                                            }
                                                                        </Grid>
                                                                        <Grid sx={{m: 2}} xs={4}>
                                                                            Success -{' '}
                                                                            {statistics?.success}
                                                                        </Grid>
                                                                        <Grid sx={{m: 2}} xs={4}>
                                                                            Total Attempts -{' '}
                                                                            {statistics?.total}
                                                                        </Grid>
                                                                    </>
                                                                ) : (
                                                                    <Grid
                                                                        container
                                                                        sx={{
                                                                            textAlign: 'center',
                                                                            mb: 2,
                                                                            mt: 2,
                                                                        }}
                                                                        style={{
                                                                            display: 'flex',
                                                                            justifyContent:
                                                                                'center',
                                                                        }}
                                                                    >
                                                                        Success Data Not Available
                                                                    </Grid>
                                                                )}
                                                            </Grid>
                                                        )}
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    )}
                                    {(!(parseFloat(zelAppdata.successRate) < 30) ||
                                        zelAppdata.successAmount === 0) && (
                                        <div>
                                            <Typography variant="h6" sx={{mt: 2, ml: 2}}>
                                                ZealAppPayment
                                            </Typography>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <Box
                                                        sx={{
                                                            borderRadius: '12px',
                                                            boxShadow:
                                                                '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                            background:
                                                                parseFloat(zelAppdata.successRate) <
                                                                30
                                                                    ? '#CD5C5C'
                                                                    : '#cbf1f5',
                                                        }}
                                                    >
                                                        <Grid
                                                            container
                                                            spacing={3}
                                                            sx={{
                                                                textAlign: 'center',
                                                                mt: 2,
                                                                justifyContent: 'space-between',
                                                            }}
                                                        >
                                                            {zelAppdata?.successAmount !== 0 &&
                                                            Object?.keys(zelAppdata).length !==
                                                                0 ? (
                                                                <>
                                                                    <Grid sx={{m: 2}} xs={3}>
                                                                        ZealAppPayment
                                                                    </Grid>
                                                                    {roles?.includes(
                                                                        RoleEnum.EarningTotal,
                                                                    ) && (
                                                                        <Grid
                                                                            sx={{mt: 2, mb: 2}}
                                                                            xs={2}
                                                                        >
                                                                            Total -{' '}
                                                                            {
                                                                                zelAppdata?.successAmount
                                                                            }
                                                                        </Grid>
                                                                    )}
                                                                    <Grid
                                                                        sx={{mt: 2, mb: 2}}
                                                                        xs={2}
                                                                    >
                                                                        SucessRate -{' '}
                                                                        {zelAppdata?.successRate}
                                                                    </Grid>
                                                                    <Grid
                                                                        sx={{mt: 2, mb: 2}}
                                                                        xs={2}
                                                                    >
                                                                        Success -{' '}
                                                                        {zelAppdata?.successCount}
                                                                    </Grid>
                                                                    <Grid
                                                                        sx={{mt: 2, mb: 2}}
                                                                        xs={2}
                                                                    >
                                                                        Total Attempts -{' '}
                                                                        {zelAppdata?.totalCount}
                                                                    </Grid>
                                                                </>
                                                            ) : (
                                                                <Grid
                                                                    container
                                                                    sx={{
                                                                        textAlign: 'center',
                                                                        mb: 2,
                                                                        mt: 2,
                                                                    }}
                                                                    style={{
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                    }}
                                                                >
                                                                    Success Data Not Available
                                                                </Grid>
                                                            )}
                                                        </Grid>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    )}
                                    {(!(parseFloat(payCircleAppdata.successRate) < 30) ||
                                        payCircleAppdata.successAmount === 0) && (
                                        <div>
                                            <Typography variant="h6" sx={{m: 2, mb: 0}}>
                                                Payment Circles
                                            </Typography>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <Box
                                                        sx={{
                                                            background:
                                                                parseFloat(
                                                                    payCircleAppdata.successRate,
                                                                ) < 30
                                                                    ? '#CD5C5C'
                                                                    : '#74c0fc69',
                                                            borderRadius: '12px',
                                                            boxShadow:
                                                                '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                        }}
                                                    >
                                                        <Grid
                                                            container
                                                            spacing={3}
                                                            sx={{
                                                                textAlign: 'center',
                                                                mb: 4,
                                                                mt: 2,
                                                                justifyContent: 'space-between',
                                                            }}
                                                        >
                                                            {payCircleAppdata?.successAmount !==
                                                                0 &&
                                                            Object?.keys(payCircleAppdata)
                                                                .length !== 0 ? (
                                                                <>
                                                                    <Grid sx={{m: 2}} xs={3}>
                                                                        Payment Circle
                                                                    </Grid>
                                                                    {roles?.includes(
                                                                        RoleEnum.EarningTotal,
                                                                    ) && (
                                                                        <Grid
                                                                            sx={{mt: 2, mb: 2}}
                                                                            xs={2}
                                                                        >
                                                                            Total -{' '}
                                                                            {
                                                                                payCircleAppdata?.successAmount
                                                                            }
                                                                        </Grid>
                                                                    )}
                                                                    <Grid
                                                                        sx={{mt: 2, mb: 2}}
                                                                        xs={2}
                                                                    >
                                                                        SuccessRate -{' '}
                                                                        {
                                                                            payCircleAppdata?.successRate
                                                                        }
                                                                    </Grid>
                                                                    <Grid
                                                                        sx={{mt: 2, mb: 2}}
                                                                        xs={2}
                                                                    >
                                                                        Success -{' '}
                                                                        {
                                                                            payCircleAppdata?.successCount
                                                                        }
                                                                    </Grid>
                                                                    <Grid
                                                                        sx={{mt: 2, mb: 2}}
                                                                        xs={2}
                                                                    >
                                                                        Total Attempts -{' '}
                                                                        {
                                                                            payCircleAppdata?.totalCount
                                                                        }
                                                                    </Grid>
                                                                </>
                                                            ) : (
                                                                <Grid
                                                                    container
                                                                    sx={{
                                                                        textAlign: 'center',
                                                                        mb: 2,
                                                                        mt: 2,
                                                                    }}
                                                                    style={{
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                    }}
                                                                >
                                                                    Success Data Not Available
                                                                </Grid>
                                                            )}
                                                        </Grid>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        <div style={{paddingBottom: '2rem'}}>
                            {handle === 'payin' ? (
                                <div>
                                    <Grid container spacing={3} xs={12}>
                                        <Grid item xs={4} sx={{mt: 3}}>
                                            <Box
                                                sx={{
                                                    borderRadius: '12px',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                    background:
                                                        parseFloat(statistics?.successRate) < 30
                                                            ? '#6ed875'
                                                            : '#322653',
                                                    animation:
                                                        parseFloat(statistics?.successRate) < 30
                                                            ? 'dropShadowAnimation 1s linear infinite'
                                                            : '',
                                                    color:
                                                        parseFloat(statistics?.successRate) < 30
                                                            ? 'black'
                                                            : 'white',
                                                }}
                                            >
                                                <Grid spacing={4} sx={{p: 2}}>
                                                    <Grid
                                                        container
                                                        sx={{
                                                            borderBottom:
                                                                parseFloat(
                                                                    statistics?.successRate,
                                                                ) < 30
                                                                    ? '1px dashed black'
                                                                    : '1px dashed white',
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontWeight: '600',
                                                                fontSize: '22px',
                                                                overflowWrap: 'break-word',
                                                                wordBreak: 'break-word',
                                                                maxWidth: '100%',
                                                            }}
                                                        >
                                                            Payz365
                                                        </Typography>
                                                    </Grid>

                                                    <Grid spacing={4} sx={{mt: 1}}>
                                                        <Typography>
                                                            Success Rate : {statistics?.successRate}
                                                        </Typography>

                                                        <Typography>
                                                            Success : {statistics?.success || 0}
                                                        </Typography>

                                                        <Typography>
                                                            Total Attempts :{' '}
                                                            {statistics?.total || 0}
                                                        </Typography>

                                                        {roles?.includes(RoleEnum.EarningTotal) && (
                                                            <Typography>
                                                                Total : {statistics?.earnings}
                                                            </Typography>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={4} sx={{mt: 3}}>
                                            <Box
                                                sx={{
                                                    borderRadius: '12px',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                    background:
                                                        parseFloat(zelAppdata?.successRate) < 30
                                                            ? '#6ed875'
                                                            : '#cbf1f5',
                                                    animation:
                                                        parseFloat(zelAppdata?.successRate) < 30
                                                            ? 'dropShadowAnimation 1s linear infinite'
                                                            : '',
                                                }}
                                            >
                                                <Grid spacing={4} sx={{p: 2}}>
                                                    <Grid
                                                        container
                                                        sx={{borderBottom: '1px dashed black'}}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontWeight: '600',
                                                                fontSize: '22px',
                                                                overflowWrap: 'break-word',
                                                                wordBreak: 'break-word',
                                                                maxWidth: '100%',
                                                            }}
                                                        >
                                                            ZealAppPayment
                                                        </Typography>
                                                    </Grid>

                                                    <Grid spacing={4} sx={{mt: 1}}>
                                                        <Typography>
                                                            Success Rate : {zelAppdata?.successRate}
                                                        </Typography>
                                                        <Typography>
                                                            Success :{' '}
                                                            {zelAppdata?.successCount || 0}
                                                        </Typography>
                                                        <Typography>
                                                            Total Attempts :{' '}
                                                            {zelAppdata?.totalCount || 0}
                                                        </Typography>
                                                        {roles?.includes(RoleEnum.EarningTotal) && (
                                                            <Typography>
                                                                Total : {zelAppdata?.successAmount}
                                                            </Typography>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={4} sx={{mt: 3}}>
                                            <Box
                                                sx={{
                                                    borderRadius: '12px',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                    background:
                                                        parseFloat(payCircleAppdata.successRate) <
                                                        30
                                                            ? '#6ed875'
                                                            : '#74c0fc69',
                                                    animation:
                                                        parseFloat(payCircleAppdata?.successRate) <
                                                        30
                                                            ? 'dropShadowAnimation 1s linear infinite'
                                                            : '',
                                                }}
                                            >
                                                <Grid spacing={4} sx={{p: 2}}>
                                                    <Grid
                                                        container
                                                        sx={{borderBottom: '1px dashed black'}}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontWeight: '600',
                                                                fontSize: '22px',
                                                                overflowWrap: 'break-word',
                                                                wordBreak: 'break-word',
                                                                maxWidth: '100%',
                                                            }}
                                                        >
                                                            Payment Circle
                                                        </Typography>
                                                    </Grid>

                                                    <Grid spacing={4} sx={{mt: 1}}>
                                                        <Typography>
                                                            Success Rate :{' '}
                                                            {payCircleAppdata?.successRate}
                                                        </Typography>
                                                        <Typography>
                                                            Success :{' '}
                                                            {payCircleAppdata?.successCount || 0}
                                                        </Typography>
                                                        <Typography>
                                                            Total Attempts :{' '}
                                                            {payCircleAppdata?.totalCount || 0}
                                                        </Typography>
                                                        {roles?.includes(RoleEnum.EarningTotal) && (
                                                            <Typography>
                                                                Total :{' '}
                                                                {payCircleAppdata?.successAmount}
                                                            </Typography>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <div
                                        style={{
                                            borderBottom: '2px dashed black',
                                            marginTop: '2.5rem',
                                            marginBottom: '2.5rem',
                                        }}
                                    />
                                    <Grid container spacing={3}>
                                        {payData.map((n: any, index: any) => (
                                            <Grid
                                                item
                                                key={index}
                                                xs={12}
                                                sm={6}
                                                md={4}
                                                sx={{cursor: 'pointer'}}
                                                onClick={() => handleRouter(n)}
                                            >
                                                <Box
                                                    sx={{
                                                        borderRadius: '12px',
                                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                        background:
                                                            parseFloat(n?.successRate) >= 30 &&
                                                            parseFloat(n?.successRate) < 40
                                                                ? '#fffacfb5'
                                                                : '#def7d6',
                                                        animation:
                                                            parseFloat(n?.successRate) < 30
                                                                ? 'dropShadowAnimation 1s linear infinite'
                                                                : '',
                                                        p: '10px 16px 10px 16px',
                                                        height: '100%',
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontWeight: '600',
                                                            fontSize: '22px',
                                                            borderBottom: '1px dashed black',
                                                            overflowWrap: 'break-word',
                                                        }}
                                                    >
                                                        {n?.userName}
                                                    </Typography>
                                                    <Typography sx={{mt: 0.5}}>
                                                        <span style={{fontWeight: 500}}>
                                                            Success Rate :
                                                        </span>{' '}
                                                        {n.successRate}
                                                    </Typography>
                                                    <Typography>
                                                        <span
                                                            style={{
                                                                fontWeight: 500,
                                                                overflowWrap: 'break-word',
                                                            }}
                                                        >
                                                            Success :
                                                        </span>{' '}
                                                        {n.successCount}
                                                    </Typography>
                                                    <Typography>
                                                        <span
                                                            style={{
                                                                fontWeight: 500,
                                                                overflowWrap: 'break-word',
                                                            }}
                                                        >
                                                            Total Attempts :
                                                        </span>{' '}
                                                        {n.totalCount}
                                                    </Typography>

                                                    {roles?.includes(
                                                        RoleEnum.AnalyticsAccountTotal,
                                                    ) && (
                                                        <Typography>
                                                            <span style={{fontWeight: 500}}>
                                                                Total :
                                                            </span>{' '}
                                                            {n.successAmount}
                                                        </Typography>
                                                    )}
                                                    <Typography>
                                                        <span
                                                            style={{
                                                                fontWeight: 500,
                                                                overflowWrap: 'break-word',
                                                                marginRight: '5px',
                                                            }}
                                                        >
                                                            A/c Name :
                                                        </span>
                                                        {n.bankAccount[0] &&
                                                            n.bankAccount[0]?.name?.map(
                                                                (
                                                                    accountName: any,
                                                                    index: number,
                                                                ) => {
                                                                    const accountId =
                                                                        n.bankAccount[0]?._id[
                                                                            index
                                                                        ];
                                                                    const transactionCount =
                                                                        n?.transactions?.filter(
                                                                            (a: any) =>
                                                                                a.status !=
                                                                                    TransactionStatusEnum.success &&
                                                                                a.bankAccountId ==
                                                                                    accountId,
                                                                        )?.length;
                                                                    const successTransactionCount =
                                                                        n?.transactions?.filter(
                                                                            (a: any) =>
                                                                                a.status ==
                                                                                    TransactionStatusEnum.success &&
                                                                                a.bankAccountId ==
                                                                                    accountId,
                                                                        )?.length;
                                                                    return (
                                                                        <Box
                                                                            sx={{
                                                                                display: 'flex',
                                                                                alignItems:
                                                                                    'center',
                                                                                fontWeight: 400,
                                                                                gap: 1,
                                                                                justifyContent:
                                                                                    'space-between',
                                                                                mb: 1,
                                                                            }}
                                                                        >
                                                                            <Box>{accountName}</Box>
                                                                            <Box
                                                                                sx={{
                                                                                    display: 'flex',
                                                                                    gap: 1,
                                                                                    justifyContent:
                                                                                        'space-between',
                                                                                }}
                                                                            >
                                                                                <Tooltip
                                                                                    title="Other Status Transactions"
                                                                                    placement="top"
                                                                                >
                                                                                    <Chip
                                                                                        label={
                                                                                            transactionCount ||
                                                                                            0
                                                                                        }
                                                                                    />
                                                                                </Tooltip>{' '}
                                                                                {successTransactionCount >
                                                                                    0 && (
                                                                                    <Tooltip
                                                                                        title="Successful Transactions"
                                                                                        placement="top"
                                                                                    >
                                                                                        <Chip
                                                                                            color="success"
                                                                                            label={
                                                                                                successTransactionCount ||
                                                                                                0
                                                                                            }
                                                                                        />
                                                                                    </Tooltip>
                                                                                )}
                                                                            </Box>
                                                                        </Box>
                                                                    );
                                                                },
                                                            )}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </div>
                            ) : (
                                <Typography
                                    sx={{
                                        display: 'flex',
                                        textAlign: 'center',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '20vh',
                                        fontSize: '30px',
                                        fontWeight: '500',
                                        color: '#322653',
                                    }}
                                >
                                    No Card View For The Payout Kindly Switch To The Table View
                                </Typography>
                            )}
                        </div>
                    )}
                </div>
                {/* </Container> */}
            </Box>
        </DashboardLayout>
    );
};

export default SettingsAnalytics;
