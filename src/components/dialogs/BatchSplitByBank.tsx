import * as React from 'react';
import {FormEvent, useEffect, useState} from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {DialogActions} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import FilterSelect, {IOptionItem} from '@/components/filter/main/filterSelect';
import {RoleEnum} from '@/utils/enums/role';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {useRouter} from 'next/router';
import {getBankNamesInBatch, getSplitByBank} from '@/utils/services/batch';
import { BankRecord } from '@/utils/interfaces/batch.interface';

export interface Props {
    open: boolean;
    ids?: string;
    onClose: () => void;
    fetchBatchTableData?: any;
    setRowData?:any;
}

export function BatchSplitByBankDialog(props: Props) {
    const user = useSelector((state: RootState) => state.auth.user);
    const roles = user?.roles as RoleEnum[];
    const userId = user?._id as string;
    const router = useRouter();
    const {onClose, ids, open, fetchBatchTableData,setRowData} = props;
    const [responseData, setResponseData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [bankCodeOptionsLoading, setBankCodeOptionsLoading] = useState(false);
    const [bankCodeOptions, setBankCodeOptions] = useState<IOptionItem[]>([]);

    const fetchBankCodes = async (): Promise<any | undefined> => {
        setBankCodeOptionsLoading(true);
        const res = await getBankNamesInBatch(ids ? ids : '');
        setBankCodeOptionsLoading(false);
        setResponseData(res);
        return res;
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data: Partial<any> = {};

        formData.forEach((value, key) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (value) data[key] = value;
        });
        const processingData = responseData?.filter((n: any) => {
            return n?.bankCode === data?.BankCodeNames;
        });

        const payloadData = {
            transactionIds: processingData[0]?.ids,
            bankCode: processingData[0]?.bankCode,
        };
        const res = await getSplitByBank(payloadData, ids ? ids : '');
        if (res?.success) {
            await fetchBatchTableData();
            setRowData()
            onClose();
        }
        setLoading(false);
    };

    useEffect(() => {
        if (ids) {
            fetchBankCodes().then((res) => {
                if (res) {
                    const options = res?.map((a: BankRecord) => ({
                        id: a.bankCode,
                        value: a.bankCode,
                    }));
                    setBankCodeOptions(options);
                }
            });
        }
    }, [ids]);

    return (
        <Dialog open={open}>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Update Split By Bank</DialogTitle>

                <Box sx={{maxWidth: '100%', width: '400px'}}>
                    <Box
                        sx={{
                            display: 'flex',
                            width: '90%',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mx: 'auto',
                        }}
                    >
                        <FilterSelect
                            width="100%"
                            required
                            hideAllOption
                            title="Bank Names"
                            name="BankCodeNames"
                            options={bankCodeOptions}
                            loading={bankCodeOptionsLoading}
                        />
                    </Box>
                </Box>

                <DialogActions sx={{pb: 2, px: 2}}>
                    <LoadingButton
                        loading={loading}
                        type="submit"
                        variant="contained"
                        sx={{px: 5, mt: 2, textTransform: 'capitalize'}}
                        color="primary"
                    >
                        Update
                    </LoadingButton>
                    <LoadingButton
                        loading={loading}
                        onClick={() => onClose()}
                        variant="contained"
                        sx={{px: 3, mt: 2, textTransform: 'capitalize'}}
                        color="success"
                    >
                        Back
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
}
