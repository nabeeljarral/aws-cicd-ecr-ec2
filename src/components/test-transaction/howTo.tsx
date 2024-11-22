import {List} from '@mui/material';
import Box from '@mui/material/Box';
import Image from 'next/image';
import * as React from 'react';
import {CollapsedItem} from '@/components/test-transaction/collapsedItem';
import {asset} from '@/utils/functions/global';

export const HowTo = () => {
    return (<List
        sx={{width: '100%', maxWidth: 450, bgcolor: 'background.paper'}}
        component="nav"
        aria-labelledby="How to find the UTR number"
    >
        <Box sx={{mb: 3}} component="div" id="nested-list-subheader">
            How to find the UTR number
        </Box>
        <CollapsedItem title={'Google Pay/ Phone pe/ Paytm'} child={<div className="accordion-body">
            <p className="text-dark">
                Upon successful transfer, the UPI apps will generate a transaction ID, UPI
                ID or
                UTR
                (See Fig.6) of your transfer.
            </p>
            <Box style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',

            }}>
                {[asset('img/how-to/google-pay-phone-pe-paytm-1.jpeg'), asset('img/how-to/google-pay-phone-pe-paytm-2.png'), asset('img/how-to/google-pay-phone-pe-paytm-3.jpg')].map((el, i) =>
                    <div style={{width: '100%', height: '300px', position: 'relative'}}>
                        <Image layout="fill" objectFit="contain"
                               key={i} src={el} alt="How To" />
                    </div>)}
            </Box>
        </div>} />
        <CollapsedItem title={'NIYOO BANK'} child={<div className="accordion-body">
            <p className="text-dark">
                Once made a transfer with NIYOO Bank, please check your email received from
                the
                bank
                and find your UTR shown in the screenshot-
            </p>
            <div style={{width: '100%', height: '340px', position: 'relative'}}>
                <Image layout="fill" objectFit="contain"
                       src={asset('img/how-to/NIYOO BANK.png')} alt="How To" />
            </div>
        </div>} />
        <CollapsedItem title={'HDFC BANK'} child={<div className="accordion-body">
            <p className="text-dark">
                Upon successful HDFC transfer, the bank will provide a Transaction ID,
                consider
                the
                same as the UTR number.
            </p>
            <div style={{width: '100%', height: '340px', position: 'relative'}}>
                <Image layout="fill" objectFit="contain"
                       src={asset('img/how-to/HDFC BANK.jpg')} alt="How To" />
            </div>
        </div>} />
        <CollapsedItem title={'ICICI BANK'} child={<div className="accordion-body">
            <p className="text-dark">
                Please check your ICICI Bank email for your UTR (shown in the screenshot)
                after
                you've made a transfer..
            </p>
            <div style={{width: '100%', height: '150px', position: 'relative'}}>
                <Image layout="fill" objectFit="contain"
                       src={asset('img/how-to/ICICI BANK.png')} alt="How To" />
            </div>
        </div>} />
        <CollapsedItem title={'Punjab National Bank/ PNB'} child={<div className="accordion-body">
            <p className="text-dark">
                Once made a transfer with PNB, the bank will provide an External Reference
                Number
                ID, consider the same as the UTR number(shown in the screenshot).
            </p>
            <div style={{width: '100%', height: '300px', position: 'relative'}}>
                <Image layout="fill" objectFit="contain"
                       src={asset('img/how-to/Punjab National Bank PNB.jpg')}
                       alt="How To" />
            </div>
        </div>} />
        <CollapsedItem title={'FI Bank'} child={<div className="accordion-body">
            <p className="text-dark">
                Making a transfer with FI Bank, the IMPS transaction ID is considered as UTR
                no.
                (shown in the screenshot).
            </p>

            <div style={{width: '100%', height: '300px', position: 'relative'}}>
                <Image layout="fill" objectFit="contain"
                       src={asset('img/how-to/FI Bank.jpeg')} alt="How To" />
            </div>
        </div>} />
        <CollapsedItem title={'Canara Bank'} child={<div className="accordion-body">
            <p className="text-dark">
                Below is the screenshot of the bank debit statement after a successful
                transfer.
            </p>
            <div style={{width: '100%', height: '50px', position: 'relative'}}>
                <Image layout="fill" objectFit="contain"
                       src={asset('img/how-to/Canara Bank.png')} alt="How To" />
            </div>
        </div>} />
        <CollapsedItem title={'Central Bank of India'} child={<div className="accordion-body">
            <p className="text-dark">
                Below is the screenshot of the bank debit statement after a successful
                transfer, to help you find the correct UTR number.
            </p>
            <div style={{width: '100%', height: '100px', position: 'relative'}}>
                <Image layout="fill" objectFit="contain"
                       src={asset('img/how-to/Central Bank of India.png')}
                       alt="How To" />
            </div>
        </div>} />
        <CollapsedItem title={'Saraswat Bank'} child={<div className="accordion-body text-dark">
            <p>
                Once made a transfer with Saraswat Bank, you will receive a text message
                from the bank and find that you will be able to find the UTR shown in the
                screenshot-
            </p>
            <div style={{width: '100%', height: '100px', position: 'relative'}}>
                <Image layout="fill" objectFit="contain"
                       src={asset('img/how-to/Saraswat Bank.jpeg')} alt="How To" />
            </div>
            <div>
                <b>State Bank Of India (SBI)</b>
                <p className="text-dark">
                    Once transferring with Saraswat Bank, you will receive a text message
                    from the bank and find that you will be able to find the UTR shown in
                    the screenshot-
                </p>
                <div style={{width: '100%', height: '150px', position: 'relative'}}>
                    <Image layout="fill" objectFit="contain"
                           src={asset('img/how-to/State Bank Of India.jpeg')}
                           alt="How To" />
                </div>
            </div>
            <div>
                <b>Union Bank Of India</b>
                <p>
                    Below is the screenshot of the bank debit statement after a successful
                    transfer from Union Bank, to help you find the correct UTR number.
                </p>
                <div style={{width: '100%', height: '100px', position: 'relative'}}>
                    <Image layout="fill" objectFit="contain"
                           src={asset('img/how-to/Union Bank Of India.png')}
                           alt="How To" />
                </div>
            </div>
        </div>} />
        <CollapsedItem title={'KOTAK BANK'} child={<div className="accordion-body">
            <p className="text-dark">
                Once made a transfer with Kotak Bank, please check your email or the text
                message you received from the bank.
            </p>
            <div style={{width: '100%', height: '300px', position: 'relative'}}>
                <Image layout="fill" objectFit="contain"
                       src={asset('img/how-to/KOTAK BANK.jpeg')} alt="How To" />
            </div>
        </div>} />
        <CollapsedItem title={'HSBC BANK'} child={<div className="accordion-body">
            <p className="text-dark">
                Making a transfer with HSBC Bank, the number written after 'HSBCN' is
                considered as the UTR no. (shown in the screenshot).
            </p>
            <div style={{width: '100%', height: '300px', position: 'relative'}}>
                <Image layout="fill" objectFit="contain"
                       src={asset('img/how-to/HSBC BANK.png')} alt="How To" />
            </div>
        </div>} />
    </List>);
};
