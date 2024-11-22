import {asset} from '@/utils/functions/global';
import Image from 'next/image';
import * as React from 'react';

const securePayment: {imgUrl: string, link: string}[] = [{
    imgUrl: asset('img/secure-payment/norton.png'), link: '',
}, {
    imgUrl: asset('img/secure-payment/pci64.png'), link: '',
}];
const isOldStyle = process.env.NEXT_PUBLIC_STYLE === '1';

export const SecurePaymentImages = () => <>
    {securePayment.map((p, i) =>
        <div key={i}
             style={isOldStyle ? {
                     width: '100%',
                     height: '50px',
                     position: 'relative',
                 } :
                 {
                     width: '100%',
                     maxWidth: '255px',
                     height: '50px',
                     position: 'relative',
                 }}>
            <Image layout="fill" objectFit="contain" src={p.imgUrl}
                   alt="secure-payment" />
        </div>)}
</>;