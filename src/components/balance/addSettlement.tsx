import Container from '@mui/material/Container';
import {Box, Button, CircularProgress, Grid, TextField} from '@mui/material';
import React, {useState} from 'react';
import {theme} from '@/utils/theme';
import Typography from '@mui/material/Typography';
import awesomeAlert from '@/utils/functions/alert';
import {useRouter} from 'next/router';
import {BALANCE_HISTORY_ROUTE} from '@/utils/endpoints/routes';
import {IBalance} from '@/utils/interfaces/balance.interface';
import {addSettlement as updateSettlement} from '@/utils/services/balance';
import RelatedToInput from '@/components/inputs/relatedToInput';


const initialFormData: Partial<IBalance> = {};

export const AddSettlement = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<IBalance>>(initialFormData);
    const router = useRouter();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const submitUpdateBalance = async (payload: Partial<IBalance>) => {
        setLoading(true);
        const res = await updateSettlement(payload);
        setLoading(false);
        // @ts-ignore
        if (!res?.message) {
            awesomeAlert({msg: 'Successfully Updated'});
            await router.push(BALANCE_HISTORY_ROUTE);
        }
        return res;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await submitUpdateBalance(formData);
    };

    return (
        <Box sx={{
            mt: 8,
            pb: 3,
            flexGrow: 1,
            background: 'white',
            borderRadius: theme.shape.borderRadius + 'px',
        }}>
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    {loading && <CircularProgress size={50} />}
                    {!loading && <Grid item xs={12}>
                        <Typography sx={{my: 2}} variant="h5">
                            Add Settlement
                        </Typography>


                        <form onSubmit={handleSubmit}>
                            <TextField
                                required
                                size="small"
                                fullWidth
                                type="number"
                                margin="normal"
                                id="add_settlement_amount"
                                name="add_settlement_amount"
                                label="Amount"
                                onChange={handleInputChange}
                            />

                            <TextField
                                size="small"
                                fullWidth
                                margin="normal"
                                id="add_settlement_remarks"
                                name="add_settlement_remarks"
                                label="Remarks"
                                onChange={handleInputChange}
                            />

                            <Box sx={{mt: 2}}>
                                <RelatedToInput hideAllOption handleChange={v => formData.relatedTo = v} />
                            </Box>

                            <Box>
                                <Button type="submit" variant="contained"
                                        sx={{px: 10, mt: 3, textTransform: 'capitalize'}}
                                        color="primary">
                                    Add
                                </Button>
                            </Box>
                        </form>
                    </Grid>}
                </Grid>
            </Container>
        </Box>
    );
};