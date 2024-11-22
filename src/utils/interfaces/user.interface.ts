import {IRole} from '@/utils/interfaces/role.interface';

export interface IUser {
    _id: string;
    username: string;
    email: string;
    roles: IRole[];
    isActive?: boolean;
    testMode?: boolean;
    ips: string[];
    isCompany?: boolean;
    createdBy?:string;
    transactionId?:string;
}
