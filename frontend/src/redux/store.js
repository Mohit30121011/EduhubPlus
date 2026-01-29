import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import settingsReducer from './features/settingsSlice';
import masterReducer from './features/masterSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        settings: settingsReducer,
        master: masterReducer,
    },
});
