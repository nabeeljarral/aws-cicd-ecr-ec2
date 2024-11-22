import {
    BankAccountStatusEnum,
    BankAccountTypesEnum,
    ChannelsEnum,
} from '@/utils/enums/accountDetails.enums';
import {BankTypesEnum} from '@/utils/enums/bankTypes.enum';
import {Box, Grid, Tooltip, Typography} from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import React from 'react';
import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import StatusChannelTags from './statusChannelTags';

interface Props {
    query: string;
    lastFinalData: any;
    bankAccounts: IBankAccount | any;
    handleRouter: (n: any) => void;
    getStatusValue: (statusId: number | string) => string | undefined;
    getChannelValue: (channelId: number | string) => string | undefined;
}
const CardContent = (props: Props) => {
    const {lastFinalData, bankAccounts, handleRouter, getStatusValue, getChannelValue, query} =
        props;
    return (
        <>
            <Grid container spacing={3} sx={{mt: 2}}>
                {(lastFinalData().length > 0 || query ? lastFinalData() : bankAccounts)?.length >
                0 ? (
                    (lastFinalData().length > 0 || query ? lastFinalData() : bankAccounts)?.map(
                        (n: any, index: any) => (
                            <Grid
                                item
                                key={index}
                                xs={12}
                                sm={12}
                                md={6}
                                lg={4}
                                xl={3}
                                sx={{cursor: 'pointer'}}
                                onClick={() => handleRouter(n)}
                            >
                                <Box
                                    sx={(theme) => {
                                        const cleanedBalance = n?.closing_balance
                                            ? Number(n.closing_balance.replace(/,/g, ''))
                                            : 0;

                                        const isNegative =
                                            n?.bankId?.name === 'IOB' ? cleanedBalance < 0 : null;

                                        return {
                                            borderRadius: '25px',
                                            boxShadow: isNegative
                                                ? '0 4px 8px rgba(255, 0, 0, 0.5)'
                                                : '0 4px 8px rgba(0, 0, 0, 0.2)',
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
                                                        return '#ffffaa7d';
                                                    case BankAccountStatusEnum.live:
                                                        return '#deffd3d9';
                                                    case BankAccountStatusEnum.processing:
                                                        return '#f7d8f7';
                                                    case BankAccountStatusEnum.other:
                                                        return '#c2deffd9';
                                                    default:
                                                        return '#fff';
                                                }
                                            })(),
                                            p: '10px 16px',
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
                                            overflow: 'hidden',
                                        };
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: '125px',
                                            width: '96px',
                                            background: '#322653',
                                            position: 'absolute',
                                            right: '-49px',
                                            top: '-62px',
                                            transform: 'rotate(315deg)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'baseline',
                                            justifyContent: 'space-around',
                                            paddingLeft: '10px',
                                            paddingBottom: '0px',
                                            fontSize: '23px',
                                            color: 'white',
                                        }}
                                    >
                                        <Tooltip
                                            title={
                                                (n.bank_type === 0 && 'Bank Accounts') ||
                                                (n.bank_type === 15 && 'Gateway Accounts')
                                            }
                                            placement="top"
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    rotate: '45deg',
                                                }}
                                            >
                                                {n.bank_type === 0 && 'B'}
                                                {n.bank_type === 15 && 'G'}
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            paddingRight: '20px',
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                sx={{
                                                    mt: 0.5,
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
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
                                                <span style={{fontWeight: 600}}>
                                                    {n?.bank_type == BankTypesEnum.theUnionPay
                                                        ? 'Gateway'
                                                        : 'Bank'}{' '}
                                                    Name:
                                                </span>{' '}
                                                {n?.bank_type == BankTypesEnum.theUnionPay
                                                    ? 'the UnionPay'
                                                    : n?.bankId?.name}
                                            </Typography>
                                            {n?.accountType === BankAccountTypesEnum.payin && (
                                                <Typography sx={{mt: 0.5}}>
                                                    <span style={{fontWeight: 600}}>
                                                        Amount Range:
                                                    </span>

                                                    {n.bankAmountRange ? (
                                                        <Typography
                                                            fontSize={15}
                                                            component={'span'}
                                                        >
                                                            {n.bankAmountRange.name}
                                                        </Typography>
                                                    ) : (
                                                        <Typography
                                                            component={'span'}
                                                            color={'red'}
                                                        >
                                                            {' '}
                                                            No range selected
                                                        </Typography>
                                                    )}
                                                </Typography>
                                            )}
                                            {n?.status === BankAccountStatusEnum.live ? (
                                                <Typography sx={{mt: 0.5}}>
                                                    <span style={{fontWeight: 600}}>
                                                        Limit_left:
                                                    </span>{' '}
                                                    <Typography
                                                        component="span"
                                                        sx={{
                                                            color:
                                                                n.daily_limit - n.daily_income <=
                                                                100000
                                                                    ? 'red'
                                                                    : '#000',
                                                            fontWeight:
                                                                n.daily_limit - n.daily_income <=
                                                                100000
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
                                            ) : (
                                                <Typography sx={{mt: 0.5}}>
                                                    <span style={{fontWeight: 600}}>Remarks:</span>{' '}
                                                    {n?.statusHistory[n?.statusHistory?.length - 1]
                                                        ?.remark || n.remark}
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
                                                                                n.closing_balance ===
                                                                                    'NaN' ||
                                                                                isNegative
                                                                                    ? 'red'
                                                                                    : '#000';

                                                                            return {
                                                                                color: color,
                                                                                fontWeight: 'bold',
                                                                            };
                                                                        }}
                                                                    >
                                                                        {n?.closing_balance &&
                                                                        !isNaN(
                                                                            Number(
                                                                                n.closing_balance,
                                                                            ),
                                                                        )
                                                                            ? Number(
                                                                                  n.closing_balance,
                                                                              ).toFixed(2)
                                                                            : '0'}
                                                                    </Typography>
                                                                </Typography>
                                                            )}
                                                        </>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <StatusChannelTags
                                        getStatusValue={getStatusValue}
                                        n={n}
                                        getChannelValue={getChannelValue}
                                    />
                                </Box>
                            </Grid>
                        ),
                    )
                ) : (
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
        </>
    );
};

export default CardContent;
