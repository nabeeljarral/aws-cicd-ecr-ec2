/*----TODO RENDER THIS PAGE ON SERVER SIDE----*/
import {useSelector} from 'react-redux';
import React, {useEffect, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE, STATEMENT_RECORDS_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import Typography from '@mui/material/Typography';
import {Alert, Grid} from '@mui/material';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import {theme} from '@/utils/theme';
import {MuiFileInput} from 'mui-file-input';
import {DeleteForever, ErrorOutline} from '@mui/icons-material';
import {deleteUploadedBankTransaction} from '@/utils/services/fileUpload';
import {getBanks} from '@/utils/services/bank';
import {IBank, IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import {ReversedBanksImportEnum} from '@/utils/enums/banks';
import {getBankAccounts} from '@/utils/services/bankAccount';
import LoadingButton from '@mui/lab/LoadingButton';
import awesomeAlert from '@/utils/functions/alert';
import {DateFormatter} from '@/utils/functions/global';
import moment from 'moment/moment';
import {useS3Upload} from 'next-s3-upload';
import {BankAccountStatusEnum, ChannelsEnum} from '@/utils/enums/accountDetails.enums';

const EditSettingPage = () => {
    let {uploadToS3} = useS3Upload();
    const router = useRouter();
    const [bankAccounts, setBankAccounts] = useState<IBankAccount[]>([]);
    const [loadingBankAccounts, setLoadingBankAccounts] = useState(false);
    const [loading, setLoading] = useState(false);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const {name: bankAccountName} = router.query;
    const [file, setFile] = React.useState<File | null>(null);
    const userId = useSelector((state: RootState) => state.auth.user)?._id;

    const handleChange = (newValue: File | null) => {
        if (newValue) setFile(newValue);
    };
    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!file) return;
        let {key} = await uploadToS3(file);
        // console.log("Successfully uploaded to S3!", url);
        const formData = {
            fileUrl: key,
        };
        try {
            setLoading(true);
            const res = await deleteUploadedBankTransaction(
                formData,
                typeof bankAccountName !== 'string' ? ':bankAccountName' : bankAccountName,
            );
            if (res) {
                awesomeAlert({msg: 'Deleted Successfully'});
                await router.push(STATEMENT_RECORDS_ROUTE);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };
    const fetchBankAccounts = async (): Promise<IBankAccount[] | undefined> => {
        setLoadingBankAccounts(true);
        const res = await getBankAccounts({relatedTo: userId});
        setLoadingBankAccounts(false);
        return res;
    };
    const fetchBanks = async (): Promise<IBank[] | undefined> => {
        return await getBanks();
    };

    const lastDate: () => undefined | Date = () => {
        let lastD = undefined;
        let dateList: number[] = [];
        if (bankAccounts && bankAccounts.length) {
            bankAccounts.forEach((a: IBankAccount) => {
                if (a.importDate) {
                    dateList.push(new Date(a.importDate).getTime());
                }
            });
            lastD = new Date(Math.max(...dateList));
        }
        return lastD;
    };

    useEffect(() => {
        if (!roles?.includes(RoleEnum.Delete)) router.push(LOGIN_ROUTE);
    }, [roles]);
    useEffect(() => {
        if (bankAccountName) {
            fetchBanks().then((bank) => {
                if (bank) {
                    const myBankID = bank.find((el) => {
                        // @ts-ignore
                        return el.name === ReversedBanksImportEnum[bankAccountName];
                    })?._id;

                    fetchBankAccounts().then((res) => {
                        const bankAccounts: IBankAccount[] = [];
                        if (res) {
                            res.forEach((account) => {
                                const isSameBank =
                                    myBankID ===
                                    (typeof account.bankId === 'string'
                                        ? account.bankId
                                        : account.bankId?._id || '');
                                if (
                                    isSameBank &&
                                    account.channel == ChannelsEnum.payz365 &&
                                    (account.status == BankAccountStatusEnum.live ||
                                        account.status == BankAccountStatusEnum.other ||
                                        account.status == BankAccountStatusEnum.hold)
                                ) {
                                    bankAccounts.push(account);
                                }
                            });
                        }
                        setFile(null);
                        setBankAccounts(bankAccounts);
                    });
                }
            });
        }
    }, [bankAccountName]);
    return (
        <DashboardLayout>
            <Box
                bgcolor="var(--toastify-color-error)"
                sx={{flexGrow: 1, borderRadius: `${theme.shape.borderRadius}px`, py: 4, mt: 4}}
            >
                <Container maxWidth="lg">
                    <Box component="form" onSubmit={handleFormSubmit}>
                        <Typography variant="h5" sx={{mb: 2, color: 'white'}}>
                            {bankAccountName}
                            <b>"Delete"</b> statement
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TableContainer component={Paper}>
                                    <Table
                                        size="small"
                                        sx={{minWidth: 650}}
                                        aria-label="simple table"
                                    >
                                        <TableHead>
                                            <TableRow>
                                                {/*<TableCell align="center">Category</TableCell>*/}
                                                {/*<TableCell align="center">Is Active</TableCell>*/}
                                                <TableCell align="center">Bank Account</TableCell>
                                                <TableCell align="center">UPI</TableCell>
                                                <TableCell align="center">Upload date</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {!loadingBankAccounts && !bankAccounts?.length && (
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align="center" colSpan={3}>
                                                        <ErrorOutline /> No Available Bank Accounts
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        )}
                                        {!loadingBankAccounts && !!bankAccounts?.length && (
                                            <TableBody>
                                                {bankAccounts.map((s, i) => (
                                                    <TableRow
                                                        key={i}
                                                        sx={{
                                                            '&:last-child td, &:last-child th': {
                                                                border: 0,
                                                            },
                                                        }}
                                                    >
                                                        {/*<TableCell align="center">*/}
                                                        {/*    {s.category || ''}*/}
                                                        {/*</TableCell>*/}
                                                        {/*<TableCell align="center">*/}
                                                        {/*    <YesNoChip value={s.is_active}/>*/}
                                                        {/*</TableCell>*/}
                                                        <TableCell align="center">
                                                            {s.name}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {s.upi_id}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {s.importDate
                                                                ? DateFormatter(s.importDate)
                                                                : '--'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        )}
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item xs={12}>
                                <Alert severity="info">
                                    Last upload date :{' '}
                                    <b>
                                        {moment(lastDate()).isValid()
                                            ? DateFormatter(lastDate()!)
                                            : '--'}
                                    </b>
                                </Alert>
                            </Grid>
                            <Grid item xs={12} sx={{pt: 0}}>
                                <MuiFileInput
                                    size="small"
                                    value={file}
                                    onChange={handleChange}
                                    placeholder="Upload statment record file"
                                    color="primary"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <LoadingButton
                                    type="submit"
                                    variant="contained"
                                    disabled={!bankAccounts?.length}
                                    loading={loadingBankAccounts || loading}
                                    startIcon={<DeleteForever />}
                                    sx={{px: 5, textTransform: 'capitalize'}}
                                    color="error"
                                >
                                    Delete Statement
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Box>
        </DashboardLayout>
    );
};

export default EditSettingPage;
