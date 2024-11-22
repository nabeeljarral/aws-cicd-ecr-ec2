import {IUser} from './user.interface';

export type IReportOutput =
    | {
          _id: string;
          status: number;
          message: string;
      }
    | undefined;

export type IReportFileInfo = {
    _id: string;
    url: string;
    filename?: string;
    extension?: string;
    // size?: number,
    error?: string;
    status?: string;
    logs?: string[];
    filter?: string;
    reportInProgress?: boolean;
    fetchedCount?: number;
    type: string;
    fileAttached: boolean;
    createdBy: any;
    createdAt: Date;
    updatedAt: Date;
    createdByList: IUser[];
    retryAttempt: number;
};
