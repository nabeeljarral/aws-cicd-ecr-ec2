import {forwardRef, useState} from 'react';
import Paper from '@mui/material/Paper';
import MainTable from '@/components/tables/mainTable';
import {IAttemptsResponsePayload, IReceivedCallbackLog} from '@/utils/interfaces/logger.interface';
import StatusChip2 from '@/components/main/statusChip2';
import {IColumn} from '@/utils/interfaces/table.interface';
import YesNoChip from '@/components/main/yesNoChip';
import {DateFormatter} from '@/utils/functions/global';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import {Box, Modal, Typography,IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import awesomeAlert from '@/utils/functions/alert';

interface Props {
    limit: number;
    loading: boolean;
    page: number;
    setLimit: (limit: number) => void;
    setPage: (page: number) => void;
    total: number;
    rows: IReceivedCallbackLog[];
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    backgroundColor:"#0D0D0D",
    borderRadius:"15px"
};

const ReceivedCallbackTable = forwardRef((props: Props, ref) => {
    // const classes = useStyles();
    const {loading, rows, limit, setLimit, total, setPage, page} = props;
    const [open, setOpen] = useState(false);

    const handleBodyData = (prettifiedData:any) => {
        setOpen(!open);
        navigator.clipboard.writeText(prettifiedData).then(() => {
            awesomeAlert({msg: 'JSON Data Copied'});
          })
    };
    const handleClose = () => {setOpen(false)}
    const columns: IColumn[] = [
        {
            id: 'createdAt',
            label: 'Date',
            minWidth: 200,
            format: (value: Date) => DateFormatter(value),
        },
        {
            id: 'externalRef',
            label: 'External Ref ID',
            minWidth: 150,
            // align: 'center'
        },
        {
            id: 'txnStatus',
            label: 'Received Status',
            align: 'center',
            minWidth: 150,
            passRow: true,
            format: (row: any) => {return <StatusChip2 status={row.txnStatus} />},
        },
        {
            id: 'msg',
            label: 'Message',
            minWidth: 200,
            // align: 'center'
        },
        {
            id: 'data',
            label: 'Body',
            minWidth: 300,
            passRow: true,
            format: (row: any) => {
                let prettifiedData = '';
                try {
                    const dataObject = JSON.parse(row.data);
                    prettifiedData = JSON.stringify(dataObject, null, 2);
                } catch (error) {
                    console.error('JSON parsing error:', error);
                    prettifiedData = 'Invalid JSON data';
                }

                return (
                    <>
                        <span style={{cursor: 'pointer'}} onClick={() => handleBodyData(prettifiedData)}>
                            {row.data}
                        </span>
                        <Modal
                            keepMounted
                            open={open}
                            onClose={handleBodyData}
                            aria-labelledby="keep-mounted-modal-title"
                            aria-describedby="keep-mounted-modal-description"
                        >
                            {/* <Box sx={style}>
                                {prettifiedData.split('\n').map((line, index) => (
                                    <span key={index}>
                                        {line.split(': ').map((part, idx) => (
                                            <span
                                                key={idx}
                                                style={{
                                                    color: idx === 0 ? 'darkpink' : 'Green',
                                                    fontWeight: idx === 0 ? 'normal' : 'normal',
                                                }}
                                            >
                                                {part}
                                                {idx === 0 ? ': ' : ''}
                                            </span>
                                        ))}
                                        <br />
                                    </span>
                                ))}
                            </Box> */}
                            <Box sx={style}>
                            <Typography sx={{fontWeight:600,color:"white"}}>
                                Body
                            </Typography>
                                <IconButton
                                    aria-label="close"
                                    onClick={handleClose}
                                    sx={{
                                        position: 'absolute',
                                        right: 8,
                                        top: 8,
                                        color: (theme) => theme.palette.grey[500],
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                                <pre>
                                    <code style={{color:'white'}}
                                        dangerouslySetInnerHTML={{
                                            __html: prettifiedData
                                                ?.replace(
                                                    /"([^"]+)":/g,
                                                    '<span style="color: #df3079; font-weight:600">"$1"</span>:',
                                                )
                                                ?.replace(
                                                    /: "([^"]+)"/g,
                                                    ': <span style="color: #00a67d;">"$1"</span>',
                                                )
                                                ?.replace(
                                                    /: (\d+)/g,
                                                    ': <span style="color: #00a67d;">$1</span>',
                                                ),
                                        }}
                                    />
                                </pre>
                            </Box>
                        </Modal>
                    </>
                );
            },
        },
    ];

    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <MainTable
                loading={loading}
                setPage={(page) => setPage(page)}
                setLimit={(limit) => setLimit(limit)}
                limit={limit}
                page={page}
                total={total}
                rows={rows}
                columns={columns}
            />
        </Paper>
    );
});

export default ReceivedCallbackTable;
