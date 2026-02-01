import { useState, useEffect } from 'react';
import { Shield, Users, Plus, X, ChevronDown, Check, Trash2, AlertTriangle, Search, SlidersHorizontal, Columns3, Eye, EyeOff, UserPlus, Mail, Lock, UserCog } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const roles = [
    { value: 'SUPER_ADMIN', label: 'Super Admin', color: 'bg-red-100 text-red-600' },
    { value: 'ADMIN', label: 'Admin', color: 'bg-purple-100 text-purple-600' },
    { value: 'FACULTY', label: 'Faculty', color: 'bg-blue-100 text-blue-600' },
    { value: 'LIBRARIAN', label: 'Librarian', color: 'bg-green-100 text-green-600' },
    { value: 'ACCOUNTANT', label: 'Accountant', color: 'bg-amber-100 text-amber-600' },
];

const Admin = () => {
    const { user, token } = useSelector((state) => state.auth);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'ADMIN',
        isActive: true
    });

    // Search and Filter
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showColumnDropdown, setShowColumnDropdown] = useState(false);
    const [filterRole, setFilterRole] = useState('');

    // Column visibility
    const [visibleColumns, setVisibleColumns] = useState({
        name: true,
        email: true,
        role: true,
        status: true
    });

    // Check if user is SUPER_ADMIN
    if (user?.role !== 'SUPER_ADMIN') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Shield size={64} className="mx-auto text-red-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                    <p className="text-gray-500">This page is only accessible to Super Admins.</p>
                </div>
            </div>
        );
    }

    // Fetch users
    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${API_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data.data || []);
        } catch (error) {
            toast.error('Failed to fetch users');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter data
    const getFilteredData = () => {
        let filtered = users;

        if (searchQuery) {
            filtered = filtered.filter(u =>
                u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filterRole) {
            filtered = filtered.filter(u => u.role === filterRole);
        }

        return filtered;
    };

    // Open modal
    const openModal = (userData = null) => {
        if (userData) {
            setIsEditMode(true);
            setFormData({
                id: userData.id,
                name: userData.name || '',
                email: userData.email,
                password: '',
                role: userData.role,
                isActive: userData.isActive
            });
        } else {
            setIsEditMode(false);
            setFormData({ name: '', email: '', password: '', role: 'ADMIN', isActive: true });
        }
        setShowModal(true);
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await axios.put(`${API_URL}/admin/users/${formData.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('User updated successfully');
            } else {
                await axios.post(`${API_URL}/admin/users`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('User created successfully');
            }
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    // Handle delete
    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL}/admin/users/${itemToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('User deleted successfully');
            setShowDeleteModal(false);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const getRoleStyle = (role) => {
        const r = roles.find(r => r.value === role);
        return r?.color || 'bg-gray-100 text-gray-600';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <Shield size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Admin Management</h1>
                            <p className="text-sm text-gray-500">Manage system administrators and their roles</p>
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl overflow-hidden"
                >
                    {/* Toolbar */}
                    <div className="p-4 sm:p-6 border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <h2 className="text-lg font-bold text-gray-900">Users ({getFilteredData().length})</h2>

                            <div className="flex items-center gap-2 flex-wrap justify-end">
                                {/* Search Input */}
                                {showSearchInput && (
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus
                                        className="w-36 sm:w-48 px-4 py-2.5 bg-gray-100 rounded-full text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    />
                                )}

                                {/* Search Button */}
                                <motion.button
                                    onClick={() => {
                                        setShowSearchInput(!showSearchInput);
                                        if (showSearchInput) setSearchQuery('');
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${showSearchInput ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {showSearchInput ? <X size={18} /> : <Search size={18} />}
                                </motion.button>

                                {/* Filter Button */}
                                <div className="relative">
                                    <motion.button
                                        onClick={() => {
                                            setShowFilterDropdown(!showFilterDropdown);
                                            setShowColumnDropdown(false);
                                        }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${(showFilterDropdown || filterRole) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        <SlidersHorizontal size={18} />
                                    </motion.button>
                                    <AnimatePresence>
                                        {showFilterDropdown && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="fixed inset-x-4 sm:inset-auto sm:absolute sm:right-0 top-24 sm:top-auto sm:mt-2 w-auto sm:w-64 max-w-sm mx-auto sm:mx-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-[100]"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <p className="text-sm font-bold text-gray-900">Filter by Role</p>
                                                    <button onClick={() => setShowFilterDropdown(false)} className="text-gray-400 hover:text-gray-600">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                                <select
                                                    value={filterRole}
                                                    onChange={(e) => setFilterRole(e.target.value)}
                                                    className="w-full p-3 bg-gray-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
                                                >
                                                    <option value="">All Roles</option>
                                                    {roles.map(r => (
                                                        <option key={r.value} value={r.value}>{r.label}</option>
                                                    ))}
                                                </select>
                                                {filterRole && (
                                                    <button
                                                        onClick={() => setFilterRole('')}
                                                        className="mt-3 w-full py-2 text-xs font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100"
                                                    >
                                                        Clear Filter
                                                    </button>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Column Visibility */}
                                <div className="relative">
                                    <motion.button
                                        onClick={() => {
                                            setShowColumnDropdown(!showColumnDropdown);
                                            setShowFilterDropdown(false);
                                        }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${showColumnDropdown ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        <Columns3 size={18} />
                                    </motion.button>
                                    <AnimatePresence>
                                        {showColumnDropdown && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="fixed inset-x-4 sm:inset-auto sm:absolute sm:right-0 top-24 sm:top-auto sm:mt-2 w-auto sm:w-48 max-w-sm mx-auto sm:mx-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100]"
                                            >
                                                <div className="flex items-center justify-between p-3 border-b border-gray-100">
                                                    <p className="text-sm font-bold text-gray-900">Show Columns</p>
                                                    <button onClick={() => setShowColumnDropdown(false)} className="text-gray-400 hover:text-gray-600">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                                {Object.keys(visibleColumns).map((col) => (
                                                    <button
                                                        key={col}
                                                        onClick={() => setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }))}
                                                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                                    >
                                                        <span className="text-sm font-medium text-gray-700 capitalize">{col}</span>
                                                        {visibleColumns[col] ? (
                                                            <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                                                                <Check size={14} className="text-white" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-5 h-5 bg-gray-200 rounded" />
                                                        )}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Add Button */}
                                <motion.button
                                    onClick={() => openModal()}
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-10 h-10 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center"
                                >
                                    <Plus size={20} />
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="p-4 sm:p-6">
                        {isLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                            </div>
                                            <div className="w-16 h-8 bg-gray-100 rounded-lg"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : getFilteredData().length === 0 ? (
                            <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                <Users size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-400 font-bold mb-2">No users found</p>
                                <button onClick={() => openModal()} className="text-blue-600 text-sm font-bold hover:underline">Add your first admin</button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-xs font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                            {visibleColumns.name && <th className="px-4 py-4">Name</th>}
                                            {visibleColumns.email && <th className="px-4 py-4">Email</th>}
                                            {visibleColumns.role && <th className="px-4 py-4">Role</th>}
                                            {visibleColumns.status && <th className="px-4 py-4">Status</th>}
                                            <th className="px-4 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {getFilteredData().map((u, index) => (
                                            <motion.tr
                                                key={u.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="hover:bg-blue-50/50 transition-colors"
                                            >
                                                {visibleColumns.name && (
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                                {u.name?.charAt(0) || u.email?.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="font-bold text-gray-700">{u.name || '-'}</span>
                                                        </div>
                                                    </td>
                                                )}
                                                {visibleColumns.email && <td className="px-4 py-4 text-gray-500 font-medium">{u.email}</td>}
                                                {visibleColumns.role && (
                                                    <td className="px-4 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleStyle(u.role)}`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                )}
                                                {visibleColumns.status && (
                                                    <td className="px-4 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                            {u.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                )}
                                                <td className="px-4 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => openModal(u)}
                                                            className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-colors"
                                                        >
                                                            Edit
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => {
                                                                setItemToDelete(u);
                                                                setShowDeleteModal(true);
                                                            }}
                                                            className="text-sm font-bold text-red-600 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-600 hover:text-white transition-colors"
                                                        >
                                                            Delete
                                                        </motion.button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black text-gray-900">
                                    {isEditMode ? 'Edit User' : 'Add New Admin'}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Name</label>
                                    <div className="relative">
                                        <UserCog size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter name"
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Email</label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="Enter email"
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">
                                        Password {isEditMode && '(leave blank to keep current)'}
                                    </label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder={isEditMode ? 'Enter new password' : 'Enter password'}
                                            required={!isEditMode}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full p-3 bg-gray-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        {roles.map(r => (
                                            <option key={r.value} value={r.value}>{r.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {isEditMode && (
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="w-5 h-5 rounded"
                                        />
                                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                                >
                                    {isEditMode ? 'Update User' : 'Create Admin'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center"
                        >
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={32} className="text-red-500" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">Delete User?</h3>
                            <p className="text-gray-500 text-sm mb-6">
                                Are you sure you want to delete <span className="font-bold">{itemToDelete?.email}</span>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Admin;
