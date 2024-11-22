import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import {Warning} from '@mui/icons-material';
import Typography from '@mui/material/Typography';

const DataNotFoundTableRow = (props: {colSpan?: number}) => {
    return <TableRow>
        <TableCell align={'center'} colSpan={props.colSpan || 6}>
            <Box>
                <Warning fontSize="large" sx={{m: 1}} />
                <Typography>Data Not Available</Typography>
            </Box>
        </TableCell>
    </TableRow>;
};
export default DataNotFoundTableRow;
