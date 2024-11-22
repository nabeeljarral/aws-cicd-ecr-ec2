import axiosInstance from '@/utils/axios';
import { FIND_ACCOUNTS_DETAILS,RECEIVED_CALLBACK_FILTER,FIND_CLOSING_BALANCE} from '@/utils/endpoints/endpoints';
import {ITable, ITablePayload} from '@/utils/interfaces/transaction.interface';
import { IAccountDetails,IAccountDetailsResponse,IGetBankAccountsResponse } from '../interfaces/accountDetails.interface';

export const getReceivedCallbackLogs = async (payload: ITablePayload<Partial<IAccountDetails>>): Promise<ITable<IAccountDetails[]> | undefined> => {
    try {
        if (!payload.page) payload.page = 1;
        if (!payload.limit) payload.limit = 10;
        const res = await axiosInstance.post(RECEIVED_CALLBACK_FILTER, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const getBankAccounts = async (filter: {}): Promise<IGetBankAccountsResponse[] | undefined> => {
    try {
        const res = await axiosInstance.post(FIND_ACCOUNTS_DETAILS, filter);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
