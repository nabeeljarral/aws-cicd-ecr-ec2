import Container from '@mui/material/Container';
import {Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {theme} from '@/utils/theme';
import Typography from '@mui/material/Typography';
import awesomeAlert from '@/utils/functions/alert';
import {useRouter} from 'next/router';
import {USERS_ROUTE} from '@/utils/endpoints/routes';
import {RoleEnum} from '@/utils/enums/role';
import {IUserDto} from '@/utils/dto/user.dto';
import {createUser, getUser, updateUser} from '@/utils/services/user';
import {IUser} from '@/utils/interfaces/user.interface';
import {booleanOptions} from '@/components/filter/options';
import {Add, Edit, EditOff} from '@mui/icons-material';


const initialFormData: IUserDto = {
    username: '',
    email: '',
    password: '',
    redirectUrl: '',
    description: '',
    callbackUrl: '',
    ips: [],
    payin_fees_percent: 0,
    payout_fees_percent: 0,
    settlement_fees_percent: 0,
    isActive: false,
    testMode: false,
    roles: [],
};

type Props = {
    id?: string
}
export const EditCreateUser = (props: Props) => {
    const [loading, setLoading] = useState(false);
    const [hidePassword, setHidePassword] = useState(true);
    const [formData, setFormData] = useState<IUserDto>(initialFormData);
    const router = useRouter();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    const handleInputChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        const index = parseInt(name.split('_')[1]);
        console.log({index, name, value});
        setFormData((prevFormData) => ({
            ...prevFormData,
            ips: prevFormData?.ips.map((el: string, i: number) => i === index ? value : el),
        }));
    };
    const fetchUser = async (): Promise<IUser | undefined> => {
        setLoading(true);
        const res = await getUser({id: props.id || ''});
        setLoading(false);
        return res;
    };
    const handleIsActiveChange = (
        event: React.ChangeEvent<{value: unknown}>,
    ) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            isActive: event.target.value as boolean,
        }));
    };
    const handleTestModeChange = (
        event: React.ChangeEvent<{value: unknown}>,
    ) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            testMode: event.target.value as boolean,
        }));
    };
    const submitUpdateUser = async (payload: IUserDto): Promise<IUser> => {
        setLoading(true);
        if (!payload?.password) delete payload.password;
        const res = await updateUser(payload);
        setLoading(false);
        if (res) {
            awesomeAlert({msg: 'Successfully Updated'});
            await router.push(USERS_ROUTE);
        }
        return res;
    };
    const submitNewUser = async (payload: IUserDto): Promise<IUser | undefined> => {
        setLoading(true);
        const res = await createUser(payload);
        setLoading(false);
        if (res) {
            awesomeAlert({msg: 'Successfully Created'});
            await router.push(USERS_ROUTE);
        }
        return res;
    };
    const removePassword = () => {
        setHidePassword(true);
        setFormData((prevFormData) => ({
            ...prevFormData,
            password: '',
        }));
    };
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        formData.ips = formData?.ips?.filter(ip => !!(ip.trim()));
        if (formData._id) {
            await submitUpdateUser(formData);
        } else {
            const payload: IUserDto = {
                username: formData?.username,
                email: formData?.email,
                password: formData?.password,
                ips: formData?.ips,
            };
            await submitNewUser(payload);
        }
    };
    const addNewIP = () => {
        setFormData((oldFD) => ({
            ...oldFD,
            ips: [
                ...oldFD.ips,
                '',
            ],
        }));
    };

    useEffect(() => {
        if (!!props.id) {
            fetchUser().then(res => {
                if (res) {
                    setFormData((old) => ({
                        ...old,
                        ...res,
                        password: '',
                    }));
                }
            });
        }
    }, [props.id]);

    return (
        <Box sx={{
            mt: 8,
            pb: 3,
            flexGrow: 1,
            background: 'white',
            borderRadius: theme.shape.borderRadius + 'px',
        }}>
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    {loading && <CircularProgress size={50} />}
                    {!loading && <Grid item xs={12}>
                        <Typography sx={{my: 2}} variant="h5">
                            {props.id ? `Edit Company ${props.id}` : 'Create New Company'}
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                size="small"
                                required
                                fullWidth
                                margin="normal"
                                id="username"
                                name="username"
                                label="Username"
                                value={formData?.username}
                                onChange={handleInputChange}
                            />
                            <TextField
                                size="small"
                                required
                                fullWidth
                                margin="normal"
                                id="email"
                                name="email"
                                label="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />

                            {
                                hidePassword && !!formData._id &&
                                <Button sx={{textTransform: 'capitalize'}} onClick={() => setHidePassword(false)}>
                                    <Edit fontSize="small" sx={{mr: 1}} />
                                    Change Password
                                </Button>
                            }
                            {
                                !hidePassword && !!formData._id &&
                                <Button sx={{textTransform: 'capitalize'}} onClick={removePassword}>
                                    <EditOff fontSize="small" sx={{mr: 1}} /> keep Password
                                </Button>
                            }
                            {
                                (!formData._id || !(hidePassword && !!formData._id)) &&
                                <TextField
                                    size="small"
                                    fullWidth
                                    required
                                    margin="normal"
                                    id="password"
                                    name="password"
                                    label={!formData._id ? 'Password' : 'New Password'}
                                    onChange={handleInputChange}
                                />
                            }

                            <TextField
                                size="small"
                                fullWidth
                                margin="normal"
                                id="redirectUrl"
                                name="redirectUrl"
                                label="Redirect Url"
                                helperText="To infuse a dynamic essence into this redirect url, incorporate '{transactionId}' in a seamless manner."
                                value={formData.redirectUrl}
                                onChange={handleInputChange}
                            />
                            <TextField
                                size="small"
                                fullWidth
                                margin="normal"
                                id="callbackUrl"
                                name="callbackUrl"
                                label="Payin Callback Url"
                                value={formData.callbackUrl}
                                onChange={handleInputChange}
                            />
                            <TextField
                                size="small"
                                fullWidth
                                margin="normal"
                                id="payoutCallbackUrl"
                                name="payoutCallbackUrl"
                                label="Payout Callback Url"
                                value={formData.payoutCallbackUrl}
                                onChange={handleInputChange}
                            />
                            <TextField
                                size="small"
                                fullWidth
                                margin="normal"
                                id="description"
                                name="description"
                                label="Description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />

                            <Box style={{display: 'flex', gap: 10}}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    id="payin_fees_percent"
                                    name="payin_fees_percent"
                                    label="Payin percent %"
                                    value={formData.payin_fees_percent}
                                    onChange={handleInputChange}
                                />

                                <TextField
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    id="payout_fees_percent"
                                    name="payout_fees_percent"
                                    label="Payout percent %"
                                    value={formData.payout_fees_percent}
                                    onChange={handleInputChange}
                                />

                                <TextField
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    id="settlement_fees_percent"
                                    name="settlement_fees_percent"
                                    label="Settlement percent %"
                                    value={formData.settlement_fees_percent}
                                    onChange={handleInputChange}
                                />
                            </Box>

                            <TextField
                                size="small"
                                fullWidth
                                margin="normal"
                                id="hours_until_balance_activation"
                                name="hours_until_balance_activation"
                                label="Hours Until Balance Activation"
                                value={formData.hours_until_balance_activation}
                                onChange={handleInputChange}
                            />
                            {
                                !!formData._id && <>
                                    <FormControl size="small" fullWidth margin="normal">
                                        <InputLabel id="isActive_label">Is Active *</InputLabel>
                                        <Select
                                            labelId="isActive_label"
                                            label="Is Active"
                                            required
                                            id="isActive"
                                            name="isActive"
                                            value={formData.isActive}
                                            // @ts-ignore
                                            onChange={handleIsActiveChange}
                                        >
                                            {
                                                booleanOptions.map((option, i) => (
                                                    <MenuItem key={i} value={option.id}>
                                                        {option.value}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <FormControl size="small" fullWidth margin="normal">
                                        <InputLabel id="testMode_label">Test Mode *</InputLabel>
                                        <Select
                                            labelId="testMode_label"
                                            label="Test Mode"
                                            required
                                            id="isActive"
                                            name="isActive"
                                            value={formData.testMode}
                                            // @ts-ignore
                                            onChange={handleTestModeChange}
                                        >
                                            {
                                                booleanOptions.map((option, i) => (
                                                    <MenuItem key={i} value={option.id}>
                                                        {option.value}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <FormControl size="small" fullWidth margin="normal">
                                        <InputLabel id="roles-label">Roles *</InputLabel>
                                        <Select
                                            label="Roles"
                                            labelId="roles-label"
                                            required
                                            id="roles"
                                            name="roles"
                                            multiple
                                            value={formData.roles}
                                            // @ts-ignore
                                            onChange={handleInputChange}
                                        >
                                            {
                                                Object.values(RoleEnum).map((option, i) => (
                                                    <MenuItem key={i} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </>
                            }
                            {
                                formData?.ips.map((ip: string, i) =>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        margin="normal"
                                        key={i}
                                        id={`ips_${i}`}
                                        name={`ips_${i}`}
                                        label={`White List IP - ${i + 1}`}
                                        value={ip}
                                        onChange={handleInputChange2}
                                    />)
                            }
                            <Box>
                                <Button type="button" variant="outlined"
                                        onClick={() => addNewIP()}
                                        sx={{pl: 2, pr: 3, mt: 2, textTransform: 'capitalize'}}
                                        startIcon={<Add />}
                                        color="primary">
                                    Add IP
                                </Button>
                            </Box>

                            <Box>
                                <Button type="submit" variant="contained"
                                        sx={{px: 10, mt: 3, textTransform: 'capitalize'}}
                                        color="primary">
                                    {props.id ? 'Update' : 'Submit'}
                                </Button>
                            </Box>
                        </form>
                    </Grid>}
                </Grid>
            </Container>
        </Box>
    );
};