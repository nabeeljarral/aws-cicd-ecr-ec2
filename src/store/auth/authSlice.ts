import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IUser} from '@/utils/interfaces/user.interface';
import {HYDRATE} from 'next-redux-wrapper';

interface AuthState {
    token: string | null;
    user: IUser | null;
}

const initialState: AuthState = {
    token: null,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setToken(state, action: PayloadAction<string | null>) {
            state.token = action.payload;
        },
        setUser(state, action: PayloadAction<IUser | null>) {
            state.user = action.payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(HYDRATE, (state, action) => {
            // Initialize state with persisted values
            return {
                ...state,
                ...action,
            };
        });
    },
});

export const {setToken, setUser} = authSlice.actions;
export default authSlice.reducer;
