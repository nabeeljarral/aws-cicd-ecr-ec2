import axiosInstance from '@/utils/axios';
import {BANK_STATEMENT_FILE, DOWNLOAD_BANK_STATEMENT_FILE} from '@/utils/endpoints/endpoints';
import {ITable, ITablePayload} from '@/utils/interfaces/transaction.interface';
import {IBankStatementFile, IBankStatementFileFilter} from '@/utils/interfaces/bankStatementFile.interface';
import {downloadZipFile} from '@/utils/functions/files';

export const getBankStatementFiles = async (payload: ITablePayload<IBankStatementFileFilter>): Promise<ITable<IBankStatementFile[]> | undefined> => {
    try {
        if (!payload.page) payload.page = 1;
        if (!payload.limit) payload.limit = 10;
        const res = await axiosInstance.post(BANK_STATEMENT_FILE, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const downloadBankStatementFiles = async (ids: string[]): Promise<void> => {
    try {
        const res = await axiosInstance({
            method: 'post',
            url: DOWNLOAD_BANK_STATEMENT_FILE,
            data: {ids},
            responseType: 'blob',
        });
        if (res.data && !res?.data?.message) downloadZipFile(res, `bank_statement-${Date.now()}`);
        return;
    } catch (error: any) {
        console.error(error);
    }
};