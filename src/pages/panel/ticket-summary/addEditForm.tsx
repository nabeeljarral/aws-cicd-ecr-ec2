import {IOptionItem} from '@/components/filter/main/filterSelect';
import SearchSelect from '@/components/filter/main/searchSelect';
import {RootState} from '@/store';
import {BankAccountStatusEnum, BankAccountTypesEnum} from '@/utils/enums/accountDetails.enums';
import {BankTypesEnum} from '@/utils/enums/bankTypes.enum';
import awesomeAlert from '@/utils/functions/alert';
import {IBalanceHistory} from '@/utils/interfaces/balance.interface';
import {IBank} from '@/utils/interfaces/bankAccount.interface';
import {ITicketSummary} from '@/utils/interfaces/ticketSummary.interface';
import {getBankAccountName} from '@/utils/services/bankAccount';
import {createTicket} from '@/utils/services/ticketSummary';
import {Button, Grid, TextField} from '@mui/material';
import React, {FormEvent, forwardRef, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

const initialFormData: ITicketSummary = {
    senderBankAccountId: '',
    receiverBankAccountId: '',
    amount: 0,
    utr: '',
    creatorRemark: '',
    senderBankAccountNo: '',
    receiverBankAccountNo: '',
};

type Props = {
    setDrawerOpen: (drawer: any) => void;
    fetchTicketSummary: () => void;
    banks:any
};
const AddEditForm = forwardRef((props: Props, ref) => {
    const {setDrawerOpen, fetchTicketSummary,banks} = props;
    const userId = useSelector((state: RootState) => state.auth.user)?._id;
    const [formData, setFormData] = useState<ITicketSummary>(initialFormData);
    const [bankAccountData, setBankAccountData] = useState<IOptionItem[]>([]);

    const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: Partial<IBalanceHistory> = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        const payloadData = {
            ...data,
            createdBy: userId,
        };

        const res = await createTicket(payloadData);
        if (!res?.message) {
            awesomeAlert({msg: 'Ticket Created Successfully'});
            setDrawerOpen(false);
            fetchTicketSummary();
        }
    };

    const handleSelectChange = (name: string, value: any) => {
        setFormData((prevFormData: any) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const fetchBankAccountName = async (): Promise<IBank[] | undefined> => {
        const res = await getBankAccountName();
        return res;
    };

    useEffect(() => {
        fetchBankAccountName().then((res) => {
            const bankMap = banks.reduce((map:any, bank:any) => {
                map[bank._id] = bank.name;
                return map;
            }, {});

            if (res?.length) {
                const options = res.map((a) => ({
                    ...a,
                    id: a._id,
                    value: `${a.name} | ${a.number} | ${bankMap[a?.bankId] || "Unknown Bank"}`,
                }));
                const liveAndHold = options.filter(
                    (n: any) =>
                        n.status === BankAccountStatusEnum.hold ||
                        n.status === BankAccountStatusEnum.live ||
                        n.bank_type === BankTypesEnum.default,
                );
                setBankAccountData(liveAndHold);
            }
        });
    }, []);

    return (
        <form onSubmit={handleCreate}>
            <Grid container spacing={1.5}>
                <Grid item xs={12} sm={12}>
                    <SearchSelect
                        marginType="normal"
                        title="Sender Account"
                        required
                        margin="15px 0px 0px 0px"
                        width="100%"
                        hideAllOption={true}
                        defaultValue={formData.senderBankAccountId}
                        handleChange={(newValue: any) =>
                            handleSelectChange('senderBankAccountId', newValue)
                        }
                        options={bankAccountData.filter(
                            (n) => n?.accountType === BankAccountTypesEnum.payin,
                        )}
                        name="senderBankAccountId"
                    />
                </Grid>

                <Grid item xs={12} sm={12}>
                    <SearchSelect
                        marginType="normal"
                        title="Receiver Account"
                        required
                        margin="15px 0px 0px 0px"
                        hideAllOption={true}
                        width="100%"
                        defaultValue={formData.receiverBankAccountId}
                        handleChange={(newValue: any) =>
                            handleSelectChange('receiverBankAccountId', newValue)
                        }
                        options={bankAccountData.filter(
                            (n) => n?.accountType === BankAccountTypesEnum.payout,
                        )}
                        name="receiverBankAccountId"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        size="small"
                        fullWidth
                        margin="normal"
                        id="amount"
                        name="amount"
                        label="Amount"
                        onChange={handleInputChange}
                        required
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        size="small"
                        fullWidth
                        margin="normal"
                        id="utr"
                        name="utr"
                        label="UTR"
                        onChange={handleInputChange}
                        required
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        size="small"
                        fullWidth
                        margin="normal"
                        id="creatorRemark"
                        name="creatorRemark"
                        label="Remarks"
                        onChange={handleInputChange}
                        sx={{mb: 0}}
                        required
                    />
                </Grid>
                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        px: 7,
                        mt: 3,
                        textTransform: 'capitalize',
                        position: 'absolute',
                        bottom: 25,
                        left: 30,
                    }}
                    color="primary"
                >
                    Create
                </Button>
            </Grid>
        </form>
    );
});

export default AddEditForm;
