import {IOptionItem} from '@/components/filter/main/filterSelect';
import {BankTypesEnum, BankTypesEnumValue} from '@/utils/enums/bankTypes.enum';
import {PayoutTransactionStatusEnum, TransactionStatusEnum} from '@/utils/enums/transactionStatus';
import {OptionsFromArray} from '@/utils/functions/global';
import {
    BalanceAccountTypesEnum,
    BalanceAccountTypesName,
    BalanceTypeEnum,
} from '@/utils/enums/balances.enum';
import {
    BankAccountStatusEnum,
    BankAccountTypesEnum,
    ChannelsEnum,
    BankAccountNatureEnum,
    TransferTypeEnum,
    UserTypeEnum,
} from '@/utils/enums/accountDetails.enums';
import {PayoutExportFormatsEnum} from '@/utils/enums/payoutExportFormats';
import {LoggerStatusEnum} from '@/utils/enums/loggerStatus';
import {TicketStatusEnum} from '@/utils/enums/ticketSummary.enum';

export const payinStatusOptions: IOptionItem[] = OptionsFromArray(TransactionStatusEnum);
export const payoutStatusOptions: IOptionItem[] = OptionsFromArray(PayoutTransactionStatusEnum);
export const loggerStatusOptions: IOptionItem[] = OptionsFromArray(LoggerStatusEnum);
export const payoutExportFormatOptions: IOptionItem[] = OptionsFromArray(PayoutExportFormatsEnum);

export const booleanOptions: IOptionItem[] = [
    {id: true, value: 'True'},
    {id: false, value: 'False'},
];
export const bankTypesOptions: IOptionItem[] = [
    {id: BankTypesEnum.default, value: 'Default'},
    {id: BankTypesEnum.recopays, value: 'Recopays'},
    {id: BankTypesEnum.payWing, value: 'PayWing'},
    {id: BankTypesEnum.pay365, value: 'Pay365'},
    {id: BankTypesEnum.pay365New, value: 'pay365 New'},
    {id: BankTypesEnum.tappay, value: 'Tappay'},
    {id: BankTypesEnum.nexapayUpiCollect, value: 'Pioneer UPI Collect'},
    {id: BankTypesEnum.firstPe, value: '1StPe'},
    {id: BankTypesEnum.airpay, value: 'Airpay'},
    {id: BankTypesEnum.starpaisa, value: 'Starpaisa'},
    {id: BankTypesEnum.finopay, value: BalanceAccountTypesName.Finopay},
    {id: BankTypesEnum.finopayStaticQR, value: BalanceAccountTypesName.FinopayStaticQR},
    {id: BankTypesEnum.autoPayIn, value: 'Auto Payin'},
    {id: BankTypesEnum.OFCPAY, value: BalanceAccountTypesName.OFCPAY},
    {id: BankTypesEnum.theUnionPay, value: BalanceAccountTypesName.theUnionPay},
    {id: BankTypesEnum.heksaPay, value: 'HEKSA Payment'},
    {id: BankTypesEnum.letspe, value: 'Letspe'},
    {id: BankTypesEnum.payTMe, value: 'PayTMe'},
];
export const getawayOptions: IOptionItem[] = [
    {id: BankTypesEnum.default, value: 'Default'},
    {id: BankTypesEnum.recopays, value: 'Recopays'},
    {id: BankTypesEnum.payWing, value: 'PayWing'},
    {id: BankTypesEnum.firstPe, value: '1stPe'},
    {id: BankTypesEnum.autoPayIn, value: 'Auto Payin'},
    {id: BankTypesEnum.pay365New, value: BalanceAccountTypesName.Pay365New},
    {id: BankTypesEnum.starpaisa, value: BalanceAccountTypesName.Starpaisa},
    {id: BankTypesEnum.OFCPAY, value: BalanceAccountTypesName.OFCPAY},
    {id: BankTypesEnum.theUnionPay, value: BalanceAccountTypesName.theUnionPay},
    {id: BankTypesEnum.heksaPay, value: BalanceAccountTypesName.HeksaPay},
    {id: BankTypesEnum.letspe, value: BalanceAccountTypesName.LETSPE},
    {id: BankTypesEnum.payTMe, value: BalanceAccountTypesName.PayTMe},
];
export const balanceAccountTypesOptions: IOptionItem[] = [
    {id: BalanceAccountTypesEnum.default, value: 'Default'},
    {id: BalanceAccountTypesEnum.recopays, value: 'Recopays'},
    {id: BalanceAccountTypesEnum.payWing, value: 'PayWing'},
    {id: BalanceAccountTypesEnum.pay365, value: 'Pay365'},
    {id: BalanceAccountTypesEnum.tappay, value: 'Tappay'},
    {id: BalanceAccountTypesEnum.heksaPay, value: 'HEKSA Payment'},
    {id: BalanceAccountTypesEnum.letspe, value: 'Letspe'},
    {id: BalanceAccountTypesEnum.payTMe, value: 'PayTMe'},
];
export const gatewayTypesOptions: IOptionItem[] = [
    {id: BalanceAccountTypesEnum.payWing, value: 'PayWing'},
    {id: BalanceAccountTypesEnum.recopays, value: 'Recopays'},
    {id: BalanceAccountTypesEnum.pay365, value: 'Pay365'},
    {id: BalanceAccountTypesEnum.tappay, value: 'Tappay'},
    {id: BalanceAccountTypesEnum.firstPe, value: 'FirstPe'},
    {id: BalanceAccountTypesEnum.starpaisa, value: BalanceTypeEnum.Starpaisa},
    {id: BalanceAccountTypesEnum.OFCPAY, value: BalanceTypeEnum.OFCPAY},
    {id: BalanceAccountTypesEnum.theUnionPay, value: BalanceTypeEnum.theUnionPay},
    {id: BalanceAccountTypesEnum.heksaPay, value: 'HEKSA Payment'},
    {id: BalanceAccountTypesEnum.letspe, value: 'Letspe'},
    {id: BalanceAccountTypesEnum.payTMe, value: 'PayTMe'},
];
export const PaymentActionOptions: IOptionItem[] = [
    {id: 'payin', value: 'payin'},
    {id: 'payout', value: 'payout'},
];
export const BankAccountTypesOptions: IOptionItem[] = [
    {id: BankAccountTypesEnum.payin, value: 'payin'},
    {id: BankAccountTypesEnum.payout, value: 'payout'},
];
export const bankAccountStatusOptions: IOptionItem[] = [
    {
        id: BankAccountStatusEnum.readyToLive,
        value: 'Ready to live',
        background: '#fff',
        color: '#000',
    },
    // {id: BankAccountStatusEnum.hold, value: 'Hold', background: '#ffffaa7d', color: '#000'},
    {id: BankAccountStatusEnum.live, value: 'Live', background: '#deffd3d9', color: '#000'},
    {id: BankAccountStatusEnum.other, value: 'Other', background: '#c2deffd9', color: '#000'},
    {id: BankAccountStatusEnum.stop, value: 'Stop', background: '#ffc5c5', color: '#000'},
    {id: BankAccountStatusEnum.freeze, value: 'Freeze', background: '#f9a293', color: '#000'},
    {
        id: BankAccountStatusEnum.permanentStop,
        value: 'Permanent Stop',
        background: '#f9a293',
        color: '#000',
    },
];
export const bankStatusOptionsExceptRTL: IOptionItem[] = [
    // {id: BankAccountStatusEnum.hold, value: 'Hold', background: '#ffffaa7d', color: '#000'},
    {id: BankAccountStatusEnum.live, value: 'Live', background: '#deffd3d9', color: '#000'},
    {id: BankAccountStatusEnum.other, value: 'Other', background: '#c2deffd9', color: '#000'},
    {id: BankAccountStatusEnum.stop, value: 'Stop', background: '#ffc5c5', color: '#000'},
    {id: BankAccountStatusEnum.freeze, value: 'Freeze', background: '#f9a293', color: '#000'},
];
export const bankStatusOptionsHLO: IOptionItem[] = [
    // {id: BankAccountStatusEnum.hold, value: 'Hold', background: '#ffffaa7d', color: '#000'},
    {id: BankAccountStatusEnum.live, value: 'Live', background: '#deffd3d9', color: '#000'},
    {id: BankAccountStatusEnum.other, value: 'Other', background: '#c2deffd9', color: '#000'},
];
export const bankAccountStatusOptionsForProcessing: IOptionItem[] = [
    {
        id: BankAccountStatusEnum.readyToLive,
        value: 'Ready to live',
        background: '#fff',
        color: '#000',
    },
    {
        id: BankAccountStatusEnum.processing,
        value: 'Processing',
        background: '#f7d8f7',
        color: '#000',
    },
];
export const bankAccountStatusOptionsFilter: IOptionItem[] = [
    {
        id: BankAccountStatusEnum.readyToLive,
        value: 'Ready to live',
        background: '#fff',
        color: '#000',
    },
    {id: BankAccountStatusEnum.hold, value: 'Hold', background: '#ffffaa7d', color: '#000'},
    {id: BankAccountStatusEnum.live, value: 'Live', background: '#deffd3d9', color: '#000'},
    {id: BankAccountStatusEnum.other, value: 'Other', background: '#c2deffd9', color: '#000'},
    {id: BankAccountStatusEnum.stop, value: 'Stop', background: '#ffc5c5', color: '#000'},
    {id: BankAccountStatusEnum.freeze, value: 'Freeze', background: '#f9a293', color: '#000'},
    {
        id: BankAccountStatusEnum.permanentStop,
        value: 'Permanent Stop',
        background: '#f9a293',
        color: '#000',
    },
    {
        id: BankAccountStatusEnum.processing,
        value: 'Processing',
        background: '#f7d8f7',
        color: '#000',
    },
];

export const TransferType: IOptionItem[] = [
    {id: TransferTypeEnum.ChargeBack, value: 'ChargeBack'},
    {id: TransferTypeEnum.InternalTransfer, value: 'InternalTransfer'},
];

export const UserType: IOptionItem[] = [
    {id: UserTypeEnum.sender, value: 'sender'},
    {id: UserTypeEnum.receiver, value: 'receiver'},
];

export const AccountDetailsChannels: IOptionItem[] = [
    {id: ChannelsEnum.payz365, value: 'Payz365'},
    {id: ChannelsEnum.paymentCircle, value: 'PaymentCircle'},
    {id: ChannelsEnum.zealApp, value: 'ZealApp'},
];
export const AccountDetailsCardChannels: IOptionItem[] = [
    {id: ChannelsEnum.payz365, value: 'Payz365'},
    {id: ChannelsEnum.paymentCircle, value: 'PayFast'},
    {id: ChannelsEnum.zealApp, value: 'Zeal'},
];

export const AccountNature: IOptionItem[] = [
    {id: BankAccountNatureEnum.saving, value: 'Saving'},
    {id: BankAccountNatureEnum.current, value: 'Current'},
];
export const ticketStatusOptions: IOptionItem[] = [
    {id: TicketStatusEnum.initiated, value: 'Initiated'},
    {id: TicketStatusEnum.approved, value: 'Approved'},
    {id: TicketStatusEnum.rejected, value: 'Rejected'},
];

export const balanceHistoryTypesOptions: IOptionItem[] = OptionsFromArray(BalanceTypeEnum);
