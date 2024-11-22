import {Box, DialogActions, FormControlLabel, FormLabel, Radio, RadioGroup} from '@mui/material';
import React, {FormEvent} from 'react';
import ChargeBackForm from './chargeBackForm';
import InternalTransferForm from './internalTransferForm';
import {LoadingButton} from '@mui/lab';
import {ChargeBackDto, TransferDto} from '@/utils/interfaces/chargeBackInternalTransfer';
import {IOptionItem} from '@/components/filter/main/filterSelect';
import TopUpForm from './topUpForm';

interface Props {
    loading: boolean;
    handleSelectChange: any;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
    formData: ChargeBackDto | TransferDto;
    selectedUpdate: any;
    userOptions: IOptionItem[];
    handleInputChange: React.ChangeEvent<HTMLInputElement> | any;
    setSelectedUpdate: any;
}
const AddEditForm = (props: Props) => {
    const {
        loading,
        handleSelectChange,
        handleInputChange,
        handleSubmit,
        formData,
        userOptions,
        setSelectedUpdate,
        selectedUpdate,
    } = props;
    return (
        <>
            <form onSubmit={handleSubmit}>
                {
                    <Box sx={{maxWidth: '100%', width: '400px', mt: 1}}>
                        <Box
                            sx={{
                                display: 'flex',
                                width: '90%',
                                flexDirection: 'column',
                                alignItems: 'center',
                                mx: 'auto',
                            }}
                        >
                            {
                                <Box sx={{mr: 'auto', ml: 1, mb: 2}}>
                                    <FormLabel id="select-radios-group">
                                        Select Transfer Method
                                    </FormLabel>
                                    <RadioGroup
                                        value={selectedUpdate}
                                        onChange={(e) =>
                                            setSelectedUpdate(e.currentTarget?.value ?? '')
                                        }
                                        row
                                        aria-labelledby="select-radios-group"
                                        name="row-radio-buttons-group"
                                    >
                                        <FormControlLabel
                                            value="chargeBack"
                                            control={<Radio />}
                                            label="Charge Back"
                                        />
                                        <FormControlLabel
                                            value="topUp"
                                            control={<Radio />}
                                            label="Top Up"
                                        />
                                        <FormControlLabel
                                            value="internalTransfer"
                                            control={<Radio />}
                                            label="Internal Transfer"
                                        />
                                    </RadioGroup>
                                </Box>
                            }
                            {selectedUpdate == 'chargeBack' && (
                                <ChargeBackForm
                                    userOptions={userOptions}
                                    handleSelectChange={handleSelectChange}
                                    handleInputChange={handleInputChange}
                                    formData={formData}
                                />
                            )}
                            {selectedUpdate == 'internalTransfer' && (
                                <InternalTransferForm
                                    userOptions={userOptions}
                                    handleSelectChange={handleSelectChange}
                                    handleInputChange={handleInputChange}
                                    formData={formData}
                                />
                            )}
                             {selectedUpdate == 'topUp' && (
                                <TopUpForm
                                    userOptions={userOptions}
                                    handleSelectChange={handleSelectChange}
                                    handleInputChange={handleInputChange}
                                    formData={formData}
                                />
                            )}
                        </Box>
                    </Box>
                }

                <DialogActions sx={{pb: 2, px: 2}}>
                    <LoadingButton
                        loading={loading}
                        type="submit"
                        variant="contained"
                        sx={{px: 5, mt: 2, textTransform: 'capitalize'}}
                        color="primary"
                    >
                        Submit
                    </LoadingButton>
                </DialogActions>
            </form>
        </>
    );
};

export default AddEditForm;
