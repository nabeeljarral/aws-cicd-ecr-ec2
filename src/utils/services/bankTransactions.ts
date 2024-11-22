import axiosInstance from '@/utils/axios';
import {
    BANK_TRANSACTIONS_BY_ID,
    BANK_TRANSACTIONS_LIST,
    REMOVE_DUPLICATED_UTR,
} from '@/utils/endpoints/endpoints';
import {IFilterBankTransactionDto} from '@/utils/dto/bankTransactions.dto';
import {IBankTransaction} from '@/utils/interfaces/bankTransaction.interface';

type IBankTransactions = {page: number; limit: number; filter: IFilterBankTransactionDto};
export const bankTransactionTable = async (
    payload: IBankTransactions,
): Promise<
    | {
          page: number;
          total: number;
          transactions: IBankTransaction[];
      }
    | undefined
> => {
    try {
        if (!payload.page) payload.page = 1;
        if (!payload.limit) payload.limit = 10;
        const res = await axiosInstance.post(BANK_TRANSACTIONS_LIST, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export type IUpdateBankTransaction = {
    id: string;
    category?: string;
    related_transaction_id?: string;
    crete_dummy_transaction?: boolean;
    relatedTo?: string;
    orderId?: string;
};
export const updateBankTransaction = async (payload: IUpdateBankTransaction): Promise<any> => {
    try {
        const {id, ...data} = payload;
        const res = await axiosInstance.put(BANK_TRANSACTIONS_BY_ID(id), data);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const bankTransactionRemoveDuplicateUtr = async (payload: {
    filter: IFilterBankTransactionDto;
}): Promise<any> => {
    try {
        const res = await axiosInstance.post(REMOVE_DUPLICATED_UTR, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
