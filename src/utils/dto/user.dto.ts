import {RoleEnum} from '@/utils/enums/role';

export type IUserDto = {
    _id?: string;
    username?: string;
    email?: string;
    password?: string;
    isActive?: boolean;
    testMode?: boolean;
    socketId?: string;
    roles?: RoleEnum[];
    redirectUrl?: string;
    callbackUrl?: string;
    payoutCallbackUrl?: string;
    description?: string;
    ips: string[];
    hours_until_balance_activation?: number;
    payin_fees_percent?: number;
    settlement_fees_percent?: number;
    payout_fees_percent?: number;
    isCompany?: boolean;
};
