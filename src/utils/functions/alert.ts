import {toast} from 'react-toastify';
import {AlertTypeEnum} from '@/utils/enums/alertType';

interface IAlert {
    msg: React.ReactNode;
    type?: AlertTypeEnum;
}

const awesomeAlert = ({msg = '', type = AlertTypeEnum.success}: IAlert) => {
    if (type === AlertTypeEnum.success) {
        toast.success(msg);
    } else if (type === AlertTypeEnum.error) {
        toast.error(msg);
    } else if (type === AlertTypeEnum.info) {
        toast.info(msg);
    } else {
        toast(msg);
    }
};

export default awesomeAlert;
