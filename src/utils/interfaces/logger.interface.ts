import {CallbackLogTypeEnum, LoggerStatusEnum} from '@/utils/enums/loggerStatus';

export interface ILogger {
    status: string | LoggerStatusEnum;
    msg?: string;
    data?: string;
    createdAt: Date;
}

export interface IAttemptsResponsePayload {
    response: string;
    date: Date;
}

export interface ICallbackLog {
    _id: string;
    relatedTo: string;
    callbackUrl: string;
    transactionId: string;
    type: CallbackLogTypeEnum;
    requestPayload: string;
    responsePayload?: string;
    success: boolean;
    retryAttempts: number;
    attemptsResponsePayload?: IAttemptsResponsePayload[];
}
export interface IReceivedCallbackLog {
    _id: string;
    transactionIds: string[] | string;
    externalRefIds: string[] | string;
    payment_action?: string;
    balanceType?: string;
    logs?:[]
}