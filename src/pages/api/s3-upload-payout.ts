import {APIRoute} from 'next-s3-upload';

export default APIRoute.configure({
    bucket: process.env.S3_UPLOAD_PAYOUT_BUCKET,
});