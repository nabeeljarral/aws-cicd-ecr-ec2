import {useSelector} from 'react-redux';
import React, {FormEvent, useEffect, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {Button, Grid} from '@mui/material';
import {DashboardBox} from '@/components/dashboard/dashboardBox';
import {
    AccountBalanceWallet,
    AttachMoney,
    Cancel,
    Check,
    HourglassEmpty,
    ReceiptLong,
    TrendingUp,
    Warning,
} from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import {PriceFormatter} from '@/utils/functions/global';
import {IStatistics} from '@/utils/interfaces/transaction.interface';
import {getTransactionStatistics, getTransactionStatistics2} from '@/utils/services/transactions';
import moment from 'moment';
import MainFilter from '@/components/filter/mainFilter';
import {IFilterPayoutTransaction, IFilterTransactionDto} from '@/utils/dto/transactions.dto';
import DateRangePicker2 from '@/components/filter/main/dateRangePicker2';
import {getPayoutStatistics} from '@/utils/services/payoutTransactions';
import {IPayoutStatistics} from '@/utils/interfaces/payouyTransaction.interface';
import {FilterEnums} from '@/utils/enums/filter';

const Dashboard = () => {
    // const [bankAccountsLoading, setBankAccountsLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [load, setLoad] = useState(false);
    const [load2, setLoad2] = useState(false);
    const [loading2, setLoading2] = useState(true);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();
    const [statistics, setStatistics] = useState<IStatistics>();
    const [payoutStatistics, setPayoutStatistics] = useState<IPayoutStatistics>();

    const [startDate, setStartDate] = useState<moment.Moment>(moment());
    const [startTime, setStartTime] = useState<moment.Moment>(moment().startOf('day'));
    const [endDate, setEndDate] = useState<moment.Moment>(moment().add(1, 'day').second(0));
    const [endTime, setEndTime] = useState<moment.Moment>(moment().startOf('day').second(0));
    const userId = useSelector((state: RootState) => state.auth.user)?._id;

    const haveDashboardPermission = !!roles?.includes(RoleEnum.Dashboard);
    const havePayoutDashboardPermission = !!roles?.includes(RoleEnum.PayoutDashboard);
    const haveClientPermission = !!(
        roles?.includes(RoleEnum.Transactions) &&
        roles?.includes(RoleEnum.Reports) &&
        roles?.includes(RoleEnum.TransactionReport)
    );
    const haveUserControlPermission = !!roles?.includes(RoleEnum.UserControl);
    const haveEarningPermission = !!roles?.includes(RoleEnum.Earning);
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data: IFilterTransactionDto = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        getStatistics(data);
        setLoading(false);
    };
    const handleSubmitPayout = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading2(true);
        const formData = new FormData(e.currentTarget);
        const data: IFilterPayoutTransaction = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        getPayoutTransactionStatistics(data);
        setLoading2(false);
    };
    const setDateToLast15Min = async () => {
        // Get the time in India
        const indiaTime = new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
        const todayFormatter = moment(indiaTime);
        const todayAfter15Min = moment(indiaTime).subtract(15, 'minutes');
        setStartDate(todayFormatter);
        setStartTime(todayAfter15Min);
        setEndDate(todayFormatter);
        setEndTime(todayFormatter);
    };

    const getStatistics = async (filter?: IFilterTransactionDto) => {
        const filters = filter || {
            startDate: moment().startOf('day').toDate(),
        };
        if (!filter && !haveUserControlPermission) {
            filters.relatedTo = userId;
        }
        if (haveUserControlPermission) {
            if(filter){
                setLoad(true)
            }
          await getTransactionStatistics({
                filter: filters,
            }).then(res => {
                if (res) {
                    const {data, ...statistics} = res;
                    setStatistics(statistics);
                }
            });
            setLoad(false)
        } else {
            if(filter){
                setLoad(true)
            }
          await getTransactionStatistics2({
                filter: filters,
            }).then(res => {
                if (res) {
                    const {data, ...statistics} = res;
                    setStatistics(statistics);
                }
            });
            setLoad(false)
        }
    };
    const getPayoutTransactionStatistics = async (filter?: IFilterPayoutTransaction) => {
        setLoading2(true);
        const filters: IFilterPayoutTransaction = filter || {
            startDate: moment().startOf('day').toDate(),
        };
        if (!haveUserControlPermission) {
            filters.relatedTo = userId;
        }
        if(filter){setLoad2(true)}
       await getPayoutStatistics({
            filter: filters,
        }).then(res => {
            if (res) setPayoutStatistics(res);
        });
        setLoading2(false);
        setLoad2(false)
    };

    useEffect(() => {
        if (!roles?.length) router.push(LOGIN_ROUTE);
        if (haveDashboardPermission || havePayoutDashboardPermission || haveClientPermission) {
            if (haveDashboardPermission || haveClientPermission) {
                setLoading(true);
                getStatistics();
            }
            if (havePayoutDashboardPermission) {
                setLoading2(true);
                getPayoutTransactionStatistics();
            }
            setLoading(false);
            setLoading2(false);
        }
    }, [roles]);

    // useEffect(() => {
    //     if (((haveDashboardPermission && haveEarningPermission) || haveClientPermission) && userId) {
    //         fetchBankAccount()
    //     }
    // }, [roles, userId])

    return <DashboardLayout>
        {
            !loading /*&& !bankAccountsLoading */ && (haveDashboardPermission || haveClientPermission) && <>
                <Box sx={{flexGrow: 1}}>
                    <Container maxWidth="lg" sx={{mt: 4}}>
                        <Typography variant="h5" sx={{mb: 2}}>Payin</Typography>

                        <MainFilter
                            loading={load}
                            filter={{}}
                            onSubmit={handleSubmit}
                            selectedFilters={[
                                ...(haveUserControlPermission ? [FilterEnums.bank_type,FilterEnums.bank_name] : []),
                            ]}
                            afterFilterBtn={
                                <Button variant="contained"
                                        onClick={() => setDateToLast15Min()}
                                        sx={{textTransform: 'capitalize', m: 1, ml: 2, px: 2}}
                                        color="success">
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
                        <Grid container spacing={3} sx={{
                            '& > .MuiGrid-item': {
                                minWidth: '240px',
                            },
                        }}>
                            {
                             roles?.includes(RoleEnum.EarningTotal)  && (haveEarningPermission || haveClientPermission )   &&
                                <Grid item xs={12} md={4} lg={4}>
                                    <DashboardBox
                                        color="blue"
                                        icon={<AttachMoney />}
                                        title={haveDashboardPermission ? 'Earnings' : 'Total Payin'}
                                        price={PriceFormatter(statistics?.earnings || 0)}
                                    />
                                </Grid>
                            }
                            <Grid item xs={12} md={4} lg={4}>
                                <DashboardBox
                                    color="green"
                                    icon={<Check />}
                                    title="Success"
                                    price={PriceFormatter(statistics?.success || 0)}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                                <DashboardBox
                                    color="pink"
                                    icon={<Cancel />}
                                    title="Failed"
                                    price={PriceFormatter(statistics?.failed || 0)}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                                <DashboardBox
                                    color="black"
                                    icon={<TrendingUp />}
                                    title="Success Rate"
                                    price={PriceFormatter(statistics?.successRate || 0) + '%'}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                                <DashboardBox
                                    color="black"
                                    icon={<TrendingUp />}
                                    title="Total Payin Attempts"
                                    price={PriceFormatter(statistics?.total ?? 0)}
                                />
                            </Grid>
                            {
                                haveDashboardPermission &&
                                <>
                                    <Grid item xs={12} md={4} lg={4}>
                                        <DashboardBox
                                            color="black"
                                            icon={<TrendingUp />}
                                            title="Rate without incomplete"
                                            price={PriceFormatter(statistics?.successRateWithoutUnfinished || 0) + '%'}
                                        />
                                    </Grid>
                                    {/*<Grid item xs={12} md={4} lg={3}>
                                <DashboardBox
                                    color='blue'
                                    icon={<MonetizationOn/>}
                                    title='Total Earnings'
                                    price={(150000000).toLocaleString()}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={3}>
                                <DashboardBox
                                    color='green'
                                    icon={<CheckCircle/>}
                                    title='Success Index'
                                    price={(80000).toLocaleString()}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={3}>
                                <DashboardBox
                                    color='blue'
                                    icon={<PlaylistAddCheck/>}
                                    title='Total Index'
                                    price={(90000).toLocaleString()}
                                />
                            </Grid>*/}
                                    <Grid item xs={12} md={4} lg={4}>
                                        <DashboardBox
                                            color="black"
                                            icon={<HourglassEmpty />}
                                            title="Pending"
                                            price={PriceFormatter(statistics?.pending || 0)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={4}>
                                        <DashboardBox
                                            color="orange"
                                            icon={<Warning />}
                                            title="Initiate"
                                            price={PriceFormatter(statistics?.initiate || 0)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={4}>
                                        <DashboardBox
                                            color="orange"
                                            icon={<Warning />}
                                            title="Incomplete"
                                            price={PriceFormatter(statistics?.unfinished || 0)}
                                        />
                                    </Grid>
                                </>
                            }

                        </Grid>
                    </Container>
                </Box>
                {/*                {
                    haveEarningPermission &&
                    <Box sx={{flexGrow: 1}}>
                        <Container maxWidth="lg">
                            <Divider sx={{my: 3}}/>
                            <Typography sx={{mb: 2}} variant='h5'>Daily Limit Reached</Typography>
                            <Grid sx={{pb: 3}} container spacing={3}>
                                {
                                    bankAccounts?.map((bankAccount, i) =>
                                        <Grid item xs={12} md={4} lg={4} key={i}>
                                            <DashboardBox
                                                color='black'
                                                icon={<AccountBalance/>}
                                                title={bankAccount.name}
                                                price={PriceFormatter(bankAccount.incomes_today || 0)}
                                            />
                                        </Grid>
                                    )
                                }
                            </Grid>
                        </Container>
                    </Box>
                }*/}
            </>
        }
        {
            !loading2 && havePayoutDashboardPermission && <>
                <Box sx={{flexGrow: 1}}>
                    <Container maxWidth="lg" sx={{mt: 4}}>
                        <Typography variant="h5" sx={{mb: 2}}>Payout</Typography>

                        <MainFilter
                            loading={load2}
                            filter={{}}
                            onSubmit={handleSubmitPayout}
                            selectedFilters={
                                [
                                    ...(haveUserControlPermission ? [FilterEnums.balanceType] : []),
                                ]}
                            afterFilterBtn={
                                <Button variant="contained"
                                        onClick={() => setDateToLast15Min()}
                                        sx={{textTransform: 'capitalize', m: 1, ml: 2, px: 2}}
                                        color="success">
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
                        <Grid container spacing={3} sx={{
                            '& > .MuiGrid-item': {
                                minWidth: '240px',
                            },
                        }}>
                         {roles?.includes(RoleEnum.EarningTotal)  &&  <Grid item xs={12} md={4} lg={4}>
                                <DashboardBox
                                    color="blue"
                                    icon={<AccountBalanceWallet />}
                                    title="Available Balance"
                                    price={PriceFormatter(payoutStatistics?.balance || 0)}
                                />
                            </Grid>}
                            {roles?.includes(RoleEnum.ShowDashboardSettlement)  && <Grid item xs={12} md={4} lg={4}>
                                <DashboardBox
                                    color="blue"
                                    icon={<ReceiptLong />}
                                    title="Settlement"
                                    price={PriceFormatter(payoutStatistics?.settlementBalance || 0)}
                                />
                            </Grid>}
                            <Grid item xs={12} md={4} lg={4}>
                                <DashboardBox
                                    color="blue"
                                    icon={<AttachMoney />}
                                    title="Total Payout"
                                    price={PriceFormatter(payoutStatistics?.earnings || 0)}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                                <DashboardBox
                                    color="green"
                                    icon={<Check />}
                                    title="Success"
                                    price={PriceFormatter(payoutStatistics?.success || 0)}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                                <DashboardBox
                                    color="pink"
                                    icon={<Cancel />}
                                    title="Failed"
                                    price={PriceFormatter(payoutStatistics?.failed || 0)}
                                />
                            </Grid>

                            <Grid item xs={12} md={4} lg={4}>
                                <DashboardBox
                                    color="black"
                                    icon={<TrendingUp />}
                                    title="Total Payout Attempts"
                                    price={PriceFormatter(payoutStatistics?.total ?? 0)}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                                <DashboardBox
                                    color="black"
                                    icon={<TrendingUp />}
                                    title="Success Rate"
                                    price={PriceFormatter(payoutStatistics?.successRate || 0) + '%'}
                                />
                            </Grid>
                            {
                                haveUserControlPermission &&
                                <>
                                    <Grid item xs={12} md={4} lg={4}>
                                        <DashboardBox
                                            color="black"
                                            icon={<TrendingUp />}
                                            title="Earnings Fees"
                                            price={PriceFormatter(payoutStatistics?.earningsFees || 0) + '%'}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={4}>
                                        <DashboardBox
                                            color="orange"
                                            icon={<Warning />}
                                            title="Initiate"
                                            price={PriceFormatter(payoutStatistics?.initiate || 0)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={4}>
                                        <DashboardBox
                                            color="orange"
                                            icon={<Warning />}
                                            title="Returned"
                                            price={PriceFormatter(payoutStatistics?.returned || 0)}
                                        />
                                    </Grid>
                                </>
                            }

                        </Grid>
                    </Container>
                </Box>
            </>
        }
        {
            !loading && !(havePayoutDashboardPermission || haveDashboardPermission || haveClientPermission) && <>
                You Don't Have Permission To Access this Page
            </>
        }
    </DashboardLayout>;
};

export default Dashboard;