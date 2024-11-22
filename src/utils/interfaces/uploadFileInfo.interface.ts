import {ChannelsEnum} from '../enums/accountDetails.enums';

export type IUploadFileInfo = {
    _id: string;
    url: string;
    fileName?: string;
    filename?: string;
    error?: string;
    status?: string;
    channel?: ChannelsEnum;
    logs?: string[];
    isCompleted?: boolean;
    isDuplicated?: boolean;
    processedCount?: number;
    notProcessedCount?: number;
    payoutTansactionsCount?: number;
    tansactionsCount?: number;
    createdBy: any;
    canceledBy: any;
    createdAt: Date;
    updatedAt: Date;
};
