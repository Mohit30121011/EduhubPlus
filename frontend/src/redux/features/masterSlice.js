import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api/master/';

// Get All Master Data
export const getAllMasterData = createAsyncThunk(
    'master/getAll',
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
    'master/createCourse',
    async (courseData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.post(API_URL + 'course', courseData, config);
            return response.data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete Course
export const deleteCourse = createAsyncThunk(
    'master/deleteCourse',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.delete(API_URL + 'course/' + id, config);
            return id; // Return ID to filter out
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Create Department
export const createDepartment = createAsyncThunk(
    'master/createDepartment',
    async (deptData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.post(API_URL + 'department', deptData, config);
            return response.data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Create Subject
export const createSubject = createAsyncThunk(
    'master/createSubject',
    async (subjectData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.post(API_URL + 'subject', subjectData, config);
            return response.data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update Course
export const updateCourse = createAsyncThunk(
    'master/updateCourse',
    async ({ id, data }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.put(API_URL + 'course/' + id, data, config);
            return response.data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update Subject
export const updateSubject = createAsyncThunk(
    'master/updateSubject',
    async ({ id, data }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.put(API_URL + 'subject/' + id, data, config);
            return response.data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update Department
export const updateDepartment = createAsyncThunk(
    'master/updateDepartment',
    async ({ id, data }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.put(API_URL + 'department/' + id, data, config);
            return response.data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    courses: [],
    subjects: [],
    departments: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

export const masterSlice = createSlice({
    name: 'master',
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
            .addCase(getAllMasterData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllMasterData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.courses = action.payload.courses;
                state.subjects = action.payload.subjects;
                state.departments = action.payload.departments;
            })
            .addCase(getAllMasterData.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createCourse.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.courses.push(action.payload); // Add new course to list
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteCourse.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.courses = state.courses.filter((course) => course.id !== action.payload);
                toast.success('Course Deleted');
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createSubject.pending, (state) => {
                state.isLoading = true;
            })
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
            .addCase(createDepartment.pending, (state) => {
                state.isLoading = true;
            })
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
            .addCase(updateCourse.fulfilled, (state, action) => {
                const index = state.courses.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.courses[index] = action.payload;
                }
            })
            .addCase(updateSubject.fulfilled, (state, action) => {
                const index = state.subjects.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.subjects[index] = action.payload;
                }
            })
            .addCase(updateDepartment.fulfilled, (state, action) => {
                const index = state.departments.findIndex(d => d.id === action.payload.id);
                if (index !== -1) {
                    state.departments[index] = action.payload;
                }
            });
    },
});

export const { reset } = masterSlice.actions;
export default masterSlice.reducer;
