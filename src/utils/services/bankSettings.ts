import axiosInstance from '@/utils/axios';
import {
    BANK_SETTING_BY_ID,
    BANK_SETTINGS,
    BANK_SETTINGS_UPDATE_UPI,
} from '@/utils/endpoints/endpoints';
import {ISetting, ISettingDto} from '@/utils/interfaces/settings.interface';

export const getSettings = async ({
    relatedTo,
    category,
}: {
    relatedTo: string | undefined;
    category?: string;
}): Promise<ISetting[] | undefined> => {
    try {
        const res = await axiosInstance.get(BANK_SETTINGS(relatedTo, category));
        return res.data;
    } catch (error: any) {
        console.error(error);
        return undefined; // or handle error appropriately
    }
};
export const getSetting = async (payload: {id: string}): Promise<ISetting | undefined> => {
    try {
        const res = await axiosInstance.get(BANK_SETTING_BY_ID(payload.id));
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const updateSetting = async (
    id: string,
    payload: Partial<ISettingDto>,
): Promise<ISetting | undefined> => {
    try {
        const res = await axiosInstance.put(BANK_SETTING_BY_ID(id), payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const updateUPISetting = async (payload: ISettingDto): Promise<ISetting | undefined> => {
    try {
        const res = await axiosInstance.post(BANK_SETTINGS_UPDATE_UPI, payload); // Ensure `payload` contains the expected data structure
        return res.data;
    } catch (error: any) {
        console.error('Error updating UPI setting:', error);
    }
};
export const createSetting = async (
    payload: Partial<ISettingDto>,
): Promise<ISetting | undefined> => {
    try {
        const res = await axiosInstance.post(BANK_SETTINGS(), payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
