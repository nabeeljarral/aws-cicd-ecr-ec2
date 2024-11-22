import axiosInstance from '@/utils/axios';
import { CHARGE_BACK, INTERNAL_TRANSFER, REPORT_FILE_CHECK, TOP_UP, TRANSFER_REPORTS} from '@/utils/endpoints/endpoints';
import { ChargeBackInterface, ChargeBackPayload, InternalTransferPayload, InternalTransferResponse, TopUpPayload } from '../interfaces/chargeBackInternalTransfer';
import { IPayoutTransaction } from '../dto/transactions.dto';
import { IReportExtraDataFormat } from './reports';
import { IReportFileInfo } from '../interfaces/report.interface';

export const chargeBackApi = async (
    payload: Partial<ChargeBackPayload>,
): Promise<ChargeBackInterface | undefined> => {
    try {
        const res = await axiosInstance.post(CHARGE_BACK, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const topUpTransferAPI = async (
    payload: Partial<TopUpPayload>,
): Promise<ChargeBackInterface | undefined> => {
    try {
        const res = await axiosInstance.post(TOP_UP, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const InternalTransferApi = async (
    payload: Partial<InternalTransferPayload>,
): Promise<InternalTransferResponse | undefined> => {
    try {
        const res = await axiosInstance.post(INTERNAL_TRANSFER, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const transferReport = async (
    payload: Partial<IPayoutTransaction> & {
        values?: IReportExtraDataFormat;
    },
    fileName?: string,
): Promise<any> => {
    try {
        const res = await axiosInstance({
            method: 'post',
            url: TRANSFER_REPORTS,
            data: payload,
        });
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const checkReportCompleted = async (id: string): Promise<IReportFileInfo | undefined> => {
    try {
        const res = await axiosInstance.get(REPORT_FILE_CHECK(id));
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};