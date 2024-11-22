import {Box, Button} from '@mui/material';
import {Edit, Preview} from '@mui/icons-material';
import {ReactNode} from 'react';

type  Props = {
    viewIcon?: ReactNode | string;
    item: any,
    handleEditClick?: (transaction: any) => void,
    handleViewClick: (transaction: any) => void,
    viewText?: string,
    hideEdit?: boolean,
    disabled?:boolean
}
export const TableActions = (props: Props) => {
    return (
        <Box sx={{display: 'flex'}}>
            <Button color="secondary" variant="outlined" size="small"
                    sx={{textTransform: 'capitalize', mr: 1}}
                    startIcon={props.viewIcon || <Preview />}
                    onClick={() => props.handleViewClick(props.item)}
                    disabled={props.disabled}
                    >
                {props.viewText || 'View'}
            </Button>
            {
                !props.hideEdit &&
                <Button color="warning" variant="outlined" size="small"
                        sx={{textTransform: 'capitalize'}}
                        startIcon={<Edit />}
                        onClick={() => props.handleEditClick && props.handleEditClick(props.item)}>
                    Edit
                </Button>
            }
        </Box>
    );
};