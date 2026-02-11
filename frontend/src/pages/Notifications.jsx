import React, { useState, useEffect } from 'react';
import { Bell, Send, Trash2, CheckCheck, Info, AlertTriangle, CheckCircle, XCircle, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const typeConfig = {
    INFO: { icon: Info, color: 'blue', bg: 'bg-blue-50', text: 'text-blue-600' },
    SUCCESS: { icon: CheckCircle, color: 'green', bg: 'bg-green-50', text: 'text-green-600' },
    WARNING: { icon: AlertTriangle, color: 'amber', bg: 'bg-amber-50', text: 'text-amber-600' },
    ERROR: { icon: XCircle, color: 'red', bg: 'bg-red-50', text: 'text-red-600' },
};

const Notifications = () => {
    const { user } = useSelector((state) => state.auth);
    const token = user?.token;
    const role = user?.role;
    const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
    const headers = { Authorization: `Bearer ${token}` };

    const [notifications, setNotifications] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    // Admin: send form
    const [showSendForm, setShowSendForm] = useState(false);
    const [sendForm, setSendForm] = useState({ title: '', message: '', type: 'INFO', targetRole: '', targetUserId: '' });
    const [sending, setSending] = useState(false);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/notifications/my?page=${page}&limit=20`, { headers });
            setNotifications(res.data.notifications || []);
            setTotal(res.data.total || 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNotifications(); }, [page, token]);

    const handleMarkRead = async (id) => {
        try {
            await axios.put(`${API_URL}/notifications/${id}/read`, {}, { headers });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            toast.error('Failed to mark as read');
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await axios.put(`${API_URL}/notifications/read-all`, {}, { headers });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success('All marked as read');
        } catch (err) {
            toast.error('Failed');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/notifications/${id}`, { headers });
            setNotifications(prev => prev.filter(n => n.id !== id));
            toast.success('Deleted');
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            const res = await axios.post(`${API_URL}/notifications`, sendForm, { headers });
            toast.success(res.data.message || 'Sent!');
            setShowSendForm(false);
            setSendForm({ title: '', message: '', type: 'INFO', targetRole: '', targetUserId: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send');
        } finally {
            setSending(false);
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {isAdmin ? 'Manage and send notifications' : 'Stay updated with announcements'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm"
                    >
                        <CheckCheck size={16} /> Mark All Read
                    </button>
                    {isAdmin && (
                        <button
                            onClick={() => setShowSendForm(!showSendForm)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:opacity-90 shadow-lg shadow-blue-500/20"
                        >
                            <Send size={16} /> Send Notification
                        </button>
                    )}
                </div>
            </div>

            {/* Admin Send Form */}
            <AnimatePresence>
                {showSendForm && isAdmin && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Send Announcement</h3>
                            <form onSubmit={handleSend} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={sendForm.title}
                                    onChange={(e) => setSendForm(p => ({ ...p, title: e.target.value }))}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium"
                                    required
                                />
                                <textarea
                                    placeholder="Message"
                                    value={sendForm.message}
                                    onChange={(e) => setSendForm(p => ({ ...p, message: e.target.value }))}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium h-24 resize-none"
                                    required
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        value={sendForm.type}
                                        onChange={(e) => setSendForm(p => ({ ...p, type: e.target.value }))}
                                        className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    >
                                        <option value="INFO">Info</option>
                                        <option value="SUCCESS">Success</option>
                                        <option value="WARNING">Warning</option>
                                        <option value="ERROR">Error/Alert</option>
                                    </select>
                                    <select
                                        value={sendForm.targetRole}
                                        onChange={(e) => setSendForm(p => ({ ...p, targetRole: e.target.value }))}
                                        className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    >
                                        <option value="">All Users</option>
                                        <option value="STUDENT">All Students</option>
                                        <option value="FACULTY">All Faculty</option>
                                        <option value="ADMIN">All Admins</option>
                                    </select>
                                </div>
                                <div className="flex gap-3">
                                    <button type="submit" disabled={sending} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50">
                                        {sending ? 'Sending...' : 'Send'}
                                    </button>
                                    <button type="button" onClick={() => setShowSendForm(false)} className="px-6 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Notification List */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
                ) : notifications.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <Bell size={40} className="mx-auto mb-3 opacity-50" />
                        <p className="font-medium">No notifications yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {notifications.map((n, idx) => {
                            const config = typeConfig[n.type] || typeConfig.INFO;
                            const Icon = config.icon;
                            return (
                                <motion.div
                                    key={n.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className={`p-4 flex items-start gap-3 hover:bg-gray-50/80 transition-colors ${!n.isRead ? 'bg-blue-50/20 border-l-4 border-l-blue-500' : ''}`}
                                >
                                    <div className={`w-9 h-9 rounded-xl ${config.bg} ${config.text} flex items-center justify-center shrink-0`}>
                                        <Icon size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className={`text-sm ${!n.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{n.title}</p>
                                                <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                {!n.isRead && (
                                                    <button onClick={() => handleMarkRead(n.id)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg" title="Mark as read">
                                                        <CheckCircle size={14} />
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(n.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg" title="Delete">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1.5">{timeAgo(n.createdAt)}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {total > 20 && (
                    <div className="p-4 border-t border-gray-100 flex justify-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-sm font-bold text-gray-600">Page {page}</span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={notifications.length < 20}
                            className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
