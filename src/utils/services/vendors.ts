import axiosInstance from '@/utils/axios';
import {PAYMENT_CIRCLE, SYNC_VENDOR, VENDORS, ZEAL_APP} from '@/utils/endpoints/endpoints';
import {IVendor} from '@/utils/interfaces/vendor.interface';

export const getVendors = async (): Promise<IVendor[] | undefined> => {
    try {
        const res = await axiosInstance.get(VENDORS);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const addVendor = async (payload: IVendor): Promise<IVendor | undefined> => {
    try {
        const res = await axiosInstance.post(VENDORS, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const syncVendorInZeal = async (payload: IVendor): Promise<IVendor | undefined> => {
    try {
        const res = await axiosInstance.post(SYNC_VENDOR, payload, {baseURL: ZEAL_APP});
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const syncVendorInPayCircle = async (payload: IVendor): Promise<IVendor | undefined> => {
    try {
        const res = await axiosInstance.post(SYNC_VENDOR, payload, {baseURL: PAYMENT_CIRCLE});
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
