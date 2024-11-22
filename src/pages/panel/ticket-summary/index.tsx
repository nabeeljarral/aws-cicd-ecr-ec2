import {useSelector} from 'react-redux';
import React, {FormEvent, useEffect, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {Button, Grid} from '@mui/material';
import {useRouter} from 'next/router';
import MainFilter from '@/components/filter/mainFilter';
import {FilterEnums} from '@/utils/enums/filter';
import TicketSummaryTable from '@/components/tables/ticketSummaryTable';
import {IBalanceHistory} from '@/utils/interfaces/balance.interface';
import Typography from '@mui/material/Typography';
import CustomDrawer from '@/components/filter/main/drawer';
import {
    ITicketSummaryResponse,
    ITicketResponseData,
} from '@/utils/interfaces/ticketSummary.interface';
import {getTickets} from '@/utils/services/ticketSummary';
import AddEditForm from './addEditForm';
import { getBanks } from '@/utils/services/bank';
import { IVendor } from '@/utils/interfaces/vendor.interface';
import { IBank } from '@/utils/interfaces/bankAccount.interface';

const TicketSummary = () => {
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const userId = useSelector((state: RootState) => state.auth.user)?._id;
    const user = useSelector((state: RootState) => state.auth.user);
    const router = useRouter();
    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [limit, setLimit] = useState<number>(50);
    const [ticketStatus, setTicketStatus] = useState<ITicketSummaryResponse[]>([]);
    const [responseData, setResponseData] = useState<ITicketResponseData | null>(null);
    const [loading, setLoading] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [filter, setFilter] = useState<Partial<IBalanceHistory>>();
    const [approveReject, setApproveReject] = useState<any>();
    const [banks, setBanks] = React.useState<IVendor[]>([]);

    const fetchTicketSummary = async (f?: Partial<IBalanceHistory>) => {
        setLoading(true);
        let filter = f ?? {};

        const res = await getTickets({page: page + 1, limit, filter});
        if (res) {
            setTicketStatus(res?.data || []);
            setResponseData(res);
            setTotal(res?.total);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPage(0);
        const formData = new FormData(e.currentTarget);
        const data: Partial<ITicketSummaryResponse> = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        const updatedData = {
            ...data,
            status: Number(data?.status),
        };
        setFilter(updatedData);
        await fetchTicketSummary(updatedData);
    };

    const fetchBanks = async (): Promise<IBank[] | undefined> => {
        try {
            const res = await getBanks();
            if (res) setBanks(res);
            return res;
        } catch (err) {
            console.log(err);
        }
    };
    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    };

    useEffect(() => {
        if (approveReject) {
            fetchTicketSummary();
        }
    }, [approveReject]);

    useEffect(() => {
        fetchBanks().then((res) => res);
    }, [])
    
    useEffect(() => {
        if (userId && !loading) fetchTicketSummary(filter).then((r) => r);
    }, [page, limit, userId]);
    useEffect(() => {
        if (!roles?.includes(RoleEnum.TicketSummary)) router.push(LOGIN_ROUTE);
    }, [roles]);
    return (
        <DashboardLayout>
            <Box sx={{flexGrow: 1}}>
                <Container maxWidth="lg" sx={{mt: 4}}>
                    <Typography sx={{mb: 3, fontWeight: '500', fontSize: '24px', ml: 1}}>
                        Ticket Summary
                    </Typography>
                   <MainFilter
                        loading={loading}
                        onSubmit={handleSubmit}
                        filter={{}}
                        selectedFilters={[
                            FilterEnums.ticket_status,
                            FilterEnums.utr,
                            FilterEnums.noRelatedTo,
                            FilterEnums.date_range,
                            FilterEnums.sender_account,
                            FilterEnums.receiver_account,
                        ]}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                            ml: 1,
                        }}
                    >
                        <Typography sx={{fontWeight: 600}}>
                            Total Amount : {responseData?.totalAmount}
                        </Typography>
                        {roles?.includes(RoleEnum.CreateTicket) && (
                            <Box>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    sx={{textTransform: 'capitalize'}}
                                    onClick={() => setDrawerOpen(true)}
                                >
                                    Create Ticket
                                </Button>
                            </Box>
                        )}
                    </Box>

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TicketSummaryTable
                                loading={loading}
                                setPage={(page: number) => setPage(page)}
                                setLimit={(limit: number) => setLimit(limit)}
                                limit={limit}
                                page={page}
                                total={total}
                                ticketStatus={ticketStatus}
                                setTicketStatus={(ticketStatus) => {
                                    setTicketStatus(ticketStatus);
                                }}
                                setApproveReject={(status: number) => setApproveReject(status)}
                                banks={banks}
                            />
                        </Grid>
                    </Grid>
                </Container>
                <CustomDrawer open={drawerOpen} onClose={handleCloseDrawer} title="Generate Ticket">
                    <Typography sx={{mt: 2, fontWeight: '500', fontSize: '18px'}}>
                        User :{' '}
                        <Typography component="span" sx={{fontSize: '18px'}}>
                            {user?.username}
                        </Typography>
                    </Typography>
                    <AddEditForm
                        setDrawerOpen={setDrawerOpen}
                        fetchTicketSummary={fetchTicketSummary}
                        banks={banks}
                    />
                </CustomDrawer>
            </Box>
        </DashboardLayout>
    );
};

export default TicketSummary;
