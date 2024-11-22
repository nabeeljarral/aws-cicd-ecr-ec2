import React, {useEffect} from 'react';
import {
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
} from '@mui/material';
import AssuredWorkloadTwoToneIcon from '@mui/icons-material/AssuredWorkloadTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import {IOptionItem} from '@/components/filter/main/filterSelect';

const UPISelect = ({
    id,
    label,
    value,
    handleChange,
    upiList,
    bankAccountsLoading,
}: {
    id: string;
    label: string;
    value: string;
    handleChange: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
    upiList: IOptionItem[];
    bankAccountsLoading: boolean;
}) => (
    <FormControl size="small" fullWidth sx={{mt: 2}}>
        <InputLabel id={`${id}-label`}>{label}</InputLabel>
        <Select
            label={label}
            labelId={`${id}-label`}
            id={id}
            name={id}
            value={value || ''}
            onChange={handleChange}
        >
            <MenuItem value="">No Select</MenuItem>
            {!bankAccountsLoading &&
                upiList.map((upi: IOptionItem, i: number) => (
                    <MenuItem key={i} value={upi.id}>
                        {upi.value}
                    </MenuItem>
                ))}
        </Select>
    </FormControl>
);

const AddNewUPILevel = ({
    formData,
    filteredUPIs,
    handleChange,
    handleAddUPI,
    handleRemoveUPI,
    bankAccountsLoading,
    setFormData,
}: {
    formData: any;
    filteredUPIs: IOptionItem[];
    handleChange: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
    handleAddUPI: () => void;
    handleRemoveUPI: (id: string) => void;
    bankAccountsLoading: boolean;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
}) => {
    // Function to get the options for each dropdown, excluding selected ones from previous dropdowns
    const getAvailableUPIOptions = (index: number) => {
        const selectedUpis = formData?.upi_ids.slice(0, index);
        const allRanged = filteredUPIs.filter(
            (upi: IOptionItem) =>
                !selectedUpis.includes(upi.id) &&
                //for bank accounts
                ((typeof upi.bankAmountRange !== 'string' &&
                    upi.bankAmountRange?.name === 'All' &&
                    upi.type === 0) ||
                    upi.type !== 0), //for gateway accounts
        ); // Filter out the already selected options
        return allRanged;
    };

    useEffect(() => {
        // Initialize the upi_ids array if it's not already initialized
        if (!formData.upi_ids || formData.upi_ids.length === 0) {
            setFormData((prevFormData: any) => ({
                ...prevFormData,
                upi_ids: [''], // Initialize with at least one empty string for the first dropdown
            }));
        }
    }, []);

    const availableDropdowns =
        formData?.upi_ids?.filter(
            (a: string) => filteredUPIs.map((b: IOptionItem) => b.id).includes(a) || a === '',
        ) || 0;
    return (
        <Box sx={{px: 2, mt: 1, border: '1px solid #ccc', borderRadius: '8px', p: 2}}>
            <Typography sx={{mb: 2}}>
                <AssuredWorkloadTwoToneIcon /> All Ranged UPIs
            </Typography>

            {/* First UPI */}
            <UPISelect
                id="upi_ids_1"
                label="Active UPI 1"
                value={availableDropdowns[0] || ''}
                handleChange={handleChange}
                upiList={getAvailableUPIOptions(0)} // Pass available options for the first UPI
                bankAccountsLoading={bankAccountsLoading}
            />

            {/* Other UPIs */}
            {availableDropdowns?.slice(1).map((id: string, i: number) => {
                const idx = i + 2; // Start from 2 for other UPI levels
                return (
                    <Grid container spacing={1.5} key={id}>
                        <Grid item xs={11}>
                            <UPISelect
                                id={`upi_ids_${idx}`}
                                label={`Active UPI ${idx}`}
                                value={id}
                                handleChange={handleChange}
                                upiList={getAvailableUPIOptions(i + 1)} // Pass available options for the current UPI
                                bankAccountsLoading={bankAccountsLoading}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={1}
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                            }}
                        >
                            <IconButton onClick={() => handleRemoveUPI(id)} aria-label="remove">
                                <CloseIcon sx={{color: 'red'}} />
                            </IconButton>
                        </Grid>
                    </Grid>
                );
            })}

            {/* Add New UPI Button */}
            <Box>
                <Button
                    type="button"
                    onClick={handleAddUPI}
                    variant="outlined"
                    sx={{px: 3, mt: 2, mb: 1, textTransform: 'capitalize'}}
                    color="info"
                >
                    + Add New UPI Level
                </Button>
            </Box>
        </Box>
    );
};

export default AddNewUPILevel;
