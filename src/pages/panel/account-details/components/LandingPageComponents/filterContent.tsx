import SelectButton from '@/components/filter/main/selectButton';
import {bankAccountStatusOptionsFilter} from '@/components/filter/options';
import {BankAccountStatusEnum} from '@/utils/enums/accountDetails.enums';
import {RoleEnum} from '@/utils/enums/role';
import {Grid, IconButton, InputAdornment, TextField} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';

interface Props {
    selectedIds: any;
    handleStatusSelection: (id?: string) => void;
    setFilteredData: IBankAccount | any;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    query: string;
    handleSearchChange: React.ChangeEvent<HTMLInputElement> | any;
    clearText: () => void;
}

const FilterContent = (props: Props) => {
    const {
        selectedIds,
        handleStatusSelection,
        setFilteredData,
        setSearchQuery,
        query,
        handleSearchChange,
        clearText,
    } = props;
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;

    return (
        <>
            <Grid item xs={12} md={7.5}>
                <Grid container spacing={0} sx={{gap: '30px'}}>
                    {bankAccountStatusOptionsFilter
                        .filter((option) => {
                            if (roles?.includes(RoleEnum?.StatusHoldLiveOthers)) {
                                return [
                                    BankAccountStatusEnum.hold,
                                    BankAccountStatusEnum.live,
                                    BankAccountStatusEnum.other,
                                ].includes(option.id);
                            } else if (roles?.includes(RoleEnum?.StatusExceptReadyToLive)) {
                                return ![
                                    BankAccountStatusEnum.readyToLive,
                                    BankAccountStatusEnum.permanentStop,
                                    BankAccountStatusEnum.processing,
                                ].includes(option.id);
                            } else if (roles?.includes(RoleEnum?.ExceptProcessingAccounts)) {
                                return ![
                                    BankAccountStatusEnum.processing,
                                    BankAccountStatusEnum.permanentStop,
                                ].includes(option.id);
                            } else if (roles?.includes(RoleEnum?.ProcessingAccountsOnly)) {
                                return option.id === BankAccountStatusEnum.processing;
                            } else {
                                return option.id !== BankAccountStatusEnum.permanentStop;
                            }
                        })
                        .map((n) => (
                            <Grid item key={n.id}>
                                <SelectButton
                                    name={n?.value}
                                    background={n?.background}
                                    color={n?.color}
                                    id={n?.id}
                                    isSelected={selectedIds.includes(n?.id)}
                                    onClick={handleStatusSelection}
                                    setFilteredData={setFilteredData}
                                    setSearchQuery={setSearchQuery}
                                />
                            </Grid>
                        ))}
                </Grid>
            </Grid>

            <Grid container xs={12} md={4.5} sx={{mt: 2}}>
                <Grid item xs={12} md={6}>
                    <TextField
                        size="small"
                        margin="normal"
                        sx={{m: 0}}
                        type="text"
                        id="query"
                        name="query"
                        value={query}
                        onChange={handleSearchChange}
                        placeholder="Search..."
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton edge="end" aria-label="search">
                                        {query ? <CloseIcon onClick={clearText} /> : <SearchIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default FilterContent;
