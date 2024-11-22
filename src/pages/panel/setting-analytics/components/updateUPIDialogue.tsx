import {IOptionItem} from '@/components/filter/main/filterSelect';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    Typography,
} from '@mui/material';
import React, {ReactNode, useEffect, useState} from 'react';
import {updateSetting, updateUPISetting} from '@/utils/services/bankSettings';
import {ISetting, ISettingDto} from '@/utils/interfaces/settings.interface';
import awesomeAlert from '@/utils/functions/alert';
import {IStatistics} from '@/utils/interfaces/transaction.interface';
import {SETTINGS_ANALYTICS_ROUTE} from '@/utils/endpoints/routes';
import router from 'next/router';
import CloseIcon from '@mui/icons-material/Close';
import {IUpiItem} from '..';
import AssuredWorkloadTwoToneIcon from '@mui/icons-material/AssuredWorkloadTwoTone';
import BankAmountRelatedRanges from '../../account-details/components/bankAmountRelatedRanges';
import AddNewUPILevel from '@/components/settings/components/addNewUPILevel';

type UpdateUPIDialogueProps = {
    openViewDialog: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenViewDialog: React.Dispatch<React.SetStateAction<boolean>>;
    fetchAnalyticsData: (data1: Partial<IStatistics>, updatedPayIn?: string) => Promise<void>;
    popupData?: any;
    data1: Partial<IStatistics>;
    payIn?: string;
    formData: ISettingDto;
    upis: IUpiItem[];
    setFormData: React.Dispatch<React.SetStateAction<ISettingDto>>;
};

function UpdateUPIDialogue({
    openViewDialog,
    setLoading,
    setOpenViewDialog,
    fetchAnalyticsData,
    popupData,
    data1,
    payIn,
    formData,
    upis,
    setFormData,
}: UpdateUPIDialogueProps) {
    const filteredUPIs = upis;
    const [availableRangedBankAcounts, setAvailableRangedBankAcounts] = useState<IUpiItem[]>([]);
    const [selectedBankAccountIds, setSelectedBankAccountIds] = useState<string[]>([]); // For storing selected bank account ID
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData((prevFormData: any) => {
            return {
                ...prevFormData,
                [name]: value,
            };
        });
    };
    useEffect(() => {
        if (formData?.ranged_upi_list?.length) {
            setSelectedBankAccountIds(formData.ranged_upi_list);
        } else {
            setSelectedBankAccountIds([]);
        }
    }, [openViewDialog]);

    const submitUpdateSetting = async (payload: ISettingDto): Promise<ISetting | undefined> => {
        setLoading(true);
        const res = await updateUPISetting(payload);
        setLoading(false);
        if (res) {
            awesomeAlert({msg: 'Successfully Updated'});
            await router.push(SETTINGS_ANALYTICS_ROUTE);
            handleViewDialogClose();
            fetchAnalyticsData(data1, payIn);
        }
        return res;
    };
    const handleViewDialogClose = () => {
        setOpenViewDialog(false);
    };
    const handleSubmit2 = async () => {
        const payload = {
            ...formData,
        };
        const filteredPayload: any = {
            active_upi_id: undefined,
            relatedTo: popupData?.userId,
        };
        if (selectedBankAccountIds?.length > 0) {
            filteredPayload.ranged_upi_list = availableRangedBankAcounts
                .filter((upi) => selectedBankAccountIds.includes(upi?.id))
                .map((upi) => upi?.id); //only keep the available ids rest will be not selected if there is no change
        } else {
            filteredPayload.ranged_upi_list = [];
        }

        if (payload?.upi_ids) {
            filteredPayload.upi_ids = payload.upi_ids
                .map((el) => el.trim())
                .filter((level) => level !== '');
        }
        await submitUpdateSetting(filteredPayload);
    };
    const handleChangeUPI = (event: SelectChangeEvent<string>, child: ReactNode) => {
        const {name, value} = event.target;
        const index = parseInt(name.split('_')[2]) - 1; // Adjusting to match array index (1-based to 0-based)

        setFormData((prevFormData) => ({
            ...prevFormData,
            upi_ids: prevFormData.upi_ids.map((el: string, i) => (i === index ? value : el)),
        }));
    };
    const handleAddUPI = () => {
        setFormData((oldFD) => ({
            ...oldFD,
            upi_ids: [...oldFD.upi_ids, ''],
        }));
    };
    const handleRemoveUPI = (upiId: string) => {
        setFormData((oldFD) => {
            const updatedUPI = oldFD.upi_ids.filter((el) => el !== upiId);
            return {
                ...oldFD,
                upi_ids: updatedUPI,
            };
        });
    };
    return (
        <Dialog open={openViewDialog}>
            <Box sx={{padding: 2, minWidth: '545px'}}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <DialogTitle sx={{p: '2px 0px'}}>Update UPI</DialogTitle>
                    <IconButton aria-label="close" onClick={handleViewDialogClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box>
                    <AddNewUPILevel
                        formData={formData}
                        filteredUPIs={filteredUPIs} // your filtered UPI options
                        handleChange={handleChangeUPI}
                        handleAddUPI={handleAddUPI}
                        handleRemoveUPI={handleRemoveUPI}
                        bankAccountsLoading={false} // loading state for UPI options
                        setFormData={setFormData}
                    />

                    {/* Radio buttons for selecting bank amount range */}
                    <BankAmountRelatedRanges
                        openDialog={openViewDialog}
                        selectedBankAccountIds={selectedBankAccountIds}
                        setSelectedBankAccountIds={setSelectedBankAccountIds}
                        upis={filteredUPIs}
                        availableRangedBankAcounts={availableRangedBankAcounts}
                        setAvailableRangedBankAcounts={setAvailableRangedBankAcounts}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'end',
                            width: '100%',
                        }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                px: 3,
                                mt: 1,
                                textTransform: 'capitalize',
                            }}
                            color="success"
                            onClick={handleSubmit2}
                        >
                            {'Update'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
}

export default UpdateUPIDialogue;
