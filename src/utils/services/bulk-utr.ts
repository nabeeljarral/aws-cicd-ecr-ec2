import axiosInstance from '@/utils/axios';
import {BULK_ADD_UPDATE, BULK_PAYOUT_FAILED, PAYOUT_BULK_ADD_UPDATE_UTR} from '@/utils/endpoints/endpoints';
import {IBulkAddUpdate, IBulkPayoutFailed} from '../interfaces/BulkUpdatetransaction.interface';

export const updateBulkUtr = async (
    id: string,
    payload: Partial<IBulkAddUpdate>,
): Promise<IBulkAddUpdate | undefined> => {
    try {
        const res = await axiosInstance.put(BULK_ADD_UPDATE(id), payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const updatePayoutBulkUtr = async (
    payload: Partial<IBulkAddUpdate>,
): Promise<IBulkAddUpdate | undefined> => {
    try {
        const res = await axiosInstance.put(PAYOUT_BULK_ADD_UPDATE_UTR, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const bulkPayoutIds = async (
    id: string,
    payload: Partial<IBulkPayoutFailed>,
): Promise<IBulkPayoutFailed | undefined> => {
    try {
        const res = await axiosInstance.put(BULK_PAYOUT_FAILED(id), payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
