/*----TODO RENDER THIS PAGE ON SERVER SIDE----*/
import {useSelector} from 'react-redux';
import React, {useEffect, useRef, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE, STATEMENT_RECORDS_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import Typography from '@mui/material/Typography';
import {Alert, Chip, Grid} from '@mui/material';
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
import {ErrorOutline, UploadFile} from '@mui/icons-material';
import {bankTransactionFileUpload} from '@/utils/services/fileUpload';
import {getBanks} from '@/utils/services/bank';
import {IBank, IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import {ReversedBanksImportEnum} from '@/utils/enums/banks';
import {getBankAccounts} from '@/utils/services/bankAccount';
import LoadingButton from '@mui/lab/LoadingButton';
import {DateFormatter} from '@/utils/functions/global';
import moment from 'moment';
import RelatedToInput from '@/components/inputs/relatedToInput';
import {useS3Upload} from 'next-s3-upload';
import {BankAccountStatusEnum, ChannelsEnum} from '@/utils/enums/accountDetails.enums';
import FileUploadingMessage from '@/components/alerts/FileUploadingMessage';
import {
    cancelUploadBankStatementFile,
    deleteBankStatementFile,
    getBankStatementUploadFiles,
} from '@/utils/services/transactions';
import {UploadFileStatusEnum} from '@/utils/enums/uploadFileStatus.enum';
import {IUploadFileInfo} from '@/utils/interfaces/uploadFileInfo.interface';
import {debug} from 'console';

const EditSettingPage = () => {
    let {uploadToS3} = useS3Upload();
    const router = useRouter();
    const [bankAccounts, setBankAccounts] = useState<IBankAccount[]>([]);
    const [loadingBankAccounts, setLoadingBankAccounts] = useState(false);
    const [loading, setLoading] = useState(false);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const {name: bankAccountName} = router.query;
    const [file, setFile] = React.useState<File | null>(null);
    const [uploadFiles, setUploadFiles] = useState<IUploadFileInfo[]>([]);
    const [bankId, setBankId] = useState<string | undefined>('');

    const userId = useSelector((state: RootState) => state.auth.user)?._id;
    const bankName = typeof bankAccountName !== 'string' ? ':bankAccountName' : bankAccountName;
    const handleChange = (newValue: File | null) => {
        if (newValue) setFile(newValue);
    };
    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const data: Partial<{createdBy?: string}> = {};
        form.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        const {createdBy} = data;

        if (!file) return;

        setLoading(true);
        try {
            // Upload file to S3 and retrieve 'key'
            let {key} = await uploadToS3(file);

            // Prepare formData for API request
            const formData = {
                fileUrl: key,
                createdBy: createdBy || ':createdBy',
            };

            // Call bankTransactionFileUpload API function
            const res = await bankTransactionFileUpload(formData, bankName);

            fetchUploadFiles();
        } catch (error) {
            console.error('Error occurred in upload statement:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUploadFiles = async () => {
        try {
            if (bankId) {
                const data = await getBankStatementUploadFiles(bankId);
                if (Array.isArray(data)) {
                    setUploadFiles(data);
                } else {
                    console.error('Fetched data is not an array:', data);
                }
            }
        } catch (err: any) {
            console.error('Error:', err.message);
        }
    };

    const cancelUploadFile = async (id: any) => {
        try {
            await cancelUploadBankStatementFile({id: id});
            fetchUploadFiles();
        } catch (err: any) {
            console.error('Error:', err.message);
        }
    };

    const deleteUploadFile = async (id: any) => {
        try {
            await deleteBankStatementFile(id?.toString());
            fetchUploadFiles();
        } catch (err: any) {
            console.error('Error:', err.message);
        }
    };

    useEffect(() => {
        fetchUploadFiles();
    }, [bankId]);

    const fetchBankAccounts = async (filter: {
        relatedTo?: string;
    }): Promise<IBankAccount[] | undefined> => {
        setLoadingBankAccounts(true);
        const res = await getBankAccounts(filter || {relatedTo: userId});
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

    const gatAvailibleBankAccounts = async (relatedTo?: string) => {
        const banks = await fetchBanks();
        if (banks) {
            const myBankID = banks.find((el) => {
                const bankName1: string =
                    typeof bankAccountName === 'string' ? bankAccountName : '';
                // @ts-ignore
                const reversedName = ReversedBanksImportEnum[bankName1];
                const name = el.name;
                return name.toLowerCase() === reversedName.toLowerCase();
            })?._id;
            setBankId(myBankID?.toString());
            const BAccounts = await fetchBankAccounts(relatedTo ? {relatedTo} : {});
            if (BAccounts) {
                const bankAccounts: IBankAccount[] = [];
                BAccounts.forEach((account) => {
                    if (account.name === 'SHREE JI TRADERS BOM') {
                        debugger;
                    }
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
                setFile(null);
                setBankAccounts(bankAccounts);
            }
        }
    };
    useEffect(() => {
        if (!roles?.includes(RoleEnum.StatementManagement)) router.push(LOGIN_ROUTE);
    }, [roles]);
    useEffect(() => {
        if (bankAccountName && userId) {
            gatAvailibleBankAccounts().then(() => {});
        }
    }, [bankAccountName, userId]);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const checkUploadFileStatus = () => {
            if (uploadFiles.length) {
                const fileInProgress = uploadFiles.some(
                    (file) =>
                        file.status == UploadFileStatusEnum.inprogress ||
                        file.status == UploadFileStatusEnum.initiated ||
                        file.status == UploadFileStatusEnum.queue,
                );
                if (fileInProgress && intervalRef.current === null) {
                    intervalRef.current = setInterval(() => {
                        fetchUploadFiles();
                    }, 5000);
                } else if (!fileInProgress) {
                    if (intervalRef.current != null) {
                        clearInterval(intervalRef.current);
                    }
                    setLoading(false);
                    intervalRef.current = null;
                }
            }
        };

        const cleanup = () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        checkUploadFileStatus(); // Initial check

        return cleanup;
    }, [uploadFiles]); // Only re-run if uploadFiles changes

    useEffect(() => {
        return () => {
            // Cleanup when unmounting or navigating away
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []);

    return (
        <DashboardLayout>
            <Box
                sx={{
                    flexGrow: 1,
                    background: 'white',
                    borderRadius: `${theme.shape.borderRadius}px`,
                    py: 4,
                    mt: 4,
                }}
            >
                <Container maxWidth="lg">
                    <Box component="form" onSubmit={handleFormSubmit}>
                        <Typography variant="h5" sx={{mb: 2}}>
                            {bankAccountName} Statement Import
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
                                                {/* <TableCell align="center">Channel</TableCell> */}
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
                            <Grid item xs={12} sx={{pt: 0}}>
                                <RelatedToInput
                                    notRequired
                                    handleChange={(relatedTo: string) =>
                                        gatAvailibleBankAccounts(relatedTo)
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <LoadingButton
                                    type="submit"
                                    variant="contained"
                                    disabled={!bankAccounts?.length}
                                    loading={loadingBankAccounts || loading}
                                    startIcon={<UploadFile />}
                                    sx={{px: 5, textTransform: 'capitalize'}}
                                    color="primary"
                                >
                                    Upload Statement
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Box>
            <Box sx={{flexGrow: 1, borderRadius: `${theme.shape.borderRadius}px`, mt: 4}}>
                <FileUploadingMessage
                    uploadFiles={uploadFiles}
                    // cancelUploadFile={cancelUploadFile}
                    title="Last Uploaded Bank Statement Files"
                    pageRoute={STATEMENT_RECORDS_ROUTE}
                    navigatePermission={RoleEnum.StatementRecords}
                    buttonText="Statement Records"
                    showCount={false}
                    deleteUploadFile={deleteUploadFile}
                    deletePermission={RoleEnum.Delete}
                />
            </Box>
        </DashboardLayout>
    );
};

export default EditSettingPage;
