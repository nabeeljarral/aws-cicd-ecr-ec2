import {RoleEnum} from '@/utils/enums/role';
import {Button, Grid} from '@mui/material';
import React from 'react';
import RangeFormDialog from '../bankRangeDialog';
import {CREATE_ACCOUNTS_DETAILS_ROUTE} from '@/utils/endpoints/routes';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {useRouter} from 'next/router';

const CreateBankAccount = () => {
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();

    return (
        <>
            <Grid container xs={12}>
                {(roles?.includes(RoleEnum.BankAccountCreate) ||
                    roles?.includes(RoleEnum.BankAccountSetAmountRanges)) && (
                    <Grid item xs={12} sx={{display: 'flex', justifyContent: 'end', gap: 3, mt: 2}}>
                        {roles?.includes(RoleEnum.BankAccountSetAmountRanges) && (
                            <RangeFormDialog />
                        )}
                        {roles?.includes(RoleEnum.BankAccountCreate) && (
                            <Button
                                color="primary"
                                variant="contained"
                                sx={{textTransform: 'capitalize'}}
                                onClick={() => router.push(CREATE_ACCOUNTS_DETAILS_ROUTE)} // Update the route path
                            >
                                Create Bank Account
                            </Button>
                        )}
                    </Grid>
                )}
            </Grid>
        </>
    );
};

export default CreateBankAccount;
