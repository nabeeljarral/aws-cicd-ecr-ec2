import {useSelector} from 'react-redux';
import React, {FormEvent, useEffect, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {Button} from '@mui/material';
import Typography from '@mui/material/Typography';
import {IOptionItem} from '@/components/filter/main/filterSelect';
import {getUsers} from '@/utils/services/user';
import {
    ChargeBackDto,
    ChargeBackResponse,
    InternalTransferResponse,
    TopUpDto,
    TopUpResponse,
    TransferDto,
} from '@/utils/interfaces/chargeBackInternalTransfer';
import {chargeBackApi, InternalTransferApi, topUpTransferAPI} from '@/utils/services/transfer';
import awesomeAlert from '@/utils/functions/alert';
import AddEditForm from './addEditForm';
import CustomDrawer from '@/components/filter/main/drawer';
import TransferHistoryPage from '../transfered-history';

const initialFormData: ChargeBackDto | TransferDto = {
    amount: 0,
    fromUser: '',
    remarks: '',
};

const TransferAmount = () => {
    const [loading, setLoading] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);
    const roles = user?.roles as RoleEnum[];
    const userId = user?._id as string;
    const router = useRouter();
    const [formData, setFormData] = useState<ChargeBackDto | TransferDto>(initialFormData);
    const [selectedUpdate, setSelectedUpdate] = useState<string>('chargeBack');
    const [userOptions, setUserOptions] = useState<IOptionItem[]>([]);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [fetchData, setFetchData] = useState<boolean>(false);

    const isTransferDto = (filter: ChargeBackDto | TransferDto): filter is TransferDto => {
        return (filter as TransferDto).toUser !== undefined;
    };

    const transferSubmit = async (
        filter?: ChargeBackDto | TransferDto| TopUpDto,
    ): Promise<ChargeBackResponse | InternalTransferResponse  | undefined> => {
        setLoading(true);

        if (filter) {
            filter = {
                ...filter,
                createdBy: userId,
            };
            console.log(filter);
            if (isTransferDto(filter)) {
                const res = await InternalTransferApi({
                    transferDto: filter,
                });
                setLoading(false);

                return res as InternalTransferResponse;
            } else if((filter as Record<string, any>)["row-radio-buttons-group"] === "chargeBack"){
                const res = await chargeBackApi({
                    chargeBackDto: filter,
                });

                setLoading(false);
                return res as ChargeBackResponse;
            }else if((filter as Record<string, any>)["row-radio-buttons-group"] === "topUp"){
                const res = await topUpTransferAPI({
                    topUpDto: filter,
                });

                setLoading(false);
                return res as TopUpResponse;
            }
        }

        setLoading(false);
        return undefined;
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | any) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    const handleSelectChange = (name: string, value: any) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data: Partial<ChargeBackDto | TransferDto> = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        const res = await transferSubmit(data);
        if (!res?.message) {
            awesomeAlert({msg: `Transaction Successful`});
            clearFields();
            setFetchData(true);
            handleCloseDrawer();
        }
        setTimeout(() => {
            setFetchData(false);
        });
        setLoading(false);
    };

    const clearFields = () => {
        setFormData({
            amount: 0,
            fromUser: '',
            order_id: '',
            remarks: '',
            toUser: '',
        });
    };

    useEffect(() => {
        clearFields();
    }, [selectedUpdate]);

    useEffect(() => {
        if (roles?.includes(RoleEnum.UserControl)) {
            getUsers()
                .then((res) => {
                    if (res?.length) {
                        const options = res
                            .filter((u) => u.isCompany && u.isActive)
                            .map((a) => ({
                                id: a._id,
                                value: a.email,
                            }));
                        setUserOptions(options);
                    }
                })
                .finally(() => {});
        }
    }, []);

    useEffect(() => {
        if (
            !roles?.some((role) =>
                [RoleEnum.ChargeBackInternalTransfer, RoleEnum.TransferHistory].includes(role),
            )
        ) {
            router.push(LOGIN_ROUTE);
        }
    }, [roles]);
    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    };

    return (
        <DashboardLayout>
            <Box sx={{flexGrow: 1}}>
                <Typography sx={{mt: 5, fontWeight: '500', fontSize: '24px', ml: 1}}>
                    Charge Back, Top Up & Internal Transfer
                </Typography>
                <Container maxWidth="lg" sx={{mt: 2}}>
                    {roles?.includes(RoleEnum.ChargeBackInternalTransfer) && (
                        <Box sx={{position:"absolute",right:"50px"}}>
                            <Button
                                color="primary"
                                variant="contained"
                                sx={{textTransform: 'capitalize'}}
                                onClick={() => setDrawerOpen(true)}
                            >
                                Create Transactions
                            </Button>
                        </Box>
                    )}

                    <CustomDrawer
                        open={drawerOpen}
                        onClose={handleCloseDrawer}
                        title="Charge Back, Top Up & Internal Transfer"
                    >
                        <AddEditForm
                            handleSubmit={handleSubmit}
                            selectedUpdate={selectedUpdate}
                            setSelectedUpdate={setSelectedUpdate}
                            userOptions={userOptions}
                            handleSelectChange={handleSelectChange}
                            handleInputChange={handleInputChange}
                            formData={formData}
                            loading={loading}
                        />
                    </CustomDrawer>

                    {roles?.includes(RoleEnum.TransferHistory) && (
                        <TransferHistoryPage fetchData={fetchData} />
                    )}
                </Container>
            </Box>
        </DashboardLayout>
    );
};
export default TransferAmount;
