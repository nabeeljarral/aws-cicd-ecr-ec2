import axiosInstance from '@/utils/axios';
import { RECEIVED_CALLBACK_FILTER,FIND_TICKETS,CREATE_TICKETS,TICKETAR} from '@/utils/endpoints/endpoints';
import {ITable, ITablePayload} from '@/utils/interfaces/transaction.interface';
import { IAccountDetails } from '../interfaces/accountDetails.interface';

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
export const getTickets = async (filter: {}): Promise<any | undefined> => {
    try {
        const res = await axiosInstance.post(FIND_TICKETS, filter);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const createTicket = async (payload:any): Promise<any> => {
    try {
        const res = await axiosInstance.post(CREATE_TICKETS, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
}

export const ticketApproveRemove = async (id: string, payload: any): Promise<any | undefined> => {
    try {
        if (payload.global) delete payload.relatedTo;

        const res = await axiosInstance.put(TICKETAR(id), payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};