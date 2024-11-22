import {Grid, Typography} from '@mui/material';
import React from 'react';
import KeyValuePair from '../../key-value-pair';
import {RoleEnum} from '@/utils/enums/role';
import {BankAccountTypesEnum} from '@/utils/enums/accountDetails.enums';
import BeneficiaryContent from './beneficiaryContent';
import ExtraAddedDetails from './extraAddedDetails';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {
    AccountDetailsChannels,
    BankAccountTypesOptions,
    bankTypesOptions,
} from '@/components/filter/options';
import {IOptionItem} from '@/components/filter/main/filterSelect';
import {User} from 'aws-sdk/clients/budgets';
import {Link} from '@mui/material';

interface Props {
    handleDailogClose: () => void;
    handleDailogClick: (e: any) => void;
    dailogAnchorEl: boolean;
    popupData: any;
    getAccountName: (statusId: any, options?: IOptionItem[]) => void | any;
    getRelatedToName: any;
    closingBalanceData: number | any;
    openViewDialog: boolean;
    handleClose: () => void;
    handleViewDialogClose: () => void;
}
const KeyValueContent = (props: Props) => {
    const {
        handleDailogClose,
        handleDailogClick,
        dailogAnchorEl,
        popupData,
        getAccountName,
        getRelatedToName,
        closingBalanceData,
        openViewDialog,
        handleClose,
        handleViewDialogClose,
    } = props;
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;

    return (
        <>
            <Grid container xs={8} sx={{borderRight: '2px dashed'}}>
                <Grid container spacing={2} sx={{ml: 4}}>
                    {roles?.includes(RoleEnum.AccountLoginDetails) && (
                        <>
                            <KeyValuePair
                                label="Account Type"
                                value={
                                    getAccountName(
                                        popupData?.accountType,
                                        BankAccountTypesOptions,
                                    ) || '-'
                                }
                            />
                            <KeyValuePair
                                label="Bank Type"
                                value={
                                    getAccountName(popupData?.bank_type, bankTypesOptions) || '-'
                                }
                            />
                            <KeyValuePair
                                label="Bank Name"
                                value={popupData?.bankId?.name || '-'}
                            />
                            <KeyValuePair
                                label="Bank Account Name"
                                value={popupData?.name || '-'}
                            />
                            <KeyValuePair
                                label="Bank Account Number:"
                                value={popupData?.number || '-'}
                            />
                            {popupData.accountType == BankAccountTypesEnum.payin && (
                                <KeyValuePair label="UPI Id" value={popupData?.upi_id || '-'} />
                            )}
                            {popupData.accountType == BankAccountTypesEnum.payin && (
                                <KeyValuePair
                                    label="Channel Name"
                                    value={
                                        getAccountName(
                                            popupData?.channel,
                                            AccountDetailsChannels,
                                        ) || '-'
                                    }
                                />
                            )}
                        </>
                    )}
                    {roles?.includes(RoleEnum.AccountPersonalDetails) && (
                        <>
                            {' '}
                            <KeyValuePair
                                label="Vendor Name"
                                value={popupData?.vendorId?.name || '-'}
                            />
                            <KeyValuePair
                                label="Daily Limit"
                                value={popupData?.daily_limit || '-'}
                            />
                            {popupData.accountType == BankAccountTypesEnum.payin && (
                                <KeyValuePair
                                    label="Related To"
                                    value={getRelatedToName(popupData?.userIds || [])}
                                />
                            )}
                            <KeyValuePair
                                label="Today Opening Balance"
                                value={popupData?.openingBalance?.balance || 0}
                            />
                        </>
                    )}
                    {roles?.includes(RoleEnum.AccountLoginDetails) && (
                        <>
                            {' '}
                            <KeyValuePair label="Login Id" value={popupData?.loginId || '-'} />
                            <KeyValuePair label="User Id" value={popupData?.username || '-'} />
                            <KeyValuePair label="Password" value={popupData?.password || '-'} />
                            <KeyValuePair
                                label="Transaction Password"
                                value={popupData.trxnPassword || '-'}
                            />
                            <KeyValuePair label="OTP Access" value={popupData.otpAccess || '-'} />
                            <KeyValuePair
                                label="Registered Phone No:"
                                value={popupData.registeredPhoneNo || '-'}
                            />
                            <Grid container sx={{m: 1.5}} xs={5}>
                                <Typography component="span" sx={{fontWeight: 600}}>
                                    Closing Balance:{' '}
                                </Typography>
                                <Typography>
                                    {closingBalanceData?.closing_balance
                                        ? Number(closingBalanceData?.closing_balance).toFixed(2)
                                        : 0}
                                </Typography>
                            </Grid>
                            <Grid container sx={{m: 1.5}} xs={5}>
                                <Typography component="span" sx={{fontWeight: 600}}>
                                    Bank Url:{' '}
                                </Typography>
                                <Typography
                                    component={Link}
                                    href={popupData?.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        display: 'block',
                                        maxWidth: '300px',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        overflowWrap: 'break-word',
                                        color: '#1A0DAB',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    {popupData.websiteUrl || '-'}
                                </Typography>
                            </Grid>
                            {popupData.accountType === BankAccountTypesEnum.payin && (
                                <BeneficiaryContent
                                    handleDailogClose={handleDailogClose}
                                    handleDailogClick={handleDailogClick}
                                    dailogAnchorEl={dailogAnchorEl}
                                    popupData={popupData}
                                />
                            )}
                        </>
                    )}
                    {roles?.includes(RoleEnum.ViewAccountOtherFields) && (
                        <>
                            <KeyValuePair
                                label="Security Question"
                                value={popupData.securityQuestion || '-'}
                            />
                            <KeyValuePair
                                label="Security Answer"
                                value={popupData.securityAnswer || '-'}
                            />
                        </>
                    )}

                    <ExtraAddedDetails
                        openViewDialog={openViewDialog}
                        handleClose={handleClose}
                        handleViewDialogClose={handleViewDialogClose}
                        popupData={popupData}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default KeyValueContent;
