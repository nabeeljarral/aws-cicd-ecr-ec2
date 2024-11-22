import React, {useState} from 'react';
import {Button} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';

type Props = {
    name?: string;
    background?: string;
    color?: string;
    onClick?: (id: string) => void;
    id?: string;
    isSelected?: boolean;
    setFilteredData?:(id: []) => void;
    setSearchQuery?:(id: string) => void;
};

export default function SelectButton(props: Props) {
    const {name, background, color, id, onClick, isSelected,setFilteredData,setSearchQuery} = props;
    const [selected, setSelected] = useState(false);

    const handleClick = () => {
        setSelected((prev) => !prev);
        if (onClick && id) {
            onClick(id);
            if(setFilteredData && setSearchQuery){
                setSearchQuery('')
            setFilteredData([])
            }
        }
    };

    return (
        <Button
            variant="contained"
            onClick={handleClick}
            sx={{
                backgroundColor: isSelected ? background : background,
                color: isSelected ? color : color,
                '&:hover': {
                    backgroundColor: isSelected ? background : 'grey.400',
                },
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
        >
            {name} {isSelected && <DoneIcon sx={{color: color, p: '2px', ml: '3px', mt: '-2px'}} />}
        </Button>
    );
}
