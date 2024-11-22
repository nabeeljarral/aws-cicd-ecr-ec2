import FilterSelect, {IOptionItem} from '@/components/filter/main/filterSelect';
import {ChargeBackDto, TransferDto} from '@/utils/interfaces/chargeBackInternalTransfer';
import { TextField} from '@mui/material';
import React from 'react';

export interface Props {
    formData: ChargeBackDto | TransferDto;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectChange: any;
    userOptions: IOptionItem[];
}

const TopUpForm = (props: Props) => {
    const {formData, handleInputChange, handleSelectChange, userOptions} = props;
    return (
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
            <FilterSelect
                title="Top Up To"
                width="100%"
                required
                hideAllOption
                marginType={'dense'}
                options={userOptions}
                name="fromUser"
                defaultValue={formData?.fromUser}
                handleChange={(newValue: string) => handleSelectChange('fromUser', newValue)}
            />
      
            <TextField
                name="remarks"
                size="small"
                fullWidth
                margin="none"
                id="remarks"
                value={formData?.remarks}
                onChange={handleInputChange}
                label="Remarks"
            />
        </>
    );
};

export default TopUpForm;
