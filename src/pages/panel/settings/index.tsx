import {useSelector} from 'react-redux';
import React, {FormEvent, useEffect, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {CREATE_SETTING_ROUTE, LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {Button, CircularProgress, FormControlLabel, Grid, Switch} from '@mui/material';
import SettingsTable from '@/components/tables/settingsTable';
import {ISetting, ISettingDto} from '@/utils/interfaces/settings.interface';
import {getSettings} from '@/utils/services/bankSettings';
import MainFilter from '@/components/filter/mainFilter';
import {IUser} from '@/utils/interfaces/user.interface';
import { FilterEnums } from '@/utils/enums/filter';

const SettingPage = () => {
    const [loading, setLoading] = useState(false);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const userId = useSelector((state: RootState) => state.auth.user)?._id;
    const router = useRouter();
    const [settings, setSettings] = useState<ISetting[]>([]);
    const hideSettingDetails = !roles?.length ? true : !!roles?.includes(RoleEnum.HideSettingDetails);
    const [showTestCompany, setShowTestCompany] = useState(false);
    const id =  localStorage.getItem('id') || ""
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = {};
        formData.forEach((value, key) => {
            // @ts-ignore
            if (value) data[key] = value;
        });
        const {relatedTo,category} = data as ISettingDto;
        const res = await fetchSettings({relatedTo: relatedTo,category:category});
        if (res) setSettings(res);
    };
    const fetchSettings = async ({ relatedTo, category }: { relatedTo?: string; category?: string }): Promise<ISetting[] | undefined> => {
        setLoading(true);
        // @ts-ignore
        const res = (await getSettings({relatedTo,category}))?.filter(t => (t.relatedTo?.isActive ));
        setLoading(false);
        return res;
    };

    useEffect(() => {
        if (!roles?.includes(RoleEnum.Settings)) router.push(LOGIN_ROUTE);
    }, [roles]);
    useEffect(() => {
        if (roles?.includes(RoleEnum.Settings) && userId) {
            let filter: {relatedTo?: string,category?: string} = {};
            if (!roles?.includes(RoleEnum.UserControl)) {
                filter = {
                    ...filter,
                    relatedTo: userId,
                };
            }
            if(id === ""){
                fetchSettings(filter).then(res => {
                    if (res) setSettings(res);
                });
            }
        }
    }, [roles, userId]);

    useEffect( ()  => {
    const fetchData = async () => {
        try {
           const res = await fetchSettings({relatedTo:id,category:"All"});
           setSettings(res || []);
           console.log(res,"resresres")
        } catch (error) {
            // Handle errors
        }
    };
    fetchData();
    setTimeout(() => {
    localStorage.setItem('id', "")
}, 1000);
    }, [])
    

    return <DashboardLayout>
        <Box sx={{flexGrow: 1}}>
            <Container maxWidth="lg" sx={{mt: 4}}>
                <Box>
                    <MainFilter
                        filter={{}}
                        loading={false}
                        isOpen={true}
                        onSubmit={handleSubmit}
                        clientId={id}
                        selectedFilters={[FilterEnums.categories]} />
                </Box>
                {
                    roles?.includes(RoleEnum.Admin) &&
                    <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2, mb: 2}}>

                        <FormControlLabel
                            control={<Switch
                                checked={!showTestCompany}
                                onChange={() => setShowTestCompany(!showTestCompany)}
                            />}
                            sx={{ml: 1}}
                            label={showTestCompany ? 'Test' : 'Prod'}
                        />

                        <Button color="primary" variant="contained"
                                sx={{textTransform: 'capitalize'}}
                                onClick={() => router.push(CREATE_SETTING_ROUTE)}>
                            Create new Setting
                        </Button>
                    </Box>
                }
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {loading && <CircularProgress size={40} />}
                        {!loading &&
                            <SettingsTable
                                rows={settings.filter(s => (s.relatedTo as IUser | undefined)?.testMode === showTestCompany)} />}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    </DashboardLayout>;
};

export default SettingPage;