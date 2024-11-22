import {ITransaction} from '@/utils/interfaces/transaction.interface';
import awesomeAlert from '@/utils/functions/alert';
import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Image from 'next/image';
import {asset, isMobile, isUpiCollectFn, PriceFormatter} from '@/utils/functions/global';
import {Button, Menu, Modal} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import {CopyAll} from '@mui/icons-material';
import {
    LoadingButton,
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    timelineItemClasses,
    TimelineSeparator,
} from '@mui/lab';
import {HowTo} from '@/components/test-transaction/howTo';
import QRCode from 'qrcode.react';
import moment from 'moment';
import {langEn, langTamil, langTelgu} from '@/utils/translation/lang';
import {PaymentMethodsImages} from '@/components/test-transaction/PaymentMethodsImages';
import {SecurePaymentImages} from '@/components/test-transaction/securePaymentImages';
import Typography from '@mui/material/Typography';
import {BankTypesEnum} from '@/utils/enums/bankTypes.enum';
import {TransactionStatusEnum} from '@/utils/enums/transactionStatus';
import AmountAndTimer from './amountAndTimer';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #376BF5',
    maxHeight: '90%',
    boxShadow: 24,
    overflowY: 'auto',
    p: 4,
};

type MainSectionProps = {
    transaction: ITransaction;
    onSubmit: any;
    loading: boolean;
};

type paymentMethodsImages = {
    name: string;
    text: string;
    image: string;
    showInAutoPayin?: boolean;
};

export const BankButton = ({
    text,
    link,
    img,
    imgSize,
}: {
    text: string;
    link: string;
    img?: string;
    imgSize?: number;
}) => {
    const goToLink = (link2: string) => window.open(link2, '_self');
    
    return (
        <Button
            variant="outlined"
            onClick={() => goToLink(link)}
            color="inherit"
            sx={{
                mx: 1,
                mb: 2,
                textTransform: 'capitalize',
            }}
        >
            {!!img && (
                <Image
                    style={{borderRadius: '50%', overflow: 'hidden'}}
                    width={imgSize || 50}
                    height={imgSize || 50}
                    src={img}
                    alt={text}
                />
            )}
            {!!text && <div className="ml-2">{text}</div>}
        </Button>
    );
};
export const MainSection = ({transaction, onSubmit, loading}: MainSectionProps) => {
    const hidePhonePeAndOtherBtn =
        transaction &&
        transaction?.amount > 2000 &&
        (transaction.bank_type === BankTypesEnum.autoPayIn ||
            transaction.bank_type === BankTypesEnum.default);
    const [timerIntervalId, setTimerIntervalId] = useState<NodeJS.Timer>();
    const [remainingTime, setRemainingTime] = useState(300);
    const $t = (text: string) => {
        if (lang === 'தா') return langTamil[text];
        else if (lang === 'తెలుగు') return langTelgu[text];
        else return langEn[text];
    };

    const mobileAndTabletCheck = function () {
        let check = false;
        (function (a) {
            if (
                /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
                    a,
                ) ||
                /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                    a.substr(0, 4),
                )
            )
                check = true;
            // @ts-ignore
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };

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
    const bankAccount = transaction?.bank_account;
    const bankAccountId = transaction?.upiqr_Link
        ? transaction?.upi_id
        : typeof bankAccount === 'string'
        ? bankAccount
        : bankAccount?.upi_id;
    const bankType = transaction?.bank_type;
    const qrCode = transaction?.upiqr_Link
        ? transaction?.upiqr_Link
        : typeof bankAccount == 'string'
        ? ''
        : bankAccount?.qrcode_url;
    const qrCodeAddExtension = (qr: string) => {
        const tn = `&tn=gp${transaction.external_ref ?? transaction._id}`;
        const pnMatch = qr.match(/(pn=[^&]*)/);
        if (pnMatch) {
            const pnParameter = pnMatch[1];
            // Add 'tr' parameter after 'pn'
            return `${qr.trim().replace(pnParameter, pnParameter + tn)}&am=${transaction.amount}`;
        }
        return `${qr.trim()}${tn}&am=${transaction.amount}`;
    };
    const qrCodeUrl =
        bankType !== BankTypesEnum.default &&
        qrCode &&
        qrCode?.trim().startsWith('upi') &&
        !qrCode?.includes('&am=')
            ? qrCodeAddExtension(qrCode)
            : qrCode;
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (lang?: string) => {
        setAnchorEl(null);
        setLang(lang || '');
    };

    const paymentMethodsLogoOnly: paymentMethodsImages[] = [
        {
            name: 'gpay://upi/',
            text: 'GPay',
            image: asset('img/payment-method/google-pay-logo-icon.png'),
        },
        {
            name: 'phonepe',
            text: 'PhonePE',
            image: asset('img/payment-method/phonepe-logo-icon.png'),
        },
        {
            name: 'paytmmp',
            text: 'Paytm',
            image: asset('img/payment-method/paytm.png'),
        },
        {
            name: 'upi',
            text: 'Other',
            image: asset('img/payment-method/upi-icon.png'),
        },
    ];
    const paymentMethodsImages1: paymentMethodsImages[] = [
        {
            name: 'gpay://upi/',
            text: 'Google Pay',
            image: asset('img/payment-method/google-pay-logo-icon.png'),
            showInAutoPayin: true,
        },
        {
            name: 'phonepe',
            text: 'PhonePE',
            image: asset('img/payment-method/phonepe-logo-icon.png'),
            showInAutoPayin: true,
        },
        {
            name: 'paytmmp',
            text: 'Paytm',
            image: asset('img/payment-method/paytm.png'),
            showInAutoPayin: true,
        },
    ];
    const paymentMethodsImages: paymentMethodsImages[] = [
        {
            name: 'tez://upi/',
            text: 'Tez',
            image: asset('img/payment-method/tez.png'),
            showInAutoPayin: false,
        },
        // {
        //     name: 'cred',
        //     text: 'CRED',
        //     image: asset('img/payment-method/cred.jpg'),
        //     showInAutoPayin: true
        // },
        // {
        //     name: 'myairtel',
        //     text: 'My Airtel',
        //     image: asset('img/payment-method/myairtel.png'),
        //     showInAutoPayin: true
        // },
        {
            name: 'upi',
            text: 'Other',
            image: asset('img/payment-method/upi-icon.png'),
            showInAutoPayin: false,
        },
    ];
    const linkPrefix = (prefix: string, link: string) =>
        link.replace(prefix.includes('//') ? 'upi://' : 'upi', prefix);
    const isUpiCollect = isUpiCollectFn(transaction.bank_type);

    const FxmbId = '64f1de479cdc20ccf9900f49';

    useEffect(() => {
        
        if (!isUpiCollect) {
            const createdAt = moment(transaction.createdAt);
            setTimerIntervalId(
                setInterval(() => {
                    const fiveMinutesAgo = moment().subtract(10, 'minutes');
                    const diffInSeconds = fiveMinutesAgo.diff(createdAt, 'seconds');
                    setRemainingTime(Math.max(0, -diffInSeconds));
                }, 1000),
            );
        } else if (isUpiCollect && transaction.upi_id) {
            const createdAt = moment(transaction.updatedAt);
            setTimerIntervalId(
                setInterval(() => {
                    const fiveMinutesAgo = moment().subtract(5, 'minutes');
                    const diffInSeconds = fiveMinutesAgo.diff(createdAt, 'seconds');
                    setRemainingTime(Math.max(0, -diffInSeconds));
                }, 1000),
            );
        }
        return () => clearInterval(timerIntervalId);
    }, [transaction]);

    useEffect(() => {}, [transaction.status]);
    return (
        <>
            {((!isUpiCollect && transaction?.status === TransactionStatusEnum.initiate) ||
                (isUpiCollect && transaction?.status === TransactionStatusEnum.initiate) ||
                (isUpiCollect && transaction?.status === TransactionStatusEnum.pending)) && (
                <Box className="payment">
                    <Box
                        id="payment-form"
                        component="form"
                        method="post"
                        onSubmit={onSubmit}
                        sx={{minHeight: '100vh'}}
                    >
                        <div className="container">
                            <div className="nav text-primary">
                                <div style={{fontSize: '20px'}}>{$t('Payment Data')}</div>
                                <div className="dropdown ms-auto">
                                    <button
                                        className=""
                                        type="button"
                                        id="lang-dropdown"
                                        onClick={handleClick}
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        <span>{lang} </span>
                                        <Image
                                            style={{display: 'inline-block', marginRight: '5px'}}
                                            width={20}
                                            height={20}
                                            src={asset('icons/iconmonstr-globe-6.svg')}
                                            alt="time-icon"
                                        />
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
                                        <MenuItem id="english2" onClick={() => handleClose('En')}>
                                            En
                                        </MenuItem>
                                        <MenuItem id="tamil2" onClick={() => handleClose('தா')}>
                                            தா
                                        </MenuItem>
                                        <MenuItem id="telgu2" onClick={() => handleClose('తెలుగు')}>
                                            తెలుగు
                                        </MenuItem>
                                    </Menu>
                                </div>
                            </div>
                        </div>
                        <div className="container pb-5">
                            <div className="main-row mx-auto pt-7">
                                {isUpiCollect && (
                                    <Box
                                        sx={{
                                            px: 5,
                                            display: 'flex',
                                            flexDirection: 'row',
                                            flexWrap: 'nowrap',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <h2 className="text-center">
                                            <span className="f-16">{$t('Amount')} </span>
                                            <span className="font-bold f-24">
                                                {PriceFormatter(transaction?.amount)} ₹
                                            </span>
                                        </h2>
                                        {transaction.upi_id && (
                                            <div className="f-16">
                                                {$t('Timer')}{' '}
                                                {`${Math.floor(remainingTime / 60)}:${(
                                                    remainingTime % 60
                                                )
                                                    .toString()
                                                    .padStart(2, '0')}`}
                                            </div>
                                        )}
                                    </Box>
                                )}
                                {!isUpiCollect && transaction?.upiqr_Link && (
                                    <Box
                                        sx={{
                                            color: '#FFF',
                                            backgroundImage: `url(${asset('img/price-bg.svg')})`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundSize: 'contain',
                                            padding: '24px 20px',
                                            margin: '0 auto',
                                            width: '346px',
                                            height: '202px',
                                            mb: 5,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                flexWrap: 'nowrap',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <h2 className="text-center">
                                                <span className="f-16">{$t('Amount')} </span>
                                                <span className="font-bold f-24">
                                                    {PriceFormatter(transaction?.amount)} ₹
                                                </span>
                                            </h2>
                                            <div className="f-16">
                                                {$t('Timer')}{' '}
                                                {`${Math.floor(remainingTime / 60)}:${(
                                                    remainingTime % 60
                                                )
                                                    .toString()
                                                    .padStart(2, '0')}`}
                                            </div>
                                        </Box>
                                        <Box className="payment-method my-4">
                                            {!isUpiCollect &&
                                                !(
                                                    !transaction.qr_Link && mobileAndTabletCheck()
                                                ) && (
                                                    <PaymentMethodsImages
                                                        transaction={transaction}
                                                    />
                                                )}
                                        </Box>
                                        {((!transaction.qr_Link && !transaction?.isQRIntent) ||
                                            transaction?.isQRIntent) &&
                                            !isUpiCollect && (
                                                <Box className="f-20 text-center font-bold copy-upi d-flex justify-content-center my-4 gap-2">
                                                    <CopyAll
                                                        sx={{mr: 2}}
                                                        onClick={() =>
                                                            copyToClipboard(bankAccountId ?? '')
                                                        }
                                                    />

                                                    <Box
                                                        style={{
                                                            display: 'inline-block',
                                                            wordBreak: 'break-word',
                                                            fontSize: 'medium',
                                                            fontWeight: 'bolder',
                                                        }}
                                                        className="f-16"
                                                        id="opportunity_bank"
                                                    >
                                                        {bankAccountId}
                                                    </Box>
                                                    {/*<p className="f-16">Ref. #{transaction?._id}</p>*/}
                                                </Box>
                                            )}
                                    </Box>
                                )}
                                {!isUpiCollect && bankType !== BankTypesEnum.theUnionPay && (
                                    <div className="qrcode-container">
                                        <div className="text-left">
                                            <AmountAndTimer
                                                bankType={bankType}
                                                transaction={transaction}
                                                remainingTime={remainingTime}
                                                key={transaction._id}
                                                $translate={$t}
                                            />
                                            {(((transaction?.qr_Link ||
                                                bankType === BankTypesEnum.autoPayIn) &&
                                                mobileAndTabletCheck()) ||
                                                transaction?.isQRIntent) && (
                                                <>
                                                    <div>
                                                        <Typography sx={{mb: 2}}>
                                                            Open with
                                                        </Typography>
                                                        {paymentMethodsImages1.map(
                                                            (p, i) =>
                                                                ((bankType ===
                                                                    BankTypesEnum.autoPayIn &&
                                                                    p.showInAutoPayin) ||
                                                                    bankType !==
                                                                        BankTypesEnum.autoPayIn) && (
                                                                    <BankButton
                                                                        key={i}
                                                                        text={p.text}
                                                                        img={p.image}
                                                                        link={linkPrefix(
                                                                            p.name,
                                                                            transaction?.qr_Link ||
                                                                                qrCodeUrl ||
                                                                                '',
                                                                        )}
                                                                    />
                                                                ),
                                                        )}
                                                    </div>
                                                    {/* {(bankType !== BankTypesEnum.tappay && <> */}
                                                    <div style={{marginBottom: '10px'}}>
                                                        <Typography sx={{mb: 2}}>
                                                            Other UPI Apps
                                                        </Typography>
                                                        {paymentMethodsImages.map(
                                                            (p, i) =>
                                                                ((bankType ===
                                                                    BankTypesEnum.autoPayIn &&
                                                                    p.showInAutoPayin) ||
                                                                    bankType !==
                                                                        BankTypesEnum.autoPayIn) && (
                                                                    <BankButton
                                                                        key={i}
                                                                        text={p.text}
                                                                        img={p.image}
                                                                        link={linkPrefix(
                                                                            p.name,
                                                                            transaction?.qr_Link ||
                                                                                qrCodeUrl ||
                                                                                '',
                                                                        )}
                                                                    />
                                                                ),
                                                        )}
                                                    </div>
                                                    {/* </>)} */}
                                                </>
                                            )}
                                        </div>

                                        {!(
                                            transaction?.qr_Link ||
                                            bankType === BankTypesEnum.autoPayIn ||
                                            bankType === BankTypesEnum.default
                                        ) &&
                                            mobileAndTabletCheck() && (
                                                <>
                                                    <Box
                                                        sx={{
                                                            textAlign: 'center',
                                                            mt: 3,
                                                            mx: 'auto',
                                                            display: 'grid',
                                                            gridTemplateColumns: '1fr 1fr',
                                                            maxWidth: '350px',
                                                        }}
                                                    >
                                                        {paymentMethodsLogoOnly.map(
                                                            (p, i) =>
                                                                (p.text === 'Other' ||
                                                                p.text === 'PhonePE'
                                                                    ? !hidePhonePeAndOtherBtn
                                                                    : true) && (
                                                                    <BankButton
                                                                        key={i}
                                                                        text={p.text}
                                                                        img={p.image}
                                                                        imgSize={30}
                                                                        link={linkPrefix(
                                                                            p.name,
                                                                            transaction?.qr_Link ||
                                                                                qrCodeUrl ||
                                                                                '',
                                                                        )}
                                                                    />
                                                                ),
                                                        )}
                                                    </Box>
                                                    <Typography variant="h5" sx={{mt: 2}}>
                                                        <b>OR</b>
                                                    </Typography>
                                                </>
                                            )}
                                        {
                                            //Bank QRCode ONLY
                                            transaction?.upiqr_Link && (
                                                <>
                                                    <p
                                                        className="translateText f-20"
                                                        style={{marginTop: '25px'}}
                                                    >
                                                        {$t('Scan QR Code To Pay')}
                                                    </p>
                                                    <div className="qrcode">
                                                        {transaction?.qr_Link || qrCodeUrl ? (
                                                            <Box
                                                                sx={{
                                                                    pt: 2,
                                                                    mx: 'auto',
                                                                    display: 'inline-block',
                                                                }}
                                                            >
                                                                <QRCode
                                                                    size={200}
                                                                    value={
                                                                        bankType ===
                                                                        BankTypesEnum.default
                                                                            ? `${
                                                                                  (
                                                                                      transaction?.qr_Link ||
                                                                                      qrCode ||
                                                                                      ''
                                                                                  )?.replace(
                                                                                      /&mc=\d+&/g,
                                                                                      '&',
                                                                                  ) /* remove mc from the link */
                                                                              }`
                                                                            : bankType ===
                                                                              BankTypesEnum.autoPayIn
                                                                            ? `${
                                                                                  transaction?.qr_Link
                                                                                      ? qrCodeAddExtension(
                                                                                            transaction?.qr_Link,
                                                                                        )
                                                                                      : qrCodeUrl
                                                                              }`
                                                                            : `${
                                                                                  transaction?.qr_Link ||
                                                                                  qrCodeUrl
                                                                              }`
                                                                    }
                                                                />
                                                            </Box>
                                                        ) : (
                                                            $t('Image Is Missing')
                                                        )}
                                                    </div>
                                                    <div className="dont-use-text mt-1">
                                                        <span className="translateText f-10">
                                                            {$t(
                                                                "Don't use the same QR code to pay multiple times",
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        {
                                                            //is bank QR
                                                            transaction?.upiqr_Link &&
                                                                !(
                                                                    transaction?.qr_Link ||
                                                                    transaction?.isQRIntent ||
                                                                    bankType ===
                                                                        BankTypesEnum.autoPayIn
                                                                ) && (
                                                                    //  || transaction?.isQRIntent //DUE TO QR CRASH NOT SHOWING QR IN INTENT/GATEWAY
                                                                    <div className="utr-input">
                                                                        <div
                                                                            id="handler"
                                                                            className="padd-tp Confirm"
                                                                        >
                                                                            <div className="inputUTR">
                                                                                <span id="error"></span>
                                                                                <input
                                                                                    id="utr"
                                                                                    name={
                                                                                        isUpiCollect
                                                                                            ? 'upi_id'
                                                                                            : 'utr'
                                                                                    }
                                                                                    type={
                                                                                        isUpiCollect
                                                                                            ? 'text'
                                                                                            : 'number'
                                                                                    }
                                                                                    style={{
                                                                                        width: '100%',
                                                                                        margin: '15px 0',
                                                                                    }}
                                                                                    placeholder={
                                                                                        isUpiCollect
                                                                                            ? 'Enter Your UPI ID'
                                                                                            : $t(
                                                                                                  'Enter 12 Digit UTR Number',
                                                                                              )
                                                                                    }
                                                                                    pattern={
                                                                                        isUpiCollect
                                                                                            ? '[A-Za-z0-9]+@[A-Za-z0-9]+'
                                                                                            : '/^-?d+.?d*$/'
                                                                                    }
                                                                                />
                                                                                <input
                                                                                    type="hidden"
                                                                                    name="id"
                                                                                    id="id"
                                                                                    value={
                                                                                        transaction?._id
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {!isUpiCollect && (
                                                                            <div className="inline-block mx-auto text-left pl-1">
                                                                                <p className="translateText text-left m-0 pt-1 f-10">
                                                                                    {$t(
                                                                                        'Please Check your payment application for UTR number',
                                                                                    )}
                                                                                </p>
                                                                                <div className="m-0 pt-1 text-left f-10">
                                                                                    <span className="translateText">
                                                                                        {$t(
                                                                                            'How to find the UTR number ?',
                                                                                        )}
                                                                                    </span>
                                                                                    <a
                                                                                        className=""
                                                                                        data-toggle="modal"
                                                                                        data-target="#exampleModalLong"
                                                                                        onClick={
                                                                                            handleOpen
                                                                                        }
                                                                                        style={{
                                                                                            color: 'var(--text-color)',
                                                                                        }}
                                                                                    >
                                                                                        <u className="translateText">
                                                                                            {$t(
                                                                                                'Click Here',
                                                                                            )}
                                                                                        </u>
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        <div>
                                                                            <LoadingButton
                                                                                type="submit"
                                                                                variant="contained"
                                                                                color="inherit"
                                                                                loading={loading}
                                                                                sx={{
                                                                                    my: 2,
                                                                                    background:
                                                                                        '#376BF5',
                                                                                    color: 'white',
                                                                                    width: '200px',
                                                                                }}
                                                                            >
                                                                                {$t('Submit')}
                                                                            </LoadingButton>
                                                                        </div>
                                                                    </div>
                                                                )
                                                        }
                                                    </div>
                                                </>
                                            )
                                        }

                                        {FxmbId === transaction.relatedTo &&
                                            bankType !== BankTypesEnum.default &&
                                            mobileAndTabletCheck() && (
                                                <>
                                                    <Typography variant="h5" sx={{mt: 2}}>
                                                        <b>OR</b>
                                                    </Typography>
                                                    <p
                                                        className="translateText f-20"
                                                        style={{marginTop: '25px'}}
                                                    >
                                                        {$t('Scan QR Code To Pay')}
                                                    </p>
                                                    <div className="qrcode">
                                                        {!!transaction?.qr_Link || !!qrCodeUrl ? (
                                                            <Box
                                                                sx={{
                                                                    pt: 2,
                                                                    mx: 'auto',
                                                                    display: 'inline-block',
                                                                }}
                                                            >
                                                                <QRCode
                                                                    size={200}
                                                                    value={`${
                                                                        (
                                                                            transaction?.qr_Link ||
                                                                            qrCodeUrl
                                                                        )?.replace(
                                                                            /&mc=\d+&/g,
                                                                            '&',
                                                                        ) /* remove mc from the link */
                                                                    }`}
                                                                />
                                                            </Box>
                                                        ) : (
                                                            $t('Image Is Missing')
                                                        )}
                                                    </div>
                                                    <div className="dont-use-text mt-1">
                                                        <span className="translateText f-10">
                                                            {$t(
                                                                "Don't use the same QR code to pay multiple times",
                                                            )}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                    </div>
                                )}
                                {/* The Unionpay Gateway code start here */}
                                {!isUpiCollect && bankType === BankTypesEnum.theUnionPay && (
                                    <div className="qrcode-container">
                                        <div className="text-center">
                                            {transaction?.qr_Link && (
                                                <>
                                                    <AmountAndTimer
                                                        bankType={bankType}
                                                        transaction={transaction}
                                                        remainingTime={remainingTime}
                                                        key={transaction._id}
                                                        $translate={$t}
                                                    />
                                                    <p
                                                        className="translateText f-20"
                                                        style={{marginTop: '25px'}}
                                                    >
                                                        {$t('Scan QR Code To Pay')}
                                                    </p>
                                                    <div className="qrcode">
                                                        <Box
                                                            sx={{
                                                                pt: 2,
                                                                mx: 'auto',
                                                                display: 'inline-block',
                                                            }}
                                                        >
                                                            <img
                                                                src={transaction.qr_Link}
                                                                alt="QR Code"
                                                                style={{
                                                                    width: '200px',
                                                                    height: '200px',
                                                                }} // Adjust dimensions as needed
                                                            />
                                                        </Box>
                                                        {transaction.upi_id && (
                                                            <Typography>
                                                                <Typography
                                                                    component="span"
                                                                    sx={{ml: 1}}
                                                                >
                                                                    UPI ID:{' '}
                                                                </Typography>
                                                                <Typography
                                                                    component="span"
                                                                    sx={{ml: 1}}
                                                                >
                                                                    {transaction.upi_id}
                                                                </Typography>
                                                            </Typography>
                                                        )}
                                                    </div>
                                                    <div className="utr-input">
                                                        <div
                                                            id="handler"
                                                            className="padd-tp Confirm"
                                                        >
                                                            <div className="inputUTR">
                                                                <span id="error"></span>
                                                                <input
                                                                    id="utr"
                                                                    name={
                                                                        isUpiCollect
                                                                            ? 'upi_id'
                                                                            : 'utr'
                                                                    }
                                                                    type={
                                                                        isUpiCollect
                                                                            ? 'text'
                                                                            : 'number'
                                                                    }
                                                                    style={{
                                                                        width: '100%',
                                                                        margin: '15px 0',
                                                                    }}
                                                                    placeholder={
                                                                        isUpiCollect
                                                                            ? 'Enter Your UPI ID'
                                                                            : $t(
                                                                                  'Enter 12 Digit UTR Number',
                                                                              )
                                                                    }
                                                                    pattern={
                                                                        isUpiCollect
                                                                            ? '[A-Za-z0-9]+@[A-Za-z0-9]+'
                                                                            : '/^-?d+.?d*$/'
                                                                    }
                                                                />
                                                                <input
                                                                    type="hidden"
                                                                    name="id"
                                                                    id="id"
                                                                    value={transaction?._id}
                                                                />
                                                            </div>
                                                        </div>
                                                        {!isUpiCollect && (
                                                            <div className="inline-block mx-auto text-left pl-1">
                                                                <p className="translateText text-left m-0 pt-1 f-10">
                                                                    {$t(
                                                                        'Please Check your payment application for UTR number',
                                                                    )}
                                                                </p>
                                                                <div className="m-0 pt-1 text-left f-10">
                                                                    <span className="translateText">
                                                                        {$t(
                                                                            'How to find the UTR number ?',
                                                                        )}{' '}
                                                                    </span>
                                                                    <a
                                                                        className=""
                                                                        data-toggle="modal"
                                                                        data-target="#exampleModalLong"
                                                                        onClick={handleOpen}
                                                                        style={{
                                                                            color: 'var(--text-color)',
                                                                        }}
                                                                    >
                                                                        <u className="translateText">
                                                                            {$t('Click Here')}
                                                                        </u>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <LoadingButton
                                                                type="submit"
                                                                variant="contained"
                                                                color="inherit"
                                                                loading={loading}
                                                                sx={{
                                                                    my: 2,
                                                                    background: '#376BF5',
                                                                    color: 'white',
                                                                    width: '200px',
                                                                }}
                                                            >
                                                                {$t('Submit')}
                                                            </LoadingButton>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div
                                            className="payment-process mx-auto mt-4 text-white text-left"
                                            style={{
                                                maxWidth: '346px',
                                                background: '#376BF5',
                                                borderRadius: '20px',
                                                padding: '17px 20px',
                                            }}
                                        >
                                            <div>
                                                <h3 className="translateText f-16 font-weight-bold">
                                                    {$t('Payment Process:')}
                                                </h3>
                                            </div>
                                            <div className="mt-2">
                                                <span className="img">
                                                    <Image
                                                        width={30}
                                                        height={30}
                                                        alt="qr-scan"
                                                        src={asset(
                                                            'icons/iconmonstr-qr-code-9.svg',
                                                        )}
                                                        style={{
                                                            verticalAlign: 'bottom',
                                                        }}
                                                    />
                                                </span>
                                                <span className="f-14 translateText">
                                                    {isMobile
                                                        ? 'Click on the available application and complete the payment process'
                                                        : $t('Scan QR Code To Pay')}
                                                </span>
                                            </div>
                                            {!isMobile && (
                                                <>
                                                    <div className="mt-2">
                                                        <div className="img">
                                                            <Image
                                                                width={30}
                                                                height={30}
                                                                alt="card-icon"
                                                                src={asset(
                                                                    'icons/money-check-dollar-solid.svg',
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="f-14">
                                                            <span className="translateText">
                                                                {$t(
                                                                    'After paying from your payment apps: PayTM,PhonePE, GooglePay,BHIM,etc.',
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2">
                                                        <div className="img">
                                                            <Image
                                                                width={21}
                                                                height={28}
                                                                alt="card-icon"
                                                                src={asset(
                                                                    'icons/receipt-solid.svg',
                                                                )}
                                                                style={{
                                                                    verticalAlign: 'bottom',
                                                                    margin: '0 auto',
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="f-14 translateText">
                                                            {$t('Then Submit the UTR code')}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div>
                                    {!transaction.upi_id &&
                                        !(
                                            transaction?.qr_Link ||
                                            bankType === BankTypesEnum.autoPayIn
                                        ) && (
                                            <div className="utr-input">
                                                <div id="handler" className="padd-tp Confirm">
                                                    <div className="inputUTR">
                                                        <span id="error"></span>
                                                        <input
                                                            id="utr"
                                                            name={isUpiCollect ? 'upi_id' : 'utr'}
                                                            type={isUpiCollect ? 'text' : 'number'}
                                                            style={{
                                                                width: '100%',
                                                                margin: '15px 0',
                                                            }}
                                                            placeholder={
                                                                isUpiCollect
                                                                    ? 'Enter Your UPI ID'
                                                                    : $t(
                                                                          'Enter 12 Digit UTR Number',
                                                                      )
                                                            }
                                                            pattern={
                                                                isUpiCollect
                                                                    ? '[A-Za-z0-9]+@[A-Za-z0-9]+'
                                                                    : '/^-?d+.?d*$/'
                                                            }
                                                        />
                                                        <input
                                                            type="hidden"
                                                            name="id"
                                                            id="id"
                                                            value={transaction?._id}
                                                        />
                                                    </div>
                                                </div>
                                                {!isUpiCollect && (
                                                    <div className="inline-block mx-auto text-left pl-1">
                                                        <p className="translateText text-left m-0 pt-1 f-10">
                                                            {$t(
                                                                'Please Check your payment application for UTR number',
                                                            )}
                                                        </p>
                                                        <div className="m-0 pt-1 text-left f-10">
                                                            <span className="translateText">
                                                                {$t('How to find the UTR number ?')}{' '}
                                                            </span>
                                                            <a
                                                                className=""
                                                                data-toggle="modal"
                                                                data-target="#exampleModalLong"
                                                                onClick={handleOpen}
                                                                style={{color: 'var(--text-color)'}}
                                                            >
                                                                <u className="translateText">
                                                                    {$t('Click Here')}
                                                                </u>
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                                <div>
                                                    <LoadingButton
                                                        type="submit"
                                                        variant="contained"
                                                        color="inherit"
                                                        loading={loading}
                                                        sx={{
                                                            my: 2,
                                                            background: '#376BF5',
                                                            color: 'white',
                                                            width: '200px',
                                                        }}
                                                    >
                                                        {$t('Submit')}
                                                    </LoadingButton>
                                                </div>
                                            </div>
                                        )}

                                    {isUpiCollect && transaction.upi_id && (
                                        <Box sx={{px: 4}}>
                                            <Box sx={{py: 4}}>
                                                <Box sx={{mx: 'auto', maxWidth: 100}}>
                                                    <Image
                                                        width={100}
                                                        height={100}
                                                        src={asset('icons/confirmation.png')}
                                                        alt="confirm icon"
                                                    />
                                                </Box>
                                            </Box>
                                            <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                                                Complete Your Payment
                                            </Typography>

                                            {transaction.upi_id && (
                                                <Typography>
                                                    Entered UPI Address: {transaction.upi_id}
                                                </Typography>
                                            )}
                                            <Timeline
                                                sx={{
                                                    [`& .${timelineItemClasses.root}:before`]: {
                                                        flex: 0,
                                                        padding: 0,
                                                    },
                                                    mt: 3,
                                                }}
                                            >
                                                <TimelineItem>
                                                    <TimelineSeparator>
                                                        <TimelineDot />
                                                        <TimelineConnector />
                                                    </TimelineSeparator>
                                                    <TimelineContent>
                                                        <Typography>
                                                            Go to your entered UPI ID mobile app
                                                        </Typography>
                                                    </TimelineContent>
                                                </TimelineItem>
                                                <TimelineItem>
                                                    <TimelineSeparator>
                                                        <TimelineDot />
                                                    </TimelineSeparator>
                                                    <TimelineContent>
                                                        <Typography>
                                                            Check pending requests and approve
                                                            payment by entering UPI PIN
                                                        </Typography>
                                                    </TimelineContent>
                                                </TimelineItem>
                                            </Timeline>
                                        </Box>
                                    )}
                                    {!isUpiCollect &&
                                        bankType !== BankTypesEnum.theUnionPay &&
                                        !transaction?.isQRIntent && (
                                            <div
                                                className="payment-process mx-auto mt-4 text-white"
                                                style={{
                                                    maxWidth: '346px',
                                                    background: '#376BF5',
                                                    borderRadius: '20px',
                                                    padding: '17px 20px',
                                                }}
                                            >
                                                <div>
                                                    <h3 className="translateText f-16 font-weight-bold">
                                                        {$t('Payment Process:')}
                                                    </h3>
                                                </div>
                                                <div className="mt-2">
                                                    <span className="img">
                                                        <Image
                                                            width={30}
                                                            height={30}
                                                            alt="qr-scan"
                                                            src={asset(
                                                                'icons/iconmonstr-qr-code-9.svg',
                                                            )}
                                                            style={{verticalAlign: 'bottom'}}
                                                        />
                                                    </span>
                                                    <span className="f-14 translateText">
                                                        {isMobile &&
                                                        bankType === BankTypesEnum.autoPayIn
                                                            ? 'Click on the available application and complete the payment process'
                                                            : $t('Scan QR Code or copy UPI Id')}
                                                    </span>
                                                </div>
                                                {!(
                                                    isMobile && bankType === BankTypesEnum.autoPayIn
                                                ) && (
                                                    <>
                                                        <div className="mt-2">
                                                            <div className="img">
                                                                <Image
                                                                    width={30}
                                                                    height={30}
                                                                    alt="card-icon"
                                                                    src={asset(
                                                                        'icons/money-check-dollar-solid.svg',
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className="f-14">
                                                                <span className="translateText">
                                                                    {$t(
                                                                        'After paying from your payment apps: PayTM,PhonePE, GooglePay,BHIM,etc.',
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2">
                                                            <div className="img">
                                                                <Image
                                                                    width={21}
                                                                    height={28}
                                                                    alt="card-icon"
                                                                    src={asset(
                                                                        'icons/receipt-solid.svg',
                                                                    )}
                                                                    style={{
                                                                        verticalAlign: 'bottom',
                                                                        margin: '0 auto',
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="f-14 translateText">
                                                                {$t('Submit the correct UTR code')}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    {!isUpiCollect && !transaction?.isQRIntent && (
                                        <div className="secure-list mt-6 text-center">
                                            <div className="flex">
                                                <SecurePaymentImages />
                                            </div>
                                            <h6 className="translateText f-14 mt-2">
                                                {$t('100% Secure Payments')}
                                            </h6>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {!transaction.upi_id &&
                                        !(
                                            transaction?.qr_Link ||
                                            bankType === BankTypesEnum.autoPayIn
                                        ) && (
                                            <div className="utr-input">
                                                <div id="handler" className="padd-tp Confirm">
                                                    <div className="inputUTR">
                                                        <span id="error"></span>
                                                        <input
                                                            id="utr"
                                                            name={isUpiCollect ? 'upi_id' : 'utr'}
                                                            type={isUpiCollect ? 'text' : 'number'}
                                                            style={{
                                                                width: '100%',
                                                                margin: '15px 0',
                                                            }}
                                                            placeholder={
                                                                isUpiCollect
                                                                    ? 'Enter Your UPI ID'
                                                                    : $t(
                                                                          'Enter 12 Digit UTR Number',
                                                                      )
                                                            }
                                                            pattern={
                                                                isUpiCollect
                                                                    ? '[A-Za-z0-9]+@[A-Za-z0-9]+'
                                                                    : '/^-?d+.?d*$/'
                                                            }
                                                        />
                                                        <input
                                                            type="hidden"
                                                            name="id"
                                                            id="id"
                                                            value={transaction?._id}
                                                        />
                                                    </div>
                                                </div>
                                                {!isUpiCollect && (
                                                    <div className="inline-block mx-auto text-left pl-1">
                                                        <p className="translateText text-left m-0 pt-1 f-10">
                                                            {$t(
                                                                'Please Check your payment application for UTR number',
                                                            )}
                                                        </p>
                                                        <div className="m-0 pt-1 text-left f-10">
                                                            <span className="translateText">
                                                                {$t('How to find the UTR number ?')}{' '}
                                                            </span>
                                                            <a
                                                                className=""
                                                                data-toggle="modal"
                                                                data-target="#exampleModalLong"
                                                                onClick={handleOpen}
                                                                style={{color: 'var(--text-color)'}}
                                                            >
                                                                <u className="translateText">
                                                                    {$t('Click Here')}
                                                                </u>
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                                <div>
                                                    <LoadingButton
                                                        type="submit"
                                                        variant="contained"
                                                        color="inherit"
                                                        loading={loading}
                                                        sx={{
                                                            my: 2,
                                                            background: '#376BF5',
                                                            color: 'white',
                                                            width: '200px',
                                                        }}
                                                    >
                                                        {$t('Submit')}
                                                    </LoadingButton>
                                                </div>
                                            </div>
                                        )}
                                    {isUpiCollect && transaction.upi_id && (
                                        <Box sx={{px: 4}}>
                                            <Box sx={{py: 4}}>
                                                <Box sx={{mx: 'auto', maxWidth: 100}}>
                                                    <Image
                                                        width={100}
                                                        height={100}
                                                        src={asset('icons/confirmation.png')}
                                                        alt="confirm icon"
                                                    />
                                                </Box>
                                            </Box>
                                            <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                                                Complete Your Payment
                                            </Typography>

                                            {transaction.upi_id && (
                                                <Typography>
                                                    Entered UPI Address: {transaction.upi_id}
                                                </Typography>
                                            )}
                                            <Timeline
                                                sx={{
                                                    [`& .${timelineItemClasses.root}:before`]: {
                                                        flex: 0,
                                                        padding: 0,
                                                    },
                                                    mt: 3,
                                                }}
                                            >
                                                <TimelineItem>
                                                    <TimelineSeparator>
                                                        <TimelineDot />
                                                        <TimelineConnector />
                                                    </TimelineSeparator>
                                                    <TimelineContent>
                                                        <Typography>
                                                            Go to your entered UPI ID mobile app
                                                        </Typography>
                                                    </TimelineContent>
                                                </TimelineItem>
                                                <TimelineItem>
                                                    <TimelineSeparator>
                                                        <TimelineDot />
                                                    </TimelineSeparator>
                                                    <TimelineContent>
                                                        <Typography>
                                                            Check pending requests and approve
                                                            payment by entering UPI PIN
                                                        </Typography>
                                                    </TimelineContent>
                                                </TimelineItem>
                                            </Timeline>
                                        </Box>
                                    )}
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
                </Box>
            )}
        </>
    );
};
