import moment from 'moment';
import {IOptionItem} from '@/components/filter/main/filterSelect';
import 'moment-timezone';
import {KeyboardEventHandler} from 'react';
import {BankTypesEnum} from '@/utils/enums/bankTypes.enum';

// DateFormatter
export const DateFormatter = (value: Date) => moment(value).tz('Asia/Kolkata').format('lll');

//OptionsFromArray
type IOptionFromEnum = (value: any) => IOptionItem[];
export const OptionsFromArray: IOptionFromEnum = (value: any[]) =>
    Object.values(value).map((s) => ({value: s, id: s}));

//PriceFormatter
export const PriceFormatter: (value: string | number) => string = (value) =>
    (+value).toLocaleString('en-US');

export const asset = (url: string) => {
    return '/' + url;
};

export const isMobile: boolean = typeof window !== 'undefined' ? window.innerWidth < 600 : false;
export const isTablet: boolean = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
export const AcceptNumber: KeyboardEventHandler<HTMLDivElement> = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);

    if (!/^\d+$/.test(keyValue)) {
        event.preventDefault();
    }
};

export const addEllipsis = (inputString: string | undefined, maxLength: number = 15) => {
    return !inputString || (inputString && inputString?.length <= maxLength)
        ? inputString
        : inputString.substring(0, maxLength - 3) + '...';
};
export const isUpiCollectFn = (bank_type: BankTypesEnum) =>
    bank_type === BankTypesEnum.nexapayUpiCollect;
