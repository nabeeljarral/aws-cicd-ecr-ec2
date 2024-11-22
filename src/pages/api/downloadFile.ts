import {NextApiRequest, NextApiResponse} from 'next';
import aws from 'aws-sdk';
import formidable from 'formidable';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing form:', err);
                res.status(500).json({error: 'Error parsing form'});
                return;
            }

            console.log(fields);
            // @ts-ignore
            const key: string = fields.key;

            // Configure AWS SDK using environment variables
            const s3 = new aws.S3({
                accessKeyId: process.env.S3_UPLOAD_KEY,
                secretAccessKey: process.env.S3_UPLOAD_SECRET,
                region: process.env.S3_UPLOAD_REGION,
            });

            const params = {
                Bucket: process.env.S3_UPLOAD_BUCKET || 'payz365',
                Key: key,
            };

            // Download file from S3
            const fileStream = s3.getObject(params).createReadStream();

            // Set the appropriate headers
            res.setHeader('Content-disposition', `attachment; filename=${path.basename(key)}`);
            res.setHeader('Content-Type', 'application/octet-stream');

            // Pipe the file stream to the response
            fileStream.pipe(res);
        });
    } else {
        res.status(405).json({error: 'Method Not Allowed'});
    }
};
