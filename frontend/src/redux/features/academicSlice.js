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

// Create Course
export const createCourse = createAsyncThunk(
    'academic/createCourse',
    async (courseData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.post(API_URL + 'course', courseData, config);
            return response.data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update Course
export const updateCourse = createAsyncThunk(
    'academic/updateCourse',
    async ({ id, courseData }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.put(API_URL + `course/${id}`, courseData, config);
            return response.data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete Course
export const deleteCourse = createAsyncThunk(
    'academic/deleteCourse',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(API_URL + `course/${id}`, config);
            return id;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Create Subject
export const createSubject = createAsyncThunk(
    'academic/createSubject',
    async (subjectData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.post(API_URL + 'subject', subjectData, config);
            return response.data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update Subject
export const updateSubject = createAsyncThunk(
    'academic/updateSubject',
    async ({ id, subjectData }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.put(API_URL + `subject/${id}`, subjectData, config);
            return response.data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Create Department
export const createDepartment = createAsyncThunk(
    'academic/createDepartment',
    async (deptData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.post(API_URL + 'department', deptData, config);
            return response.data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update Department
export const updateDepartment = createAsyncThunk(
    'academic/updateDepartment',
    async ({ id, deptData }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.put(API_URL + `department/${id}`, deptData, config);
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
            // Create Course
            .addCase(createCourse.pending, (state) => { state.isLoading = true; })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.courses.push(action.payload);
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update Course
            .addCase(updateCourse.pending, (state) => { state.isLoading = true; })
            .addCase(updateCourse.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.courses = state.courses.map((item) => item.id === action.payload.id ? action.payload : item);
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Delete Course
            .addCase(deleteCourse.pending, (state) => { state.isLoading = true; })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.courses = state.courses.filter((item) => item.id !== action.payload);
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Create Subject
            .addCase(createSubject.pending, (state) => { state.isLoading = true; })
            .addCase(createSubject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.subjects.push(action.payload);
            })
            .addCase(createSubject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update Subject
            .addCase(updateSubject.pending, (state) => { state.isLoading = true; })
            .addCase(updateSubject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.subjects = state.subjects.map((item) => item.id === action.payload.id ? action.payload : item);
            })
            .addCase(updateSubject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Create Department
            .addCase(createDepartment.pending, (state) => { state.isLoading = true; })
            .addCase(createDepartment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.departments.push(action.payload);
            })
            .addCase(createDepartment.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update Department
            .addCase(updateDepartment.pending, (state) => { state.isLoading = true; })
            .addCase(updateDepartment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.departments = state.departments.map((item) => item.id === action.payload.id ? action.payload : item);
            })
            .addCase(updateDepartment.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = academicSlice.actions;
export default academicSlice.reducer;
