import {useSelector} from 'react-redux';
import React, {useEffect, useRef, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE, PAYOUT_TRANSACTION_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import Typography from '@mui/material/Typography';
import {Grid} from '@mui/material';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import {theme} from '@/utils/theme';
import {MuiFileInput} from 'mui-file-input';
import {UploadFile} from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import {useS3Upload} from 'next-s3-upload';
import {
    cancelUploadPayoutFile,
    createPayoutTransactionByFile,
    getPayoutTransactionUploadFiles,
} from '@/utils/services/payoutTransactions';
import FileUploadingMessage from '@/components/alerts/FileUploadingMessage';
import {UploadFileStatusEnum} from '@/utils/enums/uploadFileStatus.enum';
import awesomeAlert from '@/utils/functions/alert';
import {AlertTypeEnum} from '@/utils/enums/alertType';
import {IUploadFileInfo} from '@/utils/interfaces/uploadFileInfo.interface';

const UploadPayoutTransactionsPage = () => {
    let {uploadToS3} = useS3Upload();
    const user = useSelector((state: RootState) => state.auth.user);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const [file, setFile] = useState<File | null>(null);
    const [uploadFiles, setUploadFiles] = useState<IUploadFileInfo[]>([]);

    const handleChange = (newValue: File | null) => {
        if (newValue) setFile(newValue);
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!file) return;

        try {
            setLoading(true);
            let {key} = await uploadToS3(file, {
                endpoint: {request: {url: '/api/s3-upload-payout'}},
            });
            const formData = {
                fileUrl: key,
                createdBy: user?._id || ':createdBy',
            };

            const res = await createPayoutTransactionByFile(formData).catch((err) =>
                console.log(err),
            );
            console.log({res});
            fetchUploadFiles();
        } catch (error) {
            setLoading(false);
            awesomeAlert({type: AlertTypeEnum.error, msg: 'Something went wrong.'});
            console.error(error);
        }
    };

    useEffect(() => {
        if (!roles?.includes(RoleEnum.UploadPayoutTransactionsFile)) router.push(LOGIN_ROUTE);
    }, [roles]);

    const fetchUploadFiles = async () => {
        try {
            const data = await getPayoutTransactionUploadFiles();
            if (Array.isArray(data)) {
                setUploadFiles(data);
            } else {
                console.error('Fetched data is not an array:', data);
            }
        } catch (err: any) {
            console.error('Error:', err.message);
        }
    };

    const cancelUploadFile = async (id: any) => {
        try {
            await cancelUploadPayoutFile({id: id});
            fetchUploadFiles();
        } catch (err: any) {
            console.error('Error:', err.message);
        }
    };

    useEffect(() => {
        fetchUploadFiles();
    }, []);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const checkUploadFileStatus = () => {
            if (uploadFiles.length) {
                const fileInProgress = uploadFiles.some(
                    (file) =>
                        file.status == UploadFileStatusEnum.inprogress ||
                        file.status == UploadFileStatusEnum.initiated,
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
                            Upload Payout Transactions
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sx={{mt: 3}}>
                                <MuiFileInput
                                    size="small"
                                    value={file}
                                    onChange={handleChange}
                                    placeholder="Upload transactions file"
                                    color="primary"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <LoadingButton
                                    type="submit"
                                    variant="contained"
                                    loading={loading}
                                    startIcon={<UploadFile />}
                                    sx={{pr: 5, pl: 4, textTransform: 'capitalize'}}
                                    color="primary"
                                >
                                    Upload
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Box>
            <Box sx={{flexGrow: 1, borderRadius: `${theme.shape.borderRadius}px`, mt: 4}}>
                <FileUploadingMessage
                    uploadFiles={uploadFiles}
                    cancelUploadFile={cancelUploadFile}
                    title="Payout Transaction Files uploaded from Last 24 hours"
                    pageRoute={PAYOUT_TRANSACTION_ROUTE}
                    buttonText="Payout Transaction"
                    navigatePermission={RoleEnum.PayoutTransactions}
                />
            </Box>
        </DashboardLayout>
    );
};

export default UploadPayoutTransactionsPage;
