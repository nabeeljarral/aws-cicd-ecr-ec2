// components/DynamicFormKeyValue.tsx

import React, { useState, ChangeEvent } from 'react';
import {
    Button,
    TextField,
    Grid,
    IconButton,
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogActions,
    Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { LoadingButton } from '@mui/lab';

interface KeyValuePair {
    key: string;
    value: string;
}

interface DynamicFormProps {
    onSubmit: (data: KeyValuePair[]) => void;
    initialValues?: KeyValuePair[];
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const DynamicFormKeyValue: React.FC<DynamicFormProps> = ({
    onSubmit,
    initialValues = [],
    openDialog,
    setOpenDialog,
}) => {
    const [keyValuePairs, setKeyValuePairs] = useState<KeyValuePair[]>(initialValues);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (index: number, field: 'key' | 'value', value: string) => {
        const updatedPairs = keyValuePairs.map((pair, i) =>
            i === index ? { ...pair, [field]: value } : pair,
        );
        setKeyValuePairs(updatedPairs);
    };

    const addRow = () => {
        const lastRow = keyValuePairs[keyValuePairs.length - 1];
        if (lastRow?.key?.trim() !== '' && lastRow?.value?.trim() !== '') {
            setKeyValuePairs([...keyValuePairs, { key: '', value: '' }]);
            setError(null)
        } else {
            setError('Please fill the key and value before adding a new row.');
        }
    };

    const removeRow = (index: number) => {
        const updatedPairs = keyValuePairs.filter((_, i) => i !== index);
        setKeyValuePairs(updatedPairs);
       if(keyValuePairs.length){
        setError(null)
       }
    };

    const handleSubmit = () => {
        const lastRow = keyValuePairs[keyValuePairs.length - 1];
        if (lastRow?.key?.trim() !== '' && lastRow?.value?.trim() !== '') {
            const hasError = keyValuePairs.some(
                (pair) =>
                    (pair.key.trim() !== '' && pair.value.trim() === '') ||
                    (pair.value.trim() !== '' && pair.key.trim() === ''),
            );
    
            if (hasError) {
                setError('Each key or value must have data.');
                return;
            }
    
            const filteredPairs = keyValuePairs.filter(
                (pair) => pair.key.trim() !== '' || pair.value.trim() !== '',
            );
             console.log(filteredPairs,"filtered pairs")
            onSubmit(filteredPairs);
        } else {
            setError('Please fill the key and value before submit.');
        }
     
    };

    const handleCloseSnackbar = () => {
        setError(null);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    return (
        <Dialog open={openDialog} onClose={handleClose}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            > 
            <Box sx={{borderBottom:"1px solid #322653",margin:"0px 18px"}}>
            <DialogTitle sx={{p:"12px 0px"}}>Multiple Key-Value Pairs</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: "#322653",
                 
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>
                
                <Box sx={{ width: '100%', padding: 2 }}>
                    {keyValuePairs.length ? (
                        <>
                            {keyValuePairs.map((pair, index) => (
                                <Grid
                                    container
                                    spacing={2}
                                    key={index}
                                    alignItems="center"
                                    sx={{ marginBottom: 1}}
                                >
                                    <Grid item xs={5}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Key"
                                            value={pair.key}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                handleChange(index, 'key', e.target.value)
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <TextField
                                            fullWidth
                                            label="Value"
                                            size="small"
                                            value={pair.value}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                handleChange(index, 'value', e.target.value)
                                            }
                                            sx={{borderRadius:"5px"}}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <IconButton color="error" onClick={() => removeRow(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                        </>
                    ) : (
                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    textAlign: 'center',
                                    color: '#757575',
                                    p: 2,
                                    fontSize: '22px',
                                }}
                            >
                                Sorry, No Data
                                <SentimentVeryDissatisfiedIcon
                                    sx={{ fontSize: '30px', mt: -0.5, ml: 1, mr: 1 }}
                                />
                                Please click "Add Row"
                            </Typography>
                        </Box>
                    )}
                    {error && <Typography sx={{ color: "red" }}>{error}</Typography>}

                  
                    <LoadingButton
                        onClick={addRow}
                        variant="contained"
                        sx={{px: 2, mt: 1, textTransform: 'capitalize'}}
                        color="success">
                        Add Row
                    </LoadingButton>
                 
                    
                </Box>
                <DialogActions sx={{ pb: 2, px: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{ marginTop: 2 }}
                       
                    >
                        Submit
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default DynamicFormKeyValue;
