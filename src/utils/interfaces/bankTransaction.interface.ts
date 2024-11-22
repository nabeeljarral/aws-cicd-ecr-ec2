export interface IBankTransaction {
    id: string;
    bank_account: string;
    amount: number;
    transaction: {
        info: string;
        date: Date;
    };
    idx: string;
    amount_and_utr: string;
    utr: string;
    is_claimed: boolean;
    createdBy?: string;
    relatedTo?: string;
    createdAt: Date;
    updatedAt: Date;
    related_transaction_id?: string;
}