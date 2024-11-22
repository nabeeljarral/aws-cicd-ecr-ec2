export enum TransactionStatusEnum {
    success = 'success',
    initiate = 'page_viewed',
    unfinished = 'utr_not_submitted',
    pending = 'processing',
    failed = 'failed',
}

export enum PayoutTransactionStatusEnum {
    initiate = 'initiate',
    pending = 'processing',
    success = 'success',
    failed = 'failed',
    returned = 'returned',
}
