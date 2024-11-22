import {Box, Button, CircularProgress, TextField} from '@mui/material';
import {Add, Send} from '@mui/icons-material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import * as React from 'react';
import {FormEvent, useState} from 'react';
import {IComment} from '@/utils/dto/transactions.dto';
import {addEllipsis, DateFormatter} from '@/utils/functions/global';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {RoleEnum} from '@/utils/enums/role';
import awesomeAlert from '@/utils/functions/alert';
import {addComment} from '@/utils/services/comments';
import {IUser} from '@/utils/interfaces/user.interface';
import IconButton from '@mui/material/IconButton';
import {AlertTypeEnum} from '@/utils/enums/alertType';
import {IBatch} from '@/utils/interfaces/batch.interface';

type Props = {
    batch: IBatch;
    onShow: (comments: IComment[]) => void;
};

export const CommentActions = (props: Props) => {
    const {batch, onShow} = props;
    const comments = batch.comments || [];
    const user = useSelector((state: RootState) => state.auth.user);
    const roles = user?.roles;
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState<string>('');
    const [showEdit, setShowEdit] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!comment) {
            awesomeAlert({type: AlertTypeEnum.error, msg: 'Message is empty'});
            return;
        }
        setLoading(true);
        const res = await addComment(comment, batch?._id || ':BId');
        setLoading(false);
        if (res && !res?.message) {
            awesomeAlert({msg: 'Message sent successfully'});
            setShowEdit(false);
            setComment('');
            comments.push({comment, date: new Date(), createdBy: user as IUser});
        }
    };

    const isLessThan24Hours = (initialCommentDateStr: any, currentDateStr: any): boolean => {

        const initialCommentDate = new Date(initialCommentDateStr);
        const currentDate = new Date(currentDateStr);

        const timeDifference = currentDate.getTime() - initialCommentDate.getTime();

        const differenceInHours = timeDifference / (1000 * 60 * 60);

        return differenceInHours < 24;
    };

    const lastComment = comments.length ? comments[comments.length - 1].comment : '';
    const rowData = comments.length && comments[0].date;
    let lastCommentTime;
    let currentTime;
    if (rowData) {
        lastCommentTime = DateFormatter(rowData);
        currentTime = DateFormatter(new Date());
    }
    const diffTime = isLessThan24Hours(lastCommentTime, currentTime);


    return (
        <>
            {!showEdit && !comments.length && (
                <Button
                    color="success"
                    variant="text"
                    size="small"
                    sx={{textTransform: 'capitalize', pr: 2}}
                    startIcon={<Add />}
                    onClick={() => setShowEdit(true)}
                    disabled={!roles?.includes(RoleEnum.AddCommentBatch)}
                >
                    Add
                </Button>
            )}
            {!showEdit && !!comments.length && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        title={lastComment}
                        onClick={() => roles?.includes(RoleEnum.Admin) && onShow(comments)}
                    >
                        {addEllipsis(lastComment, 20)}
                    </Box>             
                    { (roles?.includes(RoleEnum.AddCommentBatch)  && diffTime) && (
                        <IconButton color="success" type="submit" size="small">
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                <ModeEditIcon fontSize="small" onClick={() => setShowEdit(true)}  />
                            )}
                        </IconButton>
                    )}
                   
                </Box>
            )}

            {showEdit && (
                <Box>
                    <form
                        onSubmit={handleSubmit}
                        style={{display: 'flex', minWidth: '200px', alignItems: 'center'}}
                    >
                        <TextField
                            size="small"
                            fullWidth
                            label="Add Comment"
                            margin="none"
                            value={comment}
                            onChange={(e) => setComment(e.currentTarget.value)}
                        />
                        <IconButton color="success" type="submit" size="small">
                            {loading ? <CircularProgress size={24} color="inherit" /> : <Send />}
                        </IconButton>
                    </form>
                </Box>
            )}
        </>
    );
};