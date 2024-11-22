import {IUser} from '@/utils/interfaces/user.interface';
import {BalanceTypeEnum} from '@/utils/enums/balances.enum';
export interface ChargeBackInterface {
    fromUser: string | IUser;
    type: BalanceTypeEnum;
    amount: number;
    amount_fees: number;
    remarks: string;
    _id: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface InternalTransferInterface {
    fromUser: string | IUser;
    toUser: string | IUser;
    type: BalanceTypeEnum;
    amount: number;
    amount_fees: number;
    remarks: string;
    transactionRelatedID: string;
    _id: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface InternalTransferResponse {
    message: string;
    transaction: InternalTransferInterface;
  }
  

  export type ITransferHistory = {
    _id: string;
    relatedTo: string | IUser,
    remarks?: string,
    amount: number,
    amount_fee: number,
    type: BalanceTypeEnum,
}

export interface ChargeBackDto {
  amount?: number;
  fromUser?: string;
  order_id?: string;
  remarks?: string;
  createdBy?: string;
  toUser?: string;

}
export interface ChargeBackPayload {
  chargeBackDto?: ChargeBackDto;
}
export interface TopUpDto {
  amount?: number;
  fromUser?: string;
  remarks?: string;
  createdBy?: string;
  toUser?: string;

}

export interface TopUpPayload {
  topUpDto?: TopUpDto;
}

export interface TransferDto {
  fromUser?: string;
  toUser?: string;
  amount?: number;
  remarks?: string;
  createdBy?: string;
  order_id?: string;
}

export interface InternalTransferPayload {
  transferDto?: TransferDto;
}

export interface CombinedPayload extends ChargeBackPayload, InternalTransferPayload {}

export interface ChargeBackResponse {
  fromUser: string;
  type: string;
  amount: number;
  amount_fees: number;
  remarks: string;
  _id: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  message?:string
}

export interface TopUpResponse {
  fromUser: string;
  type: string;
  amount: number;
  amount_fees: number;
  remarks: string;
  _id: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  message?:string
}