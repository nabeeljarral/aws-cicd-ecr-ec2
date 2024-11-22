import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Popper } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Autocomplete, { AutocompleteChangeDetails } from '@mui/material/Autocomplete';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { CircularProgress } from '@mui/material';
import { Padding, WidthFull } from '@mui/icons-material';

export type IOptionItem = { id: any, value: string };

type Props = {
  title: string,
  options: any[],
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
export default function SearchSelect(props: Props) {
  const { defaultValue, options, name } = props;
  const [selected, setSelected] = useState<any>(defaultValue);

  useEffect(() => {
    setSelected(defaultValue || null);
  }, [defaultValue]); 

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: IOptionItem | null,
    reason: any,
    details?: AutocompleteChangeDetails<IOptionItem>
  ) => {
    const selectedValue = value ? value.id : null;
    if (props.handleChange) props.handleChange(selectedValue);
    setSelected(selectedValue);
  };

  const selectedOption = options.find(option => option.id === selected) || null;

  return (
    <FormControl
      variant="outlined"
      margin={props.marginType || 'dense'}
      sx={{ m: props.margin || 1, width: props.width ?? 200 }}
      size="small"
    >
      <Autocomplete
        id={props.title + '-select-helper'}
        options={options}
        getOptionLabel={(option) => option.value}
        value={selectedOption} // Ensure `value` is mapped to the correct option
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label={props.title}
            required={props.required}
            variant="outlined"
            className='Selectinput'
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {props.loading ? <CircularProgress color="inherit" size={30} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        disabled={props.disabled}
        isOptionEqualToValue={(option, value) => option.id === value?.id}
      />
      {props.hint && <FormHelperText>{props.hint}</FormHelperText>}
      <input type="hidden" name={name} value={selected || ''} />
    </FormControl>

    );
}