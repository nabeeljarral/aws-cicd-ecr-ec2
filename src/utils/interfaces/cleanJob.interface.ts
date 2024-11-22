
export interface ICleanJob {
    queue?: string;
    statuses?: string;
    results?: any;
}

export type ICleanJobUpdate = {
    queue?: string;
    statuses?: string[];
};