import axiosInstance from '@/utils/axios';
import {BATCH_COMMENT} from '@/utils/endpoints/endpoints';

export const addComment = async (comment: string, id: string): Promise<any | undefined> => {
    try {
        const res = await axiosInstance.post(BATCH_COMMENT(id), {comment});
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
