import axiosInstance from '@/utils/axios';
import {
    BALANCE_ADD_SETTLEMENT,
    BALANCE_HISTORY_BY_ID,
    BALANCE_SHOW,
    BALANCES,
    FIND_BALANCE_HISTORY,
    FIND_INTERNAL_TRANSFER,
} from '@/utils/endpoints/endpoints';
import {IBalance, IBalanceHistory} from '@/utils/interfaces/balance.interface';
import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import {ITable, ITablePayload} from '@/utils/interfaces/transaction.interface';

export const getBalances = async (): Promise<IBalance[] | undefined> => {
    try {
        const res = await axiosInstance.get(BALANCES);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const getBalance = async (id: string): Promise<IBalance | undefined> => {
    try {
        const res = await axiosInstance.get(BALANCE_SHOW(id));
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const updateBalance = async (payload: Partial<IBalance>): Promise<IBalance | undefined> => {
    try {
        delete payload.total;
        const res = await axiosInstance.put(BALANCES, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const getBalanceHistoryById = async (id: string): Promise<IBalanceHistory | undefined> => {
    try {
        const res = await axiosInstance.get(BALANCE_HISTORY_BY_ID(id));
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const updateBalanceHistory = async (id: string, payload: Partial<IBalanceHistory>): Promise<IBalanceHistory | undefined> => {
    try {
        const res = await axiosInstance.put(BALANCE_HISTORY_BY_ID(id), payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const deleteBalanceHistory = async (id: string): Promise<any> => {
    try {
        const res = await axiosInstance.delete(BALANCE_HISTORY_BY_ID(id));
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const addSettlement = async (payload: Partial<IBalance>): Promise<IBalance | undefined> => {
    try {
        delete payload.total;
        const res = await axiosInstance.put(BALANCE_ADD_SETTLEMENT, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const getBankAccountBalance = async (link: string): Promise<IBankAccount[] | undefined> => {
    try {
        const res = await axiosInstance(
            `bank-accounts/balance`,
            {
                baseURL: link,
                method: 'get',
            },
        );
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const getBalanceHistoryTable = async (payload: ITablePayload<Partial<IBalanceHistory>>): Promise<ITable<IBalanceHistory[]> | undefined> => {
    try {
        const res = await axiosInstance.post(FIND_BALANCE_HISTORY, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const getInternalTransferTable = async (payload: ITablePayload<Partial<IBalanceHistory>>): Promise<ITable<IBalanceHistory[]> | undefined> => {
    try {
        const res = await axiosInstance.post(FIND_INTERNAL_TRANSFER, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};



export const getBankAccountUploadTimeMoreThan2Min = async (link: string): Promise<IBankAccount[] | undefined> => {
    try {
        const res = await axiosInstance(
            `bank-accounts/more-than-2-min`,
            {
                baseURL: link,
                method: 'get',
            },
        );
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};