import Container from '@mui/material/Container';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
} from '@mui/material';
import React, {ReactNode, useEffect, useState} from 'react';
import {theme} from '@/utils/theme';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';
import {createSetting, getSetting, updateSetting} from '@/utils/services/bankSettings';
import {ISetting, ISettingDto} from '@/utils/interfaces/settings.interface';
import FilterSelect, {IOptionItem} from '@/components/filter/main/filterSelect';
import {getBankAccounts} from '@/utils/services/bankAccount';
import awesomeAlert from '@/utils/functions/alert';
import {useRouter} from 'next/router';
import {SETTINGS_ROUTE} from '@/utils/endpoints/routes';
import {bankTypesOptions, booleanOptions} from '@/components/filter/options';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import RelatedToInput from '@/components/inputs/relatedToInput';
import {RoleEnum} from '@/utils/enums/role';
import {BankTypesEnum} from '@/utils/enums/bankTypes.enum';
import BankAmountRelatedRanges from '@/pages/panel/account-details/components/bankAmountRelatedRanges';
import AssuredWorkloadTwoToneIcon from '@mui/icons-material/AssuredWorkloadTwoTone';
import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import CloseIcon from '@mui/icons-material/Close';
import AddNewUPILevel from './components/addNewUPILevel';
import {BankAccountStatusEnum, BankAccountTypesEnum} from '@/utils/enums/accountDetails.enums';
import {ITransaction} from '@/utils/interfaces/transaction.interface';

const initialFormData: ISettingDto = {
    category: '',
    active_upi_id: '',
    upi_ids: [''],
    is_active: true,
    relatedTo: '',
};
type IUpiItem = IOptionItem & {type: BankTypesEnum};
type Props = {
    id?: string;
};
export const EditCreateSetting = (props: Props) => {
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const [setting, setSetting] = useState<ISetting>();
    const [bankAccountsLoading, setBankAccountsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [upis, setUpis] = useState<IUpiItem[]>([]);
    const [formData, setFormData] = useState<ISettingDto>(initialFormData);
    const router = useRouter();
    const userId = useSelector((state: RootState) => state.auth.user)?._id;
    const newBankOptions: IOptionItem[] = bankTypesOptions.map((t) => ({
        ...t,
        value: `${t.value} (${upis.filter((u) => t.id === u.type).length})`,
    }));
    const [bankType, setBankType] = useState<BankTypesEnum>();
    const filteredUPIs =
        bankType !== undefined
            ? upis.filter(
                  (u) =>
                      u.type !== BankTypesEnum.default ||
                      (u.type === BankTypesEnum.default && u.status === BankAccountStatusEnum.live),
              )
            : upis;
    const [availableRangedBankAcounts, setAvailableRangedBankAcounts] = useState<IUpiItem[]>([]);

    //Ranged UPI Selection

    const [selectedBankAccountIds, setSelectedBankAccountIds] = useState<string[]>([]); // For storing selected bank account ID

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    const handleChangeUPI = (event: SelectChangeEvent<string>, child: ReactNode) => {
        const {name, value} = event.target;
        const index = parseInt(name.split('_')[2]) - 1; // Extracting the index from the name (e.g., 'upi_ids_1' -> index 0)

        setFormData((prevFormData) => ({
            ...prevFormData,
            upi_ids: prevFormData.upi_ids.map((el: string, i) => (i === index ? value : el)), // Update the correct UPI ID
        }));
    };

    const handleIsActiveChange = (event: React.ChangeEvent<{value: unknown}>) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            is_active: event.target.value as boolean,
        }));
    };

    const fetchSetting = async (): Promise<ISetting | undefined> => {
        setLoading(true);
        const res = await getSetting({id: props.id || ''});
        setLoading(false);
        return res;
    };
    const submitUpdateSetting = async (
        id: string,
        payload: Partial<ISettingDto>,
    ): Promise<ISetting | undefined> => {
        setLoading(true);
        const res = await updateSetting(id, payload);
        setLoading(false);
        if (res) {
            awesomeAlert({msg: 'Successfully Updated'});
            await router.push(SETTINGS_ROUTE);
        }
        return res;
    };
    const submitNewSetting = async (
        payload: Partial<ISettingDto>,
    ): Promise<ISetting | undefined> => {
        setLoading(true);
        const res: any = await createSetting(payload);
        setLoading(false);
        if (!(res?.status >= 300 || res?.message)) {
            awesomeAlert({msg: 'Successfully Created'});
            await router.push(SETTINGS_ROUTE);
        }
        return res;
    };
    const fetchBankAccounts = async (relatedTo?: string): Promise<any[]> => {
        setBankAccountsLoading(true);
        const filter: Partial<IBankAccount> = !roles?.includes(RoleEnum.UserControl)
            ? {relatedTo: userId}
            : relatedTo
            ? {relatedTo}
            : {};
        filter.accountType = BankAccountTypesEnum.payin;
        const res: IBankAccount[] | undefined = await getBankAccounts(filter);
        setBankAccountsLoading(false);
        if (res) {
            return res
                ?.filter((a) => a.is_active)
                ?.map((account) => ({
                    id: account._id,
                    value: (
                        <>
                            <Typography component={'span'} sx={{fontWeight: 600, mr: 1}}>
                                {account.bank_type === BankTypesEnum.default
                                    ? 'Bank:'
                                    : ' Gateway:'}
                            </Typography>
                            <Typography component={'span'}>
                                {account.upi_id} | {account.name}
                            </Typography>
                        </>
                    ),
                    type: account.bank_type as BankTypesEnum,
                    upi_id: account.upi_id,
                    name: account.name,
                    bankAmountRange: account.bankAmountRange,
                    status: account.status,
                }));
        }
        return [];
    };
    useEffect(() => {
        if (formData.ranged_upi_list && selectedBankAccountIds.length) {
            const fData = formData;
            setSelectedBankAccountIds(selectedBankAccountIds);
        } else {
            setSelectedBankAccountIds([]);
        }
        const hasRangedUPI =
            upis.filter(
                (upi: IOptionItem) =>
                    upi?.type === bankType &&
                    upi?.bankAmountRange !== undefined &&
                    typeof upi?.bankAmountRange !== 'string' &&
                    upi?.bankAmountRange?.name !== 'All',
            )?.length > 0;
    }, [formData, bankType]);

    // const handleBankTypeChange = (value: BankTypesEnum) => {
    //     setBankType(value);
    // };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = new FormData(event.currentTarget);
        const data = {};
        form.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        const {relatedTo, createdBy} = data as ISetting;
        const payload = {
            ...formData,
            // Remove all empty UPI
            upi_ids: formData.upi_ids.map((el) => el.trim()).filter((level) => level !== ''),
            bankType: bankType,
        };
        const filteredPayload: Partial<ISettingDto> = {
            is_active: payload.is_active,
            relatedTo,
        };
        if (selectedBankAccountIds.length > 0) {
            filteredPayload.ranged_upi_list = selectedBankAccountIds;
        }

        if (payload.upi_ids) {
            filteredPayload.upi_ids = payload.upi_ids;
            filteredPayload.active_upi_id = payload.active_upi_id;
        }
        if (payload.category !== setting?.category) filteredPayload['category'] = payload.category;
        if (props.id) await submitUpdateSetting(payload._id || ':id', filteredPayload);
        else await submitNewSetting({...filteredPayload, createdBy});
    };

    useEffect(() => {
        if (roles?.length && userId && formData.relatedTo) {
            fetchBankAccounts(formData.relatedTo).then((res) => setUpis(res));
        }
    }, [roles, userId, formData.relatedTo]);

    useEffect(() => {
        if (!!props.id) {
            fetchSetting().then((res) => {
                if (res) {
                    const ranged_upi_listIds = res?.ranged_upi_list?.map((account: any) => {
                        return account?._id;
                    });
                    const resFormData = {
                        ...res,
                        upi_ids: res.upi_ids?.map((account) => account._id || ''),
                        active_upi_id: res.active_upi_id?._id || '',
                        ranged_upi_list: ranged_upi_listIds || [],
                    };

                    const isRanged =
                        res?.ranged_upi_list && res?.ranged_upi_list?.length > 0 ? true : false;
                    const bank_type =
                        isRanged && res?.bankType
                            ? res?.bankType
                            : res?.active_upi_id?.bank_type
                            ? res?.active_upi_id?.bank_type
                            : 0;
                    setBankType(bank_type);
                    setFormData(resFormData);
                    setSetting(res);
                    setSelectedBankAccountIds(ranged_upi_listIds || []);
                }
            });
        }
    }, [props.id]);
    const handleAddUPI = () => {
        setFormData((oldFD) => ({
            ...oldFD,
            upi_ids: [...oldFD.upi_ids, ''],
        }));
    };
    const handleRemoveUPI = (upiId: string) => {
        setFormData((oldFD) => {
            const updatedUPI = oldFD.upi_ids.filter((el) => el !== upiId);
            return {
                ...oldFD,
                upi_ids: updatedUPI,
            };
        });
    };
    return (
        <Box
            sx={{
                mt: 8,
                pb: 3,
                flexGrow: 1,
                background: 'white',
                borderRadius: theme.shape.borderRadius + 'px',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    {loading && <CircularProgress size={50} />}
                    {!loading && (
                        <Grid item xs={12}>
                            <Typography sx={{my: 2}} variant="h5">
                                {props.id ? `Edit Setting ${props.id}` : 'Create New Setting'}
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <RelatedToInput
                                    hideAllOption
                                    disabled={!!(props.id && formData?.relatedTo)}
                                    handleChange={(relatedTo) =>
                                        fetchBankAccounts(relatedTo).then((res) => setUpis(res))
                                    }
                                    relatedToInitialValue={props.id ? formData?.relatedTo : ''}
                                />

                                <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    margin="normal"
                                    id="category"
                                    name="category"
                                    label="Category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                />
                           
                                <AddNewUPILevel
                                    formData={formData}
                                    filteredUPIs={filteredUPIs} // your filtered UPI options
                                    handleChange={handleChangeUPI}
                                    handleAddUPI={handleAddUPI}
                                    handleRemoveUPI={handleRemoveUPI}
                                    bankAccountsLoading={bankAccountsLoading} // loading state for UPI options
                                    setFormData={setFormData}
                                />
                                <Grid container spacing={3}>
                                    <BankAmountRelatedRanges
                                        openDialog={true}
                                        selectedBankAccountIds={selectedBankAccountIds}
                                        setSelectedBankAccountIds={setSelectedBankAccountIds}
                                        upis={filteredUPIs}
                                        availableRangedBankAcounts={availableRangedBankAcounts}
                                        setAvailableRangedBankAcounts={
                                            setAvailableRangedBankAcounts
                                        }
                                    />
                                </Grid>

                                <FormControl size="small" fullWidth margin="normal">
                                    <InputLabel id="isActive-label">Is Active *</InputLabel>
                                    <Select
                                        required
                                        label="Is Active"
                                        labelId="isActive-label"
                                        id="isActive"
                                        name="isActive"
                                        value={formData.is_active}
                                        // @ts-ignore
                                        onChange={handleIsActiveChange}
                                    >
                                        {booleanOptions.map((option, i) => (
                                            <MenuItem key={i} value={option.id}>
                                                {option.value}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Box>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{px: 10, mt: 3, textTransform: 'capitalize'}}
                                        color="primary"
                                    >
                                        {props.id ? 'Update' : 'Submit'}
                                    </Button>
                                </Box>
                            </form>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};
