import Typography from '@mui/material/Typography';
import {FormEvent, useState} from 'react';
import {Box} from '@mui/material';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import FilterBox from '@/components/filter/main/filterBox';

const UploadTransactionsPage = () => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = {};
        formData.forEach((value, key) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (value) data[key] = value;
        });
        // const filter = data
        // await uploadTransactions({
        //     files,
        //     updateStatus,
        //     updateVendor
        // }).then(res=>{if (res) awesomeAlert({msg: 'I'})})
        // await getTransactions({filter})
        //     .catch(() => setLoading(false))
        setLoading(false);
    };

    return (
        <DashboardLayout>
            <Typography variant="h5" sx={{m: 2}}>Upload Transactions</Typography>
            <FilterBox
                isOpen={true}
                loading={loading}
                onSubmit={handleSubmit}
            >
                <Box sx={{ml: 2, mb: 2}}>Coming Soon...</Box>
            </FilterBox>
        </DashboardLayout>
    );
};

export default UploadTransactionsPage;