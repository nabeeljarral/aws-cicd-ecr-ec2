import {RoleEnum} from '@/utils/enums/role';

export enum ReportEnum {
    PayoutTransactionReport = 'Payout Transaction Report',
    FailedPayoutTransactionReport = 'Failed Payout Transaction',
    TransactionReportNew = 'Transaction Report New',
    TransactionReport = 'Transaction Report',
    StatementReport = 'Statement Report',
    UnclaimedReport = 'Unclaimed Report',
    VendorReport = 'Vendor Report',
    ReconReport = 'Recon Report',
    BalanceReport = 'Balance Report',
}

export enum ReportRoleEnum {
    'Payout Transaction Report' = RoleEnum.PayoutTransactionReport,
    'Failed Payout Transaction' = RoleEnum.PayoutTransactionReport,
    'Balance Report' = RoleEnum.BalanceReport,
    'Transaction Report' = RoleEnum.TransactionReport,
    'Statement Report' = RoleEnum.StatementReport,
    'Unclaimed Report' = RoleEnum.StatementReport,
    'Vendor Report' = RoleEnum.VendorReport,
    'Recon Report' = RoleEnum.ReconReport,
    'Transaction Report New' = RoleEnum.TransactionReportNew,
}
export enum ReportFileEnum {
    completed = 'completed',
    inqueue = 'In Queue',
    initiated = 'initiated',
    fetching = 'fetching-data',
    failed = 'failed',
    buffering = 'buffering',
    uploadingfile = 'uploading-file',
    canceled = 'canceled',
}
