import Container from '@mui/material/Container';
import {Box, Button, Grid, TextField, Checkbox} from '@mui/material';
import React, {useEffect, useState} from 'react';
import Typography from '@mui/material/Typography';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {ICleanJob, ICleanJobUpdate} from '@/utils/interfaces/cleanJob.interface';
import {cleanJobApi} from '@/utils/services/cleanJob';
import { RoleEnum } from '@/utils/enums/role';
import {useRouter} from 'next/router';
import {EDIT_ACCOUNTS_DETAILS_ROUTE, LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {RootState} from '@/store';
import {useSelector} from 'react-redux';




export interface ITransformedCleanJobUpdate {
    queue: string; 
    statuses: string[]; 
}

const initialFormData: Partial<ICleanJob> = {
    queue: '',
    statuses: '',
};

const CleanJob = (props: any) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<ICleanJob>>(initialFormData);
    const [isValid, setIsValid] = useState(false);
    const [responseData, setResponseData] = useState<any>({});
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();

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

    useEffect(() => {
        if (!roles?.includes(RoleEnum?.AccountDetails)) router.push(LOGIN_ROUTE);
    }, [roles]);

    const validateForm = () => {
        const queueArray = formData.queue
            ? formData.queue
                  .split(',')
                  .map((id) => id.trim())
                  .filter(Boolean)
            : [];
        const statusesArray = formData.statuses
            ? formData.statuses
                  .split(',')
                  .map((utr) => utr.trim())
                  .filter(Boolean)
            : [];
        const resultsArray = formData.results
            ? formData.results
                  .split(',')
                  .map((amount: any) => amount.trim())
                  .filter(Boolean)
            : [];

        const hasNoEmptyStrings = ![...queueArray, ...statusesArray, ...resultsArray].includes('');
        const isSameLength =
            queueArray.length === statusesArray.length &&
            statusesArray.length === resultsArray.length;

        const isValid = isSameLength && hasNoEmptyStrings && queueArray.length > 0;

        setIsValid(isValid);
    };

    const transformData = (data: Partial<ICleanJob>): ITransformedCleanJobUpdate => {
        const removeQuotes = (str: string) => str?.replace(/"/g, '');

        const cleanStringArray = (str: string | undefined) => {
            if (!str) return [];
            return str
                .split(',')
                .map((item) => removeQuotes(item.trim()))
                .filter(Boolean);
        };

        const cleanString = (str: string | undefined) => {
            if (!str) return '';
            return removeQuotes(str.trim());
        };

        return {
            queue: cleanString(data.queue), 
            statuses: cleanStringArray(data.statuses), 
        };
    };





    const submitUpdateCreateGatewayAccount = async (payload: ITransformedCleanJobUpdate) => {
        setLoading(true);
        try {
            const response = await cleanJobApi('', payload);
            if (response) {
                setResponseData(response);
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
        console.log(transformedData);
        await submitUpdateCreateGatewayAccount(transformedData);
    };


    const resultData = (data: any) => {
        try {
  
            return JSON.stringify(data, null, 2); 
        } catch (error) {
            console.error('Error formatting JSON:', error);
            return 'Invalid JSON data';
        }
    };

    const hasData = (data: object | null) => {
        if (data === null || data === undefined) {
            return false;
        }

        const obj = data as Record<string, any>;

        return (
            Object.keys(obj).length > 0 &&
            Object.values(obj).some((value) =>
                Array.isArray(value)
                    ? value.length > 0
                    : typeof value === 'object'
                    ? Object.keys(value).length > 0
                    : Boolean(value),
            )
        );
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
                                Clean Job
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3} direction="row" wrap="wrap">
                                    <Grid item xs={12} sm={6} md={6}>
                                        <TextField
                                            size="medium"
                                            fullWidth
                                            margin="normal"
                                            id="queue"
                                            name="queue"
                                            label="Queue"
                                            value={formData.queue}
                                            onChange={handleInputChange}
                                            multiline
                                            rows={5}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <TextField
                                            size="medium"
                                            fullWidth
                                            margin="normal"
                                            id="statuses"
                                            name="statuses"
                                            label="Statuses"
                                            value={formData?.statuses}
                                            onChange={handleInputChange}
                                            multiline
                                            rows={5}
                                        />
                                    </Grid>
                            
                                </Grid>
                                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                    <Box>
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
                                            >
                                                Add
                                            </Button>
                                        </Box>
                                    </Box>
                             
                                </Box>

                                {hasData(responseData) && (
                                    <Box
                                        sx={{
                                            border: '1px solid #cdc5c5',
                                            padding: '10px 40px',
                                            borderRadius: '10px',
                                            marginTop: '15px',
                                        }}
                                    >
                                        <Typography sx={{my: 2}} variant="h5">
                                            Result
                                        </Typography>
                                        <Box>
                                            <pre>{resultData(responseData)}</pre>
                                        </Box>
                                    </Box>
                                )}
                            </form>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </DashboardLayout>
    );
};

export default CleanJob;
