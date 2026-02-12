import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import settingsReducer from './features/settingsSlice';
import academicReducer from './features/academicSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        settings: settingsReducer,
        auth: authReducer,
        settings: settingsReducer,
        academic: academicReducer,
    },
});
