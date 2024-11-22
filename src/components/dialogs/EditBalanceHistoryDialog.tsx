import * as React from 'react';
import {FormEvent, useEffect, useState} from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {DialogActions} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import {IBalanceHistory} from '@/utils/interfaces/balance.interface';
import {getBalanceHistoryById, updateBalanceHistory} from '@/utils/services/balance';
import FilterInput from '@/components/filter/main/filterInput';

export interface Props {
    open: boolean;
    id?: string;
    onClose: (balanceHistory?: IBalanceHistory) => void;
}

export function EditBalanceHistoryDialog(props: Props) {
    const {onClose, id, open} = props;
    const [balanceHistory, setBalanceHistory] = useState<IBalanceHistory>();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data: Partial<IBalanceHistory> = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        const res = await updateBalanceHistory(id ?? '', data);
        // @ts-ignore
        if (!res?.message) onClose({_id: id, ...data});
        setLoading(false);
    };


    useEffect(() => {
        if (id) {
            setBalanceHistory(undefined);
            setLoading(true);
            getBalanceHistoryById(id)
                .then(res => setBalanceHistory(res))
                .finally(() => setLoading(false));
        }
    }, [id]);


    return (
        <Dialog open={open}>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Update Balance History Id {id}</DialogTitle>
                {
                    balanceHistory && <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <FilterInput
                            title="Amount"
                            type="number"
                            name="amount"
                            width="90%"
                            defaultValue={balanceHistory?.amount?.toString()}
                            required
                        />
                        <FilterInput
                            title="Remarks"
                            name="remarks"
                            width="90%"
                            defaultValue={balanceHistory?.remarks}
                        />
                    </Box>
                }

                <DialogActions sx={{pb: 2, px: 2}}>
                    <LoadingButton
                        loading={loading}
                        type="submit"
                        variant="contained"
                        sx={{px: 5, mt: 2, textTransform: 'capitalize'}}
                        color="primary">
                        Update
                    </LoadingButton>
                    <LoadingButton
                        loading={loading}
                        onClick={() => onClose()}
                        variant="contained"
                        sx={{px: 3, mt: 2, textTransform: 'capitalize'}}
                        color="success">
                        Back
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
}
