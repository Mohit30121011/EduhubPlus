import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/academic/';

// Get All Academic Data
export const getAllAcademicData = createAsyncThunk(
    'academic/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.get(API_URL + 'all', config);
            return response.data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// ... (Create/Update/Delete thunks will automatically use the new API_URL) ...

export const academicSlice = createSlice({
    name: 'academic',
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
            .addCase(getAllAcademicData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllAcademicData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.courses = action.payload.courses;
                state.subjects = action.payload.subjects;
                state.departments = action.payload.departments;
            })
            .addCase(getAllAcademicData.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
        // ... (rest of the reducers)
    },
});

export const { reset } = academicSlice.actions;
export default academicSlice.reducer;
