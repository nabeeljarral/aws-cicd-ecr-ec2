import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import { BankTypesEnum } from '../enums/bankTypes.enum';

export type ISetting = {
    _id: string;
    category: string;
    upi_ids: IBankAccount[];
    active_upi_id: IBankAccount;
    is_active: boolean;
    updatedAt?: string;
    createdBy?: string;
    relatedTo?: string;
    ranged_upi_list?: string[];
    bankType: BankTypesEnum;
};

export type ISettingDto = {
    _id?: string;
    category?: string;
    upi_ids: string[];
    active_upi_id: string | IBankAccount;
    is_active: boolean;
    createdBy?: string;
    relatedTo?: string;
    ranged_upi_list?: string[];
};
