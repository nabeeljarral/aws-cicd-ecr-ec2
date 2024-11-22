import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {useRouter} from 'next/router';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {CheckingEnum} from '@/utils/enums/checking';
import ManualChecking from '@/components/checking/manualChecking';
import RelatedTransaction from '@/components/checking/relatedTransaction';

const EditSettingPage = () => {
    const router = useRouter();
    const {name} = router.query;
    const checkingType: string = name?.toString() || '';
    return (
        <DashboardLayout>
            <Box sx={{flexGrow: 1}}>
                <Container maxWidth="lg" sx={{mt: 4}}>
                    <Typography variant="h5">{checkingType}</Typography>
                </Container>
            </Box>
            {checkingType === CheckingEnum.ManualCheck ? (
                <ManualChecking />
            ) : checkingType === CheckingEnum.RelatedTransaction ? (
                <RelatedTransaction />
            ) : (
                <RelatedTransaction />
            )}
        </DashboardLayout>
    );
};

export default EditSettingPage;
