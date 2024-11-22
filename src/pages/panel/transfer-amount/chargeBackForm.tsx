import FilterSelect, {IOptionItem} from '@/components/filter/main/filterSelect';
import {ChargeBackDto, TransferDto} from '@/utils/interfaces/chargeBackInternalTransfer';
import {Box, TextField} from '@mui/material';
import React from 'react';

export interface Props {
    formData: ChargeBackDto | TransferDto;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectChange: any;
    userOptions: IOptionItem[];
}

const ChargeBackForm = (props: Props) => {
    const {formData, handleInputChange, handleSelectChange, userOptions} = props;
    return (
        <div>
            <>
                <TextField
                    title="Amount"
                    name="amount"
                    size="small"
                    required
                    fullWidth
                    margin="dense"
                    id="amount"
                    value={formData?.amount}
                    onChange={handleInputChange}
                    label="Amount"
                />
                <Box sx={{m: '-4px 8px 0px -8px'}}>
                    <FilterSelect
                        title="Charge Back From"
                        width="100%"
                        required
                        hideAllOption
                        options={userOptions}
                        name="fromUser"
                        defaultValue={formData?.fromUser}
                        handleChange={(newValue: string) =>
                            handleSelectChange('fromUser', newValue)
                        }
                    />
                </Box>

                <TextField
                    name="order_id"
                    size="small"
                    fullWidth
                    margin="none"
                    id="number"
                    value={formData?.order_id}
                    onChange={handleInputChange}
                    label="Order Id"
                />
                <TextField
                    name="remarks"
                    size="small"
                    fullWidth
                    margin="dense"
                    id="remarks"
                    value={formData?.remarks}
                    onChange={handleInputChange}
                    label="Remarks"
                />
            </>
        </div>
    );
};

export default ChargeBackForm;
