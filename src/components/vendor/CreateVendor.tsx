import Container from '@mui/material/Container';
import {Box, Grid, TextField} from '@mui/material';
import React, {FormEvent, useState} from 'react';
import {theme} from '@/utils/theme';
import Typography from '@mui/material/Typography';
import {addVendor, syncVendorInPayCircle, syncVendorInZeal} from '@/utils/services/vendors';
import {useRouter} from 'next/router';
import {BANK_ACCOUNTS_ROUTE} from '@/utils/endpoints/routes';
import RelatedToInput from '@/components/inputs/relatedToInput';
import LoadingButton from '@mui/lab/LoadingButton';
import {IFilterVendorDto, IVendor} from '@/utils/interfaces/vendor.interface';
import awesomeAlert from '@/utils/functions/alert';

export const CreateVendor = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data: IFilterVendorDto = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        const res = await addVendor(data as IVendor);
        if (res?.name) {
            awesomeAlert({msg: 'Successfully Created'});
            await syncVendorInPayCircle(data as IVendor);
            await syncVendorInZeal(data as IVendor);
            router.push(BANK_ACCOUNTS_ROUTE);
        }
        setLoading(false);
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
                    <Grid item xs={12}>
                        <Typography sx={{my: 2}} variant="h5">
                            Create New vendor
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                size="small"
                                required
                                fullWidth
                                margin="normal"
                                id="name"
                                name="name"
                                label="Vendor Name"
                            />
                            <RelatedToInput hideAllOption />
                            <Box>
                                <LoadingButton
                                    loading={loading}
                                    type="submit"
                                    variant="contained"
                                    sx={{px: 10, mt: 2, textTransform: 'capitalize'}}
                                    color="primary"
                                >
                                    Submit
                                </LoadingButton>
                            </Box>
                        </form>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};
