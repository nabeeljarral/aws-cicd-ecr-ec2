import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    Grid,
    IconButton,
    TextField,
    Typography,
} from '@mui/material';
import React, {ChangeEvent} from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import {ArrowForward} from '@mui/icons-material';
import {RoleEnum} from '@/utils/enums/role';
import {IBankAccount} from '@/utils/interfaces/bankAccount.interface';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import UndoIcon from '@mui/icons-material/Undo';

interface KeyValuePair {
    key: string;
    value: string;
}
interface Props {
    formData: IBankAccount;
    openViewDialog: boolean;
    handleClose: () => void;
    handleViewDialogClose: () => void;
    keyValueList: any;
    editIndex: number | null;
    newKeyValue: {
        key: '';
        value: '';
    };
    setNewKeyValue: React.Dispatch<React.SetStateAction<KeyValuePair>>;
    handleSaveEdit: () => void;
    setEditIndex: React.Dispatch<React.SetStateAction<number | null>>;
    handleEditClick: (index: number) => void;
    handleDelete: (index: number) => void;
    handleUndo: (index: number) => void;
    handleEdit: (data?: any) => void;
    OpenKeyValueDailog: () => void;
}
const ExtraAddedDetails = (props: Props) => {
    const {
        formData,
        openViewDialog,
        handleClose,
        handleViewDialogClose,
        keyValueList,
        editIndex,
        newKeyValue,
        setNewKeyValue,
        handleSaveEdit,
        setEditIndex,
        handleEditClick,
        handleDelete,
        handleUndo,
        handleEdit,
        OpenKeyValueDailog,
    } = props;
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    return (
        <>
            <Dialog open={openViewDialog} onClose={handleClose}>
                <Box sx={{padding: 2}}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <DialogTitle sx={{p: '2px 0px'}}>Extra Added Details</DialogTitle>
                        <IconButton aria-label="close" onClick={handleViewDialogClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{padding: 2}}>
                        <Grid container spacing={2} sx={{textAlign: 'center'}}>
                            <Grid
                                container
                                item
                                xs={12}
                                alignItems="center"
                                sx={{
                                    borderBottom: '1px dashed black',
                                    paddingBottom: '5px',
                                }}
                            >
                                <Grid item xs={4}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: 600,
                                            textAlign: 'left',
                                            color: '#9e00af',
                                        }}
                                    >
                                        Key
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: 400,
                                            color: '#0a6f12',
                                            textAlign: 'left',
                                        }}
                                    >
                                        Value
                                    </Typography>
                                </Grid>
                            </Grid>
                            {(keyValueList || formData?.keyValueList)?.map(
                                (item: any, index: any) =>
                                    !item.isDeleted && (
                                        <>
                                            <Grid
                                                container
                                                item
                                                xs={12}
                                                key={index}
                                                alignItems="center"
                                            >
                                                <Grid item xs={4}>
                                                    {editIndex === index ? (
                                                        <TextField
                                                            value={newKeyValue.key}
                                                            onChange={(
                                                                e: ChangeEvent<HTMLInputElement>,
                                                            ) =>
                                                                setNewKeyValue({
                                                                    ...newKeyValue,
                                                                    key: e.target.value,
                                                                })
                                                            }
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    ) : (
                                                        <Typography
                                                            variant="body1"
                                                            sx={{
                                                                fontWeight: 600,
                                                                textAlign: 'left',
                                                                textDecoration: `${
                                                                    item.isDeleted &&
                                                                    '3px #ff4747 line-through '
                                                                }`,
                                                            }}
                                                        >
                                                            {item.key}
                                                        </Typography>
                                                    )}
                                                </Grid>
                                                <Grid item xs={6}>
                                                    {editIndex === index ? (
                                                        <TextField
                                                            value={newKeyValue.value}
                                                            onChange={(
                                                                e: ChangeEvent<HTMLInputElement>,
                                                            ) =>
                                                                setNewKeyValue({
                                                                    ...newKeyValue,
                                                                    value: e.target.value,
                                                                })
                                                            }
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    ) : (
                                                        <Typography
                                                            variant="body1"
                                                            sx={{
                                                                fontWeight: 400,
                                                                textAlign: 'left',
                                                                textDecoration: `${
                                                                    item.isDeleted &&
                                                                    '3px #ff4747 line-through '
                                                                }`,
                                                            }}
                                                        >
                                                            {item.value}
                                                        </Typography>
                                                    )}
                                                </Grid>
                                                <Grid item xs={2}>
                                                    {editIndex === index ? (
                                                        <>
                                                            <Button
                                                                onClick={handleSaveEdit}
                                                                color="primary"
                                                                size="small"
                                                            >
                                                                Save
                                                            </Button>
                                                            <Button
                                                                onClick={() => setEditIndex(null)}
                                                                color="secondary"
                                                                size="small"
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <IconButton
                                                                onClick={() =>
                                                                    handleEditClick(index)
                                                                }
                                                                color="primary"
                                                                size="small"
                                                                disabled={item.isDeleted}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                            {!item.isDeleted ? (
                                                                <IconButton
                                                                    onClick={() =>
                                                                        handleDelete(index)
                                                                    }
                                                                    color="error"
                                                                    size="small"
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            ) : (
                                                                <IconButton
                                                                    onClick={() =>
                                                                        handleUndo(index)
                                                                    }
                                                                    color="error"
                                                                    size="small"
                                                                >
                                                                    <UndoIcon />
                                                                </IconButton>
                                                            )}
                                                        </>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </>
                                    ),
                            )}
                            <div
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    textAlign: 'end',
                                    marginTop: '15px',
                                }}
                            >
                                <Button
                                    onClick={handleEdit}
                                    color="primary"
                                    size="medium"
                                    variant="contained"
                                >
                                    Save
                                </Button>
                            </div>
                        </Grid>
                    </Box>

                    <DialogActions
                        sx={{
                            pb: 2,
                            px: 2,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 0,
                        }}
                    >
                        <Typography component={'span'}>
                            If you want to add more details? &nbsp;&nbsp;&nbsp;&nbsp;{' '}
                            <ArrowForward />
                        </Typography>
                        <Button
                            onClick={OpenKeyValueDailog}
                            variant="outlined"
                            sx={{
                                px: 2,
                                mt: 0,
                                textTransform: 'capitalize',
                            }}
                            color="secondary"
                            disabled={!roles?.includes(RoleEnum.BankAccountUpdateKeyValue)}
                        >
                            Add More Details
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
};

export default ExtraAddedDetails;
