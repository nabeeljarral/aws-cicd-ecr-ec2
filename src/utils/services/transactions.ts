import axiosInstance from '@/utils/axios';
import {
    RELATED_TRANSACTIONS,
    TRANSACTION,
    TRANSACTION_CHANGE,
    TRANSACTION_REDIRECT_URL,
    TRANSACTION_SHOW,
    TRANSACTION_STATUS,
    TRANSACTIONS,
    TRANSACTIONS_CHECKING,
    TRANSACTIONS_LIST,
    TRANSACTIONS_RESEND_CALLBACK,
    TRANSACTIONS_STATISTICS,
    TRANSACTIONS_STATISTICS2,
    TRANSACTIONS_UPDATE_OLD_STATUS,
    TRANSACTIONS_ANALYTICS,
    TRANSACTIONS_OFCPay,
    GET_BANK_STATEMENT_FILES,
    CANCEL_UPLOAD_BANK_STATEMENT_FILE,
    BANK_TRANSACTIONS_DELETE_BY_FILE_ID,
    UPDATEGEOLOCATION,
    GEO_LOCATION_BY_TRANSACTION_ID,
} from '@/utils/endpoints/endpoints';
import {
    ICreateTransactionDto,
    IFilterTransactionDto,
    IUpdateTransactionDto,
} from '@/utils/dto/transactions.dto';
import {
    ITable,
    ITablePayload,
    ITransaction,
    ITransactionStatistics,
    ITablePayloadzel,
    ITransactionTable,
} from '@/utils/interfaces/transaction.interface';
import {IBankTransaction} from '@/utils/interfaces/bankTransaction.interface';
import {IStatistics, IGetAnalytics} from '@/utils/interfaces/transaction.interface';
import {IUploadFileInfo} from '../interfaces/uploadFileInfo.interface';
import {ITransactionGeoLocation} from '../interfaces/transactionGeoLocation.interface';

type ITransactions = ITablePayload<IFilterTransactionDto>;
export type IRelatedTransactionsFilter = {
    utr?: string;
    _id?: string;
    relatedTo?: string;
};
export const transactionTable = async (
    payload: ITransactions,
): Promise<ITransactionTable | undefined> => {
    try {
        if (!payload.page) payload.page = 1;
        if (!payload.limit) payload.limit = 10;
        const res = await axiosInstance.post(TRANSACTIONS_LIST, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const getTransactionStatistics = async (
    payload: ITransactions,
): Promise<ITransactionStatistics | undefined> => {
    try {
        if (!payload.page) payload.page = 1;
        if (!payload.limit) payload.limit = 10;
        const res = await axiosInstance.post(TRANSACTIONS_STATISTICS, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const getTransactionStatistics2 = async (
    payload: ITransactions,
): Promise<ITransactionStatistics | undefined> => {
    try {
        if (!payload.page) payload.page = 1;
        if (!payload.limit) payload.limit = 10;
        const res = await axiosInstance.post(TRANSACTIONS_STATISTICS2, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const getRelatedTransactions = async (
    payload: IRelatedTransactionsFilter,
): Promise<
    | {
          transactions: ITransaction[];
          bankTransactions: IBankTransaction[];
      }
    | undefined
> => {
    try {
        const res = await axiosInstance.post(RELATED_TRANSACTIONS, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const transactionsChecking = async (
    payload: IFilterTransactionDto,
): Promise<string | undefined> => {
    try {
        const res = await axiosInstance.post(TRANSACTIONS_CHECKING, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const transactionResendCallback = async (payload: ITransactions): Promise<any> => {
    try {
        if (!payload.page) payload.page = 1;
        if (!payload.limit) payload.limit = 100;
        const res = await axiosInstance.post(TRANSACTIONS_RESEND_CALLBACK, payload);
        return res.data;
    } catch (error: any) {
        throw error;
    }
};
export const createTransaction = async (
    payload: ICreateTransactionDto,
): Promise<ITransaction | undefined> => {
    try {
        const res = await axiosInstance.post(TRANSACTIONS, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const createOFCTransaction = async (
    payload: ICreateTransactionDto,
): Promise<ITransaction | undefined> => {
    try {
        const res = await axiosInstance.post(TRANSACTIONS_OFCPay, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const updateTransaction = async (
    id: string,
    payload: IUpdateTransactionDto,
): Promise<ITransaction | undefined> => {
    try {
        const res = await axiosInstance.put(TRANSACTION(id), payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const getGeoInfo = async (): Promise<ITransactionGeoLocation | undefined> => {
    try {
        const ipApiUrl = process.env.NEXT_PUBLIC_IPAPI_API_URL;
        const ipApiAPIKey = process.env.NEXT_PUBLIC_IPAPI_API_KEY;
        debugger;
        let url = `${ipApiUrl}/json?key=${ipApiAPIKey}`;

        const response = await axiosInstance.get(url);
        const geoData: ITransactionGeoLocation = response.data;
        if (response.data.error) {
            console.log(response.data.error);
        }
        return geoData;
    } catch (error) {
        console.error(error);
    }
};
export const updateGeolocaion = async (id: string, data: ITransactionGeoLocation) => {
    try {
        await axiosInstance.post(UPDATEGEOLOCATION, {id, geoData: data});

        return;
    } catch (error: any) {
        console.error(error);
    }
};
export const checkWrongStatus = async (): Promise<any> => {
    try {
        const res = await axiosInstance.post(TRANSACTIONS_UPDATE_OLD_STATUS);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const updateTransaction2 = async (
    id: string,
    payload: IUpdateTransactionDto,
): Promise<ITransaction | undefined> => {
    try {
        const res = await axiosInstance.put(TRANSACTION_CHANGE(id), payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const getTransaction = async (id: string): Promise<ITransaction | undefined> => {
    try {
        const res = await axiosInstance.get(TRANSACTION(id));
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const getTransactionStatusById = async (
    id: string,
): Promise<Partial<ITransaction> | undefined> => {
    try {
        const res = await axiosInstance.get(TRANSACTION_STATUS(id));
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const getTransaction2 = async (id: string): Promise<ITransaction | undefined> => {
    try {
        const res = await axiosInstance.get(TRANSACTION_SHOW(id));
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const getTransactionRedirectUrl = async (
    id: string,
): Promise<{redirectUrl: string} | undefined> => {
    try {
        const res = await axiosInstance.get(TRANSACTION_REDIRECT_URL(id));
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const getTransactionAnalytics = async (
    payload: ITablePayload<Partial<IStatistics>>,
): Promise<ITable<ITransaction[]> | undefined> => {
    try {
        if (!payload.page) payload.page = 1;
        if (!payload.limit) payload.limit = 10;
        const res = await axiosInstance.post(TRANSACTIONS_ANALYTICS, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const getTransactionAnalyticsZelapp = async (
    payload: ITablePayloadzel<Partial<IGetAnalytics>>,
): Promise<IGetAnalytics | any> => {
    try {
        const res = await axiosInstance.post(
            'https://api.zealappayments.com/transactions/analytics',
            payload,
        );
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const getTransactionAnalyticsPayCircle = async (
    payload: ITablePayloadzel<Partial<IGetAnalytics>>,
): Promise<IGetAnalytics | any> => {
    try {
        const res = await axiosInstance.post(
            'https://api.paymentcircles.com/transactions/analytics',
            payload,
        );
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const getBankStatementUploadFiles = async (
    id: string,
): Promise<IUploadFileInfo[] | undefined> => {
    try {
        const response = await axiosInstance.get(GET_BANK_STATEMENT_FILES(id));
        return response.data;
    } catch (error: any) {
        console.error(
            'Error fetching transaction upload files:',
            error.response?.data || error.message,
        );
        throw new Error('Failed to transaction upload files');
    }
};

export const cancelUploadBankStatementFile = async (id: any): Promise<any> => {
    try {
        const response = await axiosInstance.post(CANCEL_UPLOAD_BANK_STATEMENT_FILE, id);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export const deleteBankStatementFile = async (id: string): Promise<any> => {
    try {
        const response = await axiosInstance.delete(BANK_TRANSACTIONS_DELETE_BY_FILE_ID(id));
        return response.data;
    } catch (error: any) {
        throw error;
    }
};
