import {Box, Typography} from '@mui/material';
import React from 'react';

interface Props {
    dailyIncome: number;
    dailyLimit: number;
}
const LimitCalculation = (props: Props) => {
    const {dailyIncome, dailyLimit} = props;
    return (
        <>
            <Box
                sx={{
                    display: {xs: 'none', sm: 'flex'},
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '8px',
                    pb: 1,
                }}
            >
                <Box
                    sx={{
                        background: '#ccf1ff',
                        padding: '10px 14px 10px 14px',
                        borderRadius: '15px',
                    }}
                >
                    <Typography
                        sx={{
                            mb: 0,
                            fontWeight: '500',
                            fontSize: '16px',
                            // m: '12px 8px 0px 8px',
                        }}
                    >
                        Total daily limit
                    </Typography>
                    <Typography
                        sx={{
                            mb: 0,
                            fontWeight: '500',
                            fontSize: '15px',
                            ml: 1,
                            mt: 0,
                            color: '#000387',
                        }}
                    >
                        ₹ {Number(dailyLimit).toFixed(2) || 0}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        position: 'relative',
                        top: '50%',
                        fontWeight: 900,
                    }}
                >
                    {' '}
                    -{' '}
                </Box>
                <Box
                    sx={{
                        background: '#ccf1ff',
                        padding: '10px 14px 10px 14px',
                        borderRadius: '15px',
                    }}
                >
                    <Typography
                        sx={{
                            mb: 0,
                            fontWeight: '500',
                            fontSize: '16px',
                        }}
                    >
                        Total daily income
                    </Typography>
                    <Typography
                        sx={{
                            mb: 0,
                            fontWeight: '500',
                            fontSize: '15px',
                            ml: 1,
                            mt: 0,
                            color: '#000387',
                        }}
                    >
                        ₹ {Number(dailyIncome).toFixed(2) || 0}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        position: 'relative',
                        top: '35%',
                        fontWeight: 900,
                    }}
                >
                    {' '}
                    ={' '}
                </Box>
                <Box
                    sx={{
                        background: '#cffbcf',
                        padding: '10px 14px 10px 14px',
                        borderRadius: '15px',
                    }}
                >
                    <Typography
                        sx={{
                            mb: 0,
                            fontWeight: '500',
                            fontSize: '16px',
                        }}
                    >
                        Limit left
                    </Typography>
                    <Typography
                        sx={{
                            mb: 0,
                            fontWeight: '500',
                            fontSize: '15px',
                            ml: 1,
                            mt: 0,
                            color: '#000387',
                        }}
                    >
                        ₹ {Number(dailyLimit - dailyIncome).toFixed(2)}
                    </Typography>
                </Box>
            </Box>
        </>
    );
};

export default LimitCalculation;
