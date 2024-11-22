import * as React from 'react';
import {Collapse, ListItemButton, ListItemText} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

type CollapsedItemProps = {
    title: string,
    child: React.ReactNode
}
export const CollapsedItem = ({title, child}: CollapsedItemProps) => {
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (<>

        <ListItemButton sx={{color: '#000', fontWeight: '700'}} onClick={handleClick}>
            <ListItemText primary={title} />
            {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" sx={{color: 'rgba(0,0,0,0.61)', padding: '10px'}} unmountOnExit>
            {child}
        </Collapse>
    </>);
};
