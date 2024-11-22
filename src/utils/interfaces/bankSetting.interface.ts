import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';

export interface IBankSetting {
    category: string;
    upi_ids: IBankAccount[] | string[];
    active_upi_id: IBankAccount | string;
    is_active: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    relatedTo?: string;
}
