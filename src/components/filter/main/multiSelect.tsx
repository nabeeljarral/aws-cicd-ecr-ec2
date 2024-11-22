
import * as React from 'react';
import { useState, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { LinearProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

export type IOptionItem = { id: any, value: string, background?: string, color?: string };

type Props = {
    title: string,
    options: IOptionItem[],
    hint?: string,
    name: string,
    margin?: number | string,
    loading?: boolean,
    disabled?: boolean,
    width?: string | number,
    required?: boolean,
    hideAllOption?: boolean,
    defaultValue?: any,
    marginType?: 'dense' | 'normal' | 'none' | undefined,
    handleChange?: (value: any) => void
};

export default function MultiSelect(props: Props) {
    const { defaultValue } = props;
    const [selected, setSelected] = useState<any[]>(defaultValue || []);

    useEffect(() => {
        setSelected(defaultValue || []); // Update selected state when defaultValue changes
    }, [defaultValue]);

    const handleChange = (event: SelectChangeEvent<any[]>) => {
        const value = event.target.value as any[];
        if (props.handleChange) props.handleChange(value);
        setSelected(value);
    };

    return (
        <FormControl
            variant="outlined"
            margin={props.marginType || 'dense'}
            sx={{ m: props.margin || 1, width: props.width ?? 200 }}
            size="small"
        >
            <InputLabel id={props.title + '-label'}>
                {props.title} {props.required && ' *'}
            </InputLabel>
            <Select
                labelId={props.title + '-label'}
                id={props.title + '-select-helper'}
                multiple
                value={selected}
                disabled={!!props.disabled}
                required={props.required || false}
                label={props.title}
                onChange={handleChange}
                name={props.name}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                       { Array.isArray(selected) && <>
                        {(selected as any[])?.map((value) => (
                            <Chip key={value} label={props.options.find(option => option.id === value)?.value} />
                        ))}
                        </>}
                    </Box>
                )}
            >
                {
                    !props.hideAllOption &&
                    <MenuItem value="">
                        All
                    </MenuItem>
                }
                {
                    props.loading && <MenuItem value="">
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    </MenuItem>
                }
                {props.options.map((op) => {
                    return (
                        <MenuItem key={op.id} value={op.id}>{op.value}</MenuItem>
                    );
                })}
            </Select>
            {props.hint && <FormHelperText>{props.hint}</FormHelperText>}
        </FormControl>
    );
}
