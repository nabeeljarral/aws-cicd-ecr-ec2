import axiosInstance from '@/utils/axios';
import {
    BALANCE_REPORTS,
    BANK_TRANSACTIONS_REPORTS,
    BATCH_REPORTS,
    DOWNLOAD_REPORT_FILE,
    FAILED_PAYOUT_TRANSACTIONS_REPORTS,
    PAYOUT_TRANSACTIONS_REPORTS,
    RECON_REPORTS,
    REPORT_FILE_CHECK,
    TRANSACTIONS_REPORTS,
    TRANSACTIONS_REPORTS_NEW,
    VENDOR_REPORTS,
} from '@/utils/endpoints/endpoints';
import {IFilterTransactionDto, IPayoutTransaction} from '@/utils/dto/transactions.dto';
import {IFilterBankTransactionDto} from '@/utils/dto/bankTransactions.dto';
import {IFilterVendorDto} from '@/utils/interfaces/vendor.interface';
import {AxiosResponse} from 'axios';
import awesomeAlert from '@/utils/functions/alert';
import {AlertTypeEnum} from '@/utils/enums/alertType';
import {IReportFileInfo, IReportOutput} from '@/utils/interfaces/report.interface';
import {saveAs} from 'file-saver';
export const fileDownload = async (response: AxiosResponse<any, any>, fileName: string) => {
    try {
        if (!response.data) {
            awesomeAlert({msg: 'Error downloading file', type: AlertTypeEnum.error});
            return;
        }

        // Extract filename from the Content-Disposition header
        const disposition = response.headers['content-disposition'];
        const matches = disposition && disposition.match(/filename="(.+)"/);
        const extension =
            response.headers['content-type'] === 'text/csv; charset=UTF-8' ? 'csv' : 'xlsx';
        const filename = matches && matches.length > 1 ? matches[1] : `${fileName}.${extension}`;

        // Create a Blob from the response data
        const blob = new Blob([response.data], {type: response.headers['content-type']});

        // Use FileSaver.js to save the file
        return saveAs(blob, filename);
    } catch (error) {
        console.error(error);
    }
};
export const downloadReport = async (
    id: string,
    fileName: string = 'report',
    type?: string,
): Promise<any> => {
    const res = await axiosInstance({
        method: 'get',
        url: DOWNLOAD_REPORT_FILE(id),
        responseType: 'blob',
    });
    let downloadFileName = `${fileName}-${Date.now()}`;
    if (type === 'batch') {
        downloadFileName = fileName;
    }
    return await fileDownload(res, downloadFileName);
};

export const checkReportCompleted = async (id: string): Promise<IReportFileInfo | undefined> => {
    try {
        const res = await axiosInstance.get(REPORT_FILE_CHECK(id));
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const transactionReport = async (payload: IFilterTransactionDto): Promise<IReportOutput> => {
    try {
        const res = await axiosInstance({
            method: 'post',
            url: TRANSACTIONS_REPORTS,
            data: payload,
        });
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const transactionReportNew = async (
    payload: IFilterTransactionDto,
): Promise<IReportOutput> => {
    try {
        const res = await axiosInstance({
            method: 'post',
            url: TRANSACTIONS_REPORTS_NEW,
            data: payload,
        });
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const reconReport = async (payload: IFilterTransactionDto): Promise<any> => {
    try {
        const res = await axiosInstance({
            method: 'post',
            url: RECON_REPORTS,
            data: payload,
        });
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const balanceReport = async (payload: IFilterTransactionDto): Promise<any> => {
    try {
        const res = await axiosInstance({
            method: 'post',
            url: BALANCE_REPORTS,
            data: payload,
        });
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const bankTransactionReport = async (payload: IFilterBankTransactionDto): Promise<any> => {
    try {
        const res = await axiosInstance({
            method: 'post',
            url: BANK_TRANSACTIONS_REPORTS,
            data: payload,
        });
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const vendorReport = async (payload: IFilterVendorDto): Promise<any> => {
    try {
        const res = await axiosInstance({
            method: 'post',
            url: VENDOR_REPORTS,
            data: payload,
        });
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export type IReportExtraDataFormat = {
    //AU
    'REMITTER ACCOUNT NO'?: string;
    'REMITTER NAME'?: string;
    'MOBILE NO'?: string;
    EMAIL?: string;
    //IDFC
    'Debit Account No.'?: string;
    //YES
    '91BENE MOBILE NUMBER'?: string;
    //RBL
    'Source Account Number'?: string;
    'Source Narration'?: string;
    'Destination Narration'?: string;
    Email?: string;
    //HDFC
    'Bene Bank Branch Name': string;
    'Beneficiary email id': string;
};
export const payoutTransactionReport = async (
    payload: Partial<IPayoutTransaction> & {
        values?: IReportExtraDataFormat;
    },
    fileName?: string,
): Promise<any> => {
    try {
        const res = await axiosInstance({
            method: 'post',
            url: PAYOUT_TRANSACTIONS_REPORTS,
            data: payload,
        });
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const batchReport = async (
    payload: Partial<IPayoutTransaction> & {
        values?: IReportExtraDataFormat;
    },
    fileName?: string,
): Promise<any> => {
    try {
        const res = await axiosInstance({
            method: 'post',
            url: BATCH_REPORTS,
            data: payload,
        });
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const failedPayoutTransactionReport = async (
    payload: Partial<IPayoutTransaction> & {
        values?: IReportExtraDataFormat;
    },
    fileName?: string,
): Promise<any> => {
    try {
        const res = await axiosInstance({
            method: 'post',
            url: FAILED_PAYOUT_TRANSACTIONS_REPORTS,
            data: payload,
        });
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
