import {IVendor} from '@/utils/interfaces/vendor.interface';
import {BankTypesEnum} from '@/utils/enums/bankTypes.enum';
import { BankAccountStatusEnum, BankAccountTypesEnum, ChannelsEnum } from '../enums/accountDetails.enums';

export interface IAccountDetails {
    _id: string;
    transactionIds: string[] | string;
    externalRefIds: string[] | string;
    payment_action?: string;
    balanceType?: string;
    logs?:[]
}


export interface IBank {
    _id?: string;
    name: string;
}

export interface IGetBankAccountsResponse {
    bankAccounts: IAccountDetailsResponse[];
    pages: number;
    total: number;
}

export interface IAccountDetailsResponse{
    _id?: string;
    bank_type?: BankTypesEnum;
    merchant_id?: string;
    payin_secret_key?: string;
    request_hash_key?: string;
    request_salt_key?: string;
    aes_encryption_key: string;
    aes_encryption_iv: string;
    kyc_mobile_number: string;
    username?: string;
    password?: string;
    aes_request_key?: string;
    name: string;
    number: number;
    upi_id: string;
    otpAccess?:number;
    bankId: string | IBank;
    vendorId: string | IVendor;
    daily_limit: number;
    incomes_today?: number;
    is_active: boolean;
    global?: boolean;
    qr_Link?: string | undefined;
    qrcode_url?: string | null;
    importDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    relatedTo?: string;
    total_credit?: string;
    closing_balance?: string;
    response_salt_key?: string;
    response_hash_key?: string;
    aes_response_key?: string;
    trxnPassword?:string;
    registeredPhoneNo?: string;
    remark?: string;
    accountType?: BankAccountTypesEnum;
    channel?: ChannelsEnum;
    status?: BankAccountStatusEnum;
}

export interface User {
    _id: string;
    username: string;
    email: string;
}

export interface PopupData {
    userIds: User[];
}

interface CompletionState {
    [key: number]: boolean;
}

export interface QrItem {
    name: string;
    url: string;
    isActive: boolean;
    hits: number;
    updatedAt: string;  
    createdAt: string;  
}
export interface IDailogBoxProps {
    popupData:any;
    open:boolean;
    formData:any;
    activeStep:number;
    anchorEl:HTMLElement | null;
    completed:CompletionState;
    handleStep:(step: number) => void;
    handleClosePopover:() => void;
    openPopover:boolean;
    openStatus:boolean;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement> | any) => void;
    handleClick:(e:any) => void;
    setOpen:React.Dispatch<React.SetStateAction<boolean>>;
    handleSelectChange:(name: string, value: any) => void;
    handleClose:() => void;
    validation:boolean;
    setRemarksAndAmount:() => void;
    handleDailogClose:() => void;
    OpenKeyValueViewDailog:() => void;
    handleTooltipClose:() => void;
    closingBalanceData:any;
    dailogAnchorEl:boolean;
    vendorsLoading:boolean;
    handleConfirm:()=>void;
    handleDailogClick:(e:any)=>void;
    handleViewDialogClose:() => void;
    openViewDialog:boolean;
    setFormData:any;
    setPreviousStatus:React.Dispatch<React.SetStateAction<number>>;
    previousStatus:number;
    setOpenStatus:React.Dispatch<React.SetStateAction<boolean>>;
    handleSwitch:() => void;
    setActiveStep:React.Dispatch<React.SetStateAction<number>>;
    setCompleted:React.Dispatch<React.SetStateAction<CompletionState>>;
    setDailogAnchorEl:React.Dispatch<React.SetStateAction<boolean>>;
    setVendorsLoading:React.Dispatch<React.SetStateAction<boolean>>;
}

