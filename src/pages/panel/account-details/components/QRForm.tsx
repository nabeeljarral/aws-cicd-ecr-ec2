import React, {useState} from 'react';
import {
    Box,
    Button,
    Grid,
    TextField,
    Checkbox,
    FormControlLabel,
    IconButton,
    Typography,
    Chip,
    Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import QrCodeTwoToneIcon from '@mui/icons-material/QrCodeTwoTone';
import {IQRItem} from '@/utils/interfaces/bankAccount.interface';
import {useSelector} from 'react-redux';
import {RoleEnum} from '@/utils/enums/role';
import {RootState} from '@/store';
interface QRCode {
    name: string;
    url: string;
    isActive: boolean;
}
interface QRCodeFormProps {
    qrCodes: IQRItem[];
    setQrCodes: React.Dispatch<React.SetStateAction<IQRItem[]>>;
}
const QRCodeForm: React.FC<QRCodeFormProps> = ({qrCodes, setQrCodes}) => {
    // Handle input change for QR code fields
    const user = useSelector((state: RootState) => state.auth.user);
    const roles = user?.roles as RoleEnum[];
    const canAddQR = roles?.includes(RoleEnum.MultiQRCodeAdd);
    const canEditQR = roles?.includes(RoleEnum.MultiQRCodeEdit);
    const canMarkQRActiveOrInactive = roles?.includes(RoleEnum.MarkQRActiveOrInactive);

    const handleInputChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const {
            name,
            value,
            checked,
            type,
        }: {name: string; value: string; checked?: boolean; type: string} = event.target;

        const updatedQrCodes: IQRItem[] = [...qrCodes];

        if (type === 'checkbox' && typeof checked !== 'undefined') {
            if (name === 'isActive') {
                updatedQrCodes[index].isActive = checked; // Explicitly handle the checkbox
            }
        } else if (type === 'text') {
            if (name === 'name' || name === 'url') {
                updatedQrCodes[index][name] = value; // Handle only name and url fields
            }
        }

        setQrCodes(updatedQrCodes);
    };

    // Add a new QR code entry
    const addQrCode = () => {
        setQrCodes([
            ...qrCodes,
            {
                name: '',
                url: '',
                isActive: false,
                hits: 0,
                updatedAt: new Date(),
                createdAt: new Date(),
            },
        ]);
    };

    // Remove a QR code entry
    const removeQrCode = (index: number) => {
        const updatedQrCodes = [...qrCodes];
        updatedQrCodes.splice(index, 1); // Remove the QR code at the given index
        setQrCodes(updatedQrCodes);
    };
    return (
        <Box sx={{px: 2, mt: 1, border: '1px solid #ccc', borderRadius: '8px', p: 2}}>
            <Typography sx={{mb: 2}}>
                <QrCodeTwoToneIcon /> QR Codes:
            </Typography>
            <Grid container spacing={2}>
                {qrCodes.map((qrCode, index) => (
                    <Grid container item spacing={2} key={index}>
                        {/* Name Field */}
                        <Grid item xs={3}>
                            {canEditQR ? (
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="QR Name (QR-1, QR-2, etc.)"
                                    name="name"
                                    value={qrCode.name}
                                    onChange={(e) => handleInputChange(index, e)}
                                />
                            ) : (
                                <Typography>Name: {qrCode?.name || '--'}</Typography>
                            )}
                        </Grid>

                        {/* QR Code URL Field */}
                        <Grid item xs={4}>
                            {canEditQR ? (
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="QR Code URL"
                                    name="url"
                                    value={qrCode.url}
                                    onChange={(e) => handleInputChange(index, e)}
                                />
                            ) : (
                                <Tooltip title={qrCode?.url || '--'} arrow>
                                    <Typography
                                        sx={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        QR Code URL: {qrCode?.url || '--'}
                                    </Typography>
                                </Tooltip>
                            )}
                        </Grid>
                        <Grid
                            item
                            xs={2}
                            sx={{display: 'flex', alignItems: canEditQR ? 'center' : 'flex-start'}}
                        >
                            <Typography>Hits: {qrCode?.hits || '0'}</Typography>
                        </Grid>

                        {/* isActive Checkbox */}
                        <Grid item xs={2}>
                            {canMarkQRActiveOrInactive ? (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={qrCode?.isActive}
                                            name="isActive"
                                            onChange={(e) => handleInputChange(index, e)}
                                        />
                                    }
                                    label="Is Active?"
                                />
                            ) : (
                                <Typography>
                                    Is Active?:
                                    <Chip
                                        sx={{ml: 1, fontWeight: 600}}
                                        size="small"
                                        label={qrCode.isActive ? 'Active' : 'Inactive'}
                                        color={qrCode.isActive ? 'success' : 'error'}
                                    />
                                </Typography>
                            )}
                        </Grid>

                        {/* Remove Button with Cross Icon */}
                        {canEditQR && (
                            <Grid item xs={1} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                <IconButton onClick={() => removeQrCode(index)} aria-label="remove">
                                    <CloseIcon sx={{color: 'red'}} />
                                </IconButton>
                            </Grid>
                        )}
                    </Grid>
                ))}

                {/* Button to add more QR code inputs */}
                {canAddQR && (
                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            sx={{textTransform: 'capitalize'}}
                            onClick={addQrCode}
                        >
                            <AddIcon sx={{color: 'inherit'}} /> Add More QR Code
                        </Button>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default QRCodeForm;
