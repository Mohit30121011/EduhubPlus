import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/settings/';

// Get School Profile
export const getSchoolProfile = createAsyncThunk(
    'settings/getSchoolProfile',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(API_URL + 'school', config);
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update School Profile
export const updateSchoolProfile = createAsyncThunk(
    'settings/updateSchoolProfile',
    async (profileData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.put(API_URL + 'school', profileData, config);
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    schoolProfile: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSchoolProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSchoolProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.schoolProfile = action.payload;
            })
            .addCase(getSchoolProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateSchoolProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSchoolProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.schoolProfile = action.payload;
            })
            .addCase(updateSchoolProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = settingsSlice.actions;
export default settingsSlice.reducer;
