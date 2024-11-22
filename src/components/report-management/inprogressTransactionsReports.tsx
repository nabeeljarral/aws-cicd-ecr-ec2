import React, {useEffect, useRef} from 'react';
import {Box, Button, Chip, CircularProgress, Container} from '@mui/material';
import {CloudDownloadOutlined, ErrorOutlineRounded, Label} from '@mui/icons-material';
import DoneIcon from '@mui/icons-material/Done';
import moment from 'moment';
import {TimeSpannedCounter} from './timeSpanned';
import {IReportFileInfo} from '@/utils/interfaces/report.interface';
import {downloadReport} from '@/utils/services/reports';
import {ReportFileEnum} from '@/utils/enums/reports';
import CloseIcon from '@mui/icons-material/Close';
import {CANCEL_REPORTS} from '@/utils/endpoints/endpoints';
import axiosInstance from '@/utils/axios';
import {RoleEnum} from '@/utils/enums/role';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {IUser} from '@/utils/interfaces/user.interface';
type Props = {
    reports: IReportFileInfo[];
    handleDownload: (reportId: string) => void;
    fetchReports: () => void;
};

const InprogressTransactionsReports: React.FC<Props> = ({
    reports,
    handleDownload,
    fetchReports,
}) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const roles = user?.roles as RoleEnum[];
    const isReportLogsActive = roles?.includes(RoleEnum.ActiveReportLogs);
    
    const handleCancelReport = async (reportId: string) => {
        try {
            const res = await axiosInstance({
                method: 'post',
                url: CANCEL_REPORTS,
                data: {reportId},
            });
            fetchReports();
            return res.data;
        } catch (error: any) {
            console.error(error);
        }
    };

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 3, pb: 3}}>
            <Container>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        p: 2,
                        mb: 2,
                        height: '50px',
                        width: '100%',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow:
                            '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
                    }}
                >
                    <h1>Transaction Reports from Last Day</h1>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                    {reports.map((report) => (
                        <Box
                            key={report._id}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: 2,
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                boxShadow:
                                    '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    marginBottom: '15px',
                                }}
                            >
                                {report?.filter &&
                                    (() => {
                                        const filter = JSON.parse(report?.filter);
                                        return (
                                            <Chip
                                                sx={{fontSize: '20px'}}
                                                label={` ${moment(filter.startDate).format(
                                                    'DD MMMM',
                                                )} - ${moment(filter.endDate).format(
                                                    'DD MMMM YYYY',
                                                )}`}
                                            />
                                        );
                                    })()}
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Box>
                                    <strong>Filename:</strong> {report.filename}
                                    <br />
                                    <strong>Generated At:</strong>{' '}
                                    {moment(report.createdAt).format('DD MMM YYYY hh:mm:ss')}
                                    <br />
                                    {report?.fileAttached && (
                                        <Box>
                                            <strong>Report Age: </strong>
                                            <span>
                                                <TimeSpannedCounter
                                                    createdAt={new Date(report.updatedAt)}
                                                />
                                            </span>
                                        </Box>
                                    )}
                                    {report?.status && (
                                        <Box>
                                            <strong>Status: </strong>

                                            {ReportFileEnum.initiated == report.status ? (
                                                <Chip
                                                    sx={{
                                                        color: '#956621',
                                                        background: '#9566212b',
                                                        padding: '2px',
                                                    }}
                                                    label="Your report is iniated."
                                                />
                                            ) : ReportFileEnum.canceled == report.status ? (
                                                <Chip
                                                    sx={{
                                                        color: '#c30000',
                                                        background: '#ffe0e0',
                                                        padding: '2px',
                                                    }}
                                                    label="Report Canceled"
                                                />
                                            ) : ReportFileEnum.failed == report.status ? (
                                                <Chip
                                                    sx={{
                                                        color: '#c30000',
                                                        background: '#ffe0e0',
                                                        padding: '2px',
                                                    }}
                                                    label="Report Generation Failed"
                                                />
                                            ) : ReportFileEnum.completed == report.status ? (
                                                <Chip
                                                    sx={{
                                                        color: '#04877b',
                                                        background: '#baefea',
                                                        padding: '2px',
                                                    }}
                                                    label="Completed"
                                                />
                                            ) : ReportFileEnum.inqueue == report.status ? (
                                                <Chip
                                                    sx={{
                                                        color: '#956621',
                                                        background: '#9566212b',
                                                        padding: '2px',
                                                    }}
                                                    label="Initiating"
                                                />
                                            ) : (
                                                <Chip
                                                    sx={{
                                                        color: '#956621',
                                                        padding: '2px',
                                                        background: '#9566212b',
                                                    }}
                                                    label={report.status}
                                                />
                                            )}
                                        </Box>
                                    )}
                                    {report?.fetchedCount && (
                                        <Box>
                                            <strong>Fetch Count: </strong>
                                            <span>{report?.fetchedCount}</span>
                                        </Box>
                                    )}
                                </Box>
                                <Box>
                                    {ReportFileEnum.canceled == report.status && (
                                        <Chip
                                            sx={{
                                                color: '#c30000',
                                                background: '#ffe0e0',
                                            }}
                                            label={
                                                <>
                                                    <ErrorOutlineRounded sx={{mr: 1}} />
                                                    Report Canceled
                                                </>
                                            }
                                        />
                                    )}
                                    {report?.fileAttached ? (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1,
                                            }}
                                        >
                                            <Chip
                                                sx={{
                                                    color: '#04877b',
                                                    background: '#baefea',
                                                }}
                                                label={
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <DoneIcon
                                                            color="inherit"
                                                            sx={{
                                                                mr: 1,
                                                            }}
                                                        />
                                                        <span>
                                                            Your report is ready to download
                                                        </span>
                                                    </Box>
                                                }
                                            />
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: '#5ca9a2',
                                                    '&:hover': {
                                                        backgroundColor: '#5ca9a2',
                                                        opacity: 0.8,
                                                    },
                                                }}
                                                onClick={() => handleDownload(report._id)}
                                            >
                                                <CloudDownloadOutlined sx={{mr: 1}} /> Download
                                                Report
                                            </Button>
                                        </Box>
                                    ) : report?.reportInProgress ? (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1,
                                                alignItems: 'end',
                                            }}
                                        >
                                            <Chip
                                                sx={{
                                                    color: '#0a5272',
                                                    background: '#cfecf8',
                                                }}
                                                label={
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            letterSpacing: '0.02857em',
                                                        }}
                                                    >
                                                        <CircularProgress
                                                            color="inherit"
                                                            size={20}
                                                            sx={{
                                                                mr: 1,
                                                            }}
                                                        />
                                                        {report?.fetchedCount ? (
                                                            <span>
                                                                Your report will be ready soon
                                                            </span>
                                                        ) : ReportFileEnum.inqueue ==
                                                          report.status ? (
                                                            <span>
                                                                Initiating your request, Please wait
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                Request initiated generating
                                                            </span>
                                                        )}
                                                    </Box>
                                                }
                                            />
                                            <Box>
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        color: '#c30000',
                                                        background: '#ffe0e0',
                                                        '&:hover': {
                                                            backgroundColor: '#ffe0e0',
                                                            opacity: 0.8,
                                                        },
                                                    }}
                                                    onClick={() => handleCancelReport(report._id)}
                                                >
                                                    <CloseIcon sx={{mr: 1}} /> Cancel Report
                                                </Button>
                                            </Box>
                                        </Box>
                                    ) : report?.error || report.status == ReportFileEnum.failed ? (
                                        <Chip
                                            sx={{
                                                color: '#c30000',
                                                background: '#ffe0e0',
                                            }}
                                            label={
                                                <>
                                                    <ErrorOutlineRounded sx={{mr: 1}} /> Server is
                                                    busy, Retry Again
                                                </>
                                            }
                                        />
                                    ) : (
                                        ''
                                    )}
                                </Box>
                            </Box>
                            <Box>
                                {report?.filter && (
                                    <>
                                        <strong>Applied Filters:</strong>
                                        <br />
                                        {(() => {
                                            const filter = JSON.parse(report.filter);
                                            return (
                                                <>
                                                    <Box
                                                        sx={{
                                                            py: 1,
                                                            display: 'flex',
                                                            gap: 1,
                                                        }}
                                                    >
                                                        <Chip
                                                            label={`Start Date: ${moment(
                                                                filter.startDate,
                                                            ).format('MMM DD YYYY HH:mm:ss')}`}
                                                        />
                                                        <Chip
                                                            label={`End Date: ${moment(
                                                                filter.endDate,
                                                            ).format('MMM DD YYYY HH:mm:ss')}`}
                                                        />
                                                        {filter?.status && (
                                                            <Chip
                                                                label={`Status: ${filter?.status}`}
                                                            />
                                                        )}
                                                        {filter?.type && (
                                                            <Chip label={`Type: ${filter.type}`} />
                                                        )}
                                                        {filter?.relatedTo && (
                                                            <Chip
                                                                label={`Related To: ${filter.relatedTo}`}
                                                            />
                                                        )}
                                                    </Box>
                                                </>
                                            );
                                        })()}
                                    </>
                                )}
                            </Box>
                            <Box>
                                {report?.createdBy?.username && (
                                    <>
                                        <Box>
                                            <strong>Created by: </strong>
                                            {report?.createdBy?.username}
                                        </Box>
                                    </>
                                )}
                                {report?.createdByList?.filter((a) => a._id != report.createdBy._id)
                                    .length > 0 && (
                                    <>
                                        <strong>Created by others:</strong>
                                        <br />
                                        <Box sx={{py: 1, display: 'flex', gap: 1}}>
                                            {report.createdByList
                                                .filter((a) => a._id != report.createdBy._id)
                                                .map((createdBy) => (
                                                    <Chip
                                                        key={createdBy._id} // Always use unique keys for list items
                                                        label={createdBy.username}
                                                    />
                                                ))}
                                        </Box>
                                    </>
                                )}
                            </Box>
                            {report?.logs && report?.reportInProgress && isReportLogsActive && (
                                <Box>
                                    <>
                                        <strong>Logs:</strong>
                                        <br />
                                        <Box
                                            sx={{
                                                height: '75px',
                                                overflow: 'auto',
                                                background: 'black',
                                                color: '#e3e3e3',
                                                padding: '0 5px',
                                            }}
                                        >
                                            {report.logs.map((log) => (
                                                <Box>{log}</Box>
                                            ))}
                                        </Box>
                                    </>
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default InprogressTransactionsReports;
