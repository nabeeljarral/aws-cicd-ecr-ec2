import {useRouter} from 'next/router';
import Container from '@mui/material/Container';
import MenuAppBar from '../main/navbar';
import {
    BALANCE_HISTORY_ROUTE,
    BALANCES_ROUTE,
    BANK_ACCOUNTS_ROUTE,
    BATCH_ROUTE,
    CALLBACK_LOG_ROUTE,
    RECEIVED_CALLBACK_LOG_ROUTE,
    BULK_UPDATE_ROUTE,
    CHECK_ROUTE,
    CHECKING_ROUTE,
    DASHBOARD_ROUTE,
    DELETE_STATEMENT_ROUTE,
    DELETE_STATEMENTS_ROUTE,
    FILE_ACCESS_ROUTE,
    GATEWAY_ACCOUNTS_ROUTE,
    HOME_ROUTE,
    ACCOUNTS_DETAILS_ROUTE,
    LOGIN_ROUTE,
    MAIN_LOG_ROUTE,
    PAYOUT_TRANSACTION_RESEND_CALLBACK_ROUTE,
    PAYOUT_TRANSACTION_ROUTE,
    REMOVE_DUPLICATED_UTR_ROUTE,
    CLEANJOB,
    REPORT_MANAGEMENT_ROUTE,
    REPORTS_ROUTE,
    SETTINGS_ANALYTICS_ROUTE,
    SETTINGS_ROUTE,
    STATEMENT_IMPORT_ROUTE,
    STATEMENT_MANAGEMENT_ROUTE,
    STATEMENT_RECORDS_ROUTE,
    TRANSACTIONS_RESEND_CALLBACK,
    TRANSACTIONS_ROUTE,
    UNCLAIMED_RECORDS_ROUTE,
    UPLOAD_FILE_PAYOUT_TRANSACTION,
    USERS_ROUTE,
    BULK_UPDATE_ROUTE_PAYOUT,
    TICKET_SUMMARY_ROUTE,
    BULK_PAYOUT_FAILED,
    TRANSFERAMOUNT,
    TRANSFERHISTORY,
    CHARGEBACK,
    INTERNALTRANSFER,
    TOP_UP
    
} from '@/utils/endpoints/routes';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import {RootState} from '@/store';
import {
    Collapse,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    AccountBalance,
    AccountBalanceWallet,
    Assessment,
    Balance,
    BatchPrediction,
    CurrencyRupee,
    Dashboard,
    DeleteForever,
    Description,
    DoneAll,
    ExpandLess,
    ExpandMore,
    FolderZip,
    ManageSearch,
    Payment,
    Payments,
    Receipt,
    Settings,
    SmsFailed,
    SupervisedUserCircle,
    Article,
    CleaningServices,
    ConfirmationNumber,
    Analytics,
    PaidRounded,
    SyncAltOutlined,
    MoneyOff,
    RequestQuoteRounded
} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import {RoleEnum} from '@/utils/enums/role';
import Box from '@mui/material/Box';
import {styled} from '@mui/material/styles';
import {BanksImportEnum} from '@/utils/enums/banks';
import {ReportEnum, ReportRoleEnum} from '@/utils/enums/reports';
import {CheckingEnum, CheckingRoleEnum} from '@/utils/enums/checking';
import {isMobile} from '@/utils/functions/global';

type LayoutProps = {
    children: React.ReactNode;
};

interface IRouteList {
    url: string;
    role: RoleEnum[];
    text: string;
    icon?: React.ReactNode;
    children?: IRouteList[];
}

const drawerWidth = 280;

const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})<{
    open?: boolean;
}>(({theme, open}) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: `${drawerWidth}px !important`,
    }),
}));

const MyListItem = ({r}: {r: IRouteList}) => {
    const router = useRouter();

    return (
        <ListItem
            button
            selected={window.location.pathname === r.url}
            onClick={() => router.push(r.url)}
        >
            {r.icon && <ListItemIcon sx={{color: '#322653'}}>{r.icon}</ListItemIcon>}
            <ListItemText primary={r.text} sx={{color: '#322653'}} />
        </ListItem>
    );
};
const MyListItemChildren = ({r}: {r: IRouteList}) => {
    const [open, setOpen] = React.useState(false);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
            <ListItemButton onClick={handleClick}>
                {r.icon && <ListItemIcon sx={{color: '#322653'}}>{r.icon}</ListItemIcon>}
                <ListItemText sx={{color: '#322653'}} primary={r.text} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{pl: 3}}>
                    {r.children?.length &&
                        r.children.map(
                            (route, i) =>
                                roles?.includes(
                                    typeof route.role === 'string' ? route.role : route.role[0],
                                ) && <MyListItem key={i} r={{...route, text: '- ' + route.text}} />,
                        )}
                </List>
            </Collapse>
        </>
    );
};

export const routeList: IRouteList[] = [
    {
        url: DASHBOARD_ROUTE,
        role: [RoleEnum.Dashboard],
        text: 'Dashboard',
        icon: <Dashboard />,
    },
    {
        url: USERS_ROUTE,
        role: [RoleEnum.Admin],
        text: 'Companies',
        icon: <SupervisedUserCircle />,
    },
    {
        url: BALANCES_ROUTE,
        role: [RoleEnum.BalanceControl],
        text: 'Balances',
        icon: <CurrencyRupee />,
    },
    {
        url: BALANCE_HISTORY_ROUTE,
        role: [RoleEnum.BalanceHistory],
        text: 'Settlement History',
        icon: <Balance />,
    },
    {
        url: TRANSFERAMOUNT,
        role: [RoleEnum.ChargeBackInternalTransfer, RoleEnum.TransferHistory],
        text: 'Charge Back & Internal Transfer',
        icon: <PaidRounded />,
    },
    {
        url: CHARGEBACK,
        role: [RoleEnum.ClientChargeBack],
        text: 'Charge Back History',
        icon: <MoneyOff />,
    },
    {
        url: TOP_UP,
        role: [RoleEnum.ClientTopUp],
        text: 'Top Up History',
        icon: <RequestQuoteRounded />,
    },
    {
        url: INTERNALTRANSFER,
        role: [RoleEnum.ClientInternalTransfer],
        text: 'Internal Transfer History',
        icon: <SyncAltOutlined />,
    },
    {
        url: TRANSACTIONS_ROUTE,
        role: [RoleEnum.Transactions],
        text: 'Payin Transactions',
        icon: <Payment />,
    },
    {
        url: PAYOUT_TRANSACTION_ROUTE,
        role: [RoleEnum.PayoutTransactions],
        text: 'Payout Transactions',
        icon: <Payments />,
    },
    {
        url: BATCH_ROUTE,
        role: [RoleEnum.Batch],
        text: 'Batches',
        icon: <BatchPrediction />,
    },
    {
        url: ACCOUNTS_DETAILS_ROUTE,
        role: [RoleEnum.AccountDetails],
        text: 'Account Details',
        icon: <Article />,
    },
    {
        url: BANK_ACCOUNTS_ROUTE,
        role: [RoleEnum.BankAccounts],
        text: 'Bank accounts',
        icon: <AccountBalance />,
    },
    {
        url: GATEWAY_ACCOUNTS_ROUTE,
        role: [RoleEnum.GatewayAccounts],
        text: 'Gateway Accounts',
        icon: <AccountBalanceWallet />,
    },
    {
        url: SETTINGS_ROUTE,
        role: [RoleEnum.Settings],
        text: 'Settings',
        icon: <Settings />,
    },
    {
        url: SETTINGS_ANALYTICS_ROUTE,
        role: [RoleEnum.SettingsAnalytics],
        text: 'Analytics',
        icon: <Analytics />,
    },
    {
        url: TICKET_SUMMARY_ROUTE,
        role: [RoleEnum.TicketSummary],
        text: 'Ticket Summary',
        icon: <ConfirmationNumber />,
    },
    {
        url: STATEMENT_RECORDS_ROUTE,
        role: [RoleEnum.StatementRecords],
        text: 'Statement records',
        icon: <Receipt />,
    },
    {
        url: UNCLAIMED_RECORDS_ROUTE,
        role: [RoleEnum.UnclaimedRecords],
        text: 'Unclaimed Records',
        icon: <SmsFailed />,
    },
    // {
    //     url: LAST_24_HOURLY_REPORTS_ROUTE,
    //     role: RoleEnum.HourlyReports,
    //     text: '24 hourly reports',
    //     icon: <Timeline/>
    // },
    // {
    //     url: FAILED_REPORT_ROUTE,
    //     role: RoleEnum.FailedReport,
    //     text: 'Failed report',
    //     icon: <ReportProblem/>
    // },
    {
        url: STATEMENT_MANAGEMENT_ROUTE,
        role: [RoleEnum.StatementManagement],
        text: 'Upload statement',
        icon: <Description />,
        children: Object.values(BanksImportEnum)
            .sort()
            .map((bank) => ({
                url: STATEMENT_IMPORT_ROUTE(bank),
                role: [RoleEnum.StatementManagement],
                text: bank,
            })),
    },
    {
        url: CHECKING_ROUTE,
        role: [RoleEnum.ManualCheck, RoleEnum.RelatedTransaction],
        text: 'Checking',
        icon: <DoneAll />,
        // @ts-ignore
        children: Object.values(CheckingEnum).map((check) => ({
            url: CHECK_ROUTE(check),
            role: CheckingRoleEnum[check],
            text: check,
        })),
    },
    {
        url: REPORT_MANAGEMENT_ROUTE,
        role: [RoleEnum.Reports],
        text: 'Reports',
        icon: <Assessment />,
        // @ts-ignore
        children: Object.values(ReportEnum).map((report) => ({
            url: REPORTS_ROUTE(report),
            role: ReportRoleEnum[report],
            text: report,
        })),
    },

    {
        url: FILE_ACCESS_ROUTE,
        role: [RoleEnum.FileAccess],
        text: 'Bank Statement Files',
        icon: <FolderZip />,
    },
    {
        url: '',
        role: [RoleEnum.Admin],
        text: 'Logs',
        icon: <ManageSearch />,
        children: [
            {
                url: MAIN_LOG_ROUTE,
                role: [RoleEnum.Admin],
                text: 'Main',
            },
            {
                url: CALLBACK_LOG_ROUTE,
                role: [RoleEnum.Admin],
                text: 'Callback',
            },
            {
                url: RECEIVED_CALLBACK_LOG_ROUTE,
                role: [RoleEnum.Admin],
                text: 'Received Callback',
            },
        ],
    },
    {
        url: UPLOAD_FILE_PAYOUT_TRANSACTION,
        role: [RoleEnum.UploadPayoutTransactionsFile],
        text: 'Upload Payout Trans...',
        icon: <Payments />,
    },
    {
        url: '',
        role: [RoleEnum.Delete],
        text: '_____________',
        icon: <></>,
    },
    {
        url: '',
        role: [RoleEnum.AllowBulkUpdateTransactionUTR,RoleEnum.AllowBulkUpdatePayoutTransactionUTR,RoleEnum.AllowBulkPayoutFailed],
        text: 'Bulk Update',
        icon: <BrowserUpdatedIcon />,
        children: [
            {
                url: BULK_UPDATE_ROUTE,
                role: [RoleEnum.AllowBulkUpdateTransactionUTR],
                text: 'Bulk Update Transaction UTR',
            },
            {
                url: BULK_UPDATE_ROUTE_PAYOUT,
                role: [RoleEnum.AllowBulkUpdatePayoutTransactionUTR],
                text: 'Bulk Update Payout Transaction UTR',
            },
            {
                url: BULK_PAYOUT_FAILED,
                role: [RoleEnum.AllowBulkPayoutFailed],
                text: 'Fail Bulk Payout Transactions',
            },
        ],
    },
    {
        url: CLEANJOB,
        role: [RoleEnum.Admin],
        text: 'Clean Job',
        icon: <CleaningServices />,
    },
    {
        url: REMOVE_DUPLICATED_UTR_ROUTE,
        role: [RoleEnum.Delete],
        text: 'Remove Duplicated UTR',
        icon: <DeleteForever />,
    },
    {
        url: '',
        role: [RoleEnum.ResendCallback],
        text: 'Resend Status',
        icon: <Payment />,
        children: [
            {
                url: TRANSACTIONS_RESEND_CALLBACK,
                role: [RoleEnum.ResendCallback],
                text: 'Payin',
            },
            {
                url: PAYOUT_TRANSACTION_RESEND_CALLBACK_ROUTE,
                role: [RoleEnum.ResendCallback],
                text: 'Payout',
            },
        ],
    },
    {
        url: DELETE_STATEMENT_ROUTE,
        role: [RoleEnum.Delete],
        text: 'Delete statement',
        icon: <DeleteForever />,
        children: Object.values(BanksImportEnum).map((bank) => ({
            url: DELETE_STATEMENTS_ROUTE(bank),
            role: [RoleEnum.Delete],
            text: bank,
        })),
    },
];
const DashboardLayout = ({children}: LayoutProps): JSX.Element => {
    const router = useRouter();
    const showNav = !(router.pathname === HOME_ROUTE || router.pathname === LOGIN_ROUTE);
    const token = useSelector((state: RootState) => state.auth.token);
    const [drawerOpen, setDrawerOpen] = useState(!isMobile);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const haveClientPermission = !!(
        roles?.includes(RoleEnum.Transactions) &&
        roles?.includes(RoleEnum.Reports) &&
        roles?.includes(RoleEnum.TransactionReport)
    );
    // const DrawerHeader = styled('div')(({theme}) => ({
    //     display: 'flex',
    //     alignItems: 'center',
    //     padding: theme.spacing(0, 1),
    //     // necessary for content to be below app bar
    //     ...theme.mixins.toolbar,
    //     justifyContent: 'flex-end',
    // }));

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    useEffect(() => {
        if (!token) router.push(LOGIN_ROUTE);
    }, [token]);
    return (
        <Box
            sx={{
                background: '#f0f2f5',
                minHeight: '100vh',
            }}
        >
            {showNav && <MenuAppBar drawer={drawerOpen} onChange={toggleDrawer} />}
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant={!isMobile ? 'persistent' : 'temporary'}
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer}
            >
                <ListItem>
                    <IconButton sx={{mt: 2}}>{/*<ChevronLeft/>*/}</IconButton>
                </ListItem>

                <List>
                    {routeList.map((r: IRouteList, i) => {
                        const haveRoles =
                            r.role[0] === RoleEnum.Dashboard
                                ? roles?.includes(RoleEnum.PayoutDashboard) ||
                                  roles?.includes(RoleEnum.Dashboard) ||
                                  haveClientPermission
                                : r.role.find((role) => roles?.includes(role));
                        return (
                            haveRoles &&
                            (!r.children?.length ? (
                                <MyListItem r={r} key={i} />
                            ) : (
                                <MyListItemChildren r={r} key={i} />
                            ))
                        );
                    })}
                </List>
            </Drawer>
            <Main open={drawerOpen}>
                <Container sx={{m: 0, p: 0, pt: 6, mb: '-64px'}} maxWidth={false}>
                    {children}
                </Container>
            </Main>
        </Box>
    );
};

export default DashboardLayout;
