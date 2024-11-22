import * as React from 'react';
import {FormEvent, useEffect, useState} from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {ITransaction} from '@/utils/interfaces/transaction.interface';
import {getTransaction2, updateTransaction2} from '@/utils/services/transactions';
import {DialogActions} from '@mui/material';
import FilterSelect from '@/components/filter/main/filterSelect';
import {booleanOptions} from '@/components/filter/options';
import {OptionsFromArray} from '@/utils/functions/global';
import {TransactionStatusEnum} from '@/utils/enums/transactionStatus';
import LoadingButton from '@mui/lab/LoadingButton';
import {IUpdateTransactionDto} from '@/utils/dto/transactions.dto';
import Box from '@mui/material/Box';


export interface Props {
    open: boolean;
    id?: string;
    onClose: (transaction?: ITransaction) => void;
}

export function EditTransactionDialog(props: Props) {
    const {onClose, id, open} = props;
    const [transaction, setTransaction] = useState<ITransaction>();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data: IUpdateTransactionDto = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        const res = await updateTransaction2(id || '', {
            status: data?.status,
            is_claimed: data?.is_claimed,
            key: 'lcBT6o9t$JFSE4!7Ou60*q4G',
        });
        if (res) onClose(res);
        setLoading(false);
    };


    useEffect(() => {
        if (id) {
            setTransaction(undefined);
            setLoading(true);
            getTransaction2(id)
                .then(res => setTransaction(res))
                .finally(() => setLoading(false));
        }
    }, [id]);


    return (
        <Dialog open={open}>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Update Transaction {id}</DialogTitle>
                {
                    transaction && <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <FilterSelect
                            width="90%"
                            title="status"
                            hideAllOption
                            defaultValue={transaction?.status}
                            options={OptionsFromArray(TransactionStatusEnum)}
                            name="status" />

                        <FilterSelect
                            width="90%"
                            title="is_claimed"
                            hideAllOption
                            defaultValue={transaction?.is_claimed}
                            options={booleanOptions}
                            name="is_claimed" />
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
                        Back Without update
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
}
