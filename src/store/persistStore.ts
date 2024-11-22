import {persistStore} from 'redux-persist';
import {Store} from 'redux';

const persistStoreWrapper = (store: Store) => {
    return persistStore(store);
};

export default persistStoreWrapper;