import * as React from 'react';
import {FormEvent, useEffect, useState} from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {DialogActions, FormControlLabel, FormLabel, Radio, RadioGroup} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import {IPayoutTransaction} from '@/utils/dto/transactions.dto';
import awesomeAlert from '@/utils/functions/alert';
import FilterSelect, {IOptionItem} from '@/components/filter/main/filterSelect';
import {payoutStatusOptions} from '@/components/filter/options';
import {
    bulkUpdatePayoutTransactionByIds,
    getPayoutTransactionById,
    updatePayoutTransactionById,
} from '@/utils/services/payoutTransactions';
import {RoleEnum} from '@/utils/enums/role';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {IVendor} from '@/utils/interfaces/vendor.interface';
import {getVendors} from '@/utils/services/vendors';
import {PayoutTransactionStatusEnum} from '@/utils/enums/transactionStatus';
import {AlertTypeEnum} from '@/utils/enums/alertType';
import {BATCH_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import FilterInput from '@/components/filter/main/filterInput';


export interface Props {
    open: boolean;
    id?: string | string[];
    onClose: (transaction?: IPayoutTransaction | Partial<IPayoutTransaction>[]) => void;
}

export function EditPayoutTransactionDialog(props: Props) {
    const user = useSelector((state: RootState) => state.auth.user);
    const roles = user?.roles;
    const router = useRouter();
    const {onClose, id, open} = props;
    const [selectedUpdate, setSelectedUpdate] = useState<string>('vendorId');
    const [transaction, setTransaction] = useState<IPayoutTransaction>();
    const [loading, setLoading] = useState(false);
    const [vendorOptionsLoading, setVendorOptionsLoading] = useState(false);
    const [vendorOptions, setVendorOptions] = useState<IOptionItem[]>([]);

    const fetchVendors = async (): Promise<IVendor[] | undefined> => {
        setVendorOptionsLoading(true);
        const res = await getVendors();
        setVendorOptionsLoading(false);
        return res;
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data: Partial<IPayoutTransaction> = {};
        formData.forEach((value, key) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (value) data[key] = value;
        });
        if (id && typeof id === 'string') {
            const payload: Partial<IPayoutTransaction> = {};
            if (data.vendorId) payload.vendorId = data.vendorId;
            if (data.vendor_bank) payload.vendor_bank = data.vendor_bank;
            if (data.status) payload.status = data.status;
            if (data.utr) payload.utr = data.utr;

            updatePayoutTransactionById(id, payload).then(res => {
                // @ts-ignore
                const msg: string | undefined = res?.message;
                if (res?._id) {
                    awesomeAlert({msg: 'Transaction updated successfully'});
                    props.onClose(res);
                }
                return res;
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                setLoading(false);
            });
        }
        if (id && typeof id !== 'string') {
            const payload: Partial<IPayoutTransaction> = {};
            if (data.vendorId) payload.vendorId = data.vendorId;
            if (data.vendor_bank) payload.vendor_bank = data.vendor_bank;
            if (data.status) payload.status = data.status;
            bulkUpdatePayoutTransactionByIds({
                ids: id,
                ...payload,
            }).then(res => {
                if (res) {
                    const {result, errors} = res;
                    const errorMsg: string =
                        errors?.length ?
                            `${errors.length} Transactions Failed: ${errors.map(e => e.message).join(', ')}`  /*errors.map(e => e.message).join('\\n')*/
                            : '';
                    const {data, batch, status} = result;
                    if (data?.modifiedCount) {
                        awesomeAlert({
                            msg: `Batch: ${batch}, ${data?.modifiedCount} Transaction Updated Successfully. ${errorMsg}`,
                            type: AlertTypeEnum.success,
                        });
                        router.push(BATCH_ROUTE);
                    } else if (errors.length) {
                        awesomeAlert({
                            msg: `Updated Failed. ${errorMsg}`,
                            type: AlertTypeEnum.error,
                        });
                    }
                    onClose(
                        id.map((ID: string) => ({
                                _id: ID,
                                batch: batch,
                                status: status,
                            }),
                        ),
                    );
                }
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                setLoading(false);
            });
        }
    };
    const fetchTransaction =
        (id: string) => {
            setTransaction(undefined);
            setLoading(true);
            getPayoutTransactionById(id)
                .then(res => {
                    if (res) setTransaction(res);
                })
                .finally(() => setLoading(false));

        };

    useEffect(() => {
        if (id && typeof id === 'string') fetchTransaction(id);
        else if (id) {
            setTransaction({vendorId: '', status: PayoutTransactionStatusEnum.success} as IPayoutTransaction);
            setLoading(false);
        }
        if (roles?.includes(RoleEnum.EditPayoutTransactionsVendor)) {
            fetchVendors().then(res => {
                if (res) {
                    const options = res.map(a => ({
                        id: a._id,
                        value: a.name,
                    }));
                    setVendorOptions(options);
                }
            });
        }
    }, [id]);


    return (
        <Dialog open={open}>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Update {typeof id === 'string' ? `Transaction id ${id}` : `${id?.length} Transactionssss`}</DialogTitle>
                {
                    transaction &&
                    <Box sx={{maxWidth: '100%', width: '400px'}}>
                        <Box sx={{
                            display: 'flex',
                            width: '90%',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mx: 'auto',
                        }}>
                            {
                                !Array.isArray(id) &&
                                <Box sx={{mr: 'auto', ml: 1, mb: 2}}>
                                    <FormLabel id="select-radios-group">Select to update</FormLabel>
                                    <RadioGroup
                                        value={selectedUpdate}
                                        onChange={(e) => setSelectedUpdate(e.currentTarget?.value ?? '')}
                                        row
                                        aria-labelledby="select-radios-group"
                                        name="row-radio-buttons-group"
                                    >
                                        <FormControlLabel value="vendorId" control={<Radio />} label="Vendor" />
                                        <FormControlLabel value="status" control={<Radio />} label="Status" />
                                    </RadioGroup>
                                </Box>
                            }
                            {
                                roles?.includes(RoleEnum.EditPayoutTransactionsStatus) &&
                                selectedUpdate === 'status' && !Array.isArray(id) &&
                                <FilterSelect
                                    title="Status"
                                    width="100%"
                                    required
                                    hideAllOption
                                    defaultValue={transaction?.status}
                                    options={payoutStatusOptions}
                                    name="status" />
                            }
                            {
                                roles?.includes(RoleEnum.EditPayoutTransactionsStatus) &&
                                (selectedUpdate === 'vendorId' || Array.isArray(id)) && <>
                                    <FilterSelect
                                        width="100%"
                                        required
                                        title="Vendor"
                                        name="vendorId"
                                        options={vendorOptions}
                                        loading={vendorOptionsLoading} />
                                    <FilterInput
                                        width="100%"
                                        title="Vendor Bank"
                                        name="vendor_bank" />
                                </>
                            }
                            {/*{*/}
                            {/*    roles?.includes(RoleEnum.EditPayoutTransactionsUtr) &&*/}
                            {/*    selectedUpdate === 'status' &&*/}
                            {/*    typeof id === 'string' &&*/}
                            {/*    <FilterInput*/}
                            {/*        width='100%'*/}
                            {/*        name='utr'*/}
                            {/*        title="UTR"*/}
                            {/*        defaultValue={transaction?.utr || ''*/}
                            {/*        }*/}
                            {/*    />*/}
                            {/*}*/}
                        </Box>
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