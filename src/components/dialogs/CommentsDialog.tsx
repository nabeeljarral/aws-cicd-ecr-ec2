import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {DialogActions} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import {IComment} from '@/utils/dto/transactions.dto';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import {DateFormatter} from '@/utils/functions/global';


export interface Props {
    open: boolean;
    comments?: IComment[];
    onClose: () => void;
}

export function CommentsDialog(props: Props) {
    const {onClose, comments, open} = props;

    return (
        <Dialog open={open}>
            <DialogTitle>Comments History</DialogTitle>

            {
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell width="750px">Comment</TableCell>
                            <TableCell width="450px">Date</TableCell>
                            <TableCell width="250px">By</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            comments?.length && comments?.map(comment =>
                                <TableRow hover>
                                    <TableCell>
                                        <b>{comment?.comment}</b>
                                    </TableCell>
                                    <TableCell>
                                        {DateFormatter(comment?.date)}
                                    </TableCell>
                                    <TableCell>
                                        {comment?.createdBy?.username}
                                    </TableCell>
                                </TableRow>,
                            )
                        }
                        {
                            !comments?.length && <TableRow hover>
                                <TableCell colSpan={3} align="center">
                                    No Comment Availible
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            }

            <DialogActions sx={{pb: 2, px: 2}}>
                <LoadingButton
                    onClick={onClose}
                    variant="contained"
                    sx={{px: 3, mt: 2, textTransform: 'capitalize'}}
                    color="success">
                    Back
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}