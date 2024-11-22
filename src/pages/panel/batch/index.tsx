import {useSelector} from 'react-redux';
import React, {FormEvent, useEffect, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {
    Button,
    CircularProgress,
    DialogActions,
    DialogContent,
    Grid,
    TextField,
} from '@mui/material';
import MainFilter from '@/components/filter/mainFilter';
import {getBatches} from '@/utils/services/batch';
import {IBatch, IPayload} from '@/utils/interfaces/batch.interface';
import FilterSelect from '@/components/filter/main/filterSelect';
import {payoutExportFormatOptions} from '@/components/filter/options';
import {FilterEnums} from '@/utils/enums/filter';
import BatchesTable from '@/components/tables/BatchTable';
import {PayoutExportFormatsEnum} from '@/utils/enums/payoutExportFormats';
import {
    batchReport,
    checkReportCompleted,
    downloadReport,
    IReportExtraDataFormat,
    payoutTransactionReport,
} from '@/utils/services/reports';
import {IFilterTransactionDto} from '@/utils/dto/transactions.dto';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {HttpStatusCode} from 'axios';
import awesomeAlert from '@/utils/functions/alert';
import {AlertTypeEnum} from '@/utils/enums/alertType';
import axiosInstance from '@/utils/axios';
import {BATCH_MARK_AS_EXPORTED} from '@/utils/endpoints/endpoints';
import {BatchSplitByBankDialog} from '@/components/dialogs/BatchSplitByBank';

const BankAccountPage = () => {
    const [batches, setBatches] = useState<IBatch[]>([]);
    const [loading, setLoading] = useState(false);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const router = useRouter();
    const [selectedFormat, setSelectedFormat] = useState<PayoutExportFormatsEnum>(
        PayoutExportFormatsEnum.Default,
    );
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(50);
    const [selectedBatch, setSelectedBatch] = useState<IBatch | undefined>();
    const [open, setOpen] = useState(false);
    const [extraFieldsName, setExtraFieldsName] = useState<string[]>([]);
    const extraFieldsValue: any = {};
    const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);
    const [rowData, setRowData] = useState<any>();
    const [splitByBankDailog, setSplitByBankDailog] = useState(false);

    const closeSplitDialog = () => {
        setSplitByBankDailog(false);
    };
    const openSplitDialog = () => {
        setSplitByBankDailog(true);
    };
    const {batch} = router.query;
    const exportReport = async (batch: IBatch) => {
        if (!batch.comments?.length) {
            awesomeAlert({
                msg: 'Please add a comment before exporting the report.',
                type: AlertTypeEnum.error,
            });
            return;
        }
        setLoading(true);
        let values: string[] = [];
        if (
            !Object.keys(extraFieldsValue).length &&
            selectedFormat === PayoutExportFormatsEnum.AU
        ) {
            values = ['REMITTER ACCOUNT NO', 'REMITTER NAME', 'MOBILE NO', 'EMAIL'];
        }
        if (
            !Object.keys(extraFieldsValue).length &&
            selectedFormat === PayoutExportFormatsEnum.IDFC
        ) {
            values = ['Debit Account No.'];
        }
        if (
            !Object.keys(extraFieldsValue).length &&
            selectedFormat === PayoutExportFormatsEnum.YES
        ) {
            values = ['91BENE MOBILE NUMBER'];
        }
        if (
            !Object.keys(extraFieldsValue).length &&
            selectedFormat === PayoutExportFormatsEnum.HDFC
        ) {
            values = ['Bene Bank Branch Name', 'Beneficiary email id'];
        }
        if (
            !Object.keys(extraFieldsValue).length &&
            selectedFormat === PayoutExportFormatsEnum.RBL
        ) {
            values = [
                'Source Account Number',
                'Source Narration',
                'Destination Narration',
                'Email',
            ];
        }

        if (values.length) {
            setExtraFieldsName(values);
            setOpen(true);
            setSelectedBatch(batch);
            return;
        }

        const payload: {
            batchId?: string;
            format?: string;
            values?: IReportExtraDataFormat;
        } = {
            format: selectedFormat,
        };
        if (batch.name) payload.batchId = batch.name;

        if (Object.keys(extraFieldsValue).length) {
            payload.values = extraFieldsValue;
        }
        const batchName: string = batch.name ?? '';

        try {
            const res = await batchReport(payload, `${batchName}`);
            if (res?.status === HttpStatusCode.Forbidden) {
                await fetchBatches(); //Incase there is Export Button while the Batch is already Exported, refetch batch will remove the export button
                setLoading(false);
                throw new Error(res?.message);
            }

            if (res?._id) {
                const id = setInterval(() => {
                    checkReportCompleted(res._id).then(async (res) => {
                        if (res && res.fileAttached) {
                            if (id !== null) clearInterval(id);
                            if (!roles?.includes(RoleEnum.Admin)) await markAsExported(batch._id);
                            downloadReport(res._id, batchName, 'batch').then((res) => {
                                setLoading(false);
                            });
                        }
                    });
                }, 10000);
                setIntervalId(id);
            }
        } catch {
            setLoading(false);
        }
        // reset SelectedBatch
        setSelectedBatch(undefined);
        //reset extraFieldsValue
        for (const key in extraFieldsValue) {
            if (extraFieldsValue.hasOwnProperty(key)) {
                delete extraFieldsValue[key];
            }
        }
        // reset extraFieldsName
        setExtraFieldsName([]);
    };
    const markAsExported = async (batchId?: string) => {
        try {
            if (batchId) {
                const res = await axiosInstance({
                    method: 'put',
                    url: BATCH_MARK_AS_EXPORTED(batchId),
                });
                await fetchBatches();
                return res.data;
            }
        } catch (error: any) {
            console.error(error);
        }
    };
    const handleClose = () => {
        setOpen(false);
        if (selectedBatch) exportReport(selectedBatch);
    };

    const fetchBatches = async (filters?: IPayload): Promise<IBatch[] | undefined> => {
        setLoading(true);
        const filter: Partial<IBatch> = {};
        const batchId = filters?.batchId;
        delete filters?.batchId;
        const filterData = {...filters, name: batchId};
        const res = await getBatches({filter: filterData, page: page + 1, limit});
        if (res) {
            setTotal(res?.total);
            setBatches(res?.transactions);
        }
        setLoading(false);
        return res?.transactions;
    };
    const initialFilter: () => Partial<IBatch> = () => {
        const filter: Partial<IBatch> = {};
        if (typeof batch === 'string' && batch) {
            filter.batchId = batch;
        }
        return filter;
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data: IPayload = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        const {batchId} = data as Partial<IBatch>;
        const res = await fetchBatches(data);
        if (res) setBatches(res);
        setLoading(false);
    };

    useEffect(() => {
        if (roles && !loading) fetchBatches().then((r) => r);
    }, [page, limit, roles]);
    useEffect(() => {
        if (!roles?.includes(RoleEnum.Batch)) router.push(LOGIN_ROUTE);
    }, [roles]);
    useEffect(() => {
        return () => {
            if (intervalId !== null) clearInterval(intervalId);
        };
    }, [intervalId]);
    return (
        <DashboardLayout>
            <Box sx={{flexGrow: 1}}>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>
                        Fill the Extra Data to Export "{selectedFormat}" Format
                    </DialogTitle>
                    <DialogContent>
                        {extraFieldsName.map((field: string, index: number) => (
                            <TextField
                                key={index}
                                autoFocus
                                margin="dense"
                                size="small"
                                id={field}
                                label={field}
                                onChange={(e) => {
                                    extraFieldsValue[field] = e.currentTarget?.value;
                                }}
                                type="text"
                                fullWidth
                                variant="outlined"
                            />
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant="contained" sx={{m: 2}}>
                            Export
                        </Button>
                    </DialogActions>
                </Dialog>
                {/*<Head>*/}
                {/*    <title>Batch</title>*/}
                {/*</Head>*/}
                <Container maxWidth="lg" sx={{mt: 4}}>
                    <MainFilter
                        filter={initialFilter() as IFilterTransactionDto}
                        loading={loading}
                        onSubmit={handleSubmit}
                        selectedFilters={[FilterEnums.batch_name]}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box>
                            <FilterSelect
                                title="Format"
                                hideAllOption
                                name="format"
                                defaultValue={selectedFormat}
                                options={payoutExportFormatOptions}
                                handleChange={(value) => setSelectedFormat(value)}
                            />
                        </Box>
                        {rowData && (
                            <Box>
                                <Button
                                    onClick={() => openSplitDialog()}
                                    variant="contained"
                                    sx={{m: 1}}
                                >
                                    Split By Bank
                                </Button>
                            </Box>
                        )}
                    </Box>
                    <BatchSplitByBankDialog
                        ids={rowData?._id}
                        open={splitByBankDailog}
                        onClose={closeSplitDialog}
                        fetchBatchTableData={fetchBatches}
                        setRowData={setRowData}
                    />

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            {loading && <CircularProgress size={40} />}
                            {!loading && (
                                <BatchesTable
                                    loading={loading}
                                    setPage={(page) => setPage(page)}
                                    setLimit={(limit) => setLimit(limit)}
                                    limit={limit}
                                    page={page}
                                    total={total}
                                    exportReport={(b) => exportReport(b)}
                                    rows={batches}
                                    rowData={rowData}
                                    setRowData={setRowData}
                                />
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </DashboardLayout>
    );
};

export default BankAccountPage;
