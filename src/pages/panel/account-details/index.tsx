import {useSelector} from 'react-redux';
import React, {FormEvent, useEffect, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {
    LOGIN_ROUTE,
    UPLOADING_ACTIVELY_ROUTE,
} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import {Box} from '@mui/material';
import {Grid, useTheme} from '@mui/material';
import MainFilter from '@/components/filter/mainFilter';
import {IBank, IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import {FilterEnums} from '@/utils/enums/filter';
import {getBanks} from '@/utils/services/bank';
import {IVendor} from '@/utils/interfaces/vendor.interface';
import axiosInstance from '@/utils/axios';
import {getBankAccounts} from '@/utils/services/accountDetails';
import {getVendors} from '@/utils/services/vendors';
import {
    BankAccountStatusEnum,
    BankAccountTypesEnum,
    ChannelsEnum,
} from '@/utils/enums/accountDetails.enums';
import {
    bankAccountStatusOptions,
    AccountDetailsCardChannels,
    bankAccountStatusOptionsFilter,
    bankAccountStatusOptionsForProcessing,
    bankStatusOptionsHLO,
    bankStatusOptionsExceptRTL,
} from '@/components/filter/options';
import {IOptionItem} from '@/components/filter/main/filterSelect';
import awesomeAlert from '@/utils/functions/alert';
import DialogBoxMain from './dailogBox';
import {
    BANK_ACCOUNT,
    PAYMENT_CIRCLE,
    ZEAL_APP,
    BANK_ACCOUNTS_CREATE,
} from '@/utils/endpoints/endpoints';
import FilterContent from './components/LandingPageComponents/filterContent';
import CreateBankAccount from './components/LandingPageComponents/createBankAccount';
import CardContent from './components/LandingPageComponents/cardContent';
import HeaderContent from './components/LandingPageComponents/headerContent';



const AccountDetails = () => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [dailogAnchorEl, setDailogAnchorEl] = useState(false);
    const openPopover = Boolean(anchorEl);
    const [popupData, setPopupData] = useState<any>({});
    const [logs, setLog] = useState<any>({
        accountType: BankAccountTypesEnum.payin,
        // channel: ChannelsEnum.payz365,
    });
    const [loading, setLoading] = useState(false);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [openStatus, setOpenStatus] = useState(false);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(200);
    const [bankAccounts, setBankAccounts] = useState<any>([]);
    const [filteredData, setFilteredData] = useState<any>(bankAccounts);
    const [selectedIds, setSelectedIds] = useState<any>([]);
    const [payData, setPayData] = useState<any>('payin');
    const [active, SetActive] = useState(false);
    const [banks, setBanks] = React.useState<IVendor[]>([]);
    const [vendorsLoading, setVendorsLoading] = React.useState(false);
    const [formData, setFormData] = useState<any>([]);
    const [validation, setValidation] = useState(false);
    const [trigger, setTrigger] = useState(false);
    const [previousStatus, setPreviousStatus] = useState(formData.status);
    const [closingBalanceData, setClosingBalanceData] = useState<any>(0);
    const [query, setSearchQuery] = useState<any>('');
    const [vendors, setVendors] = React.useState<IBank[]>([]);
    const [banksLoading, setBanksLoading] = React.useState(false);
    const [openViewDialog, setOpenViewDialog] = useState<boolean>(false);

    const handleChange = (e: any) => {
        setPayData(e);
    };
    const fetchBankAccount = async (formData?: any): Promise<any> => {
        const payloadData = {...formData, status: selectedIds};
        setLoading(true);

        let modifiedPayloadData = {...payloadData};
        if (roles?.includes(RoleEnum?.PayinAccountsOnly)) {
            modifiedPayloadData.accountType = BankAccountTypesEnum.payin;
        } else if (roles?.includes(RoleEnum?.PayoutAccountsOnly)) {
            modifiedPayloadData.accountType = BankAccountTypesEnum.payout;
        }

        const res: any = await getBankAccounts({
            filter: modifiedPayloadData || {},
            page: page + 1,
            limit,
        });
        setLoading(false);
        const {bankAccounts} = res;
        return bankAccounts;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSearchQuery('');
        setFilteredData([]);
        const formData = new FormData(e.currentTarget);
        const data: any = {};
        formData.forEach((value, key) => {
            if (value) data[key] = value;
        });
        setLog(data);
        const res = await fetchBankAccount(data);
        if (res) {
            setBankAccounts(res);
        }
    };

    useEffect(() => {
        fetchBankAccount(logs)
            .then((res) => {
                if (res) {
                    setBankAccounts(res);
                }
            })
            .catch((err) => console.error(err));
    }, [selectedIds, trigger]);

    useEffect(() => {
        if (!roles?.includes(RoleEnum?.AccountDetails)) router.push(LOGIN_ROUTE);
    }, [roles]);

    const handleStatusSelection = (id?: string) => {
        if (id === undefined || id === null) {
            setSelectedIds([]);
            return;
        } else {
            setSelectedIds((prevSelectedIds: any) => {
                if (prevSelectedIds.includes(id)) {
                    return prevSelectedIds.filter((selectedId: any) => selectedId !== id);
                } else {
                    return [...prevSelectedIds, id];
                }
            });
        }
    };

    const handleRouter = async (n: any) => {
        setClosingBalanceData(n);
        setActiveStep(n.statusHistory.length - 1);
        setOpen(!open);
        setPopupData(n);
        SetActive(n.is_active);
    };
    const setRemarksAndAmount = () => {
        if (openStatus) {
            if (
                formData.status === BankAccountStatusEnum.freeze &&
                !(formData.remark && formData.freezeAmount)
            ) {
                setValidation(true);
            } else if (!formData.remark) {
                setValidation(true);
            } else {
                setOpenStatus(false);
                setValidation(false);
                setFormData((prev: any) => ({
                    ...prev,
                    is_active: false,
                }));
            }
        } else {
            setOpenStatus(false);
            setValidation(false);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement> | any) => {
        const {name, value} = event.target;
        setSearchQuery(value);

        const Keys: Set<string> = new Set();

        const collectKeys = (obj: any, prefix: string = '') => {
            if (obj && typeof obj === 'object') {
                Object.keys(obj).forEach((key) => {
                    const fullKey = prefix ? `${prefix}.${key}` : key;
                    if (Array.isArray(obj[key])) {
                        if (obj[key].length > 0 && typeof obj[key][0] === 'object') {
                            collectKeys(obj[key][0], fullKey);
                        }
                    } else if (typeof obj[key] === 'object') {
                        collectKeys(obj[key], fullKey);
                    } else {
                        Keys.add(fullKey);
                    }
                });
            }
        };

        bankAccounts.forEach((item: any) => {
            collectKeys(item);
        });

        const allKeys = ['name', 'number', 'bankId.name'];

        const data = bankAccounts.filter((item: any) =>
            allKeys.some((key: string) => {
                const keyParts = key.split('.');
                let valueToCheck = item;
                for (let i = 0; i < keyParts.length; i++) {
                    valueToCheck = valueToCheck ? valueToCheck[keyParts[i]] : undefined;
                }
                return valueToCheck
                    ? valueToCheck.toString().toLowerCase().includes(value.toLowerCase())
                    : false;
            }),
        );

        setFilteredData(data);
    };

    const fetchVendors = async (): Promise<IVendor[] | undefined> => {
        try {
            setVendorsLoading(true);
            const res = await getVendors();
            if (res) setVendors(res);
            setVendorsLoading(false);
            return res;
        } catch (err) {
            console.log(err);
            setVendorsLoading(false);
        }
    };
    const fetchBanks = async (): Promise<IBank[] | undefined> => {
        try {
            setBanksLoading(true);
            const res = await getBanks();
            if (res) setBanks(res);
            setBanksLoading(false);
            return res;
        } catch (err) {
            console.log(err);
            setBanksLoading(false);
        }
    };
    const clearText = () => {
        setSearchQuery('');
        setFilteredData([]);
    };

    useEffect(() => {
        fetchVendors().then((res) => res);
        fetchBanks().then((res) => res);
    }, []);

    const liveData = bankAccounts?.filter((n: any) => n?.status === BankAccountStatusEnum.live);
    const dailyLimit = liveData?.reduce((total: number, current: any) => {
        return total + current?.daily_limit;
    }, 0);
    const dailyIncome = liveData.reduce((total: number, current: any) => {
        return total + current.daily_income;
    }, 0);
    const handleClose = () => {
        setFormData((prev: any) => ({
            ...prev,
            remark: '',
            freezeAmount: '',
            status: previousStatus,
        }));
        setOpenStatus(false);
    };

    const handleConfirm = () => {
        handleSwitch();
    };

    const handleTooltipClose = () => {
        setTooltipOpen(false);
    };

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleDailogClick = (event: any) => {
        setDailogAnchorEl(event.currentTarget);
    };
    const bankOptions: IOptionItem[] = banks?.map((bank: IBank, i) => ({
        id: bank?._id,
        value: bank?.name,
    }));
    const vendorOptions: IOptionItem[] = vendors?.map((vendor: IVendor, i) => ({
        id: vendor?._id,
        value: vendor?.name,
    }));

    const handleClosePopover = () => {
        setAnchorEl(null);
    };
    const handleDailogClose = () => {
        setDailogAnchorEl(false);
    };
    const getStatusValue = (statusId: number | string) => {
        const statusOption = bankAccountStatusOptionsFilter.find((option) => option.id == statusId);
        return statusOption && statusOption.value;
    };
    const getChannelValue = (channelId: number | string) => {
        const channelOption = AccountDetailsCardChannels.find((option) => option.id == channelId);
        return channelOption && channelOption.value;
    };

    const updateBankAccount = async (
        id: string,
        payload: IBankAccount,
    ): Promise<IBankAccount | undefined> => {
        try {
            const basePayload = {...payload, is_active: false, is_live: false};
            const activePayload = {
                ...payload,
                is_active: payload.status === BankAccountStatusEnum.live ? true : false,
                is_live: payload.status === BankAccountStatusEnum.live ? true : false,
            };
            if (payload.global) delete payload.relatedTo;
            if (payload.channel === ChannelsEnum.payz365) {
                const res = await axiosInstance.put(BANK_ACCOUNT(id), activePayload);
                axiosInstance.post(BANK_ACCOUNTS_CREATE, basePayload, {baseURL: PAYMENT_CIRCLE});
                axiosInstance.post(BANK_ACCOUNTS_CREATE, basePayload, {baseURL: ZEAL_APP});
                return res?.data;
            } else if (payload.channel === ChannelsEnum.paymentCircle) {
                const res = await axiosInstance.put(BANK_ACCOUNT(id), basePayload);
                axiosInstance.post(BANK_ACCOUNTS_CREATE, activePayload, {baseURL: PAYMENT_CIRCLE});
                axiosInstance.post(BANK_ACCOUNTS_CREATE, basePayload, {baseURL: ZEAL_APP});
                return res?.data;
            } else if (payload.channel === ChannelsEnum.zealApp) {
                const res = await axiosInstance.put(BANK_ACCOUNT(id), basePayload);
                axiosInstance.post(BANK_ACCOUNTS_CREATE, basePayload, {baseURL: PAYMENT_CIRCLE});
                axiosInstance.post(BANK_ACCOUNTS_CREATE, activePayload, {baseURL: ZEAL_APP});
                return res?.data;
            } else {
                const res = await axiosInstance.put(BANK_ACCOUNT(id), payload);
                return res?.data;
            }
        } catch (error: any) {
            console.error(error);
        }
    };

    const lastFinalData = (): any[] => {
        let dataToFilter = (filteredData && filteredData.length > 0 ? filteredData : query)
            ? filteredData
            : bankAccounts;

        let modifiedfilteredData = [...dataToFilter];

        if (roles?.includes(RoleEnum?.ProcessingAccountsOnly)) {
            modifiedfilteredData = modifiedfilteredData.filter(
                (n: any) => n.status === BankAccountStatusEnum.processing,
            );
        } else if (roles?.includes(RoleEnum?.StatusHoldLiveOthers)) {
            modifiedfilteredData = modifiedfilteredData.filter((n: any) =>
                [
                    BankAccountStatusEnum.hold,
                    BankAccountStatusEnum.live,
                    BankAccountStatusEnum.other,
                ].includes(n.status),
            );
        } else if (roles?.includes(RoleEnum?.StatusExceptReadyToLive)) {
            modifiedfilteredData = modifiedfilteredData.filter(
                (n: any) =>
                    ![
                        BankAccountStatusEnum.readyToLive,
                        BankAccountStatusEnum.permanentStop,
                        BankAccountStatusEnum.processing,
                    ].includes(n.status),
            );
        } else if (roles?.includes(RoleEnum?.ExceptProcessingAccounts)) {
            modifiedfilteredData = modifiedfilteredData.filter(
                (n: any) => n.status !== BankAccountStatusEnum.processing,
            );
        }

        return modifiedfilteredData;
    };

    const handleSwitch = async () => {
        const vendorName =
            vendorOptions.filter((n: any) => n.id === popupData?.vendorId?._id)[0]?.value || '';
        const bankName =
            bankOptions.filter((n: any) => n.id === popupData?.bankId?._id)[0]?.value || '';
        const is_active =
            (formData.status !== '' && formData.status === BankAccountStatusEnum.live) ||
            (formData.status === '' && popupData.status === BankAccountStatusEnum.live);

        const res = await updateBankAccount(popupData._id, {
            is_active,
            name: popupData?.name,
            remark: formData.remark,
            status: formData.status || popupData.status,
            freezeAmount: formData.freezeAmount,
            channel: popupData.channel,
            bankName: bankName || '',
            vendorName: vendorName || '',
            number: popupData.number,
            is_live: is_active,
            upi_id: popupData.upi_id || '',
        });
        setSelectedIds([]);
        handleStatusSelection();

        if (res) {
            awesomeAlert({msg: 'Successfully Updated'});
            setOpen(false);
            setTrigger(true);
            setFormData((prev: any) => ({
                ...prev,
                remark: '',
                freezeAmount: '',
                status: '',
            }));
        }
    };
    const handleViewDialogClose = () => {
        setOpenViewDialog(false);
    };
    const OpenKeyValueViewDailog = () => {
        setOpenViewDialog(true);
    };
    const handleActivelyUploading = () => {
        router.push(UPLOADING_ACTIVELY_ROUTE);
    };

    const handleSelectChange = (name: string, value: any) => {
        setFormData((prevFormData: any) => ({
            ...prevFormData,
            [name]: value,
        }));
        setPreviousStatus(formData.status);
        if (
            name === 'status' &&
            value !== BankAccountStatusEnum.live &&
            value !== BankAccountStatusEnum.processing
        ) {
            setOpenStatus(!openStatus);
        }
    };
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | any) => {
        const {name, value} = event.target;
        setFormData((prevFormData: any) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState<{
        [k: number]: boolean;
    }>({});

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    const getOptions = () => {
        let options = [];

        if (popupData.status === BankAccountStatusEnum.processing) {
            options = bankAccountStatusOptionsForProcessing;
        } else if (roles?.includes(RoleEnum.StatusHoldLiveOthers)) {
            options = bankStatusOptionsHLO;
        } else if (roles?.includes(RoleEnum.StatusExceptReadyToLive)) {
            options = bankStatusOptionsExceptRTL;
        } else {
            options = bankAccountStatusOptions;
        }

        // If superAdmin role is not present, filter out 'permanentStop'
        if (!roles?.includes(RoleEnum.Admin)) {
            options = options.filter(
                (option) => option?.id !== BankAccountStatusEnum.permanentStop,
            );
        }

        return options;
    };

    // Define the options for the FilterSelect component
    const statusOptions = getOptions();
    console.log(statusOptions, 'statusOptions');

    return (
        <DashboardLayout>
            <Box sx={{flexGrow: 1, p: 2}}>
                <HeaderContent
                    handleActivelyUploading={handleActivelyUploading}
                    dailyLimit={dailyLimit}
                    dailyIncome={dailyIncome}
                />

                <MainFilter
                    filter={{}}
                    loading={loading}
                    onSubmit={handleSubmit}
                    callback={'callback'}
                    payData={payData}
                    handleChange={handleChange}
                    selectedFilters={[
                        FilterEnums.noRelatedTo,
                        FilterEnums.account_type,
                        FilterEnums.vendor_id,
                        FilterEnums.channel_name,
                    ]}
                />

                <Grid container spacing={2}>
                    <FilterContent
                        selectedIds={selectedIds}
                        handleStatusSelection={handleStatusSelection}
                        setFilteredData={setFilteredData}
                        setSearchQuery={setSearchQuery}
                        query={query}
                        handleSearchChange={handleSearchChange}
                        clearText={clearText}
                    />
                </Grid>
                <CreateBankAccount />

                <CardContent
                    lastFinalData={lastFinalData}
                    bankAccounts={bankAccounts}
                    handleRouter={handleRouter}
                    getStatusValue={getStatusValue}
                    getChannelValue={getChannelValue}
                    query={query}
                />
                <DialogBoxMain
                    popupData={popupData}
                    open={open}
                    formData={formData}
                    setFormData={setFormData}
                    setPreviousStatus={setPreviousStatus}
                    previousStatus={previousStatus}
                    setOpenStatus={setOpenStatus}
                    openStatus={openStatus}
                    handleSwitch={handleSwitch}
                    handleClick={handleClick}
                    openPopover={openPopover}
                    anchorEl={anchorEl}
                    handleClosePopover={handleClosePopover}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    setCompleted={setCompleted}
                    completed={completed}
                    handleStep={handleStep}
                    setOpen={setOpen}
                    handleSelectChange={handleSelectChange}
                    handleClose={handleClose}
                    handleInputChange={handleInputChange}
                    validation={validation}
                    setRemarksAndAmount={setRemarksAndAmount}
                    handleDailogClose={handleDailogClose}
                    OpenKeyValueViewDailog={OpenKeyValueViewDailog}
                    handleTooltipClose={handleTooltipClose}
                    closingBalanceData={closingBalanceData}
                    setDailogAnchorEl={setDailogAnchorEl}
                    dailogAnchorEl={dailogAnchorEl}
                    vendorsLoading={vendorsLoading}
                    setVendorsLoading={setVendorsLoading}
                    handleConfirm={handleConfirm}
                    handleDailogClick={handleDailogClick}
                    handleViewDialogClose={handleViewDialogClose}
                    openViewDialog={openViewDialog}
                />
            </Box>
        </DashboardLayout>
    );
};
export default AccountDetails;
