import {RootState} from '@/store';
import axiosInstance from '@/utils/axios';
import {BANK_ACCOUNT, BANK_AMOUNT_RANGES} from '@/utils/endpoints/endpoints';
import {RoleEnum} from '@/utils/enums/role';
import {
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    Typography,
} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import AssuredWorkloadTwoToneIcon from '@mui/icons-material/AssuredWorkloadTwoTone';
import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import {IUpiItem} from '../../setting-analytics';
import {IBankAmountRange} from './bankRangeDialog';

type BankAmountRelatedRangesProps = {
    openDialog?: boolean;
    selectedBankAccountIds: string[];
    setSelectedBankAccountIds: React.Dispatch<React.SetStateAction<string[]>>;
    upis: IUpiItem[];
    availableRangedBankAcounts: IUpiItem[];
    setAvailableRangedBankAcounts: React.Dispatch<React.SetStateAction<IUpiItem[]>>;
};

function BankAmountRelatedRanges({
    openDialog,
    selectedBankAccountIds,
    setSelectedBankAccountIds,
    upis,
    availableRangedBankAcounts,
    setAvailableRangedBankAcounts,
}: BankAmountRelatedRangesProps) {
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const isAllowedToChangeBankAmountRange = roles?.includes(RoleEnum.BankAccountAmountRange);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked, value} = event.target;
        const availableBankIds = availableRangedBankAcounts.map((upi) => upi?.id);
        const bankAccountId = value; // This is the ID of the bank account
        if (checked && bankAccountId) {
            setSelectedBankAccountIds((prev) => [
                ...prev.filter((accountId) => availableBankIds.includes(accountId)), //only keep the available ids rest will be deleted
                bankAccountId,
            ]);
            console.log(selectedBankAccountIds);
        } else if (availableBankIds.includes(bankAccountId) && bankAccountId) {
            setSelectedBankAccountIds((prev) =>
                prev.filter(
                    (accountId) =>
                        accountId !== bankAccountId && availableBankIds.includes(accountId),
                ),
            );
            console.log(selectedBankAccountIds);
        }
    };

    useEffect(() => {
        if (upis) {
            const rangedActiveUpis = upis.filter(
                (upi) =>
                    upi?.bankAmountRange !== undefined &&
                    typeof upi?.bankAmountRange !== 'string' &&
                    upi?.bankAmountRange?.name !== 'All',
            );
            setAvailableRangedBankAcounts(rangedActiveUpis); // Reset the selected accounts if the dialog is opened
        }
    }, [upis, openDialog]);

    return (
        <Grid item xs={12} sx={{mt: 2}}>
            <Box sx={{px: 2, mt: 1, border: '1px solid #ccc', borderRadius: '8px', p: 2}}>
                <Typography sx={{mb: 2}}>
                    <AssuredWorkloadTwoToneIcon /> Ranged UPIs
                </Typography>
                {isAllowedToChangeBankAmountRange ? (
                    <FormControl component="fieldset" fullWidth>
                        <Grid container xs={12} spacing={1}>
                            {availableRangedBankAcounts &&
                                availableRangedBankAcounts.map((bankAccount) => {
                                    const bAccount =
                                        typeof bankAccount !== 'string'
                                            ? (bankAccount as IUpiItem)
                                            : null;

                                    const bankRange =
                                        typeof bAccount?.bankAmountRange !== 'string' &&
                                        bAccount?.bankAmountRange !== undefined
                                            ? (bAccount.bankAmountRange as IBankAmountRange)
                                            : null;
                                    return (
                                        bAccount &&
                                        typeof bankAccount !== 'string' && (
                                            <Grid item key={bAccount.id}>
                                                <FormControlLabel
                                                    value={bAccount.id}
                                                    name=""
                                                    control={
                                                        <Checkbox
                                                            onChange={handleInputChange}
                                                            value={bAccount.id}
                                                            checked={
                                                                bAccount &&
                                                                selectedBankAccountIds.includes(
                                                                    bAccount.id as string,
                                                                )
                                                            }
                                                        />
                                                    }
                                                    label={`${bankRange?.name}: ${bAccount?.upi_id} | ${bAccount?.name}`}
                                                />
                                            </Grid>
                                        )
                                    );
                                })}
                        </Grid>
                    </FormControl>
                ) : (
                    <>
                        {availableRangedBankAcounts.map(
                            (bAccount: any) =>
                                selectedBankAccountIds.includes(bAccount._id) && (
                                    <Box key={bAccount._id}>
                                        {`${
                                            (bAccount?.bankAmountRange as IBankAmountRange)?.name
                                        }: ${(bAccount?.active_upi_id as IBankAccount)?.upi_id} | ${
                                            (bAccount?.active_upi_id as IBankAccount)?.name
                                        }`}
                                    </Box>
                                ),
                        )}
                    </>
                )}
            </Box>
        </Grid>
    );
}

export default BankAmountRelatedRanges;
