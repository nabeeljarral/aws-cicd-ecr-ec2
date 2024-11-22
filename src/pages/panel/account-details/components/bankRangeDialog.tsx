import React, {useState, useEffect} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Grid,
    Divider,
} from '@mui/material';
import {Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import axiosInstance from '@/utils/axios';
import {BANK_AMOUNT_RANGES} from '@/utils/endpoints/endpoints';

export interface IBankAmountRange {
    _id?: string;
    name: string;
    from: number;
    to: number;
}

const validationSchema = Yup.object({
    ranges: Yup.array().of(
        Yup.object({
            name: Yup.string().required('Range name is required'),
            from: Yup.number()
                .required('From value is required')
                .min(0, 'From value must be at least 0'),
            to: Yup.number()
                .required('To value is required')
                .moreThan(Yup.ref('from'), 'To value must be greater than From value'),
        }),
    ),
});

const RangeFormDialog = () => {
    const [open, setOpen] = useState(false);
    const [initialValues, setInitialValues] = useState<{ranges: IBankAmountRange[]}>({
        ranges: [
            {name: 'Amount Range 1', from: 0, to: 1000},
            {name: 'Amount Range 2', from: 1001, to: 3000},
            {name: 'Amount Range 3', from: 3001, to: 50000},
        ],
    });

    // Fetch ranges from API when the dialog opens
    useEffect(() => {
        if (open) {
            axiosInstance
                .get(BANK_AMOUNT_RANGES)
                .then(({data}) => {
                    setInitialValues({ranges: data});
                })
                .catch((error) => {
                    console.error('Error fetching ranges:', error);
                });
        }
    }, [open]);

    const handleSubmit = (values: {ranges: IBankAmountRange[]}) => {
        console.log('Submitted Values:', values);
        axiosInstance
            .post(BANK_AMOUNT_RANGES, values.ranges)
            .then((response) => {
                console.log('Ranges saved:', response.data);
                setOpen(false); // Close the dialog after successful save
            })
            .catch((error) => {
                console.error('Error saving ranges:', error);
            });
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button variant="contained" onClick={handleClickOpen}>
                Set Bank Amount Ranges
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Set Bank Amount Ranges</DialogTitle>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={handleSubmit}
                >
                    {({errors, touched}) => (
                        <Form>
                            <DialogContent>
                                <Grid container spacing={2}>
                                    {initialValues?.ranges?.map((_, index) => (
                                        <React.Fragment key={index}>
                                            <Grid item xs={12}>
                                                <Field
                                                    size="small"
                                                    name={`ranges[${index}].name`}
                                                    label={`Range Name ${index + 1}`}
                                                    as={TextField}
                                                    fullWidth
                                                    variant="outlined"
                                                    error={
                                                        touched.ranges?.[index]?.name &&
                                                        !!(errors.ranges?.[index] as any)?.name
                                                    }
                                                    helperText={
                                                        <ErrorMessage
                                                            name={`ranges[${index}].name`}
                                                        />
                                                    }
                                                    disabled={_.name === 'All'}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Field
                                                    size="small"
                                                    name={`ranges[${index}].from`}
                                                    label="From"
                                                    as={TextField}
                                                    type="number"
                                                    fullWidth
                                                    variant="outlined"
                                                    error={
                                                        touched.ranges?.[index]?.from &&
                                                        !!(errors.ranges?.[index] as any)?.from
                                                    }
                                                    helperText={
                                                        <ErrorMessage
                                                            name={`ranges[${index}].from`}
                                                        />
                                                    }
                                                    disabled={_.name === 'All'}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Field
                                                    size="small"
                                                    name={`ranges[${index}].to`}
                                                    label="To"
                                                    as={TextField}
                                                    type="number"
                                                    fullWidth
                                                    variant="outlined"
                                                    error={
                                                        touched.ranges?.[index]?.to &&
                                                        !!(errors.ranges?.[index] as any)?.to
                                                    }
                                                    helperText={
                                                        <ErrorMessage
                                                            name={`ranges[${index}].to`}
                                                        />
                                                    }
                                                    disabled={_.name === 'All'}
                                                />
                                            </Grid>
                                            {index < initialValues.ranges.length - 1 && (
                                                <Grid item xs={12} sx={{p: '0'}}>
                                                    <Divider sx={{margin: '5px 0'}} />
                                                </Grid>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="secondary">
                                    Cancel
                                </Button>
                                <Button type="submit" color="primary" variant="contained">
                                    Save Ranges
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </>
    );
};

export default RangeFormDialog;
