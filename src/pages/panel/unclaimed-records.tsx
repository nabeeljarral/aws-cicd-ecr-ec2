import StatementRecords from '@/pages/panel/statement-records';
import {RoleEnum} from '@/utils/enums/role';
import {FilterEnums} from '@/utils/enums/filter';

const UnclaimedRecords = () => {
    return <StatementRecords
        selectedFilters={[
            FilterEnums.bank,
            FilterEnums.bank_account,
            FilterEnums.amount,
            FilterEnums.utr,
            FilterEnums.date_range,
        ]}
        pageRole={RoleEnum.UnclaimedRecords}
        initFilter={{
            is_claimed: false,
        }}
    />;
};

export default UnclaimedRecords;