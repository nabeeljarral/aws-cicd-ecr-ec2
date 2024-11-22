import {IUser} from '@/utils/interfaces/user.interface';
import {BalanceTypeEnum} from '@/utils/enums/balances.enum';

export type IBalance = {
    _id?: string;
    relatedTo: string | IUser,
    total: number,
    accountType: number,
    merchant_id: string,
    payout_key: string,
    add_settlement_remarks?: string
    open_balance_date?: string
    open_balance_value?: string
    add_settlement_amount?: string
    add_manual_payout_amount?: string
    add_manual_payout_remarks?: string
    add_manual_balance_amount?: string
    add_manual_balance_remarks?: string
    deduct_manual_balance_amount?: string
    deduct_manual_balance_remarks?: string
    request_hash_key?: string;
    request_salt_key?: string;
    aes_request_key?: string;
    response_hash_key?: string;
    response_salt_key?: string;
    aes_response_key?: string;
}

export type IBalanceHistory = {
    _id: string;
    relatedTo: string | IUser,
    remarks?: string,
    amount: number,
    amount_fee: number,
    type: BalanceTypeEnum,
    userType?: string;
}