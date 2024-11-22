import {Box, Button, Typography} from '@mui/material';
import React from 'react';
import LimitCalculation from './limitCalculation';
import {RoleEnum} from '@/utils/enums/role';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import LaunchIcon from '@mui/icons-material/Launch';

interface Props {
    dailyIncome: number;
    dailyLimit: number;
    handleActivelyUploading: () => void;
}
const HeaderContent = (props: Props) => {
    const {dailyIncome, dailyLimit, handleActivelyUploading} = props;
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography sx={{mb: 3, fontWeight: '500', fontSize: '24px', ml: 1, mt: 3}}>
                    Account Details
                </Typography>
                <Button
                    onClick={handleActivelyUploading}
                    variant="contained"
                    sx={{
                        px: 2,
                        textTransform: 'capitalize',
                        visibility: 'hidden',
                    }}
                    endIcon={<LaunchIcon />}
                    color="primary"
                >
                    Uploading Accounts
                </Button>

                {!roles?.includes(RoleEnum?.ProcessingAccountsOnly) && (
                    <LimitCalculation dailyLimit={dailyLimit} dailyIncome={dailyIncome} />
                )}
            </Box>
        </>
    );
};

export default HeaderContent;
