import {RoleEnum} from '@/utils/enums/role';

export enum CheckingEnum {
    ManualCheck = 'Manual Check',
    RelatedTransaction = 'Related Transaction',
}

export enum CheckingRoleEnum {
    'Manual Check' = RoleEnum.ManualCheck,
    'Related Transaction' = RoleEnum.RelatedTransaction,
}