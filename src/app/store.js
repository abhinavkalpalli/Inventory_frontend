import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { thunk } from 'redux-thunk'; // Correct import for thunk
import userSlice from '../utils/reducers/userReducer';

const persistConfig = {
    key: 'root',
    storage,
    transforms: [], // Apply any transforms if needed
    stateReconciler: autoMergeLevel2,
};

const rootReducer = combineReducers({
    user: userSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(thunk), // Use getDefaultMiddleware and add thunk
});

export const persistor = persistStore(store);
