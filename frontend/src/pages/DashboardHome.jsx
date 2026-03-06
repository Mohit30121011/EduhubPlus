import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import AdminDashboardHome from './AdminDashboardHome';
import StudentDashboardHome from './StudentDashboardHome';

const DashboardHome = () => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === 'STUDENT') {
        return <StudentDashboardHome />;
    }

    // Default to admin view for SUPER_ADMIN, ADMIN, FACULTY (for now, eventually maybe a Faculty dashboard)
    return <AdminDashboardHome />;
};

export default DashboardHome;
