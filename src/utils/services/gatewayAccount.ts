import axiosInstance from '@/utils/axios';
import {GATEWAY_ACCOUNTS, GATEWAY_ACCOUNTS_BY_ID, GATEWAY_ACCOUNTS_FIND} from '@/utils/endpoints/endpoints';
import {ITable, ITablePayload} from '@/utils/interfaces/transaction.interface';
import {IGatewayAccount} from '@/utils/interfaces/gatewayAccount.interface';

export const getGatewayAccounts = async (payload: ITablePayload<Partial<IGatewayAccount>>): Promise<ITable<IGatewayAccount[]> | undefined> => {
    if (!payload.page) payload.page = 1;
    if (!payload.limit) payload.limit = 10;
    try {
        const res = await axiosInstance.post(GATEWAY_ACCOUNTS_FIND, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const getGatewayAccount = async (id: string): Promise<IGatewayAccount | undefined> => {
    try {
        const res = await axiosInstance.get(GATEWAY_ACCOUNTS_BY_ID(id));
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const updateGatewayAccount = async (id: string, payload: Partial<IGatewayAccount>): Promise<IGatewayAccount | undefined> => {
    try {
        const res = await axiosInstance.put(GATEWAY_ACCOUNTS_BY_ID(id), payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const createGatewayAccount = async (payload: Partial<IGatewayAccount>): Promise<IGatewayAccount | undefined> => {
    try {
        const res = await axiosInstance.post(GATEWAY_ACCOUNTS, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

