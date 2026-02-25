import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/academic/';

// ─── Mock Academic Data (connected) ─────────────────────────────────
// Department names MUST match StudentList DEPARTMENTS & FacultyList FAC_DEPTS
const MOCK_DEPARTMENTS = [
    { id: 'mock-dept-1', name: 'Computer Science', code: 'CSE', isMock: true },
    { id: 'mock-dept-2', name: 'Electronics', code: 'ECE', isMock: true },
    { id: 'mock-dept-3', name: 'Mechanical', code: 'ME', isMock: true },
    { id: 'mock-dept-4', name: 'Civil', code: 'CE', isMock: true },
    { id: 'mock-dept-5', name: 'Electrical', code: 'EE', isMock: true },
    { id: 'mock-dept-6', name: 'Information Technology', code: 'IT', isMock: true },
    { id: 'mock-dept-7', name: 'Mathematics', code: 'MATH', isMock: true },
    { id: 'mock-dept-8', name: 'Physics', code: 'PHY', isMock: true },
];

// 3 courses per department = 24 courses
const COURSE_TEMPLATES = [
    // CSE
    { deptIdx: 0, name: 'B.Tech Computer Science', code: 'BT-CSE', duration: 4, fees: 185000 },
    { deptIdx: 0, name: 'M.Tech Computer Science', code: 'MT-CSE', duration: 2, fees: 125000 },
    { deptIdx: 0, name: 'BCA', code: 'BCA', duration: 3, fees: 95000 },
    // ECE
    { deptIdx: 1, name: 'B.Tech Electronics & Communication', code: 'BT-ECE', duration: 4, fees: 175000 },
    { deptIdx: 1, name: 'M.Tech VLSI Design', code: 'MT-VLSI', duration: 2, fees: 120000 },
    { deptIdx: 1, name: 'Diploma in Electronics', code: 'DIP-ECE', duration: 3, fees: 65000 },
    // ME
    { deptIdx: 2, name: 'B.Tech Mechanical', code: 'BT-ME', duration: 4, fees: 170000 },
    { deptIdx: 2, name: 'M.Tech Thermal Engineering', code: 'MT-TE', duration: 2, fees: 115000 },
    { deptIdx: 2, name: 'Diploma in Mechanical', code: 'DIP-ME', duration: 3, fees: 60000 },
    // CE
    { deptIdx: 3, name: 'B.Tech Civil', code: 'BT-CE', duration: 4, fees: 165000 },
    { deptIdx: 3, name: 'M.Tech Structural Engineering', code: 'MT-SE', duration: 2, fees: 110000 },
    { deptIdx: 3, name: 'Diploma in Civil', code: 'DIP-CE', duration: 3, fees: 58000 },
    // EE
    { deptIdx: 4, name: 'B.Tech Electrical', code: 'BT-EE', duration: 4, fees: 168000 },
    { deptIdx: 4, name: 'M.Tech Power Systems', code: 'MT-PS', duration: 2, fees: 112000 },
    { deptIdx: 4, name: 'Diploma in Electrical', code: 'DIP-EE', duration: 3, fees: 62000 },
    // IT
    { deptIdx: 5, name: 'B.Tech Information Technology', code: 'BT-IT', duration: 4, fees: 180000 },
    { deptIdx: 5, name: 'MCA', code: 'MCA', duration: 2, fees: 130000 },
    { deptIdx: 5, name: 'BBA in IT Management', code: 'BBA-IT', duration: 3, fees: 90000 },
    // MATH
    { deptIdx: 6, name: 'B.Sc Mathematics', code: 'BSC-MATH', duration: 3, fees: 45000 },
    { deptIdx: 6, name: 'M.Sc Mathematics', code: 'MSC-MATH', duration: 2, fees: 55000 },
    { deptIdx: 6, name: 'B.Sc Statistics', code: 'BSC-STAT', duration: 3, fees: 42000 },
    // PHY
    { deptIdx: 7, name: 'B.Sc Physics', code: 'BSC-PHY', duration: 3, fees: 44000 },
    { deptIdx: 7, name: 'M.Sc Physics', code: 'MSC-PHY', duration: 2, fees: 52000 },
    { deptIdx: 7, name: 'B.Sc Applied Physics', code: 'BSC-AP', duration: 3, fees: 46000 },
];

const MOCK_COURSES = COURSE_TEMPLATES.map((t, i) => ({
    id: `mock-course-${i + 1}`,
    name: t.name,
    code: t.code,
    duration: t.duration,
    fees: t.fees,
    DepartmentId: MOCK_DEPARTMENTS[t.deptIdx].id,
    isMock: true,
}));

// 4 subjects per course = 96 subjects
const SUBJECT_POOL = {
    'BT-CSE': ['Data Structures', 'Operating Systems', 'Database Management', 'Computer Networks'],
    'MT-CSE': ['Advanced Algorithms', 'Machine Learning', 'Cloud Computing', 'Distributed Systems'],
    'BCA': ['Programming in C', 'Web Development', 'Software Engineering', 'Java Programming'],
    'BT-ECE': ['Digital Electronics', 'Signal Processing', 'Microprocessors', 'Communication Systems'],
    'MT-VLSI': ['VLSI Design', 'Embedded Systems', 'ASIC Design', 'FPGA Programming'],
    'DIP-ECE': ['Basic Electronics', 'Circuit Theory', 'PCB Design', 'Instrumentation'],
    'BT-ME': ['Thermodynamics', 'Fluid Mechanics', 'Manufacturing Processes', 'Machine Design'],
    'MT-TE': ['Heat Transfer', 'Combustion Engineering', 'Refrigeration & AC', 'Turbo Machinery'],
    'DIP-ME': ['Workshop Technology', 'Engineering Drawing', 'Strength of Materials', 'Auto Engineering'],
    'BT-CE': ['Structural Analysis', 'Geotechnical Engineering', 'Surveying', 'Concrete Technology'],
    'MT-SE': ['Advanced Structures', 'Earthquake Engineering', 'Bridge Engineering', 'Finite Elements'],
    'DIP-CE': ['Building Construction', 'Hydraulics', 'Road Engineering', 'Estimation & Costing'],
    'BT-EE': ['Power Systems', 'Electrical Machines', 'Control Systems', 'Power Electronics'],
    'MT-PS': ['Smart Grid', 'Renewable Energy', 'High Voltage Engineering', 'Power Quality'],
    'DIP-EE': ['Basic Electrical', 'Wiring & Installation', 'Transformers', 'Switchgear'],
    'BT-IT': ['Data Mining', 'Cyber Security', 'Information Systems', 'Mobile Computing'],
    'MCA': ['Advanced Java', 'System Analysis', 'Artificial Intelligence', 'Data Warehousing'],
    'BBA-IT': ['IT Project Management', 'ERP Systems', 'Business Analytics', 'Digital Marketing'],
    'BSC-MATH': ['Linear Algebra', 'Calculus', 'Differential Equations', 'Number Theory'],
    'MSC-MATH': ['Real Analysis', 'Abstract Algebra', 'Topology', 'Functional Analysis'],
    'BSC-STAT': ['Probability Theory', 'Statistical Methods', 'Regression Analysis', 'Sampling Theory'],
    'BSC-PHY': ['Classical Mechanics', 'Electrodynamics', 'Quantum Mechanics', 'Optics'],
    'MSC-PHY': ['Nuclear Physics', 'Solid State Physics', 'Particle Physics', 'Astrophysics'],
    'BSC-AP': ['Applied Optics', 'Material Science', 'Laser Physics', 'Plasma Physics'],
};

let subjectCounter = 0;
const MOCK_SUBJECTS = MOCK_COURSES.flatMap((course) => {
    const names = SUBJECT_POOL[course.code] || ['Subject 1', 'Subject 2', 'Subject 3', 'Subject 4'];
    return names.map((subName, si) => ({
        id: `mock-sub-${++subjectCounter}`,
        name: subName,
        code: `${course.code}-${String(si + 1).padStart(2, '0')}`,
        credits: [3, 4, 3, 4][si % 4],
        CourseId: course.id,
        isMock: true,
    }));
});

// Helper to merge real API data with mock fallback
const mergeWithMock = (real, mock, keyField = 'code') => {
    const realArr = (real || []).map(item => ({ ...item, isMock: false }));
    const realKeys = new Set(realArr.map(r => r[keyField]));
    const mockToAdd = mock.filter(m => !realKeys.has(m[keyField]));
    return [...realArr, ...mockToAdd];
};

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

const initialState = {
    courses: [],
    subjects: [],
    departments: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

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
                state.departments = mergeWithMock(action.payload.departments, MOCK_DEPARTMENTS, 'code');
                state.courses = mergeWithMock(action.payload.courses, MOCK_COURSES, 'code');
                state.subjects = mergeWithMock(action.payload.subjects, MOCK_SUBJECTS, 'code');
            })
            .addCase(getAllAcademicData.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                // Use mocks as fallback if API fails
                state.departments = MOCK_DEPARTMENTS;
                state.courses = MOCK_COURSES;
                state.subjects = MOCK_SUBJECTS;
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
