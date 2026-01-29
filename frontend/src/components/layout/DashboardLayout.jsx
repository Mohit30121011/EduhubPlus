import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, LogOut, Settings } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../../redux/features/authSlice';
import Sidebar from '../Sidebar';
import BottomNav from './BottomNav';

const DashboardLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(reset());
        window.location.href = '/login'; // Force redirect to be safe
    };

    return (
        <div className="flex min-h-screen animated-bg relative">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="main-content flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white/80 backdrop-blur border-b border-gray-200 p-4 sticky top-0 z-30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            <Menu size={24} />
                        </button>
                        <span className="font-bold text-gray-800 text-lg">ICMS</span>
                    </div>
                </div>

                <div className="w-full p-4 md:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>

            {/* Bottom Navigation for Mobile */}
            <BottomNav onMenuClick={() => setSidebarOpen(true)} />
        </div>
    );
};

export default DashboardLayout;
