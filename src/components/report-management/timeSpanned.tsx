import React, {useEffect, useState} from 'react';

type Props = {
    createdAt: Date;
};

export const TimeSpannedCounter: React.FC<Props> = ({createdAt}) => {
    const [timeSpan, setTimeSpan] = useState('');

    useEffect(() => {
        const timerId = setInterval(() => {
            const now = new Date();
            const createdAtDate = new Date(createdAt);
            if (isNaN(createdAtDate.getTime())) {
                return;
            }

            const diff = now.getTime() - createdAtDate.getTime();
            const seconds = Math.floor(diff / 1000) % 60;
            const minutes = Math.floor(diff / 60000) % 60;
            const hours = Math.floor(diff / 3600000) % 24;
            const days = Math.floor(diff / 86400000);
            let formattedTimeSpan = '';
            if (days > 0) formattedTimeSpan += `${days} ${days > 1 ? 'days, ' : 'day, '}`;
            if (hours > 0 || days > 0)
                formattedTimeSpan += `${hours} ${hours > 1 ? 'hours, ' : 'hour, '}`;
            if (minutes > 0 || hours > 0 || days > 0)
                formattedTimeSpan += `${minutes}  ${minutes > 1 ? 'minutes, ' : 'minute, '}`;
            formattedTimeSpan += `${seconds} seconds Older`;

            setTimeSpan(formattedTimeSpan);
        }, 1000);

        return () => clearInterval(timerId);
    }, [createdAt]);

    return <span>{timeSpan}</span>;
};
