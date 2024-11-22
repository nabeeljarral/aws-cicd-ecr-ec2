import * as React from 'react';
import {TextField} from '@mui/material';

type Props = {
    title: string;
    name: string;
    hint?: string;
    type?: string;
    defaultValue?: string;
    width?: string | number;
    required?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
};
export default function FilterInput(props: Props) {
    // const [val, setVal] = React.useState('');
    // const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    //     setVal(event.target.value);
    // };

    return (
        <TextField
            id={props.title + '-input-helper'}
            label={props.title}
            required={props.required || false}
            name={props.name}
            type={props.type ?? 'text'}
            defaultValue={props.defaultValue || ''}
            onChange={props.onChange}
            size="small"
            variant="outlined"
            sx={{m: 1, width: props.width || 200}}
        />
    );
}
