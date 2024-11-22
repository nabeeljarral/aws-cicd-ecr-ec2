import axiosInstance from '@/utils/axios';
import {
    BANK_ACCOUNT,
    BANK_ACCOUNTS,
    FIND_BANK_ACCOUNTS,
    FIND_BANK_NAMES,
    PAYMENT_CIRCLE,
    ZEAL_APP,
    BANK_ACCOUNTS_CREATE,
    BANK_ACCOUNT_UPSERT,
} from '@/utils/endpoints/endpoints';
import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import {
    BankAccountStatusEnum,
    BankAccountTypesEnum,
    ChannelsEnum,
} from '../enums/accountDetails.enums';

export const getBankAccounts = async (filter: {
    relatedTo?: string;
}): Promise<IBankAccount[] | undefined> => {
    try {
        const res = await axiosInstance.post(FIND_BANK_ACCOUNTS, filter);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const getBankAccountName = async (): Promise<IBankAccount[] | undefined> => {
    try {
        const res = await axiosInstance.get(FIND_BANK_NAMES);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const getBankAccount = async (payload: {id: string}): Promise<IBankAccount | undefined> => {
    try {
        const res = await axiosInstance.get(BANK_ACCOUNT(payload.id));
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const updateBankAccountAPI = async (id: string, payload: IBankAccount): Promise<IBankAccount | undefined> => {
    try {
        if (payload.global) delete payload.relatedTo;

        const res = await axiosInstance.put(BANK_ACCOUNT(id), payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const createBankAccountAPI = async (payload: IBankAccount): Promise<IBankAccount | undefined> => {
    try {
        const res = await axiosInstance.post(BANK_ACCOUNTS, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const updateBankAccount = async (
    id: string,
    payload: IBankAccount,
): Promise<IBankAccount | undefined> => {
    try {
        const deleteSensitiveKeys = (payload: IBankAccount): IBankAccount => {
            const keysToDelete: Array<keyof IBankAccount> = [
                'loginId',
                'username',
                'password',
                'trxnPassword',
                'otpAccess',
                'registeredPhoneNo',
                'securityQuestion',
                'securityAnswer',
                'websiteUrl',
            ];
            const updatedPayload = {...payload};
            keysToDelete.forEach((key) => {
                delete updatedPayload[key];
            });
            return updatedPayload;
        };
        delete payload.daily_income;
        if(payload.accountType === BankAccountTypesEnum.payout){
            const res = await axiosInstance.put(BANK_ACCOUNT(id), payload);
            return res?.data;
        }
        if (payload.accountType === BankAccountTypesEnum.payin) {
            delete payload.closing_balance;
        }
        const basePayload = {...payload, is_active: false, is_live: false};
        const activePayload = {
            ...payload,
            is_active: payload.status === BankAccountStatusEnum.live ? true : false,
            is_live: payload.status === BankAccountStatusEnum.live ? true : false,
        };
        if (
            payload?.prevChannel === payload.channel &&
            payload.status !== BankAccountStatusEnum.live
        ) {
            if (payload.global || payload.channel !== ChannelsEnum.payz365)
                delete payload.relatedTo;
            if (payload.channel === ChannelsEnum.payz365) {
                const res = await axiosInstance.put(BANK_ACCOUNT(id), activePayload);
                await axiosInstance.post(BANK_ACCOUNTS_CREATE, deleteSensitiveKeys(basePayload), {
                    baseURL: PAYMENT_CIRCLE,
                });
                await axiosInstance.post(BANK_ACCOUNTS_CREATE, deleteSensitiveKeys(basePayload), {
                    baseURL: ZEAL_APP,
                });
                return res?.data;
            } else if (payload.channel === ChannelsEnum.paymentCircle) {
                const res = await axiosInstance.put(BANK_ACCOUNT(id), basePayload);
                await axiosInstance.post(BANK_ACCOUNTS_CREATE, deleteSensitiveKeys(activePayload), {
                    baseURL: PAYMENT_CIRCLE,
                });
                await axiosInstance.post(BANK_ACCOUNTS_CREATE, deleteSensitiveKeys(basePayload), {
                    baseURL: ZEAL_APP,
                });
                return res?.data;
            } else if (payload.channel === ChannelsEnum.zealApp) {
                const res = await axiosInstance.put(BANK_ACCOUNT(id), basePayload);
                await axiosInstance.post(BANK_ACCOUNTS_CREATE, deleteSensitiveKeys(basePayload), {
                    baseURL: PAYMENT_CIRCLE,
                });
                await axiosInstance.post(BANK_ACCOUNTS_CREATE, deleteSensitiveKeys(activePayload), {
                    baseURL: ZEAL_APP,
                });
                return res?.data;
            }
        } else if (
            payload?.prevChannel === payload.channel ||
            payload.status == BankAccountStatusEnum.live
        ) {
            if (payload.global || payload.channel !== ChannelsEnum.payz365)
                delete payload.relatedTo;
            // const res = await axiosInstance.put(BANK_ACCOUNT(id), payload);

            if (payload.channel === ChannelsEnum.payz365) {
                await axiosInstance.put(BANK_ACCOUNT(id), activePayload);
                await axiosInstance.post(BANK_ACCOUNTS_CREATE, deleteSensitiveKeys(basePayload), {
                    baseURL: PAYMENT_CIRCLE,
                });
                await axiosInstance.post(BANK_ACCOUNTS_CREATE, deleteSensitiveKeys(basePayload), {
                    baseURL: ZEAL_APP,
                });
            } else if (payload.channel === ChannelsEnum.paymentCircle) {
                await axiosInstance.put(BANK_ACCOUNT(id), basePayload);
                await axiosInstance.post(BANK_ACCOUNTS_CREATE, deleteSensitiveKeys(activePayload), {
                    baseURL: PAYMENT_CIRCLE,
                });
                await axiosInstance.post(BANK_ACCOUNTS_CREATE, deleteSensitiveKeys(basePayload), {
                    baseURL: ZEAL_APP,
                });
            } else if (payload.channel === ChannelsEnum.zealApp) {
                await axiosInstance.put(BANK_ACCOUNT(id), basePayload);
                await axiosInstance.post(BANK_ACCOUNTS_CREATE, deleteSensitiveKeys(basePayload), {
                    baseURL: PAYMENT_CIRCLE,
                });
                await axiosInstance.post(BANK_ACCOUNTS_CREATE, deleteSensitiveKeys(activePayload), {
                    baseURL: ZEAL_APP,
                });
            }
        } else {
            if (payload.channel === ChannelsEnum.payz365) {
                await axiosInstance.put(BANK_ACCOUNT(id), activePayload);
                await axiosInstance.post(BANK_ACCOUNTS_CREATE, deleteSensitiveKeys(basePayload), {
                    baseURL: PAYMENT_CIRCLE,
                });
                await axiosInstance.post(BANK_ACCOUNTS_CREATE, deleteSensitiveKeys(basePayload), {
                    baseURL: ZEAL_APP,
                });
            } else if (payload.channel === ChannelsEnum.paymentCircle) {
                await axiosInstance.put(BANK_ACCOUNT(id), basePayload);
                await axiosInstance.post(BANK_ACCOUNTS_CREATE, deleteSensitiveKeys(activePayload), {
                    baseURL: PAYMENT_CIRCLE,
                });
                await axiosInstance.post(BANK_ACCOUNTS_CREATE, deleteSensitiveKeys(basePayload), {
                    baseURL: ZEAL_APP,
                });
            } else if (payload.channel === ChannelsEnum.zealApp) {
                await axiosInstance.put(BANK_ACCOUNT(id), basePayload);
                await axiosInstance.post(BANK_ACCOUNTS_CREATE, deleteSensitiveKeys(basePayload), {
                    baseURL: PAYMENT_CIRCLE,
                });
                await axiosInstance.post(BANK_ACCOUNTS_CREATE, deleteSensitiveKeys(activePayload), {
                    baseURL: ZEAL_APP,
                });
            }
        }
    } catch (error: any) {
        console.error(error);
    }
};
export const createBankAccount = async (
    payload: IBankAccount,
): Promise<IBankAccount | undefined> => {
    try {
        const deleteSensitiveKeys = (payload: IBankAccount): IBankAccount => {
            const keysToDelete: Array<keyof IBankAccount> = [
                'loginId',
                'username',
                'password',
                'trxnPassword',
                'otpAccess',
                'registeredPhoneNo',
                'securityQuestion',
                'securityAnswer',
                'websiteUrl',
            ];
            const updatedPayload = {...payload};
            keysToDelete.forEach((key) => {
                delete updatedPayload[key];
            });
            return updatedPayload;
        };

        const res = await axiosInstance.post(BANK_ACCOUNTS, payload);
        if (!res.data.message) {
            if (
                payload.channel === ChannelsEnum.paymentCircle &&
                payload.accountType === BankAccountTypesEnum.payin
            ) {
                await axiosInstance.post(BANK_ACCOUNTS_CREATE, deleteSensitiveKeys(payload), {
                    baseURL: PAYMENT_CIRCLE,
                });
            } else if (
                payload.channel === ChannelsEnum.zealApp &&
                payload.accountType === BankAccountTypesEnum.payin
            ) {
                await axiosInstance.post(BANK_ACCOUNTS_CREATE, deleteSensitiveKeys(payload), {
                    baseURL: ZEAL_APP,
                });
            }
        }
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};

export const bankAccountUpsertKeyValues = async (id: string, payload: any): Promise<any | undefined> => {
    try {
        if (payload.global) delete payload.relatedTo;

        const res = await axiosInstance.put(BANK_ACCOUNT_UPSERT(id), payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};