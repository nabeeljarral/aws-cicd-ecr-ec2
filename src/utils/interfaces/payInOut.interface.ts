export type IpayInOut = {
    payment_action?:string;
    successRate?: any;
    _id?: string;
    status?: string;
    category?: string;
    statuses?: string[];
    is_claimed?: boolean;
    startDate?: Date;
    endDate?: Date;
    show?: boolean;
    showBankAccount?: boolean;
    utr?: string;
    unlimited?: boolean;
    setting?: any;
    bank_account?: any;
    createdBy?: string;
    relatedTo?: string;
}

export type IPayData = {
    _id: string;
    clientName: string;
    initiateAmount: number
    successAmount: number;
    failedAmount: number;
    successRate?: any;
    total: number;
}
export type IPayInOutFilter = Partial<IPayData>
