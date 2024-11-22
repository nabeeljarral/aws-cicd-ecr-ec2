import FilterSelect, {IOptionItem} from '@/components/filter/main/filterSelect';
import MultiSelect from '@/components/filter/main/multiSelect';
import {
    AccountDetailsChannels,
    AccountNature,
    bankAccountStatusOptionsFilter,
    BankAccountTypesOptions,
    bankTypesOptions,
} from '@/components/filter/options';
import RelatedToMultiInput from '@/components/inputs/relatedToMultiInput';
import {RootState} from '@/store';
import {
    BankAccountStatusEnum,
    BankAccountTypesEnum,
    ChannelsEnum,
} from '@/utils/enums/accountDetails.enums';
import {BankTypesEnum} from '@/utils/enums/bankTypes.enum';
import {RoleEnum} from '@/utils/enums/role';
import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import {Box, Button, Grid, TextField} from '@mui/material';
import React from 'react';
import {useSelector} from 'react-redux';

interface Props {
    vendorsLoading: boolean;
    handleSelectChange: any;
    account: BankAccountTypesEnum;
    formData: IBankAccount;
    banksLoading: boolean;
    bankOptions: IOptionItem[];
    handleInputChange: React.ChangeEvent<HTMLInputElement> | any;
    vendorOptions: IOptionItem[];
    bankAccountData: any;
    OpenKeyValueDailog: () => void;
}
const CreateForm = (props: Props) => {
    const {
        vendorsLoading,
        handleSelectChange,
        account,
        formData,
        banksLoading,
        bankOptions,
        handleInputChange,
        vendorOptions,
        bankAccountData,
        OpenKeyValueDailog,
    } = props;
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const userId = useSelector((state: RootState) => state.auth.user)?._id;
    return (
        <>
            <Grid item xs={12} sm={6} md={4}>
                <Box sx={{mt: 1}}>
                    <FilterSelect
                        marginType="normal"
                        title="Account Type"
                        required
                        margin={'unset'}
                        width="100%"
                        defaultValue={BankAccountTypesEnum.payin}
                        loading={vendorsLoading}
                        handleChange={(newValue: string) =>
                            handleSelectChange('accountType', newValue)
                        }
                        options={BankAccountTypesOptions}
                        name="accountType"
                        hideAllOption={true}
                    />
                </Box>
            </Grid>

            {account === BankAccountTypesEnum.payin && (
                <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{mt: 1}}>
                        <FilterSelect
                            marginType="normal"
                            title="Channel Name"
                            margin={'unset'}
                            width="100%"
                            hideAllOption={true}
                            defaultValue={formData.channel}
                            handleChange={(newValue: string) =>
                                handleSelectChange('channel', newValue)
                            }
                            options={AccountDetailsChannels}
                            name="channel"
                        />
                    </Box>
                </Grid>
            )}

            <Grid item xs={12} sm={6} md={4}>
                <Box sx={{mt: 1}}>
                    <FilterSelect
                        marginType="normal"
                        title="Bank Type"
                        margin={'unset'}
                        hideAllOption
                        width="100%"
                        defaultValue={formData.bank_type}
                        loading={vendorsLoading}
                        handleChange={(newValue: BankTypesEnum) =>
                            handleSelectChange('bank_type', newValue)
                        }
                        options={bankTypesOptions}
                        name="bank_type"
                        disabled
                    />
                </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Box
                    sx={{
                        mt: formData.accountType === BankAccountTypesEnum.payout ? 1 : 2,
                    }}
                >
                    <FilterSelect
                        marginType="normal"
                        title="Bank Name"
                        required
                        margin={'unset'}
                        width="100%"
                        hideAllOption={true}
                        defaultValue={formData.bankId}
                        loading={banksLoading}
                        handleChange={(newValue: string) => handleSelectChange('bankId', newValue)}
                        options={bankOptions}
                        name="bankId"
                    />
                </Box>
            </Grid>
            {
                // Not Default Type
                (formData.bank_type === BankTypesEnum.default ||
                    formData.bank_type === BankTypesEnum.recopays ||
                    formData.bank_type === BankTypesEnum.payWing ||
                    formData.bank_type === BankTypesEnum.tappay ||
                    formData.bank_type === BankTypesEnum.nexapayUpiCollect ||
                    formData.bank_type === BankTypesEnum.firstPe ||
                    formData.bank_type === BankTypesEnum.airpay ||
                    formData.bank_type === BankTypesEnum.xettle ||
                    formData.bank_type === BankTypesEnum.pay365 ||
                    formData.bank_type === BankTypesEnum.pay365New ||
                    formData.bank_type === BankTypesEnum.heksaPay ||
                    formData.bank_type === BankTypesEnum.letspe ||
                    formData.bank_type === BankTypesEnum.payTMe ||
                    formData.bank_type === BankTypesEnum.finopay ||
                    formData.bank_type === BankTypesEnum.finopayStaticQR ||
                    formData.bank_type === BankTypesEnum.OFCPAY ||
                    formData.bank_type === BankTypesEnum.theUnionPay) && (
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            size="small"
                            fullWidth
                            required={
                                formData.bank_type === BankTypesEnum.finopay ||
                                formData.bank_type === BankTypesEnum.finopayStaticQR ||
                                formData.bank_type === BankTypesEnum.OFCPAY
                            }
                            margin="normal"
                            type="text"
                            id="merchant_id"
                            name="merchant_id"
                            value={formData.merchant_id}
                            onChange={handleInputChange}
                            label={
                                formData.bank_type === BankTypesEnum.pay365
                                    ? 'Key Id'
                                    : formData.bank_type === BankTypesEnum.pay365New
                                    ? 'API Key'
                                    : formData.bank_type === BankTypesEnum.heksaPay
                                    ? 'Auth ID'
                                    : formData.bank_type === BankTypesEnum.letspe
                                    ? 'Ter No'
                                    : formData.bank_type === BankTypesEnum.nexapayUpiCollect
                                    ? 'Pay Id'
                                    : formData.bank_type === BankTypesEnum.xettle ||
                                      formData.bank_type === BankTypesEnum.finopay ||
                                      formData.bank_type === BankTypesEnum.finopayStaticQR
                                    ? 'Client-Id'
                                    : // : formData.bank_type ===
                                    //   BankTypesEnum.starpaisa
                                    // ? 'Username/Email'
                                    formData.bank_type === BankTypesEnum.recopays
                                    ? 'Merchant Code'
                                    : formData.bank_type === BankTypesEnum.OFCPAY
                                    ? 'Merchant Code (AID)'
                                    : formData.bank_type === BankTypesEnum.theUnionPay
                                    ? 'Account Id'
                                    : 'Merchant Id'
                            }
                        />
                    </Grid>
                )
            }
            {(formData.bank_type === BankTypesEnum.pay365 ||
                formData.bank_type === BankTypesEnum.pay365New ||
                formData.bank_type === BankTypesEnum.heksaPay ||
                formData.bank_type === BankTypesEnum.letspe ||
                formData.bank_type === BankTypesEnum.payTMe ||
                formData.bank_type === BankTypesEnum.firstPe ||
                formData.bank_type === BankTypesEnum.nexapayUpiCollect ||
                formData.bank_type === BankTypesEnum.xettle ||
                formData.bank_type === BankTypesEnum.airpay ||
                formData.bank_type === BankTypesEnum.payWing ||
                formData.bank_type === BankTypesEnum.recopays ||
                // formData.bank_type === BankTypesEnum.starpaisa ||
                formData.bank_type === BankTypesEnum.finopay ||
                formData.bank_type === BankTypesEnum.finopayStaticQR ||
                formData.bank_type === BankTypesEnum.OFCPAY ||
                formData.bank_type === BankTypesEnum.theUnionPay) && (
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        size="small"
                        fullWidth
                        required={
                            formData.bank_type === BankTypesEnum.finopay ||
                            formData.bank_type === BankTypesEnum.finopayStaticQR ||
                            formData.bank_type === BankTypesEnum.OFCPAY
                        }
                        margin="normal"
                        type="text"
                        id="payin_secret_key"
                        name="payin_secret_key"
                        value={formData.payin_secret_key}
                        onChange={handleInputChange}
                        label={
                            formData.bank_type === BankTypesEnum.pay365
                                ? 'Secret Key'
                                : formData.bank_type === BankTypesEnum.recopays
                                ? 'Token'
                                : formData.bank_type === BankTypesEnum.pay365New
                                ? 'API Secret'
                                : formData.bank_type === BankTypesEnum.heksaPay
                                ? 'Auth Key'
                                : formData.bank_type === BankTypesEnum.letspe
                                ? 'Public Key'
                                : formData.bank_type === BankTypesEnum.OFCPAY
                                ? 'AKEY'
                                : formData.bank_type === BankTypesEnum.nexapayUpiCollect
                                ? 'Merchant Hosted Encryption Key'
                                : formData.bank_type === BankTypesEnum.xettle ||
                                  formData.bank_type === BankTypesEnum.finopay ||
                                  formData.bank_type === BankTypesEnum.finopayStaticQR
                                ? 'Client-Secret'
                                : formData.bank_type === BankTypesEnum.theUnionPay
                                ? 'Access Token'
                                : // : formData.bank_type ===
                                  //   BankTypesEnum.starpaisa
                                  // ? 'Password'
                                  'Payin Secret Key'
                        }
                    />
                </Grid>
            )}
            {(formData.bank_type === BankTypesEnum.finopay ||
                formData.bank_type === BankTypesEnum.finopayStaticQR) && (
                <>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            size="small"
                            fullWidth
                            margin="normal"
                            type="text"
                            id="aes_encryption_iv"
                            name="aes_encryption_iv"
                            value={formData.aes_encryption_iv}
                            onChange={handleInputChange}
                            label="AES Encryption IV"
                            required={
                                formData.bank_type === BankTypesEnum.finopay ||
                                formData.bank_type === BankTypesEnum.finopayStaticQR
                            }
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            size="small"
                            fullWidth
                            margin="normal"
                            type="text"
                            id="aes_encryption_key"
                            name="aes_encryption_key"
                            value={formData.aes_encryption_key}
                            onChange={handleInputChange}
                            label="AES Encryption Key"
                            required={
                                formData.bank_type === BankTypesEnum.finopay ||
                                formData.bank_type === BankTypesEnum.finopayStaticQR
                            }
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            size="small"
                            fullWidth
                            margin="normal"
                            type="text"
                            id="kyc_mobile_number"
                            name="kyc_mobile_number"
                            value={formData.kyc_mobile_number}
                            onChange={handleInputChange}
                            label="Mobile Number (Provided during the KYC process)"
                            required={
                                formData.bank_type === BankTypesEnum.finopay ||
                                formData.bank_type === BankTypesEnum.finopayStaticQR
                            }
                        />
                    </Grid>
                </>
            )}
            {formData.bank_type === BankTypesEnum.airpay && (
                //  || formData.bank_type === BankTypesEnum.starpaisa
                <>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            size="small"
                            fullWidth
                            margin="normal"
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            label="Username"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            size="small"
                            fullWidth
                            margin="normal"
                            type="text"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            label="Password"
                        />
                    </Grid>
                </>
            )}
            {formData.bank_type === BankTypesEnum.nexapayUpiCollect && (
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        size="small"
                        fullWidth
                        margin="normal"
                        type="text"
                        id="request_salt_key"
                        name="request_salt_key"
                        value={formData.request_salt_key}
                        onChange={handleInputChange}
                        label="Salt Key"
                    />
                </Grid>
            )}
            {(formData.bank_type === BankTypesEnum.tappay ||
                formData.bank_type === BankTypesEnum.pay365) && (
                <>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            size="small"
                            fullWidth
                            margin="normal"
                            type="text"
                            id="request_hash_key"
                            name="request_hash_key"
                            value={formData.request_hash_key}
                            onChange={handleInputChange}
                            label="Request Hash Key"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            size="small"
                            fullWidth
                            margin="normal"
                            type="text"
                            id="request_salt_key"
                            name="request_salt_key"
                            value={formData.request_salt_key}
                            onChange={handleInputChange}
                            label="Request Salt Key"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            size="small"
                            fullWidth
                            margin="normal"
                            type="text"
                            id="response_hash_key"
                            name="response_hash_key"
                            value={formData.response_hash_key}
                            onChange={handleInputChange}
                            label="Response Hash Key"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            size="small"
                            fullWidth
                            margin="normal"
                            type="text"
                            id="response_salt_key"
                            name="response_salt_key"
                            value={formData.response_salt_key}
                            onChange={handleInputChange}
                            label="Response Salt Key"
                        />
                    </Grid>
                </>
            )}
            {formData.bank_type === BankTypesEnum.pay365 && (
                <>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            size="small"
                            fullWidth
                            margin="normal"
                            type="text"
                            id="aes_request_key"
                            name="aes_request_key"
                            value={formData.aes_request_key}
                            onChange={handleInputChange}
                            label={'AES Request Key'}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            size="small"
                            fullWidth
                            margin="normal"
                            type="text"
                            id="aes_response_key"
                            name="aes_response_key"
                            value={formData.aes_response_key}
                            onChange={handleInputChange}
                            label={'AES Request Key'}
                        />
                    </Grid>
                </>
            )}
            {formData.bank_type === BankTypesEnum.pay365New && (
                <>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            size="small"
                            fullWidth
                            margin="normal"
                            type="text"
                            id="request_hash_key"
                            name="request_hash_key"
                            value={formData.request_hash_key}
                            onChange={handleInputChange}
                            label="Request API Hash"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            size="small"
                            fullWidth
                            margin="normal"
                            type="text"
                            id="response_hash_key"
                            name="response_hash_key"
                            value={formData.response_hash_key}
                            onChange={handleInputChange}
                            label={'Response API Hash'}
                        />
                    </Grid>
                </>
            )}
            <Grid item xs={12} sm={6} md={4}>
                <TextField
                    size="small"
                    fullWidth
                    margin="normal"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    label="Bank Account Name"
                />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
                <TextField
                    size="small"
                    required
                    fullWidth
                    margin="normal"
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    label="Bank Account Number"
                />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
                <Box
                    sx={{
                        mt: formData.accountType === BankAccountTypesEnum.payout ? 2 : 1,
                    }}
                >
                    <FilterSelect
                        marginType="normal"
                        title="Account Nature"
                        margin={'unset'}
                        width="100%"
                        hideAllOption={true}
                        defaultValue={formData.accountNature}
                        loading={banksLoading}
                        handleChange={(newValue: string) =>
                            handleSelectChange('accountNature', newValue)
                        }
                        options={AccountNature}
                        name="accountNature"
                    />
                </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Box sx={{mt: -1}}>
                    <TextField
                        size="small"
                        fullWidth
                        margin="normal"
                        id="customerID"
                        name="customerID"
                        value={formData.customerID}
                        onChange={handleInputChange}
                        label="Customer ID"
                    />
                </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
                <Box sx={{mt: 1}}>
                    <FilterSelect
                        marginType="normal"
                        title="Vendor Name"
                        required
                        margin={'unset'}
                        width="100%"
                        defaultValue={formData.vendorId}
                        loading={vendorsLoading}
                        handleChange={(newValue: string) =>
                            handleSelectChange('vendorId', newValue)
                        }
                        options={vendorOptions}
                        name="vendorId"
                        hideAllOption={true}
                    />
                </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
                <Box sx={{mt: -1}}>
                    <TextField
                        size="small"
                        fullWidth
                        margin="normal"
                        type="number"
                        id="daily_limit"
                        name="daily_limit"
                        value={formData.daily_limit}
                        onChange={handleInputChange}
                        label="Daily Limit"
                    />
                </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Box sx={{mt: -1}}>
                    <TextField
                        size="small"
                        fullWidth
                        margin="normal"
                        type="number"
                        id="limit_percentage"
                        name="limit_percentage"
                        value={formData?.limit_percentage}
                        onChange={handleInputChange}
                        label="Limit Percentage"
                    />
                </Box>
            </Grid>
            {BankAccountTypesEnum.payout === formData.accountType && (
                <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{mt: -1}}>
                        <TextField
                            size="small"
                            fullWidth
                            margin="normal"
                            type="number"
                            id="closing_balance"
                            name="closing_balance"
                            value={formData.closing_balance}
                            onChange={handleInputChange}
                            label="Closing Balance"
                        />
                    </Box>
                </Grid>
            )}
            <Grid item xs={12} sm={6} md={4}>
                <Box sx={{mt: 1}}>
                    <FilterSelect
                        marginType="normal"
                        title="Status"
                        required
                        margin={'unset'}
                        width="100%"
                        hideAllOption={true}
                        defaultValue={formData.status || BankAccountStatusEnum.processing}
                        loading={vendorsLoading}
                        handleChange={(newValue: boolean) => handleSelectChange('status', newValue)}
                        options={bankAccountStatusOptionsFilter}
                        name="status"
                        disabled
                    />
                </Box>
            </Grid>

            <input type="hidden" name="createdBy" value={userId} />
            <Grid item xs={12} sm={6} md={4}>
                <Box sx={{mt: -1}}>
                    <TextField
                        size="small"
                        fullWidth
                        margin="normal"
                        type="text"
                        id="remark"
                        name="remark"
                        value={formData.remark}
                        onChange={handleInputChange}
                        required
                        label="Remarks"
                    />
                </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Box sx={{mt: -1}}>
                    <TextField
                        size="small"
                        fullWidth
                        margin="normal"
                        type="text"
                        id="websiteUrl"
                        name="websiteUrl"
                        value={formData?.websiteUrl}
                        onChange={handleInputChange}
                        label="Bank Url"
                    />
                </Box>
            </Grid>
            {formData.accountType === BankAccountTypesEnum.payin && (
                <Grid item xs={12} sm={8} md={8}>
                    <Box sx={{mt: 1}}>
                        <MultiSelect
                            marginType="normal"
                            title="Beneficiary Accounts"
                            required
                            margin={'unset'}
                            width="100%"
                            defaultValue={formData.beneficiaryAccounts}
                            handleChange={(newValue: string) =>
                                handleSelectChange('beneficiaryAccounts', newValue)
                            }
                            options={bankAccountData}
                            name="beneficiaryAccounts"
                            hideAllOption={true}
                        />
                    </Box>
                </Grid>
            )}
            <input type="hidden" name="createdBy" value={userId} />
            <Grid item xs={12} sm={6} md={4}>
                <Box sx={{mt: -1}}>
                    <Button
                        onClick={OpenKeyValueDailog}
                        variant="outlined"
                        sx={{px: 2, mt: 2, textTransform: 'capitalize'}}
                        color="secondary"
                        disabled={!roles?.includes(RoleEnum.BankAccountUpdateKeyValue)}
                    >
                        Add More Details
                    </Button>
                </Box>
            </Grid>
            {formData.accountType == BankAccountTypesEnum.payin &&
                formData.channel === ChannelsEnum.payz365 && (
                    <Grid item xs={12} sm={8} md={8}>
                        <Box sx={{mt: 1}}>
                            <RelatedToMultiInput
                                relatedToInitialValue={formData.relatedTo}
                                multiselect={true}
                                hideAllOption={true}
                                name="relatedTo"
                                globalOption={true}
                                disabled
                            />
                        </Box>
                    </Grid>
                )}
            {formData.accountType == BankAccountTypesEnum.payin && (
                <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{mt: -1}}>
                        <TextField
                            size="small"
                            fullWidth
                            margin="normal"
                            required
                            type="text"
                            id="openingBalance"
                            name="openingBalance"
                            value={formData.openingBalance}
                            onChange={handleInputChange}
                            label="Today Opening Balance"
                        />
                    </Box>
                </Grid>
            )}
        </>
    );
};

export default CreateForm;
