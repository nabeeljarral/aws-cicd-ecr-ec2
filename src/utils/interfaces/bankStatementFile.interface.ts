import {IBank, IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import {UploadFileStatusEnum} from '../enums/uploadFileStatus.enum';

export type IBankStatementFile = {
    _id: string;
    filename: string;
    extension: string;
    bankId?: IBank;
    account_number?: string;
    bank_account?: IBankAccount;
    size: number;
    url: string;
    type: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    status?: UploadFileStatusEnum;
    logs?: string[];
    isCompleted?: boolean;
    processedCount?: number;
    notProcessedCount?: number;
    tansactionsCount?: number;
    canceledBy?: string;
};

export type IBankStatementFileFilter = Partial<IBankStatementFile>;
