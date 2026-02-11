import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const NotificationBell = () => {
    const { user } = useSelector((state) => state.auth);
    const token = user?.token;
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const headers = { Authorization: `Bearer ${token}` };

    // Fetch unread count
    const fetchUnread = async () => {
        if (!token) return;
        try {
            const res = await axios.get(`${API_URL}/notifications/unread-count`, { headers });
            setUnreadCount(res.data.count);
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch latest notifications
    const fetchLatest = async () => {
        if (!token) return;
        try {
            const res = await axios.get(`${API_URL}/notifications/my?limit=5`, { headers });
            setNotifications(res.data.notifications || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUnread();
        const interval = setInterval(fetchUnread, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [token]);

    useEffect(() => {
        if (isOpen) fetchLatest();
    }, [isOpen]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkRead = async (id) => {
        try {
            await axios.put(`${API_URL}/notifications/${id}/read`, {}, { headers });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await axios.put(`${API_URL}/notifications/read-all`, {}, { headers });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error(err);
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'SUCCESS': return 'bg-green-500';
            case 'WARNING': return 'bg-amber-500';
            case 'ERROR': return 'bg-red-500';
            default: return 'bg-blue-500';
        }
    };

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                        <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                            <h4 className="font-bold text-gray-800 text-sm">Notifications</h4>
                            {unreadCount > 0 && (
                                <button onClick={handleMarkAllRead} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                    <CheckCheck size={14} /> Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-72 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-6 text-center text-gray-400 text-sm">No notifications</div>
                            ) : (
                                notifications.map(n => (
                                    <div
                                        key={n.id}
                                        onClick={() => !n.isRead && handleMarkRead(n.id)}
                                        className={`p-3 border-b border-gray-50 hover:bg-gray-50/80 transition-colors cursor-pointer ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                                    >
                                        <div className="flex items-start gap-2">
                                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${getTypeColor(n.type)}`}></div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm ${!n.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{n.title}</p>
                                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                                                <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-2 border-t border-gray-100 bg-gray-50/80">
                            <button
                                onClick={() => { setIsOpen(false); navigate('/dashboard/notifications'); }}
                                className="w-full py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                View All Notifications
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
