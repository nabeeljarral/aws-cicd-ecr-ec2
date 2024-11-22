import React, {useState} from 'react';
import {Grid, Box, Typography, Dialog, IconButton, Chip} from '@mui/material';
import QRCode from 'qrcode.react'; // QRCode component to generate QR codes
import CloseIcon from '@mui/icons-material/Close';

interface QRCodeItem {
    name: string;
    url: string;
    isActive: boolean;
    hits: number;
    _id: string; // Assuming each QR code has a unique identifier
}

interface QRCodeListProps {
    qrsList: QRCodeItem[];
    setQrsList: React.Dispatch<React.SetStateAction<QRCodeItem[]>>;
}

const QRCodeList: React.FC<QRCodeListProps> = ({qrsList, setQrsList}) => {
    const [openZoom, setOpenZoom] = useState(false);
    const [selectedQRCode, setSelectedQRCode] = useState<QRCodeItem | null>(null);

    // Handle QR code click to open zoomed view
    const handleQRCodeClick = (qr: QRCodeItem) => {
        setSelectedQRCode(qr); // Set the clicked QR code as the selected QR code
        setOpenZoom(true); // Open the modal
    };

    // Handle modal close
    const handleCloseZoom = () => {
        setOpenZoom(false);
        setSelectedQRCode(null); // Clear the selected QR code when the modal is closed
    };

    return (
        <>
            <Box sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                <Box sx={{flexGrow: 1, overflow: 'auto', maxHeight: '100%'}}>
                    <Grid container spacing={1}>
                        {qrsList.length
                            ? qrsList
                                  .filter((x) => x.isActive)
                                  .sort((a, b) => (a.hits < b.hits ? -1 : 1))
                                  .map((qr, index) => (
                                      <Grid item key={index}>
                                          <Box
                                              onClick={() => handleQRCodeClick(qr)} // Handle QR click
                                              sx={{
                                                  p: 1,
                                                  border: qr.isActive
                                                      ? '3px solid #63c16b'
                                                      : '3px solid #b40b44',
                                                  borderRadius: '5px',
                                                  cursor: 'pointer', // Make it look clickable
                                              }}
                                          >
                                              <QRCode value={qr.url} size={75} />
                                              <Typography sx={{mt: 1}} fontSize={11}>
                                                  Name: {qr.name}
                                              </Typography>
                                              <Typography fontSize={11}>Hits: {qr.hits}</Typography>
                                          </Box>
                                      </Grid>
                                  ))
                            : 'No QR Available'}
                    </Grid>
                </Box>
            </Box>

            {/* Modal for Zoomed QR Code */}
            <Dialog open={openZoom} onClose={handleCloseZoom}>
                <Box sx={{position: 'relative', padding: 3}}>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseZoom}
                        sx={{position: 'absolute', right: 8, top: 8}}
                    >
                        <CloseIcon />
                    </IconButton>

                    {selectedQRCode && (
                        <Box sx={{textAlign: 'center', mt: 4}}>
                            <Typography fontWeight="bold" mb={2} fontSize={16}>
                                {selectedQRCode.name}
                            </Typography>
                            <QRCode value={selectedQRCode.url} size={250} /> {/* Zoomed QR */}
                            <Typography fontSize={14} mt={2}>
                                Hits: {selectedQRCode.hits}
                            </Typography>
                            <Typography fontSize={14} mt={2}>
                                <Chip
                                    label={selectedQRCode.isActive ? 'Active' : 'Inactive'}
                                    color={selectedQRCode.isActive ? 'success' : 'error'}
                                />
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Dialog>
        </>
    );
};

export default QRCodeList;
