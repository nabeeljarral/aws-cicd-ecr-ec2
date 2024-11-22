import React from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    IconButton,
    Typography,
} from '@mui/material';
import {Delete, ErrorOutlineRounded} from '@mui/icons-material';
import moment from 'moment';
import {RoleEnum} from '@/utils/enums/role';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {UploadFileStatusEnum} from '@/utils/enums/uploadFileStatus.enum';
import router from 'next/router';
import CloseIcon from '@mui/icons-material/Close';
import {IUploadFileInfo} from '@/utils/interfaces/uploadFileInfo.interface';
import AlertPrompt from './AlertPrompt';
import {ChannelsEnum} from '@/utils/enums/accountDetails.enums';

type Props = {
    cancelUploadFile?: (id: string) => void;
    deleteUploadFile?: (id: string) => Promise<any>;
    uploadFiles: IUploadFileInfo[];
    title?: string;
    pageRoute?: string;
    buttonText?: string;
    navigatePermission?: RoleEnum;
    showCount?: boolean;
    deletePermission?: RoleEnum;
};

const FileUploadingMessage: React.FC<Props> = ({
    uploadFiles,
    cancelUploadFile,
    deleteUploadFile,
    title,
    pageRoute,
    buttonText,
    navigatePermission,
    deletePermission,
    showCount = true,
}) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const roles = user?.roles as RoleEnum[];
    const canNavigate = navigatePermission ? roles?.includes(navigatePermission) : false;
    const canDelete = deletePermission ? roles?.includes(deletePermission) : false;

    const [open, setOpen] = React.useState(false);
    const [itemId, setItemId] = React.useState<string>('');
    const handleClickOpen = (id: string) => {
        setOpen(true);
        setItemId(id);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirmDelete = () => {
        deleteUploadFile &&
            deleteUploadFile(itemId).then(() => {
                setOpen(false);
            });
    };

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 3, pb: 3}}>
            <Container>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        p: 2,
                        mb: 2,
                        height: '50px',
                        width: '100%',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow:
                            '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
                    }}
                >
                    <h1>{title}</h1>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                    {uploadFiles.map((file) => (
                        <Box
                            key={file._id}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: 2,
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                boxShadow:
                                    '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Box>
                                    <Box>
                                        <strong>Uploading Start At:</strong>{' '}
                                        {moment(file.createdAt).format('DD MMM YYYY hh:mm:ss')}
                                        <br />
                                    </Box>
                                    <Box>
                                        <strong>File Name: </strong>
                                        <span>{file?.fileName || file?.filename}</span>
                                    </Box>
                                    {file?.status && (
                                        <Box>
                                            <strong>Status: </strong>

                                            {UploadFileStatusEnum.initiated == file.status ? (
                                                <Chip
                                                    sx={{
                                                        color: '#956621',
                                                        background: '#9566212b',
                                                        padding: '2px',
                                                    }}
                                                    label="The upload of the File is Initiated"
                                                />
                                            ) : UploadFileStatusEnum.canceled == file.status ? (
                                                <Chip
                                                    sx={{
                                                        color: '#c30000',
                                                        background: '#ffe0e0',
                                                        padding: '2px',
                                                    }}
                                                    label="The upload of the File is Canceled"
                                                />
                                            ) : UploadFileStatusEnum.failed == file.status ? (
                                                <Chip
                                                    sx={{
                                                        color: '#c30000',
                                                        background: '#ffe0e0',
                                                        padding: '2px',
                                                    }}
                                                    label="The upload of the File is Failed"
                                                />
                                            ) : UploadFileStatusEnum.completed == file?.status &&
                                              file?.processedCount ? (
                                                <Chip
                                                    sx={{
                                                        color: '#04877b',
                                                        background: '#baefea',
                                                        padding: '2px',
                                                    }}
                                                    label="The upload of the File is Completed"
                                                />
                                            ) : UploadFileStatusEnum.completed == file?.status &&
                                              file?.processedCount == 0 ? (
                                                <Chip
                                                    sx={{
                                                        color: '#956621',
                                                        background: '#FFFACD',
                                                        padding: '2px',
                                                    }}
                                                    label="The process completed. Checkout the logs below"
                                                />
                                            ) : UploadFileStatusEnum.inprogress == file.status ? (
                                                <Chip
                                                    sx={{
                                                        color: '#0a5272',
                                                        background: '#cfecf8',
                                                        padding: '2px',
                                                    }}
                                                    label="The upload of the File is In Progress"
                                                />
                                            ) : UploadFileStatusEnum.queue == file.status ? (
                                                <Chip
                                                    sx={{
                                                        color: '#ffffff',
                                                        background: '#bc9ae3',
                                                        padding: '2px',
                                                    }}
                                                    label="The upload of the File is In Queue"
                                                />
                                            ) : (
                                                <Chip
                                                    sx={{
                                                        color: '#956621',
                                                        padding: '2px',
                                                        background: '#9566212b',
                                                    }}
                                                    label={file.status}
                                                />
                                            )}
                                        </Box>
                                    )}
                                    {showCount && file?.payoutTansactionsCount !== undefined && (
                                        <Box>
                                            <strong>Total Payout Transactions: </strong>
                                            <span>{file?.payoutTansactionsCount}</span>
                                        </Box>
                                    )}
                                    {showCount && file?.tansactionsCount !== undefined && (
                                        <Box>
                                            <strong>Total Credited Transactions: </strong>
                                            <span>{file?.tansactionsCount}</span>
                                        </Box>
                                    )}
                                    {showCount && (
                                        <Box>
                                            <strong>Processed Count: </strong>
                                            <span>{file?.processedCount}</span>
                                            {file?.processedCount && (
                                                <Typography
                                                    component="span"
                                                    sx={{color: '#04877b', ml: 1}}
                                                >
                                                    (Successfully uploaded)
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                    {showCount && (
                                        <Box>
                                            <strong>Not Processed Count: </strong>
                                            <span>{file?.notProcessedCount}</span>
                                            {file?.notProcessedCount && (
                                                <Typography
                                                    component="span"
                                                    sx={{color: '#c30000', ml: 1}}
                                                >
                                                    (Check the logs)
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                                <Box>
                                    {file?.isCompleted &&
                                        canNavigate &&
                                         (
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: '#5ca9a2',
                                                    '&:hover': {
                                                        backgroundColor: '#5ca9a2',
                                                        opacity: 0.8,
                                                    },
                                                }}
                                                onClick={() => router.push(`${pageRoute}`)}
                                            >
                                                Go to {buttonText} Page
                                            </Button>
                                        )}
                                    {file?.isCompleted && canDelete && (
                                        <IconButton
                                            sx={{
                                                backgroundColor: '#c30000',
                                                marginLeft: '10px',
                                                marginRight: '10px',
                                                '&:hover': {
                                                    backgroundColor: 'darkred',
                                                    opacity: 0.8,
                                                },
                                            }}
                                            onClick={() => handleClickOpen(file._id)}
                                        >
                                            <Delete style={{color: 'white'}} />
                                        </IconButton>
                                    )}
                                    {UploadFileStatusEnum.failed == file.status && (
                                        <Chip
                                            sx={{
                                                color: '#c30000',
                                                background: '#ffe0e0',
                                                mb: 1,
                                            }}
                                            label={
                                                file.isDuplicated ? (
                                                    <>
                                                        <ErrorOutlineRounded sx={{mr: 1}} />
                                                        File is duplicated
                                                    </>
                                                ) : (
                                                    <>
                                                        <ErrorOutlineRounded sx={{mr: 1}} />
                                                        Something went wrong
                                                    </>
                                                )
                                            }
                                        />
                                    )}
                                    {UploadFileStatusEnum.initiated == file.status ||
                                    UploadFileStatusEnum.inprogress == file.status ||
                                    UploadFileStatusEnum.queue == file.status ? (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1,
                                                alignItems: 'end',
                                            }}
                                        >
                                            <Chip
                                                sx={{
                                                    color: '#0a5272',
                                                    background: '#cfecf8',
                                                }}
                                                label={
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            letterSpacing: '0.02857em',
                                                        }}
                                                    >
                                                        <CircularProgress
                                                            color="inherit"
                                                            size={20}
                                                            sx={{
                                                                mr: 1,
                                                            }}
                                                        />
                                                        {file.status ===
                                                            UploadFileStatusEnum.queue ||
                                                        file.status ===
                                                            UploadFileStatusEnum.initiated ? (
                                                            <span>Your upload will start soon</span>
                                                        ) : (
                                                            <span>
                                                                Please wait your file is uploading
                                                            </span>
                                                        )}
                                                    </Box>
                                                }
                                            />
                                            {cancelUploadFile && (
                                                <Box>
                                                    <Button
                                                        variant="contained"
                                                        sx={{
                                                            color: '#c30000',
                                                            background: '#ffe0e0',
                                                            '&:hover': {
                                                                backgroundColor: '#ffe0e0',
                                                                opacity: 0.8,
                                                            },
                                                        }}
                                                        onClick={() => cancelUploadFile(file?._id)}
                                                    >
                                                        <CloseIcon sx={{mr: 1}} /> Cancel Upload File
                                                    </Button>
                                                </Box>
                                            )}
                                        </Box>
                                    ) : (
                                        ''
                                    )}
                                </Box>
                            </Box>
                            <Box>
                                {file?.createdBy?.username && (
                                    <>
                                        <Box>
                                            <strong>Created by: </strong>
                                            {file?.createdBy?.username}
                                        </Box>
                                    </>
                                )}
                            </Box>
                            <Box>
                                {file?.canceledBy?.username && (
                                    <>
                                        <Box>
                                            <strong>Canceled by: </strong>
                                            {file?.canceledBy?.username}
                                        </Box>
                                    </>
                                )}
                            </Box>
                            {file?.logs && file?.logs.length > 0 && (
                                <Box>
                                    <>
                                        <strong>Logs:</strong>
                                        <br />
                                        <Box
                                            sx={{
                                                height: '75px',
                                                overflow: 'auto',
                                                background: 'black',
                                                color: '#e3e3e3',
                                                padding: '0 5px',
                                            }}
                                        >
                                            {file?.logs.map((log, index) => (
                                                <Box key={`${file?._id}-${index}`}>{log}</Box>
                                            ))}
                                        </Box>
                                    </>
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>
                {/* Confirmation Dialog */}
                <AlertPrompt
                    open={open}
                    onClose={handleClose}
                    onReject={handleClose}
                    onAccept={handleConfirmDelete}
                    title="Do You Want To Delete This File?"
                    content="The file will be deleted. This action cannot be undone."
                />
            </Container>
        </Box>
    );
};

export default FileUploadingMessage;
