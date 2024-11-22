import {useSelector} from 'react-redux';
import React, {FormEvent, useEffect, useState} from 'react';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import Box from '@mui/material/Box';
import {Button, FormControlLabel, FormLabel, Grid, Radio, RadioGroup} from '@mui/material';
import MainFilter from '@/components/filter/mainFilter';
import {FilterEnums} from '@/utils/enums/filter';
import {IBalanceHistory} from '@/utils/interfaces/balance.interface';
import {getInternalTransferTable} from '@/utils/services/balance';
import {BalanceTypeEnum} from '@/utils/enums/chargeBack-internalTransfer';
import ChargeBackTable from '@/components/tables/chargeBackTable';
import InternalTransferTable from '@/components/tables/internalTransfer';
import {checkReportCompleted, downloadReport} from '@/utils/services/reports';
import {transferReport} from '@/utils/services/transfer';
import {HttpStatusCode} from 'axios';
import {CloudDownload} from '@mui/icons-material';
import TopUpTable from '@/components/tables/topUpTable';

interface Props {
    fetchData: boolean;
}
const TransferHistoryPage = (props: Props) => {
    const {fetchData} = props;
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const userId = useSelector((state: RootState) => state.auth.user)?._id;
    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [limit, setLimit] = useState<number>(50);
    const [balanceHistory, setBalanceHistory] = useState<IBalanceHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedUpdate, setSelectedUpdate] = useState<string>('chargeBack');
    const [formData, setFormData] = useState<any>([]);
    const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);
    const [filteredData, setFilteredData] = useState<any>([FilterEnums.date_range]);

    const fetchTransferHistory = async (f?: Partial<IBalanceHistory>) => {
        setLoading(true);
        let filter = f ?? {relatedTo: userId};
        if (roles?.includes(RoleEnum.UserControl) && f === undefined) {
            delete filter?.relatedTo;
        }
        let transferType = [];
        if (selectedUpdate === 'chargeBack') {
            transferType = [BalanceTypeEnum.ChargeBack];
        } else if (selectedUpdate === 'internalTransfer') {
            transferType = [BalanceTypeEnum.InternalTransfer];
        } else if (selectedUpdate === 'topUp') {
            transferType = [BalanceTypeEnum.TopUp];
        } else {
            transferType = [BalanceTypeEnum.InternalTransfer, BalanceTypeEnum.ChargeBack];
        }
        // @ts-ignore
        filter = {...filter, type: {$in: filter.type ? [filter.type] : transferType}};

        const res = await getInternalTransferTable({page: page + 1, limit, filter});
        if (res) {
            setBalanceHistory(res.transactions || []);
            setTotal(res.total);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPage(0);
        const formData = new FormData(e.currentTarget);
        const data: Partial<IBalanceHistory> = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        setFormData(data);
        await fetchTransferHistory(data);
    };

    const exportReport = async () => {
        setLoading(true);
        let transferType = '';
        if (selectedUpdate === 'chargeBack') {
            transferType = BalanceTypeEnum.ChargeBack;
        } else if (selectedUpdate === 'internalTransfer') {
            transferType = BalanceTypeEnum.InternalTransfer;
        } else if (selectedUpdate === 'topUp') {
            transferType = BalanceTypeEnum.TopUp;
        }
        const payload = {...formData, type: transferType};
        try {
            const res = await transferReport(payload, `transfer-history`);
            if (res?.status === HttpStatusCode.Forbidden) {
                await fetchTransferHistory();
                setLoading(false);
                throw new Error(res?.message);
            }

            if (res?._id) {
                const id = setInterval(() => {
                    checkReportCompleted(res._id).then(async (res) => {
                        if (res && res.fileAttached) {
                            if (id !== null) clearInterval(id);
                            // if (!roles?.includes(RoleEnum.Admin))
                            downloadReport(res._id, `${transferType}`, 'batch').then((res) => {
                                setLoading(false);
                            });
                        }
                    });
                }, 1000);
                setIntervalId(id);
            }
        } catch {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId && !loading) {
            fetchTransferHistory().then((r) => r);
        }
    }, [page, limit, userId, selectedUpdate]);

    useEffect(() => {
        console.log(fetchData, 'boolean');
        fetchTransferHistory().then((r) => r);
    }, [fetchData]);

    useEffect(() => {
        return () => {
            if (intervalId !== null) clearInterval(intervalId);
        };
    }, [intervalId]);

    useEffect(() => {
        if (selectedUpdate === 'chargeBack' || selectedUpdate === 'topUp') {
            setFilteredData([FilterEnums.date_range]);
        } else {
            setFilteredData([
                FilterEnums.transfer_from,
                FilterEnums.transfer_to,
                FilterEnums.date_range,
            ]);
        }
    }, [selectedUpdate]);

    return (
        <Box sx={{flexGrow: 1}}>
            <Box sx={{mr: 'auto', ml: 1, mb: 2}}>
                <FormLabel id="select-radios-group">Select Transfer Method</FormLabel>
                <RadioGroup
                    value={selectedUpdate}
                    onChange={(e) => setSelectedUpdate(e.currentTarget?.value ?? '')}
                    row
                    aria-labelledby="select-radios-group"
                    name="row-radio-buttons-group"
                >
                    <FormControlLabel value="chargeBack" control={<Radio />} label="Charge Back" />
                    <FormControlLabel value="topUp" control={<Radio />} label="Top Up" />
                    <FormControlLabel
                        value="internalTransfer"
                        control={<Radio />}
                        label="Internal Transfer"
                    />
                </RadioGroup>
            </Box>
            <MainFilter
                loading={loading}
                onSubmit={handleSubmit}
                filter={{}}
                selectedFilters={filteredData}
            />
            <Box sx={{pb: 1, display: 'flex', justifyContent: 'flex-end'}}>
                <Button
                    variant="contained"
                    endIcon={<CloudDownload />}
                    onClick={() => exportReport()}
                >
                    Export to Excel
                </Button>
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {selectedUpdate === 'chargeBack' && (
                        <ChargeBackTable
                            loading={loading}
                            setPage={(page: number) => setPage(page)}
                            setLimit={(limit: number) => setLimit(limit)}
                            limit={limit}
                            page={page}
                            total={total}
                            balanceHistory={balanceHistory}
                            setBalanceHistory={(balanceHistory) => {
                                setBalanceHistory(balanceHistory);
                            }}
                        />
                    )}
                    {selectedUpdate === 'topUp' && (
                        <TopUpTable
                            loading={loading}
                            setPage={(page: number) => setPage(page)}
                            setLimit={(limit: number) => setLimit(limit)}
                            limit={limit}
                            page={page}
                            total={total}
                            balanceHistory={balanceHistory}
                            setBalanceHistory={(balanceHistory) => {
                                setBalanceHistory(balanceHistory);
                            }}
                        />
                    )}
                    {selectedUpdate === 'internalTransfer' && (
                        <InternalTransferTable
                            loading={loading}
                            setPage={(page: number) => setPage(page)}
                            setLimit={(limit: number) => setLimit(limit)}
                            limit={limit}
                            page={page}
                            total={total}
                            balanceHistory={balanceHistory}
                            setBalanceHistory={(balanceHistory) => {
                                setBalanceHistory(balanceHistory);
                            }}
                            formData={formData}
                        />
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default TransferHistoryPage;
