import * as React from 'react';
import {ChangeEvent, useState} from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {Button, DialogActions, FormControlLabel, Switch, TextField} from '@mui/material';
import {ArrowBackRounded, Lock} from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {IUpdateBankTransaction} from '@/utils/services/bankTransactions';
import RelatedToInput from '@/components/inputs/relatedToInput';
import FilterSelect from '@/components/filter/main/filterSelect';

export interface Props {
    open: boolean;
    transactionId: string;
    onClose: (payload: IUpdateBankTransaction) => void;
}

export function ClaimTransactionDialog(props: Props) {
    const {onClose, transactionId, open} = props;
    const [crete_dummy_transaction, setCrete_dummy_transaction] = useState(false);
    const [category, setCategory] = useState('P1');
    const [relatedTo, setRelatedTo] = useState('');
    const [orderId, setOrderId] = useState('');
    const [related_transaction_id, setRelated_transaction_id] = useState('');
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRelated_transaction_id(event.target.value);
    };
    const handleChange2 = (event: ChangeEvent<HTMLInputElement>) => {
        setCrete_dummy_transaction(event.target.checked);
    };

    return (
        <Dialog open={open}>
            <DialogTitle>
                Block Transaction <br />
                <Typography sx={{color: '#5b5a5a', fontSize: '12px'}}>
                    Id: {transactionId}
                </Typography>
            </DialogTitle>
            <Box sx={{mt: 2, mx: 2, minWidth: '400px'}}>
                <FormControlLabel
                    control={<Switch checked={crete_dummy_transaction} onChange={handleChange2} />}
                    label="Create Dummy transaction from it"
                />
            </Box>
            {crete_dummy_transaction && (
                <Box sx={{px: 2, pt: 2, pb: 3}}>
                    <RelatedToInput handleChange={(val) => setRelatedTo(val)} hideAllOption />
                    <Box sx={{ml: -1, pr: 1, mt: 2}}>
                        <FilterSelect
                            width="100%"
                            hideAllOption={true}
                            name="category"
                            handleChange={(val) => setCategory(val)}
                            title="Category"
                            defaultValue={'P1'}
                            options={['P1', 'P2', 'P3', 'P4', 'P5', 'TD', 'FTD'].map((s) => ({
                                value: s,
                                id: s,
                            }))}
                        />
                    </Box>
                    <Box sx={{ml: -1, pr: 1, mt: 1}}>
                        <TextField
                            required={true}
                            sx={{m: 1, width: '100%'}}
                            label="Order ID"
                            name="orderId"
                            size="small"
                            variant="outlined"
                            onChange={(e) => setOrderId(e.target.value)}
                        />
                    </Box>
                </Box>
            )}
            {!crete_dummy_transaction && transactionId && (
                <Box sx={{mt: 2, mx: 2, mb: 2, minWidth: '400px'}}>
                    <TextField
                        fullWidth
                        helperText="Transaction ID is 24 digit size"
                        label="Transaction Id"
                        value={related_transaction_id}
                        onChange={handleChange}
                    />
                </Box>
            )}

            <DialogActions sx={{pb: 2, px: 2}}>
                <Button
                    onClick={() => {
                        onClose({
                            related_transaction_id: '',
                            crete_dummy_transaction: false,
                            id: transactionId,
                        });
                        setRelated_transaction_id('');
                        setRelatedTo('');
                        setCategory('P1');
                        setOrderId('');
                    }}
                    variant="contained"
                    sx={{pr: 4, mt: 2, textTransform: 'capitalize'}}
                    color="success"
                >
                    <ArrowBackRounded sx={{mr: 1}} />
                    Back
                </Button>
                <Button
                    onClick={() => {
                        onClose({
                            related_transaction_id,
                            crete_dummy_transaction,
                            relatedTo,
                            category,
                            orderId,
                            id: transactionId,
                        });
                        setRelated_transaction_id('');
                        setRelatedTo('');
                        setCategory('P1');
                        setOrderId('');
                    }}
                    variant="contained"
                    disabled={
                        !(
                            related_transaction_id.length === 24 ||
                            (crete_dummy_transaction && relatedTo && orderId)
                        )
                    }
                    sx={{pr: 4, mt: 2, mr: 'auto', textTransform: 'capitalize'}}
                    color="warning"
                >
                    <Lock fontSize="small" sx={{mr: 1}} />
                    Block
                </Button>
            </DialogActions>
        </Dialog>
    );
}
