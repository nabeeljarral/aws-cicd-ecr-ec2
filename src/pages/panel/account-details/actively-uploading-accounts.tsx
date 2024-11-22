import {useSelector} from 'react-redux';
import React, {useEffect, useRef, useState} from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import {ACCOUNTS_DETAILS_ROUTE, LOGIN_ROUTE} from '@/utils/endpoints/routes';
import {useRouter} from 'next/router';
import Typography from '@mui/material/Typography';
import {
    Button,
    ClickAwayListener,
    Grid,
    IconButton,
    Popover,
    Step,
    StepButton,
    StepContent,
    Stepper,
    TextField,
} from '@mui/material';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import {theme} from '@/utils/theme';
import {MuiFileInput} from 'mui-file-input';
import {ArrowBack, UploadFile} from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import {useS3Upload} from 'next-s3-upload';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import {
    createPayoutTransactionByFile,
    getPayoutTransactionUploadFiles,
} from '@/utils/services/payoutTransactions';
import FileUploadingMessage from '@/components/alerts/FileUploadingMessage';
import { UploadFileStatusEnum } from '@/utils/enums/uploadFileStatus.enum';
import { IUploadFileInfo } from '@/utils/interfaces/uploadFileInfo.interface';
import awesomeAlert from '@/utils/functions/alert';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import InfoIcon from '@mui/icons-material/Info';
import {AlertTypeEnum} from '@/utils/enums/alertType';
import {getBankAccounts} from '@/utils/services/accountDetails';
import {
    BankAccountStatusEnum,
    BankAccountTypesEnum,
    ChannelsEnum,
} from '@/utils/enums/accountDetails.enums';
import {AccountDetailsCardChannels, AccountDetailsChannels, bankAccountStatusOptionsFilter} from '@/components/filter/options';
import Icon from '@mdi/react';
import {mdiAccount, mdiCancel, mdiUploadCircle, mdiUploadCircleOutline, mdiUploadOffOutline, mdiUploadOutline} from '@mdi/js';

const ActivelyUploadingAccounts = () => {
    let {uploadToS3} = useS3Upload();
    const user = useSelector((state: RootState) => state.auth.user);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const [file, setFile] = useState<File | null>(null);
    const [limit, setLimit] = useState(200);
    const [page, setPage] = useState(0);
    const [data, setData] = useState<any>([]);
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [active, SetActive] = useState(false);
    const [query, setSearchQuery] = useState<any>('');
    const [filteredData, setFilteredData] = useState<any>(data);
    const [popupData, setPopupData] = useState<any>({});
    const openPopover = Boolean(anchorEl);
    const [dailogAnchorEl, setDailogAnchorEl] = useState(false);

    const [uploadFiles, setUploadFiles] = useState<IUploadFileInfo[]>([]);

    const handleChange = (newValue: File | null) => {
        if (newValue) setFile(newValue);
    };

    const handleRouter = async (n: any) => {
        // setClosingBalanceData(n);
        setActiveStep(n.statusHistory.length - 1);
        // setOpen(!open);
        setPopupData(n);
        SetActive(n.is_active);
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

    const fetchBankAccount = async (formData?: any): Promise<any> => {
        const payloadData = {accountType: 1, status: [2, 3, 4]};
        setLoading(true);

        const res: any = await getBankAccounts({
            filter: payloadData || {},
            page: page + 1,
            limit,
        });
        setLoading(false);
        const {bankAccounts} = res;
        setData(res);
        return bankAccounts;
    };
    useEffect(() => {
        fetchBankAccount()
            .then((res) => {
                if (res) {
                    setData(res);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchBankAccount().then((res) => {
                if (res) {
                    setData(res);
                    awesomeAlert({type: AlertTypeEnum.success, msg: 'Refreshed'})
                }
            })
            .catch((err) => console.error(err));
        }, 30000); 

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement> | any) => {
        const {name, value} = event.target;
        setSearchQuery(value);

        const Keys: Set<string> = new Set();

        const collectKeys = (obj: any, prefix: string = '') => {
            if (obj && typeof obj === 'object') {
                Object.keys(obj).forEach((key) => {
                    const fullKey = prefix ? `${prefix}.${key}` : key;
                    if (Array.isArray(obj[key])) {
                        if (obj[key].length > 0 && typeof obj[key][0] === 'object') {
                            collectKeys(obj[key][0], fullKey);
                        }
                    } else if (typeof obj[key] === 'object') {
                        collectKeys(obj[key], fullKey);
                    } else {
                        Keys.add(fullKey);
                    }
                });
            }
        };

        data.forEach((item: any) => {
            collectKeys(item);
        });

        const allKeys = ['name', 'number', 'bankId.name'];

        const finalData = data.filter((item: any) =>
            allKeys.some((key: string) => {
                const keyParts = key.split('.');
                let valueToCheck = item;
                for (let i = 0; i < keyParts.length; i++) {
                    valueToCheck = valueToCheck ? valueToCheck[keyParts[i]] : undefined;
                }
                return valueToCheck
                    ? valueToCheck.toString().toLowerCase().includes(value.toLowerCase())
                    : false;
            }),
        );

        setFilteredData(finalData);
    };
    const clearText = () => {
        setSearchQuery('');
        setFilteredData([]);
    };
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

        checkUploadFileStatus();

        return cleanup;
    }, [uploadFiles]);

    useEffect(() => {
        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []);
    const getStatusValue = (statusId: number | string) => {
        const statusOption = bankAccountStatusOptionsFilter.find((option) => option.id == statusId);
        return statusOption && statusOption.value;
    };

    const getChannelValue = (channelId: number | string) => {
        const channelOption = AccountDetailsCardChannels.find((option) => option.id == channelId);
        return channelOption && channelOption.value;
    };

    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState<{
        [k: number]: boolean;
    }>({});

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };
    const handleDailogClick = (event: any) => {
        setDailogAnchorEl(event.currentTarget);
    };

    const handleDailogClose = () => {
        setDailogAnchorEl(false);
    };
    const handleTooltipClose = () => {
        setTooltipOpen(false);
    };
    const handleClosePopover = () => {
        setAnchorEl(null);
    };
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <DashboardLayout>
            <Box>
                <Box sx={{mt: 3, mb: 0, display: 'flex', justifyContent: 'space-between'}}>
                    <Button
                        color="primary"
                        variant="contained"
                        sx={{textTransform: 'capitalize'}}
                        onClick={() => router.push(ACCOUNTS_DETAILS_ROUTE)}
                    >
                        <ArrowBack sx={{mr: 1}} />
                        Back To Account Details
                    </Button>
                </Box>
                <Typography sx={{mb: 0, fontWeight: '500', fontSize: '24px', ml: 1, mt: 2}}>
                    Uploading Accounts
                </Typography>
                <Grid item xs={12} sx={{textAlign:"center"}}>
                            <TextField
                                size="small"
                                margin="normal"
                                sx={{m: 0}}
                                type="text"
                                id="query"
                                name="query"
                                value={query}
                                onChange={handleSearchChange}
                                placeholder="Search..."
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton edge="end" aria-label="search">
                                                {query ? (
                                                    <CloseIcon onClick={clearText} />
                                                ) : (
                                                    <SearchIcon />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                <Grid container spacing={3} sx={{mt: 0, pb: 3}}>
                {(filteredData.length > 0 || query ? filteredData : data)
                        ?.length > 0 ? (
                        (filteredData.length > 0 || query ? filteredData : data)?.map(
                            (n: any, index: any) => (
                        <Grid
                            item
                            key={index}
                            xs={12}
                            sm={12}
                            md={6}
                            lg={4}
                            xl={3}
                           
                        >
                            <Box
                                sx={(theme) => {
                                    const cleanedBalance = n?.closing_balance
                                        ? Number(n.closing_balance.replace(/,/g, ''))
                                        : 0;

                                    const isNegative =
                                        n.bankId.name === 'IOB' ? cleanedBalance < 0 : null;

                                    return {
                                        borderRadius: '25px',
                                        boxShadow: isNegative
                                            ? '0 4px 8px rgba(255, 0, 0, 0.5)'
                                            : '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        position: 'relative',
                                        background: (() => {
                                            switch (n.status) {
                                                case BankAccountStatusEnum.readyToLive:
                                                    return '#fff';
                                                case BankAccountStatusEnum.freeze:
                                                    return '#f9a293';
                                                case BankAccountStatusEnum.stop:
                                                    return '#ffc5c5';
                                                case BankAccountStatusEnum.hold:
                                                    return '#fffcc97d';
                                                case BankAccountStatusEnum.live:
                                                    return '#e3ffdbd9';
                                                case BankAccountStatusEnum.processing:
                                                    return '#f7d8f7';
                                                case BankAccountStatusEnum.other:
                                                    return '#d8eaffd9';
                                                default:
                                                    return '#fff';
                                            }
                                        })(),
                                        p: '10px 16px',
                                        overflow: 'hidden',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        animation: isNegative
                                            ? 'dropShadowAnimation2 1s linear infinite'
                                            : n.daily_limit - n.daily_income <= 100000 &&
                                              n.status === BankAccountStatusEnum.live
                                            ? 'dropShadowAnimationforlive 1s linear infinite'
                                            : '',
                                    };
                                }}
                            >
                                <Box
                                    sx={{
                                        height: '105px',
                                        width: '105px',
                                        background: n.status === BankAccountStatusEnum.live && '#b2e5b2' || n.status === BankAccountStatusEnum.hold && "#ffbcbc" || n.status === BankAccountStatusEnum.other && "#a7daff" || "#fff",
                                        position: 'absolute',
                                        right: '-57px',
                                        top: '-57px',
                                        transform: 'rotate(315deg)',
                                        
                                    }}
                                >

                                   {n.status === BankAccountStatusEnum.hold ? <Icon
                                        path={mdiCancel}
                                        title="Upload Stopped"
                                        size={1.1}
                                        rotate={46}
                                        style={{marginTop:"37px",marginLeft:"2px"}}
                                        color="#c12828"
                                    /> :
                                    <Icon
                                        path={mdiUploadCircleOutline}
                                        title="Upload Stopped"
                                        size={1.1}
                                        rotate={46}
                                        style={{marginTop:"37px",marginLeft:"2px"}}
                                        color="#2a672a"
                                    />}
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            sx={{
                                                mt: 0.5,
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                paddingRight: '10px',
                                            }}
                                        >
                                            <Typography component="span">
                                                <span style={{fontWeight: 600}}>A/c Name:</span>{' '}
                                                {n?.name}
                                            </Typography>
                                        </Typography>
                                        <Typography sx={{mt: 0.5}}>
                                            <span style={{fontWeight: 600}}>A/c No:</span>{' '}
                                            {n?.number}
                                        </Typography>
                                        <Typography sx={{mt: 0.5}}>
                                            <span style={{fontWeight: 600}}>Bank Name:</span>{' '}
                                            {n?.bankId?.name}
                                        </Typography>

                                        {n?.status === BankAccountStatusEnum.live && (
                                            <Typography sx={{mt: 0.5}}>
                                                <span style={{fontWeight: 600}}>Limit_left:</span>{' '}
                                                <Typography
                                                    component="span"
                                                    sx={{
                                                        color:
                                                            n.daily_limit - n.daily_income <= 100000
                                                                ? 'red'
                                                                : '#000',
                                                        fontWeight:
                                                            n.daily_limit - n.daily_income <= 100000
                                                                ? 600
                                                                : 500,
                                                        display: 'inline-block',
                                                    }}
                                                >
                                                    {Number(
                                                        n?.daily_limit - n?.daily_income,
                                                    ).toFixed(2) || 0}
                                                </Typography>
                                            </Typography>
                                        )}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Box>
                                                {n.status === BankAccountStatusEnum.freeze ? (
                                                    <Typography sx={{mt: 0.5}}>
                                                        <span style={{fontWeight: 600}}>
                                                            Freeze Amount:
                                                        </span>{' '}
                                                        <Typography
                                                            component="span"
                                                            sx={{
                                                                animation:
                                                                    n.status ===
                                                                        BankAccountStatusEnum.readyToLive ||
                                                                    n.status ===
                                                                        BankAccountStatusEnum.live
                                                                        ? ''
                                                                        : 'dropColorShadowAnimation 1s linear infinite',
                                                                display: 'inline-block',
                                                            }}
                                                        >
                                                            {n?.freezeAmount || 0}
                                                        </Typography>
                                                    </Typography>
                                                ) : (
                                                    <>
                                                        {n.status ===
                                                        BankAccountStatusEnum.readyToLive ? (
                                                            <Typography sx={{mt: 0.5}}>
                                                                <Typography
                                                                    component={'span'}
                                                                    style={{
                                                                        fontWeight: 600,
                                                                    }}
                                                                >
                                                                    Daily Limit:
                                                                </Typography>{' '}
                                                                {n?.daily_limit}
                                                            </Typography>
                                                        ) : (
                                                            <Typography
                                                                sx={{
                                                                    mt: 0.5,
                                                                    position: 'relative',
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        fontWeight: 600,
                                                                    }}
                                                                >
                                                                    Closing Balance:
                                                                </span>{' '}
                                                                <Typography
                                                                    component={'span'}
                                                                    sx={(theme) => {
                                                                        const cleanedBalance =
                                                                            n?.closing_balance
                                                                                ? Number(
                                                                                      n.closing_balance.replace(
                                                                                          /,/g,
                                                                                          '',
                                                                                      ),
                                                                                  )
                                                                                : 0;

                                                                        const isNegative =
                                                                            cleanedBalance < 0;
                                                                        const color =
                                                                            n.status ===
                                                                                BankAccountStatusEnum.hold ||
                                                                            n.status ===
                                                                                BankAccountStatusEnum.stop ||
                                                                            !n.closing_balance ||
                                                                            isNegative
                                                                                ? 'red'
                                                                                : '#000';

                                                                        return {
                                                                            color: color,
                                                                            fontWeight: 'bold',
                                                                        };
                                                                    }}
                                                                >
                                                                    {n.closing_balance
                                                                        ? (() => {
                                                                              const cleanedBalance =
                                                                                  Number(
                                                                                      n.closing_balance.replace(
                                                                                          /,/g,
                                                                                          '',
                                                                                      ),
                                                                                  );

                                                                              if (
                                                                                  !isNaN(
                                                                                      cleanedBalance,
                                                                                  )
                                                                              ) {
                                                                                  return cleanedBalance <
                                                                                      0
                                                                                      ? n.bankId
                                                                                            .name ===
                                                                                        'IOB'
                                                                                          ? 'Some Transactions missed'
                                                                                          : cleanedBalance.toFixed(
                                                                                                2,
                                                                                            )
                                                                                      : cleanedBalance.toFixed(
                                                                                            2,
                                                                                        );
                                                                              }
                                                                              return 'N/A';
                                                                          })()
                                                                        : 'N/A'}
                                                                </Typography>
                                                            </Typography>
                                                        )}
                                                    </>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Grid item>
                                        <ClickAwayListener onClickAway={handleTooltipClose}>
                                            <div>
                                                <Button
                                                    onClick={() => handleRouter(n)}
                                                    sx={{pl: 0, pt: 0.6}}
                                                >
                                                    <InfoIcon onClick={handleClick} /> Upload
                                                    Accounts
                                                </Button>
                                                <Popover
                                                    open={openPopover}
                                                    anchorEl={anchorEl}
                                                    onClose={handleClosePopover}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'center',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'center',
                                                    }}
                                                    PaperProps={{
                                                        sx: {
                                                            borderRadius: '8px',
                                                            width: 350,
                                                            border: '1px solid grey',
                                                            transition: 'none',
                                                            boxShadow: 'none',
                                                        },
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 350,
                                                            p: 2,
                                                            overflow: 'auto',
                                                            maxHeight: '400px',
                                                            minHeight: '370px',
                                                        }}
                                                    >
                                                        {popupData?.statusHistory?.length > 0 ? (
                                                            <Stepper
                                                                nonLinear
                                                                activeStep={activeStep}
                                                                orientation="vertical"
                                                                sx={{pb: 1}}
                                                            >
                                                                {popupData?.statusHistory?.map(
                                                                    (label: any, index: any) => (
                                                                        <Step
                                                                            key={index}
                                                                            completed={
                                                                                completed[index]
                                                                            }
                                                                        >
                                                                            <StepButton
                                                                                color="inherit"
                                                                                onClick={handleStep(
                                                                                    index,
                                                                                )}
                                                                            >
                                                                                {label?.updatedBy
                                                                                    ?.username ||
                                                                                    'Account Change'}
                                                                            </StepButton>
                                                                            <StepContent>
                                                                                hi
                                                                            </StepContent>
                                                                        </Step>
                                                                    ),
                                                                )}
                                                            </Stepper>
                                                        ) : (
                                                            <Box>
                                                                <Typography
                                                                    variant="h6"
                                                                    sx={{
                                                                        textAlign: 'center',
                                                                        color: '#757575',
                                                                        p: 2,
                                                                        fontSize: '20px',
                                                                    }}
                                                                >
                                                                    Sorry no status history
                                                                    available...
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Popover>
                                            </div>
                                        </ClickAwayListener>
                                    </Grid>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                        }}
                                    >
                                        <Typography component="span">
                                            <span
                                                style={{
                                                    fontWeight: 600,
                                                    color:
                                                        n?.channel === ChannelsEnum.payz365
                                                            ? '#fff'
                                                            : '#000',
                                                    borderRadius: '15px',
                                                    background: (() => {
                                                        switch (n?.channel) {
                                                            case ChannelsEnum.payz365:
                                                                return 'rgb(50, 38, 83)';
                                                            case ChannelsEnum.paymentCircle:
                                                                return '#7dc8ff9c';
                                                            case ChannelsEnum.zealApp:
                                                                return '#cbf1f5';
                                                            default:
                                                                return '#fff';
                                                        }
                                                    })(),
                                                    padding: '10px 11px',
                                                    boxShadow:
                                                        'inset rgb(0 0 0 / 26%) 0px 0px 6px 0px',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    fontSize: '13px',
                                                }}
                                            >
                                                {getChannelValue(n?.channel)}
                                            </span>
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    )))
                    : (
                        <Grid item xs={12}>
                            <Typography
                                variant="h6"
                                sx={{
                                    textAlign: 'center',
                                    color: '#757575',
                                    p: 2,
                                    fontSize: '30px',
                                }}
                            >
                                Sorry, there is no data available{' '}
                                <SentimentVeryDissatisfiedIcon sx={{fontSize: '30px', mt: -0.5}} />
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </DashboardLayout>
    );
};

export default ActivelyUploadingAccounts;
