import {Card, CardContent} from '@mui/material';
import Box from '@mui/material/Box';
import {SpaceDashboard} from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import React, {useEffect, useState} from 'react';

type Props = {
    icon: React.ReactNode;
    color: 'blue' | 'black' | 'green' | 'pink' | 'orange',
    title: string,
    price: string,
}
export const DashboardBox = (prop: Props) => {
    const [color, setColor] = useState({
        background: 'linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232))',
        color: 'rgb(255, 255, 255)',
        shadow: 'rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(0, 187, 212, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem',
    });
    const initColor = () => {
        let color = {
            background: '',
            color: '',
            shadow: '',
        };

        if (prop.color === 'black')
            color = {
                background: 'linear-gradient(195deg, #2b2b2b, #191919)',
                color: '#ffffff',
                shadow: 'rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(64, 64, 64, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem',
            };
        else if (prop.color === 'green')
            color = {
                background: 'linear-gradient(195deg, #32a852, #43a047)',
                color: '#ffffff',
                shadow: 'rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(76, 175, 79, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem',
            };
        else if (prop.color === 'orange')
            color = {
                background: 'linear-gradient(195deg, #f2a153, #fb8c00)', // Adjusted the second color (#fb8c00) to a darker shade
                color: '#ffffff',
                shadow: 'rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(251, 140, 0, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem',
            };
        else if (prop.color === 'pink')
            color = {
                background: 'linear-gradient(195deg, rgb(236, 64, 122), rgb(216, 27, 96))',
                color: 'rgb(255, 255, 255)',
                shadow: 'rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(233, 30, 98, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem',
            };
        else //if (prop.color === 'blue')
            color = {
                background: 'linear-gradient(195deg, #322653, #322653)',
                color: '#ffffff',
                shadow: 'rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(0, 0, 0, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem',
            };
        setColor(color);
    };

    useEffect(() => {
        initColor();
    }, [prop.color]);

    useEffect(() => {
        initColor();
    }, []);

    return <Card sx={{
        position: 'relative',
        overflow: 'visible!important',
    }}>
        <CardContent>
            <Box
                sx={{
                    position: 'absolute',
                    top: '2.6rem',
                    left: '1em',
                    'justifyContent': 'center',
                    'alignItems': 'center',
                    'width': '4rem',
                    'height': '4rem',
                    'marginTop': '-24px',
                    'opacity': '1',
                    'background': color.background,
                    'color': color.color,
                    'borderRadius': '0.75rem',
                    'boxShadow': color.shadow,
                    'display': 'flex',
                }}>
                {prop.icon || <SpaceDashboard />}
            </Box>
            <Box className="text-right">
                <Typography color="textSecondary" sx={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    maxWidth: 'calc(100% - 96px)',
                    whiteSpace: 'nowrap',
                    marginLeft: 'auto',
                    textTransform: 'capitalize',
                }} gutterBottom>
                    {prop.title || '--'}
                </Typography>
                <Typography variant="h5" component="h2">
                    {prop.price || '--'}
                </Typography>
            </Box>
        </CardContent>
    </Card>;
};