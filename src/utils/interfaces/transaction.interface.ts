import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import {IBankSetting} from '@/utils/interfaces/bankSetting.interface';
import {BankTypesEnum} from '@/utils/enums/bankTypes.enum';

export interface ITransaction {
    _id: string;
    setting: IBankSetting;
    statusUpdates: {status: string; date: Date}[];
    idx: string;
    amount_and_utr: string;
    utr: string;
    amount: number;
    status: string;
    upi_id?: any;
    bank_account: IBankAccount | string;
    bank_type: BankTypesEnum;
    is_claimed: boolean;
    updates: {status: string; updatedAt: ''}[];
    createdAt: Date;
    updatedAt: Date;
    qr_Link?: string;
    redirect_url?: string;
    external_ref?: string;
    username?: string;
    initial_redirect?: string;
    createdBy?: string;
    relatedTo?: string;

    filename: string;
    logs?: string[];
    filter?: string;
    reportInProgress?: boolean;
    fetchedCount?: number;
    successRate?: number;
    transactions?: any[];
    upiqr_Link?: string;
    externalRedirectUrl?: string;
    isQRIntent?: boolean;
}

export type ITable<T> = {
    logs?: any[];
    transactions: T;
    pages: number;
    total: number;
};

export type ITablePayload<T> = {page?: number; limit?: number; filter: T};
export type ITablePayloadzel<T> = {filter: T};

export type ITransactionTable = ITable<ITransaction[]>;

export type IStatistics = {
    earnings: number;
    success: number;
    failed: number;
    successRate?: any;
    successRateWithoutUnfinished: number;
    pending: number;
    initiate: number;
    unfinished: number;
    total: number;
    modifiedSuccessRate?: any;
};

export type ITransactionStatistics = IStatistics & {
    data: ITransactionTable;
};
export type IFilterTransactionStatistics = Partial<IStatistics> & {
    unlimited?: boolean;
};

export interface ITransactionError {
    _id: string;
    message?: string;
}

export interface IGetAnalytics {
    username: string;
    successRate?: number;
    success: number;
    initiateAmount?: number;
    successAmount: number;
    failAmount?: number;
    total: number;
    relatedTo: string;
}
