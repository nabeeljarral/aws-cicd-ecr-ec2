import {Box, Button, CircularProgress} from '@mui/material';
import {Delete, Edit, Preview} from '@mui/icons-material';
import * as React from 'react';
import {useState} from 'react';
import awesomeAlert from '@/utils/functions/alert';
import AlertPrompt from '@/components/alerts/AlertPrompt';

type  Props = {
    item: any,
    handleEditClick?: (id: string) => void,
    handleViewClick?: (item: any) => void,
    handleDeleteClick?: (item: any) => void,
    deleteFunction?: (item: any) => Promise<any>,
    showView?: boolean,
    showEdit?: boolean,
    showDelete?: boolean,
    editIcon?: React.ReactNode,
    viewIcon?: React.ReactNode,
    deleteIcon?: React.ReactNode,
    editText?: string,
    viewText?: string,
    deleteText?: string,
    deleteSuccessMessage?: string,
}
export const ActionButtonsMain = (props: Props) => {
    const {
        item,
        handleEditClick,
        handleViewClick,
        handleDeleteClick,
        deleteFunction,
        showView,
        showEdit,
        showDelete,
        editIcon,
        viewIcon,
        deleteIcon,
        editText,
        viewText,
        deleteText,
        deleteSuccessMessage,
    } = props;

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };
    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleDelete = () => {
        setDeleteLoading(true);
        handleDeleteClick && handleDeleteClick(item);
        deleteFunction && deleteFunction(item)
            .then(res => {
                if (!res.message) {
                    awesomeAlert({
                        msg: deleteSuccessMessage ?? 'Deleted Successfully',
                    });
                }
            }).finally(() => {
                setDeleteLoading(false);
            });
        setOpenDeleteDialog(false);
        setDeleteLoading(false);

    };
    return (
        <Box sx={{display: 'flex'}}>
            <AlertPrompt
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                onReject={handleCloseDeleteDialog}
                onAccept={handleDelete}
                title="Do You Want To Delete?"
                content="The record will be deleted. This action cannot be undone."

            />
            {
                showView && <Button
                    color="secondary" variant="outlined" size="small"
                    sx={{textTransform: 'capitalize', mr: 1}}
                    startIcon={viewIcon || <Preview />}
                    onClick={() => handleViewClick && handleViewClick(item)}>
                    {viewText || 'View'}
                </Button>
            }
            {
                showEdit && <Button
                    color="warning" variant="outlined" size="small"
                    sx={{textTransform: 'capitalize', mr: 1}}
                    startIcon={editIcon || <Edit />}
                    onClick={() => handleEditClick && handleEditClick(item)}>
                    {editText || 'Edit'}
                </Button>
            }
            {
                showDelete && <Button
                    color="error" variant="outlined" size="small"
                    sx={{textTransform: 'capitalize'}}
                    disabled={deleteLoading}
                    startIcon={deleteIcon || <Delete />}
                    onClick={handleOpenDeleteDialog}>
                    {
                        deleteLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            deleteText || 'Edit'
                        )
                    }
                </Button>
            }
        </Box>
    );
};