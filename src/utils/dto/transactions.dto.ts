import {IBankSetting} from '@/utils/interfaces/bankSetting.interface';
import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import {IUser} from '@/utils/interfaces/user.interface';
import {PaymentMethodEnum, PaymentOptionsEnum} from '@/utils/enums/paymentMethod.enum';
import {PayoutTransactionStatusEnum} from '@/utils/enums/transactionStatus';
import {IBatch} from '@/utils/interfaces/batch.interface';

export type IFilterTransactionDto = {
    // _ids?: string[];
    _id?: string;
    status?: string;
    category?: string;
    statuses?: string[];
    is_claimed?: boolean;
    startDate?: Date | any;
    endDate?: Date | any;
    show?: boolean;
    showBankAccount?: boolean;
    utr?: string;

    unlimited?: boolean;
    setting?: IBankSetting | string;
    bank_account?: IBankAccount | string;
    createdBy?: string;
    relatedTo?: string;
    payment_action?: string;
};
export type ICreateTransactionDto = {
    status?: string;
    category?: string;
    statuses?: string[];
    is_claimed?: boolean;
    startDate?: Date;
    endDate?: Date;
    show?: boolean;

    amount?: number;
    qr_Link?: string;

    setting?: string;
    bank_account?: IBankAccount | string;
    createdBy?: string;
    relatedTo?: string;
};

export interface IUpdateTransactionDto {
    ids?: string[];
    status?: string;
    is_claimed?: boolean;
    utr?: string;
    upi_id?: string;
    amount_and_utr?: string;
    createdBy?: string;
    relatedTo?: string;
    key?: 'lcBT6o9t$JFSE4!7Ou60*q4G';
    selectedPaymentMethod?: PaymentOptionsEnum;
}

export interface StatusHistoryItem {
    data: Partial<IPayoutTransaction>;
    date: Date;
    updatedBy: string;
}

export interface IComment {
    comment: string;
    date: Date;
    createdBy: IUser;
}

export interface IPayoutTransaction {
    _id: string;
    status_history: StatusHistoryItem[];
    vendorId: string;
    vendor_bank?: string;
    is_processing?: boolean;
    amount: number;
    batchId?: string | IBatch;
    amount_fees: number;
    status: PayoutTransactionStatusEnum;
    is_claimed: boolean;
    order_id: string;
    utr: string;
    beneficiary_email: string;
    beneficiary_phone: string;
    remarks: string;
    payment_method: PaymentMethodEnum;
    currency: string;
    account_holder_name: string;
    account_number: number;
    balance: string;
    bank_name: string;
    bank_branch: string;
    bank_address: string;
    ifsc: string;
    relatedTo: string | IUser;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    format: string;
    gatewayId: string;
    startDate?: Date;
    endDate?: Date;
    external_ref?: string;
}

export type IFilterPayoutTransaction = Partial<IPayoutTransaction> & {
    unlimited?: boolean;
};
