import {forwardRef, useEffect, useState} from 'react';
import Paper from '@mui/material/Paper';
import {useSelector} from 'react-redux';
import {IUser} from '@/utils/interfaces/user.interface';
import {RootState} from '@/store';
import {IColumn} from '@/utils/interfaces/table.interface';
import {addEllipsis, DateFormatter, PriceFormatter} from '@/utils/functions/global';
import MainTable from '@/components/tables/mainTable';
import {IBalanceHistory} from '@/utils/interfaces/balance.interface';
import {Box} from '@mui/material';
import {Button, Grid, TextField, Modal, IconButton} from '@mui/material';
import {RoleEnum} from '@/utils/enums/role';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import {ITicketStatusAR} from '@/utils/interfaces/ticketSummary.interface';
import {ticketApproveRemove} from '@/utils/services/ticketSummary';
import awesomeAlert from '@/utils/functions/alert';
import {AlertTypeEnum} from '@/utils/enums/alertType';
import React from 'react';

interface Props {
    limit: number;
    loading: boolean;
    page: number;
    setLimit: (limit: number) => void;
    setPage: (page: number) => void;
    total: number;
    ticketStatus: any;
    setTicketStatus?: (balances: any) => void;
    setApproveReject?: (status: number) => void;
    banks: any;
}
const initialFormData: ITicketStatusAR = {
    remark: '',
};

const styleforStatus = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '35%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    borderRadius: '15px',
};

const TicketSummaryTable = forwardRef((props: Props, ref) => {
    const {
        loading,
        ticketStatus,
        setTicketStatus,
        limit,
        setLimit,
        total,
        setPage,
        page,
        setApproveReject,
        banks,
    } = props;
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const [formData, setFormData] = useState<ITicketStatusAR>(initialFormData);
    const [rowData, setRowData] = useState({});

    const handleSwitch = async (row?: any, status?: any) => {
        const res = await ticketApproveRemove(row?._id, {
            status: status,
            remark: formData.remark && formData.remark,
        });
        if (!res?.message) {
            awesomeAlert({type: AlertTypeEnum.error, msg: 'Rejected'});
            // router.push();
            if (setApproveReject) setApproveReject(3);
        }
    };
    const handleOpen = (row: any) => {
        setOpenStatus(true);
        setRowData(row);
    };
    const handleOpenApprove = (row: any) => {
        setOpenStatusApprove(true);
        setRowData(row);
    };
    const handleConfirm = async (row: any) => {
        const res = await ticketApproveRemove(row?._id, {
            status: 2,
            approveutr: formData.approveutr && formData.approveutr,
        });
        if (!res?.message) {
            awesomeAlert({msg: 'Approved'});
            // router.push();
            if (setApproveReject) setApproveReject(2);
        }
    };

    const [openStatus, setOpenStatus] = useState(false);
    const [openStatusapprove, setOpenStatusApprove] = useState(false);
    const [validation, setValidation] = useState(false);

    const handleClose = () => {
        setFormData((prev: any) => ({
            ...prev,
            remark: '',
            freezeAmount: '',
            approveutr: '',
        }));
        setOpenStatus(false);
        setOpenStatusApprove(false);
    };

    const getBankName = (bankId: string) => {
        const bankMap = banks.reduce((map: Record<string, string>, bank: any) => {
            map[String(bank._id)] = bank.name;
            return map;
        }, {});
        console.log(bankMap, bankId, banks);
        return bankMap[bankId] || 'Unknown Bank';
    };

    const [columns, setColumns] = useState<IColumn[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData((prevFormData: any) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    const setRemarksAndAmount = () => {
        if (openStatus) {
            if (!formData?.remark) {
                setValidation(true);
            } else {
                handleSwitch(rowData, 3);
                setOpenStatus(false);
                setValidation(false);
            }
        } else {
            setOpenStatus(false);
            setValidation(false);
        }
    };

    const setApproveUTR = () => {
        if (openStatusapprove) {
            if (!formData?.approveutr) {
                setValidation(true);
            } else {
                handleConfirm(rowData);
                setOpenStatus(false);
                setOpenStatusApprove(false);
                setValidation(false);
            }
        } else {
            setOpenStatus(false);
            setOpenStatusApprove(false);
            setValidation(false);
        }
    };

    useEffect(() => {
        setColumns([
            {
                id: 'senderBankAccountId',
                label: 'Sender Account',
                minWidth: 240,
                format: (row: any) => {
                    return (
                        <Box sx={{display:"flex",flexDirection:"column"}}>
                            <Typography variant="body2" color="text.primary">
                                {row.name}
                            </Typography>
                            <Typography
                                component="span"
                                color="text.secondary"
                                sx={{fontSize: '14px'}}
                            >
                                <span style={{fontWeight: '600'}}>Acc no:</span> {row?.number}
                            </Typography>
                            <Typography
                                component="span"
                                color="text.secondary"
                                sx={{fontSize: '14px'}}
                            >
                                <span style={{fontWeight: '600'}}>Bank Name:</span>{' '}
                                {getBankName(row?.bankId)}
                            </Typography>
                        </Box>
                    );
                },
            },
            {
                id: 'receiverBankAccountId',
                label: 'Receiver Account',
                minWidth: 240,
                format: (row: any) => {
                    return (
                        <Box sx={{display:"flex",flexDirection:"column"}}>
                            <Typography variant="body2" color="text.primary">
                                {row.name}
                            </Typography>
                            <Typography
                                component="span"
                                color="text.secondary"
                                sx={{fontSize: '14px'}}
                            >
                                <span style={{fontWeight: '600'}}> Acc no:</span> {row?.number}
                            </Typography>
                            <Typography
                                component="span"
                                color="text.secondary"
                                sx={{fontSize: '14px'}}
                            >
                                <span style={{fontWeight: '600'}}>Bank Name:</span>{' '}
                                {getBankName(row?.bankId)}
                            </Typography>
                        </Box>
                    );
                },
            },
            {id: 'amount', label: 'Amount', minWidth: 100},
            {
                id: 'utr',
                label: 'UTR',
                minWidth: 120,
            },
            {
                id: 'approveutr',
                label: 'Approved by',
                minWidth: 170,
                passRow: true,
                format: (row: any) => {
                    return (
                        <>
                            <Typography variant="body2" color="text.primary">
                                {row.approveutr || '-'}
                            </Typography>
                        </>
                    );
                },
            },
            {
                id: 'createdBy',
                label: 'Created By',
                minWidth: 250,
                passRow: true,
                format: (row: any) => {
                    return (
                        <>
                            <Typography variant="body2" color="text.primary">
                                {row.createdBy.username}
                            </Typography>
                            <Typography
                                component="span"
                                color="text.secondary"
                                sx={{fontSize: '14px'}}
                            >
                                <span style={{fontWeight: '600'}}> Time:</span>{' '}
                                {DateFormatter(row?.createdAt ?? undefined)}
                            </Typography>
                        </>
                    );
                },
            },
            {
                id: 'creatorRemark',
                label: 'Creator Remarks',
                minWidth: 150,
            },
            {
                id: 'data',
                label: '',
                minWidth: 240,
                passRow: true,
                format: (row: any) => {
                    return (
                        <>
                            {row.status === 1 && (
                                <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        disabled={!roles?.includes(RoleEnum.ApproveOrRejectTicket)}
                                        onClick={() => handleOpenApprove(row)}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleOpen(row)}
                                        disabled={!roles?.includes(RoleEnum.ApproveOrRejectTicket)}
                                    >
                                        Reject
                                    </Button>
                                </Box>
                            )}
                            {row.status === 2 && (
                                <Box>
                                    <Typography variant="body2" color="text.primary">
                                        Approved by {row.updatedBy.username}
                                    </Typography>
                                    <Typography
                                        component="span"
                                        color="text.secondary"
                                        sx={{fontSize: '14px'}}
                                    >
                                        <span style={{fontWeight: '600'}}> Time:</span>{' '}
                                        {DateFormatter(row?.updatedAt ?? undefined)}
                                    </Typography>
                                </Box>
                            )}
                            {row.status === 3 && (
                                <Box>
                                    <Typography variant="body2" color="text.primary">
                                        Rejected by {row.updatedBy.username}
                                    </Typography>
                                    <Typography
                                        component="span"
                                        color="text.secondary"
                                        sx={{fontSize: '13px'}}
                                    >
                                        (Reason : {row?.remark})
                                    </Typography>
                                    <Typography color="text.secondary" sx={{fontSize: '14px'}}>
                                        <span style={{fontWeight: '600'}}> Time:</span>{' '}
                                        {DateFormatter(row?.updatedAt ?? undefined)}
                                    </Typography>
                                </Box>
                            )}
                        </>
                    );
                },
            },
        ]);
    }, [props]);

    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <MainTable
                loading={loading}
                setPage={(page) => setPage(page)}
                setLimit={(limit) => setLimit(limit)}
                limit={limit}
                page={page}
                total={total}
                rows={ticketStatus}
                columns={columns}
                background={ticketStatus}
            />
            <Modal
                keepMounted
                open={openStatus}
                // onClose={handleBodyData}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <>
                    <Box sx={styleforStatus}>
                        <IconButton
                            aria-label="close"
                            onClick={() => {
                                handleClose();
                            }}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Box>
                            <Typography>
                                <Typography component="span" sx={{fontWeight: 500}}>
                                    Please add the reason to Reject in remarks.
                                </Typography>
                            </Typography>
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12} md={12}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    type="text"
                                    id="remark"
                                    name="remark"
                                    value={formData?.remark}
                                    onChange={handleInputChange}
                                    required
                                    label="Remarks"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{mt: -2}} />
                                {validation && (
                                    <Typography sx={{color: 'red'}}>
                                        {' '}
                                        Please fill the Remarks
                                    </Typography>
                                )}
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Box sx={{mt: -2}} />

                                <Box>
                                    <Button
                                        // type="submit"
                                        variant="contained"
                                        sx={{
                                            px: 10,
                                            textTransform: 'capitalize',
                                        }}
                                        color="primary"
                                        onClick={() => {
                                            setRemarksAndAmount();
                                        }}
                                    >
                                        Submit
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </>
            </Modal>
            <Modal
                keepMounted
                open={openStatusapprove}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <>
                    <Box sx={styleforStatus}>
                        <IconButton
                            aria-label="close"
                            onClick={() => {
                                handleClose();
                            }}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Box>
                            <Typography>
                                <Typography component="span" sx={{fontWeight: 500}}>
                                    Please add the UTR to approve.
                                </Typography>
                            </Typography>
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12} md={12}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    type="text"
                                    id="approveutr"
                                    name="approveutr"
                                    value={formData?.approveutr}
                                    onChange={handleInputChange}
                                    required
                                    label="UTR By Approve"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{mt: -2}} />
                                {validation && (
                                    <Typography sx={{color: 'red'}}>
                                        {' '}
                                        Please fill the UTR
                                    </Typography>
                                )}
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Box sx={{mt: -2}} />

                                <Box>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            px: 10,
                                            textTransform: 'capitalize',
                                        }}
                                        color="primary"
                                        onClick={() => {
                                            setApproveUTR();
                                        }}
                                    >
                                        Submit
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </>
            </Modal>
        </Paper>
    );
});

export default TicketSummaryTable;
