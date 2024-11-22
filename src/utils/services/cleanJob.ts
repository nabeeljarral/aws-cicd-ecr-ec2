import axiosInstance from '@/utils/axios';
import {CLEAN_JOB, PAYOUT_BULK_ADD_UPDATE_UTR} from '@/utils/endpoints/endpoints';
import { ICleanJobUpdate } from '../interfaces/cleanJob.interface';

export const cleanJobApi = async (
    id: string,
    payload: Partial<ICleanJobUpdate>,
): Promise<ICleanJobUpdate | undefined> => {
    try {
        const res = await axiosInstance.post(CLEAN_JOB(id), payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};


