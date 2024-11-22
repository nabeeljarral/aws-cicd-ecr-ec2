export interface IPayWingCreateTransaction {
    BeneficiaryEmail: string;
    BeneficiaryMobile: number;
    BeneficiaryAddress: string;
    MERCHANT_ID: string;
    ClientTID: string;
    AccHolderName: string;
    AccountNo: string;
    IFSC: string;
    Amount: number;
    TxnMode: string;
    Remark: string;
    relatedTo?: string;
}

export interface IPayWingResponse<T> {
    respCode: string;
    respStatus: string;
    respMsg: string;
    data: T;
}

export type IPayWingCreateTransactionResponse =
    IPayWingResponse<IPayWingCreateTransaction | null>;

export type IPayWingBalanceResponse = IPayWingResponse<{balance: string}>;