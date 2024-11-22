import {ReportEnum} from '../enums/reports';

export type IFilterBankTransactionDto = {
    is_claimed?: boolean;
    utr?: string;
    startDate?: Date;
    endDate?: Date;
    show?: boolean;
    relatedTo?: string;
    type?: ReportEnum;
};
