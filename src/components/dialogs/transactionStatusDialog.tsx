import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {ITransaction} from '@/utils/interfaces/transaction.interface';
import {Button, DialogActions} from '@mui/material';
import Box from '@mui/material/Box';
import {ArrowBackRounded} from '@mui/icons-material';
import Grid2 from '@mui/material/Unstable_Grid2';
import {DateFormatter} from '@/utils/functions/global';
import StatusChip from '@/components/main/statusChip';
import {TransactionStatusEnum} from '@/utils/enums/transactionStatus';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import Typography from '@mui/material/Typography';


export interface Props {
    open: boolean;
    transaction?: ITransaction;
    onClose: () => void;
}

export function TransactionStatusDialog(props: Props) {
    const {onClose, transaction, open} = props;

    return (
        <Dialog open={open}>
            <DialogTitle>
                Transaction Status Updates <br />
                <Typography sx={{color: '#5b5a5a', fontSize: '12px'}}>Id: {transaction?._id}</Typography>
            </DialogTitle>
            {
                transaction && !!transaction?.statusUpdates?.length &&
                <Grid2 container spacing={2} sx={{mt: 2, mx: 6, mb: 4}}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell width="250px">Status</TableCell>
                                <TableCell width="230px">Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                transaction.statusUpdates.map(s =>
                                    <TableRow hover>
                                        <TableCell>
                                            <StatusChip status={s.status as TransactionStatusEnum} />
                                        </TableCell>
                                        <TableCell>
                                            {DateFormatter(s.date)}
                                        </TableCell>
                                    </TableRow>,
                                )
                            }
                        </TableBody>
                    </Table>
                </Grid2>
            }
            {
                !transaction?.statusUpdates?.length && <Box sx={{ml: 4}}>
                    No Updates Availible
                </Box>
            }

            <DialogActions sx={{pb: 2, px: 2}}>
                <Button
                    onClick={() => onClose()}
                    variant="contained"
                    sx={{pr: 4, mt: 2, mr: 'auto', textTransform: 'capitalize'}}
                    color="primary">
                    <ArrowBackRounded sx={{mr: 1}} />
                    Back
                </Button>
            </DialogActions>
        </Dialog>
    );
}
