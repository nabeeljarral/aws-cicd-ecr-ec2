import * as React from 'react';
import {useEffect, useState} from 'react';
import 'react-minimal-datetime-range/lib/react-minimal-datetime-range.min.css';
import Box from '@mui/material/Box';
import moment from 'moment';
import {DatePicker, LocalizationProvider, TimePicker} from '@mui/x-date-pickers';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';

type IDateRangePicker = {
    startDate2?: moment.Moment,
    startTime2?: moment.Moment,
    endDate2?: moment.Moment,
    endTime2?: moment.Moment,
}
export default function DateRangePicker2({startDate2, startTime2, endDate2, endTime2}: IDateRangePicker) {
    const [startDate, setStartDate] = useState<moment.Moment>(moment().subtract(1, 'day').second(0));
    const [startTime, setStartTime] = useState<moment.Moment>(moment().startOf('day').second(0));
    const [endDate, setEndDate] = useState<moment.Moment>(moment().add(1, 'day').second(0));
    const [endTime, setEndTime] = useState<moment.Moment>(moment().startOf('day').second(0));
    const [combinedEndDateTime, setCombinedEndDateTime] = useState<string>('');
    const [combinedStartDateTime, setCombinedStartDateTime] = useState<string>('');

    const handleStartTimeChange = (time: moment.Moment | null) => {
        if (time) setStartTime(time);
    };
    const handleEndTimeChange = (time: moment.Moment | null) => {
        if (time) setEndTime(time);
    };
    const handleEndDateChange = (time: moment.Moment | null) => {
        if (time) setEndDate(time);
    };
    const handleStartDateChange = (time: moment.Moment | null) => {
        if (time) setStartDate(time);
    };

    useEffect(() => {
        const combinedStart = moment(startDate).second(0).set({
            hour: startTime.hour(),
            minute: startTime.minute(),
        });
        const combinedEnd = moment(endDate).second(0).set({
            hour: endTime.hour(),
            minute: endTime.minute(),
        });
        setCombinedStartDateTime(combinedStart.format('YYYY-MM-DD HH:mm:ss'));
        setCombinedEndDateTime(combinedEnd.format('YYYY-MM-DD HH:mm:ss'));
    }, [startDate, startTime, endDate, endTime]);

    useEffect(() => {
        if (startDate2) setStartDate(startDate2);
        if (startTime2) setStartTime(startTime2);
        if (endDate2) setEndDate(endDate2);
        if (endTime2) setEndTime(endTime2);
    }, [startDate2, endDate2, startTime2, endTime2]);

    return (<LocalizationProvider dateAdapter={AdapterMoment}>
            <Box sx={{display: 'inline-block'}}>
                <input type="hidden" name="startDate" value={combinedStartDateTime} />
                <input type="hidden" name="endDate" value={combinedEndDateTime} />
                <DatePicker
                    onChange={handleStartDateChange}
                    slotProps={{textField: {size: 'small'}}}
                    value={startDate}
                    sx={{m: 1, width: 200}}
                    label="Start Date"
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