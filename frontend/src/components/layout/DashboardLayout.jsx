import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, LogOut, Settings } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../../redux/features/authSlice';
import Sidebar from '../Sidebar';
import BottomNav from './BottomNav';
import NotificationBell from '../NotificationBell';

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
                {/* Top Header Bar */}
                <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <div className="hidden lg:block" />
                    <div className="flex items-center gap-2">
                        <NotificationBell />
                        <Link to="/dashboard/settings" className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors">
                            <Settings size={20} />
                        </Link>
                    </div>
                </div>

                <div className="w-full p-4 md:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>

            {/* Bottom Navigation for Mobile */}
            <BottomNav onMenuClick={() => setSidebarOpen(!isSidebarOpen)} isMenuOpen={isSidebarOpen} />
        </div>
    );
};

export default DashboardLayout;

