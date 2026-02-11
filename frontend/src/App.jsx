import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import DashboardHome from './pages/DashboardHome';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import StudentList from './pages/StudentList';
import AddStudent from './pages/AddStudent';
import ViewStudent from './pages/ViewStudent';
import FacultyList from './pages/FacultyList';
import AddFaculty from './pages/AddFaculty';
import Attendance from './pages/Attendance';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import EnquiryList from './pages/EnquiryList';
import Admissions from './pages/Admissions';
import Academics from './pages/Academics';
import Finances from './pages/Finances';
import Content from './pages/Content';
import Insights from './pages/Insights';
import Tasks from './pages/Tasks';
import Master from './pages/Master';
import Admin from './pages/Admin';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';



function App() {
    return (
        <div className="font-sans antialiased text-gray-900 bg-gray-50 min-h-screen">
            <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<DashboardHome />} />
                    <Route path="analytics" element={<AnalyticsDashboard />} />

                    <Route path="enquiries" element={<EnquiryList />} />
                    <Route path="admissions" element={<Admissions />} />
                    <Route path="academics" element={<Academics />} />
                    <Route path="finances" element={<Finances />} />
                    <Route path="content" element={<Content />} />
                    <Route path="insights" element={<Insights />} />

                    <Route path="students" element={<StudentList />} />
                    <Route path="students/add" element={<AddStudent />} />
                    <Route path="students/view/:id" element={<ViewStudent />} />
                    <Route path="students/edit/:id" element={<AddStudent />} />

                    <Route path="faculty" element={<FacultyList />} />
                    <Route path="faculty/add" element={<AddFaculty />} />
                    <Route path="faculty/edit/:id" element={<AddFaculty />} />
                    <Route path="staff" element={<FacultyList />} />
                    <Route path="staff/add" element={<AddFaculty />} />

                    <Route path="tasks" element={<Tasks />} />
                    <Route path="master" element={<Master />} />
                    <Route path="admin" element={<Admin />} />
                    <Route path="settings" element={<Settings />} />

                    <Route path="attendance" element={<Attendance />} />
                    <Route path="notifications" element={<Notifications />} />
                </Route>

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<div className="p-8 text-center text-red-500">404: Page Not Found</div>} />
            </Routes>
        </div>
    );
}

export default App;
