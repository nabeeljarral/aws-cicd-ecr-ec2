import * as React from 'react';
import {useEffect, useState} from 'react';
import FilterBox from '@/components/filter/main/filterBox';
import DateRangePicker from '@/components/filter/main/dateRangePicker';
import FilterSelect, {IOptionItem} from '@/components/filter/main/filterSelect';
import {IFilterTransactionDto} from '@/utils/dto/transactions.dto';
import {OptionsFromArray} from '@/utils/functions/global';
import {IBankAccount, IBank} from '@/utils/interfaces/bankAccount.interface';
import {getBankAccounts, getBankAccountName} from '@/utils/services/bankAccount';
import {ISetting} from '@/utils/interfaces/settings.interface';
import {getSettings} from '@/utils/services/bankSettings';
import FilterInput from '@/components/filter/main/filterInput';
import {BanksEnum} from '@/utils/enums/banks';
import {FilterEnums} from '@/utils/enums/filter';
import {getVendors} from '@/utils/services/vendors';
import {IVendor} from '@/utils/interfaces/vendor.interface';
import {RoleEnum} from '@/utils/enums/role';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {getUsers} from '@/utils/services/user';
import {
    balanceHistoryTypesOptions,
    bankTypesOptions,
    booleanOptions,
    getawayOptions,
    loggerStatusOptions,
    payinStatusOptions,
    PaymentActionOptions,
    payoutExportFormatOptions,
    payoutStatusOptions,
    gatewayTypesOptions,
    BankAccountTypesOptions,
    AccountDetailsChannels,
    bankAccountStatusOptions,
    ticketStatusOptions,
    TransferType,
    UserType,
} from '@/components/filter/options';
import SearchSelect from './main/searchSelect';
import {BankAccountTypesEnum} from '@/utils/enums/accountDetails.enums';

type Props = {
    topChildren?: React.ReactNode;
    children?: React.ReactNode;
    afterFilterBtn?: React.ReactNode;
    loading: boolean;
    isOpen?: boolean;
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    onSubmitNew?: React.FormEventHandler<HTMLFormElement>;
    filter: IFilterTransactionDto;
    selectedFilters: FilterEnums[];
    submitText?: React.ReactNode;
    submitTextNew?: React.ReactNode;
    isRestrictedPage?: boolean;
    clientId?: string;
    handleChange?: any;
    callback?: string;
    payData?: string;
    callBackFunction?: (value: any) => Promise<void>;
};
export default function MainFilter(props: Props) {
    const {selectedFilters, payData} = props;
    const [vendorOptionsLoading, setVendorOptionsLoading] = useState(false);
    const [vendorOptions, setVendorOptions] = useState<IOptionItem[]>([]);
    const [userOptionsLoading, setUserOptionsLoading] = useState(false);
    const [bankAccountsLoading, setBankAccountsLoading] = useState(false);
    const [bankAccountNameOptions, setBankAccountNameOptions] = useState<IOptionItem[]>([]);
    const [bankAccountData, setBankAccountData] = useState<IOptionItem[]>([]);
    const [bankAccountOptions, setBankAccountOptions] = useState<IOptionItem[]>([]);
    const [userOptions, setUserOptions] = useState<IOptionItem[]>([]);
    const [categoryLoading, setCategoryLoading] = useState(false);
    const [categories, setCategories] = useState<IOptionItem[]>([]);
    const [relatedToValues, setRelatedToValues] = useState<string>('');
    const [bankType, setBankType] = useState<string>('');
    const banksOptions = OptionsFromArray(BanksEnum);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const user = useSelector((state: RootState) => state.auth.user);
    const userId = user?._id;
    const isClaimedOptions = [
        {id: true, value: 'True'},
        {id: false, value: 'False'},
    ];
    const [areDatesValid, setAreDatesValid] = useState(true);
    const fetchBankAccounts = async (): Promise<IBankAccount[] | undefined> => {
        setBankAccountsLoading(true);
        const res = await getBankAccounts({relatedTo: userId});
        setBankAccountsLoading(false);
        return res;
    };

    const fetchBankAccountName = async (): Promise<IBank[] | undefined> => {
        setBankAccountsLoading(true);
        const res = await getBankAccountName();
        setBankAccountsLoading(false);
        return res;
    };
    const fetchCategory = async (): Promise<ISetting[] | undefined> => {
        setCategoryLoading(true);
        const res = await getSettings({relatedTo: userId});
        setCategoryLoading(false);
        return res;
    };
    const fetchVendors = async (): Promise<IVendor[] | undefined> => {
        setVendorOptionsLoading(true);
        const res = await getVendors();
        setVendorOptionsLoading(false);
        return res;
    };

    useEffect(() => {
        if (selectedFilters.includes(FilterEnums.setting) && userId) {
            fetchCategory().then((res) => {
                if (res) {
                    const options = res.map((s) => ({
                        value: s.category,
                        id: s._id,
                    }));
                    setCategories(options);
                }
            });
        }
        if (selectedFilters.includes(FilterEnums.bank_account)) {
            fetchBankAccounts().then((res) => {
                if (res?.length) {
                    const options = res.map((a) => ({
                        id: a._id,
                        value: a.name,
                    }));
                    setBankAccountOptions(options);
                }
            });
        }
        if (selectedFilters.includes(FilterEnums.bank_name)) {
            fetchBankAccountName().then((res) => {
                if (res?.length) {
                    const options = res.map((a) => ({
                        ...a,
                        id: a._id,
                        value: a.name,
                    }));
                    setBankAccountData(options);
                }
            });
        }
        if (
            selectedFilters.includes(FilterEnums.sender_account) ||
            selectedFilters.includes(FilterEnums.receiver_account)
        ) {
            fetchBankAccountName().then((res) => {
                if (res?.length) {
                    const options = res.map((a) => ({
                        ...a,
                        id: a._id,
                        value: a.name,
                    }));
                    setBankAccountData(options);
                }
            });
        }

        if (selectedFilters.includes(FilterEnums.vendor)) {
            fetchVendors().then((res) => {
                if (res?.length) {
                    const options = res.map((a) => ({
                        id: a._id,
                        value: a.name,
                    }));
                    setVendorOptions(options);
                }
            });
        }
        if (selectedFilters.includes(FilterEnums.vendor_id)) {
            fetchVendors().then((res) => {
                if (res?.length) {
                    const options = res.map((a) => ({
                        id: a._id,
                        value: a.name,
                    }));
                    setVendorOptions(options);
                }
            });
        }
        if (roles?.includes(RoleEnum.UserControl)) {
            setCategoryLoading(true);
            getUsers()
                .then((res) => {
                    if (res?.length) {
                        const options = res
                            .filter((u) => u.isCompany && u.isActive)
                            .map((a) => ({
                                id: a._id,
                                value: a.email,
                            }));
                        setUserOptions(options);
                    }
                })
                .finally(() => {
                    setCategoryLoading(false);
                });
        }
    }, []);

    const handleChangeRelatedTo = (e: any) => {
        setRelatedToValues(e);
        handleGlobalChange(e);
    };
    const handleBankTypeChange = (e: any) => {
        setBankType(e);
        handleGlobalChange(e);
    };
    const handleGlobalChange = async (e: any) => {
        if (typeof props.callBackFunction === 'function') await props.callBackFunction(e);
    };
    useEffect(() => {
        const filteredBankOptions = bankAccountData.filter((o: any) => {
            const matchesRelatedTo = relatedToValues ? o.userIds?.includes(relatedToValues) : true;
            const matchesBankType = bankType !== '' ? o.bank_type === bankType : true;
            return matchesRelatedTo && matchesBankType;
        });
        setBankAccountNameOptions(filteredBankOptions);
    }, [relatedToValues, bankType]);

    return (
        <FilterBox
            isOpen={props.isOpen}
            loading={props.loading}
            onSubmit={props.onSubmit}
            onSubmitNew={props.onSubmitNew}
            submitText={props.submitText}
            submitTextNew={props.submitTextNew}
            afterFilterBtn={props.afterFilterBtn}
            areDatesValid={areDatesValid}
        >
            {!selectedFilters.includes(FilterEnums.noRelatedTo) && (
                <>
                    {props.topChildren}
                    {roles?.includes(RoleEnum.UserControl) ? (
                        <FilterSelect
                            title="Related To"
                            name="relatedTo"
                            options={userOptions}
                            loading={userOptionsLoading}
                            defaultValue={props.clientId}
                            handleChange={handleChangeRelatedTo}
                        />
                    ) : (
                        <input type="hidden" name="relatedTo" value={userId} />
                    )}
                </>
            )}
            {selectedFilters.includes(FilterEnums.order_id) && (
                <FilterInput onChange={handleGlobalChange} title="Order Id" name="order_id" />
            )}
            {selectedFilters.includes(FilterEnums.categories) && (
                <FilterSelect
                    loading={false}
                    hideAllOption={true}
                    name="category"
                    title="Category"
                    options={['All', 'P1', 'P2', 'P3', 'P4', 'TD', 'FTD'].map((s) => ({
                        value: s,
                        id: s,
                    }))}
                    handleChange={handleGlobalChange}
                />
            )}
            {selectedFilters.includes(FilterEnums.account_number) && (
                <FilterInput
                    title="Account Number"
                    name="account_number"
                    onChange={handleGlobalChange}
                />
            )}
            {selectedFilters.includes(FilterEnums.ifsc) && <FilterInput title="IFSC" name="ifsc" />}
            {selectedFilters.includes(FilterEnums.bank) && (
                <FilterSelect
                    title="Bank"
                    name="bank"
                    options={banksOptions}
                    handleChange={handleGlobalChange}
                />
            )}
            {selectedFilters.includes(FilterEnums.bank_account) && (
                <FilterSelect
                    loading={bankAccountsLoading}
                    name="bank_account"
                    title="Bank Account"
                    options={bankAccountOptions}
                    handleChange={handleGlobalChange}
                />
            )}
            {selectedFilters.includes(FilterEnums.is_claimed) && (
                <FilterSelect
                    title="Is Claimed"
                    name="is_claimed"
                    options={isClaimedOptions}
                    handleChange={handleGlobalChange}
                />
            )}
            {selectedFilters.includes(FilterEnums.setting) && (
                <FilterSelect
                    loading={categoryLoading}
                    name="setting"
                    title="Category"
                    options={categories}
                    handleChange={handleGlobalChange}
                />
            )}
            {selectedFilters.includes(FilterEnums.has_vendor) && (
                <FilterSelect
                    title="Has Vendor"
                    name="has_vendor"
                    options={booleanOptions}
                    handleChange={handleGlobalChange}
                />
            )}
            {selectedFilters.includes(FilterEnums.vendor) && (
                <FilterSelect
                    title="Vendor"
                    name="vendor"
                    options={vendorOptions}
                    loading={vendorOptionsLoading}
                    handleChange={handleGlobalChange}
                />
            )}
            {selectedFilters.includes(FilterEnums.vendor_id) && (
                <FilterSelect
                    title="Vendor"
                    name="vendorId"
                    options={vendorOptions}
                    loading={vendorOptionsLoading}
                    handleChange={handleGlobalChange}
                />
            )}
            {selectedFilters.includes(FilterEnums.status) && (
                <FilterSelect
                    name="status"
                    title="Status"
                    options={payinStatusOptions}
                    handleChange={handleGlobalChange}
                />
            )}
            {selectedFilters.includes(FilterEnums.account_status) && (
                <FilterSelect
                    name="status"
                    title="Status"
                    hideAllOption
                    options={bankAccountStatusOptions}
                    handleChange={handleGlobalChange}
                />
            )}
            {selectedFilters.includes(FilterEnums.ticket_status) && (
                <FilterSelect
                    handleChange={handleGlobalChange}
                    name="status"
                    title="Status"
                    options={ticketStatusOptions}
                />
            )}
            {selectedFilters.includes(FilterEnums.payout_status) && (
                <FilterSelect
                    handleChange={handleGlobalChange}
                    name="status"
                    title="Status"
                    options={payoutStatusOptions}
                />
            )}
            {selectedFilters.includes(FilterEnums.logger_status) && (
                <FilterSelect
                    handleChange={handleGlobalChange}
                    name="status"
                    title="Status"
                    options={loggerStatusOptions}
                />
            )}
            {selectedFilters.includes(FilterEnums.check_by_getaway) && (
                <FilterSelect
                    handleChange={handleGlobalChange}
                    name="bank_type"
                    title="Check By Gateway"
                    hideAllOption
                    options={getawayOptions}
                />
            )}
            {selectedFilters.includes(FilterEnums.balanceType) && (
                <FilterSelect
                    handleChange={handleGlobalChange}
                    name="balanceType"
                    title="Gateway"
                    options={getawayOptions}
                />
            )}
            {selectedFilters.includes(FilterEnums.bank_type) && (
                <FilterSelect
                    name="bank_type"
                    title="Bank Type"
                    options={bankTypesOptions}
                    handleChange={(e) => handleBankTypeChange(e)}
                />
            )}
            {selectedFilters.includes(FilterEnums.payment_action) && (
                <FilterSelect
                    name="payment_action"
                    title="Payment Action"
                    hideAllOption
                    options={PaymentActionOptions}
                    defaultValue={'payin'}
                    handleChange={props.handleChange}
                />
            )}
            {selectedFilters.includes(FilterEnums.account_type) && (
                <FilterSelect
                    name="accountType"
                    title="Account Type"
                    hideAllOption={true}
                    options={BankAccountTypesOptions}
                    defaultValue={
                        (roles?.includes(RoleEnum?.PayinAccountsOnly) && 1) ||
                        (roles?.includes(RoleEnum?.PayoutAccountsOnly) &&
                            BankAccountTypesEnum.payout) ||
                        BankAccountTypesEnum.payin
                    }
                    handleChange={props.handleChange}
                    disabled={
                        roles?.includes(RoleEnum?.PayinAccountsOnly) ||
                        roles?.includes(RoleEnum?.PayoutAccountsOnly)
                    }
                />
            )}
            {selectedFilters.includes(FilterEnums.channel_name) && (
                <FilterSelect
                    name="channel"
                    title="Channel Name"
                    options={AccountDetailsChannels}
                    handleChange={props.handleChange}
                    disabled={roles?.includes(RoleEnum?.PayoutAccountsOnly)}
                />
            )}

            {props.callback === 'callback' && (
                <>
                    {props.callback === 'callback' && payData === 'payin' ? (
                        <>
                            {selectedFilters.includes(FilterEnums.balancetype) && (
                                <FilterSelect
                                    name="gatewayType"
                                    title="Balance Type"
                                    options={bankTypesOptions}
                                    handleChange={(e) => setBankType(e)}
                                />
                            )}
                        </>
                    ) : (
                        <>
                            {selectedFilters.includes(FilterEnums.gateway) && (
                                <FilterSelect
                                    name="gatewayType"
                                    title="Gateway"
                                    options={gatewayTypesOptions}
                                    handleChange={(e) => setBankType(e)}
                                />
                            )}
                        </>
                    )}
                </>
            )}
            {selectedFilters.includes(FilterEnums.utr) && (
                <FilterInput title="UTR" name="utr" onChange={handleGlobalChange} />
            )}
            {selectedFilters.includes(FilterEnums.sender_account) && (
                <SearchSelect
                    handleChange={handleGlobalChange}
                    name="senderBankAccountId"
                    title="Sender Account"
                    options={bankAccountData.filter(
                        (n) => n?.accountType === BankAccountTypesEnum.payin,
                    )}
                />
            )}

            {selectedFilters.includes(FilterEnums.receiver_account) && (
                <SearchSelect
                    handleChange={handleGlobalChange}
                    name="receiverBankAccountId"
                    title="Receiver Account"
                    options={bankAccountData.filter(
                        (n) => n?.accountType === BankAccountTypesEnum.payout,
                    )}
                />
            )}
            {selectedFilters.includes(FilterEnums.bank_name) && (
                <SearchSelect
                    handleChange={handleGlobalChange}
                    name="bank_account"
                    title="Bank Name"
                    options={relatedToValues || bankType ? bankAccountNameOptions : bankAccountData}
                />
            )}
            {selectedFilters.includes(FilterEnums.transactionId) && (
                <FilterInput
                    onChange={handleGlobalChange}
                    name="transactionId"
                    title="Transaction Id"
                />
            )}
            {selectedFilters.includes(FilterEnums.transactionIds) && (
                <FilterInput
                    onChange={handleGlobalChange}
                    name="transactionIds"
                    title="Transaction Ids"
                />
            )}
            {selectedFilters.includes(FilterEnums.reference_number) && (
                <FilterInput
                    onChange={handleGlobalChange}
                    title="Reference Number"
                    name="reference_number"
                />
            )}
            {selectedFilters.includes(FilterEnums.transaction_id) && (
                <FilterInput onChange={handleGlobalChange} title="Transaction Id" name="_id" />
            )}
            {selectedFilters.includes(FilterEnums.external_ref) && (
                <FilterInput onChange={handleGlobalChange} title="Ref." name="external_ref" />
            )}
            {selectedFilters.includes(FilterEnums.external_ref_id) && (
                <FilterInput
                    onChange={handleGlobalChange}
                    title="External Ref Id"
                    name="externalRefIds"
                />
            )}

            {selectedFilters.includes(FilterEnums.payout_export_format) && (
                <FilterSelect
                    handleChange={handleGlobalChange}
                    title="Format"
                    hideAllOption
                    name="format"
                    options={payoutExportFormatOptions}
                />
            )}
            {selectedFilters.includes(FilterEnums.amount) && (
                <FilterInput onChange={handleGlobalChange} title="Amount" name="amount" />
            )}
            {selectedFilters.includes(FilterEnums.transfer_type) && (
                <FilterSelect
                    title="Transfer Type"
                    options={TransferType}
                    name="type"
                />
            )}
            {selectedFilters.includes(FilterEnums.transfer_from) && (
                <FilterSelect
                    title="Transfer From"
                    options={userOptions}
                    name="fromUser"
                />
            )}
            {selectedFilters.includes(FilterEnums.transfer_to) && (
                <FilterSelect
                    title="Transfer To"
                    options={userOptions}
                    name="toUser"
                />
            )}
            {selectedFilters.includes(FilterEnums.user_type) && (
                <FilterSelect
                    title="User Type"
                    options={UserType}
                    name="userType"
                />
            )}

            {selectedFilters.includes(FilterEnums.batch_name) && (
                <FilterInput onChange={handleGlobalChange} title="Batch" name="batchId" />
            )}
            {selectedFilters.includes(FilterEnums.balance_type) && (
                <FilterSelect
                    handleChange={handleGlobalChange}
                    title="Type"
                    name="type"
                    options={balanceHistoryTypesOptions}
                />
            )}
            {selectedFilters.includes(FilterEnums.date_range) && (
                <DateRangePicker
                    onValidityChange={setAreDatesValid}
                    isRestrictedPage={props.isRestrictedPage}
                    onChange={handleGlobalChange}
                />
            )}
            {props.children}
        </FilterBox>
    );
}
