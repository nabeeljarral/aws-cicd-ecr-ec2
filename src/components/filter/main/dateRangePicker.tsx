import * as React from 'react';
import {useEffect, useState} from 'react';
import 'react-minimal-datetime-range/lib/react-minimal-datetime-range.min.css';
import Box from '@mui/material/Box';
import moment from 'moment';
import {DatePicker, LocalizationProvider, TimePicker} from '@mui/x-date-pickers';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import {RoleEnum} from '@/utils/enums/role';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';

type DateRangePickerProps = {
    onValidityChange: (isValid: boolean) => void;
    isRestrictedPage?: boolean;
    onChange?: (e: any) => void;
};

export default function DateRangePicker({
    onValidityChange,
    isRestrictedPage = false,
    onChange,
}: DateRangePickerProps) {
    const user = useSelector((state: RootState) => state.auth.user);
    const roles = user?.roles;
    const [startDate, setStartDate] = useState<moment.Moment | null>(
        moment().subtract(1, 'day').second(0),
    );
    const [startTime, setStartTime] = useState<moment.Moment | null>(
        moment().startOf('day').second(0),
    );
    const [endDate, setEndDate] = useState<moment.Moment | null>(moment().add(1, 'day').second(0));
    const [endTime, setEndTime] = useState<moment.Moment | null>(
        moment().startOf('day').add(0, 'minutes').second(0),
    );
    const [combinedEndDateTime, setCombinedEndDateTime] = useState<string>('');
    const [combinedStartDateTime, setCombinedStartDateTime] = useState<string>('');

    const handleStartTimeChange = (time: moment.Moment | null) => {
        if (time) {
            setStartTime(time);
        }
        if (typeof onChange === 'function') onChange(time);
    };

    const handleEndTimeChange = (time: moment.Moment | null) => {
        if (time) {
            setEndTime(time);
        }
        if (typeof onChange === 'function') onChange(time);
    };

    const handleEndDateChange = (date: moment.Moment | null) => {
        setEndDate(date);
        validateDates(date, startDate);
        if (typeof onChange === 'function') onChange(date);
    };

    const handleStartDateChange = (date: moment.Moment | null) => {
        setStartDate(date);
        validateDates(endDate, date);
        if (typeof onChange === 'function') onChange(date);
    };
    console.log(roles);
    const validateDates = (end: moment.Moment | null, start: moment.Moment | null) => {
        const minDate = moment().subtract(2, 'months').startOf('day');
        const maxDate = moment().add(1, 'days').endOf('day');

        const isStartValid = start?.isValid() && start.isBetween(minDate, maxDate, undefined, '[]');
        const isEndValid = end?.isValid() && end.isBetween(minDate, maxDate, undefined, '[]');
        const isRangeValid = start && end && end.isSameOrAfter(start);
        let isValid = true;
        if (roles?.includes(RoleEnum.Client) && isRestrictedPage) {
            isValid = Boolean(isStartValid && isEndValid && isRangeValid);
        }
        onValidityChange(isValid);

        console.log(
            'Start Date Valid:',
            isStartValid,
            'End Date Valid:',
            isEndValid,
            'Range Valid:',
            isRangeValid,
            'Overall Valid:',
            isValid,
        );
    };
    const minDate =
        roles?.includes(RoleEnum.Client) && isRestrictedPage
            ? moment().subtract(2, 'months')
            : moment(0);
    const maxDate = moment().add(1, 'days');

    useEffect(() => {
        const combinedStart = moment(startDate)
            .second(0)
            .set({
                hour: startTime?.hour() || 0,
                minute: startTime?.minute() || 0,
            });
        const combinedEnd = moment(endDate)
            .second(0)
            .set({
                hour: endTime?.hour() || 0,
                minute: endTime?.minute() || 0,
            });
        setCombinedStartDateTime(combinedStart.format('YYYY-MM-DD HH:mm:ss'));
        setCombinedEndDateTime(combinedEnd.format('YYYY-MM-DD HH:mm:ss'));
    }, [startDate, startTime, endDate, endTime]);

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Box sx={{display: 'inline-block'}}>
                <input type="hidden" name="startDate" value={combinedStartDateTime} />
                <input type="hidden" name="endDate" value={combinedEndDateTime} />
                <DatePicker
                    onChange={handleStartDateChange}
                    slotProps={{textField: {size: 'small'}}}
                    value={startDate}
                    sx={{m: 1, width: 200}}
                    label="Start Date"
                    minDate={minDate}
                    maxDate={maxDate}
                />
                <TimePicker
                    onChange={handleStartTimeChange}
                    slotProps={{textField: {size: 'small'}}}
                    value={startTime}
                    format="HH:mm:ss"
                    sx={{m: 1, width: 200}}
                    label="Start Time"
                />
                <DatePicker
                    onChange={handleEndDateChange}
                    slotProps={{textField: {size: 'small'}}}
                    value={endDate}
                    sx={{m: 1, width: 200}}
                    label="End Date"
                    minDate={minDate}
                    maxDate={maxDate}
                />
                <TimePicker
                    onChange={handleEndTimeChange}
                    slotProps={{textField: {size: 'small'}}}
                    value={endTime}
                    format="HH:mm:ss"
                    sx={{m: 1, width: 200}}
                    label="End Time"
                />
            </Box>
        </LocalizationProvider>
    );
}
