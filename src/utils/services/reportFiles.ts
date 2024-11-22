import {GET_REPORT_FILES} from '../endpoints/endpoints';
import {IReportFileInfo} from '../interfaces/report.interface';
import axiosInstance from '../axios';
import {ReportEnum} from '../enums/reports';

export const fetchReportFiles = async (reportType: ReportEnum): Promise<IReportFileInfo[]> => {
    try {
        const response = await axiosInstance.post(GET_REPORT_FILES, {
            reportType,
        });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching report files:', error.response?.data || error.message);
        throw new Error('Failed to fetch report files');
    }
};
