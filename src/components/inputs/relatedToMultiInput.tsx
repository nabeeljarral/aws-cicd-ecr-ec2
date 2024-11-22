import * as React from 'react';
import { useEffect, useState } from 'react';
import MultiSelect, { IOptionItem } from '@/components/filter/main/multiSelect';
import { RoleEnum } from '@/utils/enums/role';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { getUsers } from '@/utils/services/user';

type Props = {
    hideAllOption?: boolean,
    notRequired?: boolean,
    relatedToInitialValue?: string,
    name?: string,
    title?: string,
    hideCreatedBy?: boolean,
    globalOption?: boolean,
    disabled?: boolean,
    handleChange?: (value: string) => void
    multiselect?: boolean
}

export default function RelatedToMultiInput(props: Props) {
    const [loading, setLoading] = useState(false);
    const [userOptions, setUserOptions] = useState<IOptionItem[]>([]);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const userId = useSelector((state: RootState) => state.auth.user)?._id;

    useEffect(() => {
        if (roles?.includes(RoleEnum.UserControl)) {
            setLoading(true);
            getUsers().then(res => {
                if (res) {
                    const options = res
                        .filter(u => u.isCompany && u.isActive)
                        .map(a => ({
                            id: a._id,
                            value: a.email,
                        }));
                    if (props.globalOption) {
                        options.push({ id: 'global', value: 'Global' });
                    }
                    setUserOptions(options);
                }
            }).finally(() => {
                setLoading(false);
            });
        }
    }, []);

    return (<>
        {
            roles?.includes(RoleEnum.UserControl) ?
                <MultiSelect
                    title={props.title || 'Related To'}
                    name={props.name || 'relatedTo'}
                    disabled={props.disabled}
                    defaultValue={props.relatedToInitialValue}
                    options={userOptions}
                    margin={'unset'}
                    handleChange={props?.handleChange}
                    loading={loading}
                    width="100%"
                    hideAllOption={props?.hideAllOption} /> :
                <input type="hidden" name="relatedTo" value={userId} />
        }
        {!props?.hideCreatedBy && <input type="hidden" name="createdBy" value={userId} />}
    </>);
}
