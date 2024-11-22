
export interface IBulkUpdate {
    ids?: string;
    utrs?: string;
    amounts?: any;
    sendCallback?: boolean;
}

export type IBulkAddUpdate = {
    ids: string[];
    utrs: string[];
    amounts: string[];
    sendCallback: boolean;
}
export type IBulkPayoutFailed = {
    ids: string[];
    status:string
}