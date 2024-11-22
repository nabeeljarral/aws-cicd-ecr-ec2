import axiosInstance from '@/utils/axios';
import {BANKS} from '@/utils/endpoints/endpoints';
import {IBank} from '@/utils/interfaces/bankAccount.interface';

export const getBanks = async (): Promise<IBank[] | undefined> => {
    try {
        const res = await axiosInstance.get(BANKS);
        return res.data;
    } catch (error: any) {
        throw error;
    }
};