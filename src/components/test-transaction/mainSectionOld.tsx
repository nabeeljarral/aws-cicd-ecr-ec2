import {ITransaction} from '@/utils/interfaces/transaction.interface';
import awesomeAlert from '@/utils/functions/alert';
import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Image from 'next/image';
import {asset, PriceFormatter} from '@/utils/functions/global';
import {Menu, Modal} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import {CopyAll} from '@mui/icons-material';
import {LoadingButton} from '@mui/lab';
import {HowTo} from '@/components/test-transaction/howTo';
import QRCode from 'qrcode.react';
import moment from 'moment';
import {langEn, langTamil, langTelgu} from '@/utils/translation/lang';
import {PaymentMethodsImages} from '@/components/test-transaction/PaymentMethodsImages';
import {SecurePaymentImages} from '@/components/test-transaction/securePaymentImages';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    maxHeight: '90%',
    boxShadow: 24,
    overflowY: 'auto',
    p: 4,
};

type MainSectionProps = {
    transaction: ITransaction,
    onSubmit: any,
    loading: boolean
}

export const MainSectionOld = ({transaction, onSubmit, loading}: MainSectionProps) => {
    const $t = (text: string) => {
        if (lang === 'தா') return (langTamil[text]);
        else if (lang === 'తెలుగు') return (langTelgu[text]);
        else return (langEn[text]);
    };

    function downloadQRCode() {
        // @ts-ignore
        const {toDataURL} = document.querySelector('canvas');
        const dataURL = toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'qr-code.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const [remainingTime, setRemainingTime] = useState(0);

    function copyToClipboard(val: string) {
        navigator.clipboard.writeText(val);
        awesomeAlert({msg: 'UPI Copied'});
    }

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleCloseModal = () => setOpen(false);

    const [lang, setLang] = React.useState('En');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openLang = Boolean(anchorEl);
    const activeUpiId = transaction?.setting?.active_upi_id;
    const upiId = typeof activeUpiId === 'string' ? '' : activeUpiId?.upi_id;
    const qrCodeUrl = typeof activeUpiId === 'string' ? '' : activeUpiId?.qrcode_url;
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (lang?: string) => {
        setAnchorEl(null);
        setLang(lang || '');
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            const createdAt = moment(transaction?.createdAt);
            const fiveMinutesAgo = moment().subtract(10, 'minutes');
            const diffInSeconds = fiveMinutesAgo.diff(createdAt, 'seconds');
            setRemainingTime(Math.max(0, -diffInSeconds));
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return <Box className="payment-old" sx={{
        '--primary': process.env.NEXT_PUBLIC_COLOR || '#159895',
    }}>
        <div id="loader"></div>
        <div id="notification"></div>
        <Box id="payment-form" component="form" method="post" onSubmit={onSubmit}>
            <div className="container">
                <div className="nav">
                    <div className="time">
                        <Image width={22} height={19} src={asset('icons/stopwatch-solid.svg')} alt="time-icon" />
                        <span id="time">
                            {Math.floor(remainingTime / 60)}:{remainingTime % 60 < 10 ? `0${remainingTime % 60}` : remainingTime % 60}
                        </span>
                    </div>
                    <div className="lang d-desktop ms-auto">
                        <span id="english" onClick={() => handleClose('En')} className="selected">En</span>
                        <span id="tamil" onClick={() => handleClose('தா')}>தா</span>
                        <span id="telgu" onClick={() => handleClose('తెలుగు')}>తెలుగు</span>
                    </div>
                    <div className="dropdown d-mobile ms-auto">

                        <button className="" type="button" id="lang-dropdown" onClick={handleClick}
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span>{lang} </span>
                            <Image style={{display: 'inline-block', marginRight: '5px'}} width={20} height={20}
                                   src={asset('icons/iconmonstr-globe-6-old.svg')} alt="time-icon" />
                            <span id="lang_text2">{$t(anchorEl || 'En')}</span>
                        </button>

                        <Menu
                            id="demo-positioned-menu"
                            aria-labelledby="demo-positioned-button"
                            anchorEl={anchorEl}
                            open={openLang}
                            onClose={() => handleClose(lang)}
                            anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                            transformOrigin={{vertical: 'top', horizontal: 'left'}}
                        >
                            <MenuItem id="english2" onClick={() => handleClose('En')}>En</MenuItem>
                            <MenuItem id="tamil2" onClick={() => handleClose('தா')}>தா</MenuItem>
                            <MenuItem id="telgu2" onClick={() => handleClose('తెలుగు')}>తెలుగు</MenuItem>
                        </Menu>
                    </div>

                </div>
            </div>
            <div className="container pb-5">
                <div className="main-row">
                    <div>
                        <h2 className="text-center price f-40 d-mobile">₹ {PriceFormatter(transaction?.amount)}</h2>
                        <div className="qrcode-container">
                            <p className="translateText f-20"
                               style={{marginBottom: '10px'}}>ssss{$t('Scan QR Code To Pay')}</p>

                            {/*<div className="d-none">*/}
                            {/*    <Box sx={{borderRadius: '30px', p: 3, mx: 'auto', background: 'white', display: 'inline-block'}}>*/}
                            {/*        <QRCode size={258} value={`${test?.bank_account?.qrcode_url}`}/>*/}
                            {/*    </Box>*/}
                            {/*</div>*/}
                            <div className="payment-method d-desktop my-3">
                                <PaymentMethodsImages transaction={transaction} />
                            </div>
                            <div className="qrcode">
                                {qrCodeUrl ? <Box sx={{
                                    borderRadius: '30px', p: 5, mx: 'auto', background: 'white', display: 'inline-block',
                                }}>
                                    <QRCode size={300} value={`${qrCodeUrl}`} />
                                </Box> : $t('Image Is Missing')}
                                {/*<div className="download-img">*/}
                                {/*    <a download="qrcode-{{$test->_id}}.jpg"*/}
                                {/*       href="{{$qrcodeUrl = asset('qrcodes') . '/' . BankAccount::find($test->bank_account_id)->qrcode}}"*/}
                                {/*       title="{{$test->_id}}">*/}
                                {/*        <span className="translateText f-16">Download</span>*/}
                                {/*        <img src="{{ asset('icons/iconmonstr-download-19.svg')}}" alt="download-icon">*/}
                                {/*    </a>*/}
                                {/*</div>*/}
                            </div>
                            <div className="dont-use-text mt-1">
                                <span
                                    className="translateText f-10">{$t('Don\'t use the same QR code to pay multiple times')}</span>
                            </div>

                            <div className="copy-upi d-mobile d-flex justify-content-center my-4 gap-2">
                                <CopyAll onClick={() => copyToClipboard(upiId ?? '')} />
                                <Box
                                    style={{
                                        display: 'inline-block', wordBreak: 'break-word', fontSize: 'medium',
                                    }}
                                    className="f-16"
                                    id="opportunity_bank">{upiId}</Box>
                            </div>
                        </div>
                        <div className="payment-method d-mobile my-3">
                            <PaymentMethodsImages transaction={transaction} />
                        </div>
                        <div className="secure-list d-desktop mt-2">
                            <div className="grid">
                                <SecurePaymentImages />
                            </div>
                            <h6 className="translateText f-10 text-center mt-2">{$t('100% Secure Payments')}</h6>
                        </div>
                    </div>
                    <div>
                        <div className="d-desktop">
                            <h2 className="price f-40">₹ {PriceFormatter(transaction?.amount)}</h2>
                            <p className="f-16">Ref. #{transaction?._id}</p>
                            <div className="copy-upi d-flex my-4 gap-2">
                                <CopyAll sx={{mx: 1, cursor: 'pointer'}} onClick={() => copyToClipboard(upiId ?? '')} />
                                <Box
                                    style={{
                                        display: 'inline-block', wordBreak: 'break-word', fontSize: 'medium',
                                    }}
                                    className="f-16"
                                    id="opportunity_bank">{upiId}</Box>
                            </div>
                        </div>
                        <div className="utr-input">
                            <div id="handler" className="padd-tp Confirm">
                                <div className="inputUTR">
                                    <span id="error"></span>
                                    <input id="utr" name="utr" type="number" style={{width: '100%', margin: '15px 0'}}
                                           placeholder={$t('Enter 12 Digit UTR Number')}
                                           pattern="/^-?\d+\.?\d*$/" />
                                    <input type="hidden" name="id" id="id" value={transaction?._id} />
                                </div>
                            </div>
                            <div className="text-left pl-1" style={{margin: '10px 0'}}>
                                <p className="translateText m-0 pt-1 f-10">{$t('Please Check your payment application for UTR number')}</p>
                                <div className="m-0 pt-1 f-10">
                                    <span className="translateText">{$t('How to find the UTR number ?')} </span>
                                    <a className="" data-toggle="modal"
                                       data-target="#exampleModalLong"
                                       onClick={handleOpen}
                                       style={{color: 'var(--text-color)'}}>
                                        <u className="translateText">{$t('Click Here')}</u>
                                    </a>
                                </div>
                            </div>
                            <div>
                                <LoadingButton type="submit" variant="contained" color="inherit"
                                               loading={loading}
                                               sx={{
                                                   my: 4,
                                                   background: 'white',
                                                   color: 'var(--primary)',
                                                   width: '300px',
                                               }}>
                                    {$t('Submit')}
                                </LoadingButton>
                            </div>
                        </div>
                        <div className="payment-process mt-4">
                            <div>
                                <h3 className="translateText f-16 font-weight-bold">{$t('Payment Process:')}</h3>
                            </div>
                            <div className="mt-2">
                                <span className="img">
                                    <Image width={30} height={30} alt="qr-scan"
                                           src={asset('icons/iconmonstr-qr-code-9.svg')}
                                           style={{verticalAlign: 'bottom'}} />
                                </span>
                                <span className="f-14 translateText">{$t('Scan QR Code or copy UPI Id')}</span>
                            </div>
                            <div className="mt-2">
                                <div className="img">
                                    <Image width={30} height={30} alt="card-icon"
                                           src={asset('icons/money-check-dollar-solid.svg')} />
                                </div>
                                <div className="f-14">
                                    <span
                                        className="translateText">{$t('After paying from your payment apps: PayTM,PhonePE, GooglePay,BHIM,etc.')}</span>
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="img">
                                    <Image width={21} height={28} alt="card-icon" src={asset('icons/receipt-solid.svg')}
                                           style={{verticalAlign: 'bottom', margin: '0 auto'}} />
                                </div>
                                <div className="f-14 translateText">{$t('Submit the correct UTR code')}</div>
                            </div>
                        </div>
                        <div className="secure-list d-mobile mt-2">
                            <div className="grid">
                                <SecurePaymentImages />
                            </div>
                            <h6 className="translateText f-14 mt-2">{$t('100% Secure Payments')}</h6>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <HowTo />
                </Box>
            </Modal>

        </Box>
    </Box>;
};
