import {RootState} from '@/store';
import axiosInstance from '@/utils/axios';
import {BANK_AMOUNT_RANGES} from '@/utils/endpoints/endpoints';
import {RoleEnum} from '@/utils/enums/role';
import {
    Box,
    FormControl,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    Typography,
} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import AssuredWorkloadTwoToneIcon from '@mui/icons-material/AssuredWorkloadTwoTone';
import {IBankAmountRange} from './bankRangeDialog';
type BankAmountRangesProps = {
    openDialog?: boolean;
    selectedRange: string | IBankAmountRange;
    setSelectedRange: React.Dispatch<React.SetStateAction<string | IBankAmountRange>>;
};

function BankAmountRanges({
    openDialog = true,
    selectedRange,
    setSelectedRange,
}: BankAmountRangesProps) {
    const [bankAmountRangeList, setbankAmountRangeList] = useState<IBankAmountRange[]>([]);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const isAllowedToChangeBankAmountRange = roles?.includes(RoleEnum.BankAccountAmountRange);

    const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRange(event.target.value); // Update selected range state
    };

    useEffect(() => {
        if (openDialog) {
            axiosInstance
                .get(BANK_AMOUNT_RANGES)
                .then(({data}: {data: IBankAmountRange[]}) => {
                    setbankAmountRangeList(data);
                })
                .catch((error) => {
                    console.error('Error fetching ranges:', error);
                });
        }
    }, [openDialog]);
    return (
        <Grid item xs={12} sx={{mt: 2}}>
            <Box sx={{px: 2, mt: 1, border: '1px solid #ccc', borderRadius: '8px', p: 2}}>
                <Typography sx={{mb: 2}}>
                    <AssuredWorkloadTwoToneIcon /> Bank Amount Ranges
                </Typography>
                {isAllowedToChangeBankAmountRange ? (
                    <FormControl component="fieldset" fullWidth>
                        <RadioGroup
                            name="bankAmountRange"
                            value={selectedRange}
                            onChange={handleRangeChange}
                        >
                            <Grid container xs={12} spacing={1}>
                                {bankAmountRangeList.length > 0 &&
                                    bankAmountRangeList?.map((range) => (
                                        <Grid item>
                                            <FormControlLabel
                                                key={range._id}
                                                value={range._id}
                                                control={<Radio required />}
                                                label={`${range.name} (From: ${range.from} To: ${range.to})`}
                                            />
                                        </Grid>
                                    ))}
                            </Grid>
                        </RadioGroup>
                    </FormControl>
                ) : (
                    <>
                        {bankAmountRangeList.length > 0 &&
                            bankAmountRangeList?.map(
                                (range) =>
                                    range._id === selectedRange && (
                                        <Box>
                                            {range.name} (From: {range.from} To: {range.to})
                                        </Box>
                                    ),
                            )}
                    </>
                )}
            </Box>
        </Grid>
    );
}

export default BankAmountRanges;
