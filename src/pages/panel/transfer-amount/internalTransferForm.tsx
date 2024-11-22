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

const InternalTransferForm = (props: Props) => {
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
                <FilterSelect
                    title="Sender Account"
                    width="100%"
                    required
                    hideAllOption
                    margin={'dense'}
                    options={userOptions}
                    name="fromUser"
                    defaultValue={formData?.fromUser}
                    handleChange={(newValue: string) => handleSelectChange('fromUser', newValue)}
                />
                <FilterSelect
                    title="Receiver Account"
                    width="100%"
                    required
                    hideAllOption
                    options={userOptions}
                    name="toUser"
                    margin={'dense'}
                    defaultValue={formData?.toUser}
                    handleChange={(newValue: string) => handleSelectChange('toUser', newValue)}
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

export default InternalTransferForm;
