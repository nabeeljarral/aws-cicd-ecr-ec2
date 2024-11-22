export type IAlign = 'left' | 'center' | 'right'

export interface IColumn {
    id: string;
    label: string;
    minWidth?: number;
    passRow?: boolean;
    align?: IAlign;
    format?: (value: any) => any;
}