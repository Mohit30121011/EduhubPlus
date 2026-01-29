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
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 uppercase"
                        >
                            {user?.name?.[0] || 'U'}
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {showProfileMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowProfileMenu(false)}
                                    ></div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 top-12 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-2 z-50 transform origin-top-right ring-1 ring-black/5"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100 mb-1">
                                            <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'User'}</p>
                                            <p className="text-xs text-gray-500 truncate font-medium">{user?.email}</p>
                                        </div>
                                        <Link
                                            to="/dashboard/settings"
                                            onClick={() => setShowProfileMenu(false)}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all font-bold group"
                                        >
                                            <Settings size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                            Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold group mt-1"
                                        >
                                            <LogOut size={18} className="text-red-400 group-hover:text-red-600 transition-colors" />
                                            Log Out
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
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
