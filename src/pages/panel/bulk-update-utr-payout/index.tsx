import Container from '@mui/material/Container';
import {Box, Button, Grid, TextField, Checkbox} from '@mui/material';
import React, {useEffect, useState} from 'react';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {IBulkUpdate} from '@/utils/interfaces/BulkUpdatetransaction.interface';
import {updateBulkUtr, updatePayoutBulkUtr} from '@/utils/services/bulk-utr';
import awesomeAlert from '@/utils/functions/alert';

interface ITransformedBulkUpdate {
    ids: string[];
    utrs: string[];
    amounts: string[];
    sendCallback: boolean;
    success?: any;
    message?: string;
    modifiedCount?: number;
    notModifiedCount?: number;
    total?: number;
}

const initialFormData: Partial<IBulkUpdate> = {
    ids: '',
    utrs: '',
    amounts: '',
    sendCallback: false,
};

const BulkUpdateUTR = (props: any) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<IBulkUpdate>>(initialFormData);
    const [isValid, setIsValid] = useState(false);
    const [responseData, setResponseData] = useState<Partial<ITransformedBulkUpdate>>({});

    useEffect(() => {
        validateForm();
    }, [formData]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: checked,
        }));
    };

    const validateForm = () => {
        const idsArray = formData.ids
            ? formData.ids
                  .split(',')
                  .map((id) => id.trim())
                  .filter(Boolean)
            : [];
        const utrsArray = formData.utrs
            ? formData.utrs
                  .split(',')
                  .map((utr) => utr.trim())
                  .filter(Boolean)
            : [];
        const amountsArray = formData.amounts
            ? formData.amounts
                  .split(',')
                  .map((amount: any) => amount.trim())
                  .filter(Boolean)
            : [];

        const hasNoEmptyStrings = ![...idsArray, ...utrsArray, ...amountsArray].includes('');
        const isSameLength =
            idsArray.length === utrsArray.length && utrsArray.length === amountsArray.length;

        const isValid = isSameLength && hasNoEmptyStrings && idsArray.length > 0;

        setIsValid(isValid);
    };

    const transformData = (data: Partial<IBulkUpdate>): ITransformedBulkUpdate => {
        const removeQuotes = (str: string) => str?.replace(/"/g, '');

        const cleanArray = (str: string | undefined) => {
            if (!str) return [];
            return str
                .split(',')
                .map((item) => removeQuotes(item.trim()))
                .filter(Boolean);
        };

        return {
            ids: cleanArray(data.ids),
            utrs: cleanArray(data.utrs),
            amounts: cleanArray(data.amounts),
            sendCallback: data.sendCallback || false,
        };
    };

    const revertTransformedData = (data: ITransformedBulkUpdate): IBulkUpdate => {
        return {
            ids: data.ids.join(','),
            utrs: data.utrs.join(','),
            amounts: data.amounts.join(','),
            sendCallback: data.sendCallback,
        };
    };

    const submitUpdateCreateGatewayAccount = async (payload: ITransformedBulkUpdate) => {
        setLoading(true);
        try {
            const revertedData = revertTransformedData(payload);
            const response = await updatePayoutBulkUtr(payload);

            if (response) {
                handleResponse(response);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const transformedData = transformData(formData);
        await submitUpdateCreateGatewayAccount(transformedData);
    };

    const handleResponse = (response: any) => {
        setResponseData(response);
        if (response.ids) {
            setFormData({
                ids: response.ids.join(','),
                utrs: response.utrs.join(','),
                amounts: response.amounts.join(','),
                sendCallback: response.sendCallback,
            });
        } else if (response?.success === true) {
            awesomeAlert({
                msg: `All done | Total : ${responseData?.total} | Modified : ${response?.modifiedCount}`,
            });
            setFormData(initialFormData);
        }
    };

    return (
        <DashboardLayout>
            <Box
                sx={{
                    mt: 8,
                    pb: 3,
                    flexGrow: 1,
                    background: 'white',
                    borderRadius: (theme) => theme.shape.borderRadius + 'px',
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography sx={{my: 2}} variant="h5">
                                Bulk Add Payout Transaction UTR
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3} direction="row" wrap="wrap">
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            size="medium"
                                            fullWidth
                                            margin="normal"
                                            id="ids"
                                            name="ids"
                                            label="IDs"
                                            value={formData.ids}
                                            onChange={handleInputChange}
                                            multiline
                                            rows={5}
                                            placeholder="Enter the Payout transaction Ids as comma separated e.g.: Id,Id,Id,..."
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            size="medium"
                                            fullWidth
                                            margin="normal"
                                            id="utrs"
                                            name="utrs"
                                            label="UTRs"
                                            value={formData?.utrs}
                                            onChange={handleInputChange}
                                            multiline
                                            rows={5}
                                            placeholder="Enter the Payout transaction UTRs as comma separated e.g.: UTR,UTR,UTR,..."
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            size="medium"
                                            fullWidth
                                            margin="normal"
                                            id="amounts"
                                            name="amounts"
                                            label="Amounts"
                                            value={formData.amounts}
                                            onChange={handleInputChange}
                                            multiline
                                            rows={5}
                                            placeholder="Enter the Payout transaction Amounts as comma separated e.g.: Amount,Amount,Amount,..."
                                        />
                                    </Grid>
                                </Grid>
                                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                    <Box>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={formData.sendCallback}
                                                    onChange={handleCheckboxChange}
                                                    name="sendCallback"
                                                />
                                            }
                                            label="Send Callback"
                                            sx={{pt: 1}}
                                        />
                                        <Box
                                            sx={{display: 'flex', justifyContent: 'space-between'}}
                                        >
                                            <Typography
                                                sx={{display: 'flex', alignItems: 'center', mt: 1}}
                                            >
                                                Status to be updated : Success
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                sx={{
                                                    px: 10,
                                                    mt: 3,
                                                    textTransform: 'capitalize',
                                                    width: '50px',
                                                }}
                                                color="primary"
                                                disabled={!isValid}
                                            >
                                                Add
                                            </Button>
                                        </Box>
                                    </Box>
                                    {responseData.ids && !responseData?.success && (
                                        <Box
                                            sx={{
                                                gap: 2,
                                                flexDirection: 'column',
                                                display: 'flex',
                                                p: 2,
                                            }}
                                        >
                                            <Alert severity="warning" sx={{background: '#fff8db'}}>
                                                Some of the UTRs and Amounts are not Updated, Please
                                                verify the UTRs and Amounts, Modified :
                                                <span
                                                    style={{
                                                        fontWeight: '600',
                                                        borderRight: '1px solid black',
                                                        paddingRight: '3px',
                                                    }}
                                                >
                                                    {responseData?.modifiedCount}
                                                </span>{' '}
                                                Not Modified :{' '}
                                                <span style={{fontWeight: '600'}}>
                                                    {responseData?.notModifiedCount}
                                                </span>
                                            </Alert>
                                            <Alert severity="info">
                                                Unupdated UTRs and Amounts are populated at their
                                                fields, please review and proceed & Add again
                                            </Alert>
                                        </Box>
                                    )}
                                </Box>
                            </form>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </DashboardLayout>
    );
};

export default BulkUpdateUTR;
