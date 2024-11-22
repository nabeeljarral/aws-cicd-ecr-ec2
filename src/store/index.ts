import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {authReducer} from './auth';
import storage from 'redux-persist/lib/storage';
import {FLUSH, PAUSE, PERSIST, persistReducer, REGISTER, REHYDRATE} from 'redux-persist';
import persistStoreWrapper from './persistStore';

const rootReducer = combineReducers({
    auth: authReducer,
    // Add other reducers here
});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, REGISTER],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
    // Add other store options here
});

const persistor = persistStoreWrapper(store);

export {store, persistor};
