import {BalanceAccountTypesEnum} from '@/utils/enums/balances.enum';

export interface IGatewayAccount {
    _id?: string;
    name: string;
    type?: BalanceAccountTypesEnum;
    merchant_id?: string;
    secret_key?: string;
    payout_key?: string;
    request_hash_key?: string;
    request_salt_key?: string;
    aes_request_key?: string;
    response_hash_key?: string;
    response_salt_key?: string;
    aes_response_key?: string;
    aes_encryption_iv?: string;
    aes_encryption_key?: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
