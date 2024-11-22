import {ThunkAction} from 'redux-thunk';
import {RootState} from '@/store';
import {setToken, setUser} from './authSlice';
import awesomeAlert from '@/utils/functions/alert';
import {AnyAction} from 'redux';
import {IUser} from '@/utils/interfaces/user.interface';
import {AlertTypeEnum} from '@/utils/enums/alertType';

export const login = (payload: {
    user: IUser,
    token: string
}): ThunkAction<void, RootState, null, AnyAction> => async (dispatch) => {
    try {
        // Store the token in the auth store
        if (payload) {
            dispatch(setToken(payload.token));
            dispatch(setUser(payload.user));
        }
    } catch (err: any) {
        awesomeAlert({msg: err.message, type: AlertTypeEnum.error});
    }
    return null;
};

export const logout = (): ThunkAction<void, RootState, null, AnyAction> => async (dispatch) => {

    try {
        // Store the token in the auth store
        dispatch(setToken(null));
        dispatch(setUser(null));
    } catch (err: any) {
        console.error(err);
    }
    return null;
};