import FilterSelect, {IOptionItem} from '@/components/filter/main/filterSelect';
import MultiSelect from '@/components/filter/main/multiSelect';
import {
    AccountDetailsChannels,
    AccountNature,
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
import {Box, Button, Grid, TextField, Typography} from '@mui/material';
import React from 'react';
import {useSelector} from 'react-redux';

interface Props {
    vendorsLoading: boolean;
    handleSelectChange: (name: string, value: any) => void;
    // account:BankAccountTypesEnum;
    formData: IBankAccount;
    banksLoading: boolean;
    bankOptions: IOptionItem[];
    handleInputChange: React.ChangeEvent<HTMLInputElement> | any;
    vendorOptions: IOptionItem[];
    bankAccountData: any;
    OpenKeyValueDailog: () => void;
    editData: IBankAccount | any;
    isEditAccountOtherFields: boolean | any;
    statusOptions: IOptionItem[];
    hasActiveDetails: any;
    OpenKeyValueViewDailog: () => void;
}
const EditForm = (props: Props) => {
    const {
        vendorsLoading,
        handleSelectChange,
        OpenKeyValueViewDailog,
        hasActiveDetails,
        statusOptions,
        isEditAccountOtherFields,
        formData,
        banksLoading,
        editData,
        bankOptions,
        handleInputChange,
        vendorOptions,
        bankAccountData,
        OpenKeyValueDailog,
    } = props;
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;

    return (
        <>
            <Grid item xs={12} sm={6} md={4}>
                <Box sx={{mt: 2}}>
                    <FilterSelect
                        marginType="normal"
                        title="Account Type"
                        required
                        margin={'unset'}
                        width="100%"
                        defaultValue={formData.accountType || BankAccountTypesEnum.payin}
                        loading={vendorsLoading}
                        handleChange={(newValue: string) =>
                            handleSelectChange('accountType', newValue)
                        }
                        options={BankAccountTypesOptions}
                        name="accountType"
                        hideAllOption={true}
                        disabled
                    />
                </Box>
            </Grid>
            {formData.accountType == 1 && (
                <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{mt: 2}}>
                        <FilterSelect
                            marginType="normal"
                            title="Channel Name"
                            required
                            margin={'unset'}
                            width="100%"
                            hideAllOption={true}
                            defaultValue={formData.channel}
                            handleChange={(newValue: string) =>
                                handleSelectChange('channel', newValue)
                            }
                            options={AccountDetailsChannels}
                            name="channel"
                            disabled={
                                isEditAccountOtherFields ||
                                editData?.status !== BankAccountStatusEnum.processing
                            }
                        />
                    </Box>
                </Grid>
            )}
            <Grid item xs={12} sm={6} md={4}>
                <Box sx={{mt: 2}}>
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
                <Box sx={{mt: 2}}>
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
                        disabled={
                            isEditAccountOtherFields ||
                            isEditAccountOtherFields ||
                            editData?.status !== BankAccountStatusEnum.processing
                        }
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
                                    : formData.bank_type === BankTypesEnum.OFCPAY
                                    ? 'Merchant Code (AID)'
                                    : formData.bank_type === BankTypesEnum.recopays
                                    ? 'Merchant Code'
                                    : formData.bank_type === BankTypesEnum.theUnionPay
                                    ? 'Account Id'
                                    : 'Merchant Id'
                            }
                            disabled={
                                isEditAccountOtherFields ||
                                (!roles?.includes(RoleEnum.Admin) &&
                                    !roles?.includes(RoleEnum.BankAccountUpdate))
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
                        disabled={
                            isEditAccountOtherFields ||
                            (!roles?.includes(RoleEnum.Admin) &&
                                !roles?.includes(RoleEnum.BankAccountUpdate))
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
                            disabled={
                                isEditAccountOtherFields ||
                                (!roles?.includes(RoleEnum.Admin) &&
                                    !roles?.includes(RoleEnum.BankAccountUpdate))
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
                            disabled={
                                isEditAccountOtherFields ||
                                (!roles?.includes(RoleEnum.Admin) &&
                                    !roles?.includes(RoleEnum.BankAccountUpdate))
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
                            disabled={
                                isEditAccountOtherFields ||
                                (!roles?.includes(RoleEnum.Admin) &&
                                    !roles?.includes(RoleEnum.BankAccountUpdate))
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
                            disabled={
                                isEditAccountOtherFields ||
                                (!roles?.includes(RoleEnum.Admin) &&
                                    !roles?.includes(RoleEnum.BankAccountUpdate))
                            }
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
                            disabled={
                                isEditAccountOtherFields ||
                                (!roles?.includes(RoleEnum.Admin) &&
                                    !roles?.includes(RoleEnum.BankAccountUpdate))
                            }
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
                        disabled={
                            isEditAccountOtherFields ||
                            (!roles?.includes(RoleEnum.Admin) &&
                                !roles?.includes(RoleEnum.BankAccountUpdate))
                        }
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
                            disabled={
                                isEditAccountOtherFields ||
                                (!roles?.includes(RoleEnum.Admin) &&
                                    !roles?.includes(RoleEnum.BankAccountUpdate))
                            }
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
                            disabled={
                                isEditAccountOtherFields ||
                                (!roles?.includes(RoleEnum.Admin) &&
                                    !roles?.includes(RoleEnum.BankAccountUpdate))
                            }
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
                            disabled={
                                isEditAccountOtherFields ||
                                (!roles?.includes(RoleEnum.Admin) &&
                                    !roles?.includes(RoleEnum.BankAccountUpdate))
                            }
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
                            disabled={
                                isEditAccountOtherFields ||
                                (!roles?.includes(RoleEnum.Admin) &&
                                    !roles?.includes(RoleEnum.BankAccountUpdate))
                            }
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
                            disabled={
                                isEditAccountOtherFields ||
                                (!roles?.includes(RoleEnum.Admin) &&
                                    !roles?.includes(RoleEnum.BankAccountUpdate))
                            }
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
                            disabled={
                                isEditAccountOtherFields ||
                                (!roles?.includes(RoleEnum.Admin) &&
                                    !roles?.includes(RoleEnum.BankAccountUpdate))
                            }
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
                            disabled={
                                isEditAccountOtherFields ||
                                (!roles?.includes(RoleEnum.Admin) &&
                                    !roles?.includes(RoleEnum.BankAccountUpdate))
                            }
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
                            disabled={
                                isEditAccountOtherFields ||
                                (!roles?.includes(RoleEnum.Admin) &&
                                    !roles?.includes(RoleEnum.BankAccountUpdate))
                            }
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
                    disabled={
                        isEditAccountOtherFields ||
                        (!roles?.includes(RoleEnum.Admin) &&
                            !roles?.includes(RoleEnum.BankAccountUpdate))
                    }
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
                    disabled={
                        isEditAccountOtherFields ||
                        editData?.status !== BankAccountStatusEnum.processing
                    }
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Box sx={{mt: 1}}>
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
                        disabled={
                            isEditAccountOtherFields ||
                            (!roles?.includes(RoleEnum.Admin) &&
                                !roles?.includes(RoleEnum.BankAccountUpdate))
                        }
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
                        disabled={
                            isEditAccountOtherFields ||
                            (!roles?.includes(RoleEnum.Admin) &&
                                !roles?.includes(RoleEnum.BankAccountUpdate))
                        }
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
                        hideAllOption={true}
                        defaultValue={formData.vendorId}
                        loading={vendorsLoading}
                        handleChange={(newValue: string) =>
                            handleSelectChange('vendorId', newValue)
                        }
                        options={vendorOptions}
                        name="vendorId"
                        disabled={isEditAccountOtherFields || !roles?.includes(RoleEnum.Admin)}
                    />
                </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Box sx={{mt: -1}}>
                    <TextField
                        size="small"
                        required
                        fullWidth
                        margin="normal"
                        type="number"
                        id="daily_limit"
                        name="daily_limit"
                        value={formData.daily_limit}
                        onChange={handleInputChange}
                        label="Daily Limit"
                        disabled={
                            isEditAccountOtherFields ||
                            (!roles?.includes(RoleEnum.Admin) &&
                                !roles?.includes(RoleEnum.BankAccountUpdate))
                        }
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
                        value={formData.limit_percentage}
                        onChange={handleInputChange}
                        label="Limit Percentage"
                        disabled={
                            isEditAccountOtherFields ||
                            (!roles?.includes(RoleEnum.Admin) &&
                                !roles?.includes(RoleEnum.BankAccountUpdate))
                        }
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
                            disabled={
                                isEditAccountOtherFields ||
                                !roles?.includes(RoleEnum.BankAccountClosingBalance) ||
                                !roles?.includes(RoleEnum.Admin)
                            }
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
                        defaultValue={
                            (editData?.status === BankAccountStatusEnum.processing &&
                                BankAccountStatusEnum.readyToLive) ||
                            formData.status
                        }
                        loading={vendorsLoading}
                        handleChange={(newValue: boolean) => handleSelectChange('status', newValue)}
                        options={statusOptions}
                        name="status"
                        disabled={
                            isEditAccountOtherFields ||
                            editData?.status === BankAccountStatusEnum.hold ||
                            editData?.status === BankAccountStatusEnum.processing
                                ? true
                                : !roles?.includes(RoleEnum.Admin) &&
                                  !roles?.includes(RoleEnum.BankAccountCustomUpdate) &&
                                  !roles?.includes(RoleEnum.BankAccountUpdate)
                        }
                    />
                </Box>
                {editData?.status === BankAccountStatusEnum.processing && (
                    <Typography
                        sx={{
                            fontSize: '0.8rem',
                            lineHeight: '1.5',
                            color: '#6b6b6b',
                        }}
                    >
                        (If you edit the processing account will updates its status to 'Ready to
                        Live')
                    </Typography>
                )}
            </Grid>
            {formData?.status === BankAccountStatusEnum.processing && (
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
                            disabled={isEditAccountOtherFields}
                        />
                    </Box>
                </Grid>
            )}
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
                        disabled={
                            isEditAccountOtherFields ||
                            (!roles?.includes(RoleEnum.Admin) &&
                                !roles?.includes(RoleEnum.BankAccountUpdate))
                        }
                    />
                </Box>
            </Grid>
            {formData.accountType == BankAccountTypesEnum.payin && (
                <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{mt: -1}}>
                        <TextField
                            size="small"
                            fullWidth
                            margin="normal"
                            type="text"
                            required
                            id="openingBalance"
                            name="openingBalance"
                            value={formData.openingBalance}
                            onChange={handleInputChange}
                            label="Today Opening Balance"
                            disabled={
                                isEditAccountOtherFields ||
                                (!roles?.includes(RoleEnum.Admin) &&
                                    !roles?.includes(RoleEnum.BankAccountUpdate))
                            }
                        />
                    </Box>
                </Grid>
            )}
            {formData.accountType === BankAccountTypesEnum.payin && (
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={formData.status === BankAccountStatusEnum.processing && 8}
                >
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
                            disabled={isEditAccountOtherFields}
                        />
                    </Box>
                </Grid>
            )}
            {formData.accountType == BankAccountTypesEnum.payin &&
                formData.channel === ChannelsEnum.payz365 && (
                    <Grid item xs={12} sm={12} md={12}>
                        <Box sx={{mt: 1}}>
                            <RelatedToMultiInput
                                relatedToInitialValue={formData.relatedTo}
                                multiselect={true}
                                hideAllOption={true}
                                globalOption
                                handleChange={(value) => console.log(value)}
                                name="relatedTo"
                                disabled={
                                    isEditAccountOtherFields ||
                                    (!roles?.includes(RoleEnum.Admin) &&
                                        !roles?.includes(RoleEnum.BankAccountCustomUpdate) &&
                                        !roles?.includes(RoleEnum.BankAccountUpdate))
                                }
                            />
                        </Box>
                    </Grid>
                )}
            {hasActiveDetails ? (
                <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{mt: -1}}>
                        <Button
                            onClick={OpenKeyValueViewDailog}
                            variant="outlined"
                            sx={{
                                px: 2,
                                mt: 2,
                                textTransform: 'capitalize',
                            }}
                            color="secondary"
                            disabled={!roles?.includes(RoleEnum.BankAccountUpdateKeyValue)}
                        >
                            View Added Details
                        </Button>
                    </Box>{' '}
                </Grid>
            ) : (
                <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{mt: -1}}>
                        <Button
                            onClick={OpenKeyValueDailog}
                            variant="outlined"
                            sx={{
                                px: 2,
                                mt: 2,
                                textTransform: 'capitalize',
                            }}
                            color="secondary"
                            disabled={!roles?.includes(RoleEnum.BankAccountUpdateKeyValue)}
                        >
                            Add More Details
                        </Button>
                    </Box>
                </Grid>
            )}
        </>
    );
};

export default EditForm;
