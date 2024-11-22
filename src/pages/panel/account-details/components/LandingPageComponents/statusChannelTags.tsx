import { BankAccountTypesEnum, ChannelsEnum } from '@/utils/enums/accountDetails.enums';
import { Box, Typography } from '@mui/material';
import React from 'react';

interface Props {
    getStatusValue: (statusId: number | string) => string | undefined;
    getChannelValue: (channelId: number | string) => string | undefined;
    n:any;
}
const StatusChannelTags = (props:Props) => {
    const { getStatusValue, getChannelValue,n} =
        props;
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginTop: '15px',
                    position: 'relative',
                    bottom: '5px',
                }}
            >
                <Box>
                    <Typography component="span">
                        <span
                            style={{
                                fontWeight: 600,
                                color: '#000',
                                borderRadius: '10px',
                                background: '#ffffff54',
                                padding: '10px 16px',
                                boxShadow: 'inset rgb(0 0 0 / 26%) 0px 0px 6px 0px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {getStatusValue(n.status)}
                        </span>
                    </Typography>
                </Box>
                {n.accountType === BankAccountTypesEnum.payin && (
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
                                    color: n?.channel === ChannelsEnum.payz365 ? '#fff' : '#000',
                                    borderRadius: '10px',
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
                                    boxShadow: 'inset rgb(0 0 0 / 26%) 0px 0px 6px 0px',
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
                )}
            </Box>
        </>
    );
};

export default StatusChannelTags;
