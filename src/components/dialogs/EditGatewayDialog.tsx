import * as React from 'react';
import {FormEvent, useEffect, useState} from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {DialogActions} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import {IFilterPayoutTransaction, IPayoutTransaction} from '@/utils/dto/transactions.dto';
import awesomeAlert from '@/utils/functions/alert';
import FilterSelect, {IOptionItem} from '@/components/filter/main/filterSelect';
import {sendPayoutTransactionToGateway} from '@/utils/services/payoutTransactions';
import {RoleEnum} from '@/utils/enums/role';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {AlertTypeEnum} from '@/utils/enums/alertType';
import {BATCH_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import {getGatewayAccounts} from '@/utils/services/gatewayAccount';
import {IGatewayAccount} from '@/utils/interfaces/gatewayAccount.interface';


export interface Props {
    open: boolean;
    ids?: string[];
    onClose: () => void;
    fetchTransactions: (f?: IFilterPayoutTransaction) => Promise<void>;
}

export function EditGatewayDialog(props: Props) {
    const user = useSelector((state: RootState) => state.auth.user);
    const roles = user?.roles as RoleEnum[];
    const userId = user?._id as string;
    const router = useRouter();
    const {onClose, ids, open, fetchTransactions} = props;
    const [transaction, setTransaction] = useState<IPayoutTransaction>();
    const [loading, setLoading] = useState(false);
    const [gatewayOptionsLoading, setGatewayOptionsLoading] = useState(false);
    const [gatewayOptions, setGatewayOptions] = useState<IOptionItem[]>([]);

    const fetchGateway = async (): Promise<IGatewayAccount[] | undefined> => {
        setGatewayOptionsLoading(true);
        const res = await getGatewayAccounts({page: 0, limit: 10000, filter: {}});
        setGatewayOptionsLoading(false);
        return res?.transactions;
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
        if (ids) {
            const payload: Partial<IPayoutTransaction> = {};
            if (data.gatewayId) payload.gatewayId = data.gatewayId;

            await sendPayoutTransactionToGateway({
                ids: ids,
                ...payload,
            }).then(async res => {
                if (res) {
                    const {result, errors} = res;

                    const errorMsg: string =
                        errors?.length ?
                            `${errors.length} Transactions Failed` : '';
                    const {data, gateway, status} = result;
                    if (data?.modifiedCount) {
                        awesomeAlert({
                            msg: `Gateway: ${gateway}, ${data?.modifiedCount} Transaction Updated Successfully. ${errorMsg}`,
                            type: AlertTypeEnum.success,
                        });
                        router.push(BATCH_ROUTE);
                    }
                    if (errors.length) {
                        awesomeAlert({
                            msg: <>{errorMsg}</>,
                            type: AlertTypeEnum.error,
                        });
                        errors.map(err => {
                            awesomeAlert({
                                msg: <> Updated Failed <br /><strong>{err._id}</strong>:<br /><span
                                    style={{color: 'red'}}>{err.message} </span></>,
                                type: AlertTypeEnum.error,
                            });
                        });
                    }
                    await fetchTransactions();
                    onClose();
                }
            }).catch(err => {
                console.log(err);
            }).finally(async () => {
                setLoading(false);
            });


        }
    };
    useEffect(() => {
        if (ids) {
            setTransaction({} as IPayoutTransaction);
            setLoading(false);
        }
    }, [ids]);
    useEffect(() => {
        if (roles?.includes(RoleEnum.GatewayAccounts)) {
            fetchGateway().then(res => {
                if (res) {
                    const options = res.map(a => ({
                        id: a._id,
                        value: a.name,
                    }));
                    setGatewayOptions(options);
                }
            });
        }
    }, []);


    return (
        <Dialog open={open}>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Update {`${ids?.length} Transactions`}</DialogTitle>
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
                            <FilterSelect
                                width="100%"
                                required
                                hideAllOption
                                title="Gateway"
                                name="gatewayId"
                                options={gatewayOptions}
                                loading={gatewayOptionsLoading} />
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