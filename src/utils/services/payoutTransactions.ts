import axiosInstance from '@/utils/axios';
import {
    BULK_PAYOUT_TRANSACTIONS,
    CANCEL_UPLOAD_PAYOUT_FILE,
    CREATE_PAYOUT_TRANSACTIONS,
    CREATE_PAYOUT_TRANSACTIONS_BY_FILE,
    FIND_PAYOUT_TRANSACTIONS,
    GET_PAYOUT_UPLOAD_FILES,
    PAYOUT_STATISTICS,
    PAYOUT_TRANSACTION_BY_ID,
    PAYOUT_TRANSACTIONS_ANALYTICS,
    PAYOUT_TRANSACTIONS_RESEND_CALLBACK,
    SEND_PAYOUT_TRANSACTIONS_TO_GATEWAY,
} from '@/utils/endpoints/endpoints';
import {ITable, ITablePayload, ITransaction} from '@/utils/interfaces/transaction.interface';
import {IFilterPayoutTransaction, IPayoutTransaction} from '@/utils/dto/transactions.dto';
import {IUpdateQuery} from '@/utils/interfaces/global.interface';
import {PayoutTransactionStatusEnum} from '@/utils/enums/transactionStatus';
import {IPayoutStatistics} from '@/utils/interfaces/payouyTransaction.interface';
import {IStatistics} from '@/utils/interfaces/transaction.interface';
import {IUploadFileInfo} from '../interfaces/uploadFileInfo.interface';

export const getPayoutTransactions = async (
    payload: ITablePayload<Partial<IPayoutTransaction>>,
): Promise<ITable<IPayoutTransaction[]> | undefined> => {
    try {
        if (!payload.page) payload.page = 1;
        if (!payload.limit) payload.limit = 10;
        const res = await axiosInstance.post(FIND_PAYOUT_TRANSACTIONS, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const createPayoutTransaction = async (
    payload: Partial<IPayoutTransaction>,
): Promise<IPayoutTransaction | undefined> => {
    try {
        const res = await axiosInstance.post(CREATE_PAYOUT_TRANSACTIONS, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const createPayoutTransactionByFile = async (formData: {
    fileUrl: string;
    createdBy: string;
}) => {
    try {
        const response = await axiosInstance.post(CREATE_PAYOUT_TRANSACTIONS_BY_FILE, formData);
        return response?.data;
    } catch (error: any) {
        console.log(error);
    }
};
export const getPayoutTransactionById = async (
    id: string,
): Promise<IPayoutTransaction | undefined> => {
    try {
        const res = await axiosInstance.get(PAYOUT_TRANSACTION_BY_ID(id));
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const updatePayoutTransactionById = async (
    id: string,
    payload: Partial<IPayoutTransaction>,
): Promise<IPayoutTransaction | undefined> => {
    try {
        const res = await axiosInstance.put(PAYOUT_TRANSACTION_BY_ID(id), payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

type IBulkUpdatePayoutTransactionByIds = {
    errors: {message: string; _id: string}[];
    result: {
        data: IUpdateQuery;
        batch: string;
        gateway?: string;
        status: PayoutTransactionStatusEnum;
    };
};

export const bulkUpdatePayoutTransactionByIds = async (
    payload: Partial<IPayoutTransaction> & {ids: string[]},
): Promise<IBulkUpdatePayoutTransactionByIds | undefined> => {
    try {
        const res = await axiosInstance.put(BULK_PAYOUT_TRANSACTIONS, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const sendPayoutTransactionToGateway = async (
    payload: Partial<IPayoutTransaction> & {ids: string[]},
): Promise<IBulkUpdatePayoutTransactionByIds | undefined> => {
    try {
        const res = await axiosInstance.put(SEND_PAYOUT_TRANSACTIONS_TO_GATEWAY, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const getPayoutStatistics = async (payload: {
    filter: IFilterPayoutTransaction;
}): Promise<IPayoutStatistics | undefined> => {
    try {
        const res = await axiosInstance.post(PAYOUT_STATISTICS, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const payoutTransactionResendCallback = async (
    payload: ITablePayload<IFilterPayoutTransaction>,
): Promise<any> => {
    try {
        if (!payload.page) payload.page = 1;
        if (!payload.limit) payload.limit = 100;
        const res = await axiosInstance.post(PAYOUT_TRANSACTIONS_RESEND_CALLBACK, payload);
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

export const getpayoutTransactionAnalytics = async (
    payload: ITablePayload<Partial<IStatistics>>,
): Promise<ITable<ITransaction[]> | undefined> => {
    try {
        if (!payload.page) payload.page = 1;
        if (!payload.limit) payload.limit = 10;
        const res = await axiosInstance.post(PAYOUT_TRANSACTIONS_ANALYTICS, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const getPayoutTransactionUploadFiles = async (): Promise<IUploadFileInfo[]> => {
    try {
        const response = await axiosInstance.get(GET_PAYOUT_UPLOAD_FILES);
        return response.data;
    } catch (error: any) {
        console.error(
            'Error fetching payout transaction upload files:',
            error.response?.data || error.message,
        );
        throw new Error('Failed to  payout transaction upload files');
    }
};

export const cancelUploadPayoutFile = async (id: any): Promise<any> => {
    try {
        const response = await axiosInstance.post(CANCEL_UPLOAD_PAYOUT_FILE, id);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};
