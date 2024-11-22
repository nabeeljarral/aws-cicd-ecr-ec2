import {BanksImportEnum} from '@/utils/enums/banks';
import {ReportEnum} from '@/utils/enums/reports';
import {CheckingEnum} from '@/utils/enums/checking';

export const HOME_ROUTE = '/';
export const TEST_TRANSACTION_ROUTE = '/test';
export const TEST_TRANSACTION_ROUTE_OFC = '/create-ofcpay';
export const TEST_PAYOUT_TRANSACTION_ROUTE = `/test2`;
export const TRANSACTION_ROUTE = '/transactions';
export const SHOW_TRANSACTION_ROUTE = (id: string) => `${TRANSACTION_ROUTE}/${id || ':id'}`;
const SECRET_ROUTE = '/panel';
export const PAYOUT_TRANSACTION_ROUTE = `${SECRET_ROUTE}/payout-transactions`;
export const FAILED_PAYOUT_TRANSACTION_ROUTE = `${SECRET_ROUTE}/failed-payout-transaction`;
export const BATCH_ROUTE = `${SECRET_ROUTE}/batch`;
export const EDIT_PAYOUT_TRANSACTION = `${PAYOUT_TRANSACTION_ROUTE}/edit`;
export const PAYOUT_TRANSACTION_RESEND_CALLBACK_ROUTE = `${PAYOUT_TRANSACTION_ROUTE}/resend-callback`;
export const UPLOAD_PAYOUT_TRANSACTION = `${PAYOUT_TRANSACTION_ROUTE}/upload`;
export const UPLOAD_FILE_PAYOUT_TRANSACTION = `${PAYOUT_TRANSACTION_ROUTE}/upload-file`;
export const LOGIN_ROUTE = `${SECRET_ROUTE}/login`;
export const SIGNUP_ROUTE = `${SECRET_ROUTE}/signup`;
export const LOG_ROUTE = `${SECRET_ROUTE}/log`;
export const MAIN_LOG_ROUTE = `${LOG_ROUTE}/main`;
export const CLEANJOB = `${SECRET_ROUTE}/clean-job`;
export const TRANSFERAMOUNT = `${SECRET_ROUTE}/transfer-amount`;
export const TRANSFERHISTORY = `${SECRET_ROUTE}/transfered-history`;
export const TRANSFERHISTORY1 = `${SECRET_ROUTE}/transfer-history`;
export const CHARGEBACK = `${SECRET_ROUTE}/chargeBack`;
export const TOP_UP = `${SECRET_ROUTE}/topUp`;
export const INTERNALTRANSFER = `${SECRET_ROUTE}/internal-transfer`;
export const CALLBACK_LOG_ROUTE = `${LOG_ROUTE}/callback`;
export const RECEIVED_CALLBACK_LOG_ROUTE = `${LOG_ROUTE}/received-callback`;
export const FILE_ACCESS_ROUTE = `${SECRET_ROUTE}/file-access`;
export const DASHBOARD_ROUTE = `${SECRET_ROUTE}/dashboard`;
export const TRANSACTIONS_ROUTE = `${SECRET_ROUTE}/transactions`;
export const BULK_UPDATE_ROUTE = `${SECRET_ROUTE}/bulk-update-utr`;
export const BULK_UPDATE_ROUTE_PAYOUT = `${SECRET_ROUTE}/bulk-update-utr-payout`;
export const BULK_PAYOUT_FAILED = `${SECRET_ROUTE}/bulk-payout-failed`;
export const TRANSACTIONS_RESEND_CALLBACK = `${TRANSACTIONS_ROUTE}/resend-callback`;
export const BANK_ACCOUNTS_ROUTE = `${SECRET_ROUTE}/bank-accounts`;
export const ACCOUNTS_DETAILS_ROUTE = `${SECRET_ROUTE}/account-details`;
export const UPLOADING_ACTIVELY_ROUTE = `${ACCOUNTS_DETAILS_ROUTE}/actively-uploading-accounts`;
export const TICKET_SUMMARY_ROUTE = `${SECRET_ROUTE}/ticket-summary`;
export const CREATE_BANK_ACCOUNTS_ROUTE = `${BANK_ACCOUNTS_ROUTE}/create`;
export const CREATE_ACCOUNTS_DETAILS_ROUTE = `${ACCOUNTS_DETAILS_ROUTE}/create`;
export const CREATE_VENDOR_ROUTE = `${BANK_ACCOUNTS_ROUTE}/vendor/create`;
export const EDIT_BANK_ACCOUNTS_ROUTE = (id: string) => `${BANK_ACCOUNTS_ROUTE}/${id || ':id'}`;
export const EDIT_ACCOUNTS_DETAILS_ROUTE = (id: string) =>
    `${ACCOUNTS_DETAILS_ROUTE}/${id || ':id'}`;
export const SETTINGS_ROUTE = `${SECRET_ROUTE}/settings`;
export const SETTINGS_ANALYTICS_ROUTE = `${SECRET_ROUTE}/setting-analytics`;

export const CREATE_SETTING_ROUTE = `${SETTINGS_ROUTE}/create`;
export const EDIT_SETTING_ROUTE = (id: string) => `${SETTINGS_ROUTE}/${id || ':id'}`;
export const STATEMENT_RECORDS_ROUTE = `${SECRET_ROUTE}/statement-records`;
export const UNCLAIMED_RECORDS_ROUTE = `${SECRET_ROUTE}/unclaimed-records`;
// export const LAST_24_HOURLY_REPORTS_ROUTE = `${SECRET_ROUTE}/24-hourly-reports`;
export const REMOVE_DUPLICATED_UTR_ROUTE = `${STATEMENT_RECORDS_ROUTE}/remove-duplicated-utr`;
export const STATEMENT_MANAGEMENT_ROUTE = `${SECRET_ROUTE}/statement-management`;
export const DELETE_STATEMENT_ROUTE = `${SECRET_ROUTE}/delete-statement`;
export const STATEMENT_IMPORT_ROUTE = (bankName: BanksImportEnum) =>
    `${STATEMENT_MANAGEMENT_ROUTE}/${bankName || ':bankName'}`;
export const DELETE_STATEMENTS_ROUTE = (bankName: BanksImportEnum) =>
    `${DELETE_STATEMENT_ROUTE}/${bankName || ':bankName'}`;
export const REPORT_MANAGEMENT_ROUTE = `${SECRET_ROUTE}/report-management`;
export const REPORTS_ROUTE = (report: ReportEnum) =>
    `${REPORT_MANAGEMENT_ROUTE}/${report || ':report'}`;

export const CHECKING_ROUTE = `${SECRET_ROUTE}/checking`;
export const CHECK_ROUTE = (check: CheckingEnum) => `${CHECKING_ROUTE}/${check || ':check'}`;

export const USERS_ROUTE = `${SECRET_ROUTE}/user`;
export const USER_CREATE_ROUTE = `${USERS_ROUTE}/create`;
export const EDIT_USER_ROUTE = (userId: string) => `${USERS_ROUTE}/${userId || ':userId'}`;

export const BALANCES_ROUTE = `${SECRET_ROUTE}/balance`;
export const BALANCE_HISTORY_ROUTE = `${BALANCES_ROUTE}/history`;
export const BALANCE_ADD_SETTLEMENT_ROUTE = `${BALANCES_ROUTE}/add-settlement`;
export const EDIT_BALANCE_ROUTE = (userId: string) => `${BALANCES_ROUTE}/${userId || ':userId'}`;
export const SHOW_BALANCES_ROUTE = `${BALANCES_ROUTE}/view`;

export const GATEWAY_ACCOUNTS_ROUTE = `${SECRET_ROUTE}/gateway-accounts`;
export const CREATE_GATEWAY_ACCOUNTS_ROUTE = `${GATEWAY_ACCOUNTS_ROUTE}/create`;
export const EDIT_GATEWAY_ACCOUNTS_ROUTE = (id: string) =>
    `${GATEWAY_ACCOUNTS_ROUTE}/edit/${id || ':id'}`;
