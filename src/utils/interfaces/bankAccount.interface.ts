import {IVendor} from '@/utils/interfaces/vendor.interface';
import {BankTypesEnum} from '@/utils/enums/bankTypes.enum';
import {
    BankAccountStatusEnum,
    BankAccountTypesEnum,
    ChannelsEnum,
    BankAccountNatureEnum,
} from '../enums/accountDetails.enums';
import {IBankAmountRange} from '@/pages/panel/account-details/components/bankRangeDialog';
export interface IBank {
    _id?: string;
    name: string;
    number?:any
    bankId?: any;
}
interface KeyValuePair {
    isDeleted?: boolean;
    key: string;
    value: string;
}

// Define the type for an array of key-value pairs
export type KeyValuePairArray = KeyValuePair[];
export interface IBankAccount {
    _id?: string;
    bank_type?: BankTypesEnum;
    merchant_id?: string;
    payin_secret_key?: string;
    request_hash_key?: string;
    request_salt_key?: string;
    aes_encryption_key?: string;
    aes_encryption_iv?: string;
    kyc_mobile_number?: string;
    username?: string;
    password?: string;
    aes_request_key?: string;
    name: string;
    number?: number;
    upi_id?: any;
    otpAccess?: number;
    bankId?: string | IBank;
    vendorId?: string | IVendor;
    daily_limit?: number;
    incomes_today?: number;
    is_active: boolean;
    global?: boolean;
    qr_Link?: string | undefined;
    qrcode_url?: string | null;
    importDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    relatedTo?: any;
    total_credit?: string;
    closing_balance?: string;
    response_salt_key?: string;
    response_hash_key?: string;
    aes_response_key?: string;
    trxnPassword?: string;
    registeredPhoneNo?: string;
    remark?: string;
    accountType?: BankAccountTypesEnum;
    channel?: ChannelsEnum;
    status?: BankAccountStatusEnum;
    freezeAmount?: string;
    loginId?: string;
    userIds?: any;
    accountNature?: BankAccountNatureEnum;
    customerID?: string;
    securityQuestion?: string;
    securityAnswer?: string;
    websiteUrl?: string;
    vendorName?: string;
    bankName?: string;
    prevChannel?: number;
    is_live?: boolean;
    limit_percentage?: string;
    daily_income?: string;
    beneficiaryAccounts?: string[];
    keyValueList?: KeyValuePair[];
    openingBalance?: any;
    showAccNoIFSCCode?: boolean;
    ifscCode?: string;
    showQRUPIId?: boolean;
    qrsList?: IQRItem[];
    bankAmountRange?: string | IBankAmountRange;
    paymentMethods?: string[];
}

export interface IQRItem {
    name: string;
    url: string;
    isActive: boolean;
    hits: number; //number of hits for QR by user
    updatedAt: Date;
    createdAt: Date;
    _id?: string;
}
