import {BankTypesEnum} from '@/utils/enums/bankTypes.enum';
import {PriceFormatter} from '@/utils/functions/global';
import {Box} from '@mui/material';
import {FunctionComponent} from 'react';

interface Transaction {
    amount: number;
    qr_Link?: string;
    // Add other properties of the transaction if needed
}

interface AmountAndTimerProps {
    transaction: Transaction;
    bankType: BankTypesEnum;
    remainingTime: number;
    $translate: (key: string) => string; // Assuming $translate is a translation function
}

const AmountAndTimer: FunctionComponent<AmountAndTimerProps> = ({
    transaction,
    bankType,
    remainingTime,
    $translate,
}) => {
    if (!transaction?.qr_Link && bankType !== BankTypesEnum.autoPayIn) {
        return null; // Return null to avoid rendering anything
    }

    const formattedTime = `${Math.floor(remainingTime / 60)}:${(remainingTime % 60)
        .toString()
        .padStart(2, '0')}`;

    return (
        <>
            <hr
                style={{
                    borderTop: '1px solid #ccc',
                    marginBottom: '20px',
                }}
            />
            <Box
                sx={{
                    mb: 4,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <h2 className="text-center">
                    <span className="f-16">{$translate('Amount')}</span>
                    <span className="font-bold f-24"> {PriceFormatter(transaction.amount)} ₹</span>
                </h2>
                <div className="f-16">
                    <span>{$translate('Timer')} </span>
                    <span>{formattedTime}</span>
                </div>
            </Box>
        </>
    );
};

export default AmountAndTimer;
