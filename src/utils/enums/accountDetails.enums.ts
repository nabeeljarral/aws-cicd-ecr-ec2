export enum BankAccountStatusEnum {
  readyToLive = 1,
  hold = 2,
  live = 3,
  other = 4,
  stop = 5,
  freeze=6,
  permanentStop=7,
  processing = 8
  }

  export enum BankAccountTypesEnum {
    payin = 1,
    payout = 2,
  }

  export enum ChannelsEnum {
    payz365 =1,
    paymentCircle =2,
    zealApp =3,
  }

  export enum TransferTypeEnum {
    InternalTransfer = 'InternalTransfer',
    ChargeBack ='ChargeBack',
  }
  export enum UserTypeEnum {
    sender = 'sender',
    receiver ='receiver',
  }

  export enum BankAccountNatureEnum {
    saving = 1,
    current = 2,
  }