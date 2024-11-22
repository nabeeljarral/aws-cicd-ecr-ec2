import axiosInstance from '@/utils/axios';
import {BATCH_FIND, BATCH_SPLIT_BY_BANK_ID,BANKS_IN_BATCH_ID} from '@/utils/endpoints/endpoints';
import {IBatch} from '@/utils/interfaces/batch.interface';
import {ITable, ITablePayload} from '@/utils/interfaces/transaction.interface';

export const getBatches = async (payload: ITablePayload<Partial<IBatch>>): Promise<ITable<IBatch[]> | undefined> => {
    try {
        const res = await axiosInstance.post(BATCH_FIND, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const getBankNamesInBatch = async (id: string): Promise<any | undefined> => {
    try {
        const res = await axiosInstance.get(BANKS_IN_BATCH_ID(id));
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const getSplitByBank = async (filter: {},id:string): Promise<any | undefined> => {
    try {
        const res = await axiosInstance.post(BATCH_SPLIT_BY_BANK_ID(id), filter);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
