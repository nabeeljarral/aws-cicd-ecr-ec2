import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {Button, DialogActions} from '@mui/material';
import Box from '@mui/material/Box';
import {ArrowBackRounded} from '@mui/icons-material';
import Grid2 from '@mui/material/Unstable_Grid2';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import Typography from '@mui/material/Typography';
import {DateFormatter} from '@/utils/functions/global';
import {IPayoutTransaction} from '@/utils/dto/transactions.dto';


export interface Props {
    open: boolean;
    transaction?: IPayoutTransaction;
    onClose: () => void;
}

const stringFromObject = (statusHistoryItems: Partial<IPayoutTransaction>) => {
    let str = '';
    const acceptedList = ['vendorId', 'amount', 'amount_fees', 'status', 'utr'];
    for (const [key, value] of Object.entries(statusHistoryItems)) {
        if (acceptedList.includes(key)) {
            str += ` ${key}: ${value as string} |`;
        }
    }
    return str.slice(0, -1);
};

export function UpdatesHistoryPayoutTransactionDialog(props: Props) {
    const {onClose, transaction, open} = props;

    return (
        <Dialog open={open}>
            <DialogTitle>
                Transaction Status Updates <br />
                <Typography sx={{color: '#5b5a5a', fontSize: '12px'}}>Id: {transaction?._id}</Typography>
            </DialogTitle>
            {
                transaction && !!transaction?.status_history?.length &&
                <Grid2 container spacing={2} sx={{mt: 2, mx: 6, mb: 4}}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell width="750px">Info</TableCell>
                                <TableCell width="250px">Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                transaction.status_history.map(s =>
                                    <TableRow hover>
                                        <TableCell>
                                            <b>{stringFromObject(s.data)}</b>
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
                !transaction?.status_history?.length &&
                <Box sx={{ml: 4, width: '400px'}}>
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