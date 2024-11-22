import {IVendor} from '@/utils/interfaces/vendor.interface';
import {IComment} from '@/utils/dto/transactions.dto';

export interface IBatch {
    _id?: string;
    name?: string;
    batchId?: string;
    isExported: boolean;
    amount: number;
    transactionCount: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    vendorId: string | IVendor;
    comments?: IComment[];
}

export interface IPayload {
    relatedTo?:string;
    batchId?:string;
}

export interface BankRecord {
    count: number;
    ids: string[];
    bankCode: string;
  }
  
  interface RelatedTo {
    _id: string;
    username: string;
    email: string;
  }
  
  export interface RowData {
    isChild: boolean;
    isSplitted: boolean;
    _id: string;
    vendorId:string | IVendor;
    name: string;
    amount: number;
    amount_fees: number;
    transactionCount: number;
    isExported: boolean;
    createdBy: string;
    relatedTo: RelatedTo;
    comments: IComment[]; 
    createdAt: string; 
    updatedAt: string; 
  }