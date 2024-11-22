import {FormEvent, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RoleEnum} from '@/utils/enums/role';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import MainFilter from '@/components/filter/mainFilter';
import {FilterEnums} from '@/utils/enums/filter';
import {bankTransactionRemoveDuplicateUtr} from '@/utils/services/bankTransactions';
import {IFilterBankTransactionDto} from '@/utils/dto/bankTransactions.dto';
import Typography from '@mui/material/Typography';
import awesomeAlert from '@/utils/functions/alert';

type Props = {
    selectedFilters?: FilterEnums[]
    pageRole?: RoleEnum
}
const RemoveDuplicatedUtrPage = (props: Props) => {
    const selectedFilters: FilterEnums[] = props.selectedFilters ?
        props.selectedFilters :
        [
            FilterEnums.bank,
            FilterEnums.bank_account,
            FilterEnums.is_claimed,
            FilterEnums.amount,
            FilterEnums.utr,
            FilterEnums.date_range,
        ];
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        const filter: IFilterBankTransactionDto = {
            ...data,
        };
        const res = await bankTransactionRemoveDuplicateUtr({filter});
        if (res && !res.message) awesomeAlert({msg: res});
        setLoading(false);
    };

    return <DashboardLayout>
        <Box sx={{flexGrow: 1}}>
            <Container maxWidth="lg" sx={{mt: 4}}>
                <Typography sx={{m: 2}} variant="h5">Delete Duplicate UTR</Typography>
                <MainFilter
                    loading={loading}
                    onSubmit={handleSubmit}
                    filter={{}}
                    selectedFilters={selectedFilters}
                />
            </Container>
        </Box>
    </DashboardLayout>;
};

export default RemoveDuplicatedUtrPage;