export interface ITicketSummary {
    senderBankAccountId: any;
    receiverBankAccountId: any;
    amount: number;
    utr: string;
    creatorRemark?: string;
    receiverBankAccountNo?:any,
    senderBankAccountNo?:any,
    remark?:string
}
interface BankAccount {
    name: string;
    number: string;
}

export interface ITicketSummaryResponse {
    _id: string;
    senderBankAccountId: BankAccount;
    receiverBankAccountId: BankAccount;
    amount: number;
    status: number;
    creatorRemark: string;
    createdBy: any;
    createdAt: string;
    updatedAt: string;
    updatedBy: any;
    data?:any;
    totalAmount?:number
}

export interface ITicketResponseData {
    data: ITicketSummaryResponse[];
    pages: number;
    total: number;
    totalAmount?:number;
}

export type ITicketStatusAR = {
    remark: string;
    status?: number;
    approveutr?:string;
}

interface User {
    username: string | null;
}

interface TicketData {
    _id: string;
    senderBankAccountId: BankAccount;
    receiverBankAccountId: BankAccount;
    utr: string;
    amount: number;
    creatorRemark: string;
    status: number;
    createdBy: User;
    createdAt: string;
    updatedAt: string;
    updatedBy: User;
}

export default TicketData;
