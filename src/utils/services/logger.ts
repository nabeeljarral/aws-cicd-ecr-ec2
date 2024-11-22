import axiosInstance from '@/utils/axios';
import {CALLBACK_LOG_FIND, LOG_FIND,RECEIVED_CALLBACK_FILTER} from '@/utils/endpoints/endpoints';
import {ITable, ITablePayload} from '@/utils/interfaces/transaction.interface';
import {ICallbackLog, ILogger,IReceivedCallbackLog} from '@/utils/interfaces/logger.interface';

export const getLogs = async (payload: ITablePayload<Partial<ILogger>>): Promise<ITable<ILogger[]> | undefined> => {
    try {
        if (!payload.page) payload.page = 1;
        if (!payload.limit) payload.limit = 10;
        const res = await axiosInstance.post(LOG_FIND, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const getCallbackLogs = async (payload: ITablePayload<Partial<ICallbackLog>>): Promise<ITable<ICallbackLog[]> | undefined> => {
    try {
        if (!payload.page) payload.page = 1;
        if (!payload.limit) payload.limit = 10;
        const res = await axiosInstance.post(CALLBACK_LOG_FIND, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const getReceivedCallbackLogs = async (payload: ITablePayload<Partial<IReceivedCallbackLog>>): Promise<ITable<IReceivedCallbackLog[]> | undefined> => {
    try {
        if (!payload.page) payload.page = 1;
        if (!payload.limit) payload.limit = 10;
        const res = await axiosInstance.post(RECEIVED_CALLBACK_FILTER, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
