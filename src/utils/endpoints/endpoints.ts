import {BanksImportEnum} from '@/utils/enums/banks';

export const AUTH = `/auth`;
export const LOGIN = `${AUTH}/login`;
export const SIGNUP = `${AUTH}/signup`;
export const USERS = `${AUTH}/user`;
export const USER = (id: string) => `${USERS}/${id || ':id'}`;
export const BALANCES = `/balance`;
export const BALANCE = (userId: string) => `${BALANCES}/${userId || ':id'}`;
export const BALANCE_ADD_SETTLEMENT = `${BALANCES}/add-settlement`;
export const BALANCE_SHOW = (userId: string) => `${BALANCE(userId)}/show`;
export const BALANCE_HISTORY = `balance-history`;
export const FIND_BALANCE_HISTORY = `${BALANCE_HISTORY}/find`;
export const BALANCE_HISTORY_BY_ID = (id: string) => `${BALANCE_HISTORY}/${id ?? ':id'}`;
export const TRANSFER = `transfer`;
export const FIND_INTERNAL_TRANSFER = `${TRANSFER}/find`;
export const CHARGE_BACK = `${TRANSFER}/charge-back`;
export const TOP_UP = `${TRANSFER}/top-up`;
export const INTERNAL_TRANSFER = `${TRANSFER}/internal-transfer`;
export const USER_CREATE = `${AUTH}/register`;
export const CHECK_TRANSACTIONS = `/check-transactions`;
export const RELATED_TRANSACTIONS = `${CHECK_TRANSACTIONS}/related`;
export const TRANSACTIONS_CHECKING = `${CHECK_TRANSACTIONS}/match-by-transaction`;
export const TRANSACTIONS = `/transactions`;
export const TRANSACTIONS_OFCPay = `/transactions/create-ofcpay`;
export const TRANSACTION = (id: string) => `${TRANSACTIONS}/${id || ':id'}`;
export const UPDATEGEOLOCATION = `${TRANSACTIONS}/update-geolocaion`;
export const GEO_LOCATION = `/geo-location`;
export const GEO_LOCATION_BY_TRANSACTION_ID = `${GEO_LOCATION}/get-geoinfo-by-transaction-id`;
export const TRANSACTION_CHANGE = (id: string) => `${TRANSACTION(id)}/change`;
export const TRANSACTION_STATUS = (id: string) => `${TRANSACTION(id)}/status`;
export const TRANSACTION_SHOW = (id: string) => `${TRANSACTION(id)}/show`;
export const TRANSACTIONS_RESEND_CALLBACK = `${TRANSACTIONS}/resend-callback`;
export const TRANSACTION_REDIRECT_URL = (id: string) => `${TRANSACTION(id)}/redirect-url`;
export const TRANSACTIONS_LIST = `${TRANSACTIONS}/find`;
export const TRANSACTIONS_STATISTICS = `${TRANSACTIONS}/statistics`;
export const TRANSACTIONS_UPDATE_OLD_STATUS = `${TRANSACTIONS}/update-old-status`;
export const TRANSACTIONS_ANALYTICS = `${TRANSACTIONS}/analytics`;
export const BULK_ADD_UPDATE = (id: string) => `${TRANSACTIONS}/${'bulk-utr'}`;
export const QUEUE = `/queue`;
export const CLEAN_JOB = (id: string) => `${QUEUE}/${'clean-jobs'}`;
export const TRANSACTIONS_STATISTICS2 = `${TRANSACTIONS_STATISTICS}2`;
export const BANK_TRANSACTIONS = `/bank-transactions`;
export const BANK_TRANSACTIONS_LIST = `${BANK_TRANSACTIONS}/find`;
export const BANK_TRANSACTIONS_BY_ID = (id: string) => `${BANK_TRANSACTIONS}/${id || ':id'}`;
export const BANK_TRANSACTIONS_DELETE_BY_FILE_ID = (id: string) =>
    `${BANK_TRANSACTIONS}/delete-file/${id || ':id'}`;
export const REMOVE_DUPLICATED_UTR = `${BANK_TRANSACTIONS}/remove-duplicated-utr`;
export const BANK_TRANSACTION_UPLOAD = (bankName: BanksImportEnum | string) =>
    `${BANK_TRANSACTIONS}/upload/${bankName || ':bankName'}`;
export const BANK_SETTINGS = (relatedTo?: string, category?: string) =>
    `/bank-setting${relatedTo ? `?relatedTo=${relatedTo}` : ''}${relatedTo && category ? '&' : ''}${
        !relatedTo && category ? '?' : ''
    }${category ? `category=${category}` : ''}`;
export const BANK_SETTINGS_UPDATE_UPI = `/bank-setting/update-active-upi`;
export const BANK_SETTING_BY_ID = (id: string) => `${BANK_SETTINGS()}/${id || ':id'}`;
export const BATCH = `/batch`;
export const BATCH_BY_ID = (id: string) => `${BATCH}/${id || ':id'}`;
export const BATCH_COMMENT = (id: string) => `${BATCH_BY_ID(id)}/comment`;
export const BATCH_MARK_AS_EXPORTED = (id: string) => `${BATCH}/mark-as-exported/${id || ':id'}`;
export const BATCH_FIND = `${BATCH}/find`;
export const BANKS_IN_BATCH_ID = (id: string) => `${BATCH}/banks-in-batch/${id || ':id'}`;
export const BATCH_SPLIT_BY_BANK_ID = (id: string) => `${BATCH}/split-by-bank/${id || ':id'}`;
export const BANK_ACCOUNTS = `/bank-accounts`;
export const BANK_ACCOUNTS_CREATE = `${BANK_ACCOUNTS}/create-or-update`;
export const PAYMENT_CIRCLE = `${process.env.NEXT_PUBLIC_PAYMENT_CIRCLE_URL}`;
export const ZEAL_APP = `${process.env.NEXT_PUBLIC_ZEAL_APP_URL}`;
export const FIND_CLOSING_BALANCE = `${BANK_ACCOUNTS}/number`;
export const FIND_BANK_ACCOUNTS = `${BANK_ACCOUNTS}/find`;
export const FIND_ACCOUNTS_DETAILS = `${BANK_ACCOUNTS}/filter`;
export const CREATE_TICKETS = `/ticket`;
export const FIND_TICKETS = `${CREATE_TICKETS}/filter`;
export const FIND_BANK_NAMES = `${BANK_ACCOUNTS}/bank-names`;
export const BANK_ACCOUNT = (id: string) => `${BANK_ACCOUNTS}/${id || ':id'}`;
export const BANK_ACCOUNT_UPSERT = (id: string) =>
    `${BANK_ACCOUNTS}/upsert-key-values/${id || ':id'}`;
export const TICKETAR = (id: string) => `${CREATE_TICKETS}/${id || ':id'}`;

// BANK AMOUNT RANGES
export const BANK_AMOUNT_RANGES = `/bank-amount-ranges`;
// BANK
export const BANKS = `/bank`;
// VENDOR
export const VENDORS = `/vendors`;
export const SYNC_VENDOR = `${VENDORS}/sync-vendor`;
// REPORTS
export const REPORTS = `/reports`;
export const CANCEL_REPORTS = `${REPORTS}/cancel-report`;
export const TRANSACTIONS_REPORTS = `${REPORTS}/transaction`;
export const TRANSACTIONS_REPORTS_NEW = `${REPORTS}/transaction-new`;
export const PAYOUT_TRANSACTIONS_REPORTS = `${REPORTS}/payout-transaction`;
export const BATCH_REPORTS = `${REPORTS}/batch-report`;
export const TRANSFER_REPORTS = `${REPORTS}/transfer-report`;
export const FAILED_PAYOUT_TRANSACTIONS_REPORTS = `${REPORTS}/failed-payout-transaction`;
export const BANK_TRANSACTIONS_REPORTS = `${REPORTS}/bank-transaction`;
export const VENDOR_REPORTS = `${REPORTS}/vendor`;
export const RECON_REPORTS = `${REPORTS}/recon`;
export const BALANCE_REPORTS = `${REPORTS}/balance`;
export const LOG = `/log`;
export const LOG_FIND = `${LOG}/find`;
export const CALLBACK_LOG = `/callback-log`;
export const RECEIVED_CALLBACK_FILTER = `${LOG}/filter`;
export const CALLBACK_LOG_FIND = `${CALLBACK_LOG}/find`;

// PAYOUT
export const BANK_STATEMENT_FILE = `/bank-statement-file`;
export const DOWNLOAD_BANK_STATEMENT_FILE = `${BANK_STATEMENT_FILE}/download`;
export const PAYOUT = `/payout`;
export const PAYOUT_TRANSACTIONS = `${PAYOUT}/transactions`;
export const PAYOUT_BULK_ADD_UPDATE_UTR = `${PAYOUT_TRANSACTIONS}/${'bulk-utr'}`;
export const BULK_PAYOUT_FAILED = (id: string) => `${PAYOUT_TRANSACTIONS}/${'bulk'}`;
export const PAYOUT_TRANSACTIONS_RESEND_CALLBACK = `${PAYOUT_TRANSACTIONS}/resend-callback`;
export const FIND_PAYOUT_TRANSACTIONS = `${PAYOUT_TRANSACTIONS}/find`;
export const CREATE_PAYOUT_TRANSACTIONS = `${PAYOUT_TRANSACTIONS}/create`;
export const BULK_PAYOUT_TRANSACTIONS = `${PAYOUT_TRANSACTIONS}/bulk`;
export const SEND_PAYOUT_TRANSACTIONS_TO_GATEWAY = `${PAYOUT_TRANSACTIONS}/send-to-gateway`;
export const CREATE_PAYOUT_TRANSACTIONS_BY_FILE = `${PAYOUT_TRANSACTIONS}/file-upload`;
export const PAYOUT_TRANSACTION_BY_ID = (id: string) => `${PAYOUT_TRANSACTIONS}/${id || ':id'}`;
export const PAYOUT_STATISTICS = `${PAYOUT_TRANSACTIONS}/statistics`;
export const PAYOUT_TRANSACTIONS_ANALYTICS = `${PAYOUT_TRANSACTIONS}/analytics`;

export const GATEWAY_ACCOUNTS = `/gateway-accounts`;
export const GATEWAY_ACCOUNTS_FIND = `${GATEWAY_ACCOUNTS}/find`;
export const GATEWAY_ACCOUNTS_BY_ID = (id: string) => `${GATEWAY_ACCOUNTS}/${id || ':id'}`;

export const REPORT_FILE = `/report-file`;
export const REPORT_FILE_CHECK = (id: string) => `${REPORT_FILE}/${id || ':id'}`;
export const DOWNLOAD_REPORT_FILE = (id: string) => `${REPORT_FILE_CHECK(id)}/download`;
export const GET_REPORT_FILES = `${REPORT_FILE}/get-report-files`;

export const PAYOUT_UPLOAD_FILE = `/payout-upload-file`;
export const GET_PAYOUT_UPLOAD_FILES = `${PAYOUT_UPLOAD_FILE}/get-files`;
export const CANCEL_UPLOAD_PAYOUT_FILE = `${PAYOUT_UPLOAD_FILE}/cancel-upload-file`;

// upload bank statement
export const GET_BANK_STATEMENT_FILES = (id: string) =>
    `${BANK_STATEMENT_FILE}/get-files/${id || ':id'}`;
export const CANCEL_UPLOAD_BANK_STATEMENT_FILE = `${BANK_STATEMENT_FILE}/cancel-upload-file`;
