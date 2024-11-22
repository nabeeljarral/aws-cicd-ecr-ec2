import axiosInstance from '@/utils/axios';
import {BANK_TRANSACTION_UPLOAD} from '@/utils/endpoints/endpoints';
import {BanksImportEnum} from '@/utils/enums/banks';

export const bankTransactionFileUpload = async (formData: {
    'fileUrl': string,
    'createdBy': string
}, bank: BanksImportEnum | string) => {
    try {
        const response = await axiosInstance.post(BANK_TRANSACTION_UPLOAD(bank), formData);
        return response?.data;
    } catch (error: any) {
        console.log(error);
    }
};
export const deleteUploadedBankTransaction = async (formData: {
    'fileUrl': string
}, bank: BanksImportEnum | string) => {
    try {
        const response = await axiosInstance.delete(BANK_TRANSACTION_UPLOAD(bank), {
            data: formData,
        });
        console.log({response});
        return response;
    } catch (error: any) {
        console.log(error);
    }
};