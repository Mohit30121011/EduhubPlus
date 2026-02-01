import { useState, useEffect } from 'react';
import { Shield, Users, Plus, X, Check, AlertTriangle, Search, SlidersHorizontal, Columns3, Phone, MapPin, Calendar, CreditCard, Building } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Only admin roles - no students/faculty
const adminRoles = [
    { value: 'SUPER_ADMIN', label: 'Super Admin', color: 'bg-red-100 text-red-600' },
    { value: 'ADMIN', label: 'Admin', color: 'bg-purple-100 text-purple-600' },
];

// Permission modules matching sidebar
const permissionModules = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'enquiries', label: 'Enquiries' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'academics', label: 'Academics' },
    { id: 'finances', label: 'Finances' },
    { id: 'content', label: 'Content' },
    { id: 'insights', label: 'Insights' },
    { id: 'staff', label: 'Staff' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'master', label: 'Academic Data' },
];

const Admin = () => {
    const { user, token } = useSelector((state) => state.auth);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Form state with all fields
    const initialFormState = {
        name: '',
        email: '',
        password: '',
        role: 'ADMIN',
        isActive: true,
        phone: '',
        dateOfBirth: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        aadhaarNumber: '',
        joiningDate: '',
        permissions: []
    };
    const [formData, setFormData] = useState(initialFormState);

    // Search and Filter
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showColumnDropdown, setShowColumnDropdown] = useState(false);
    const [filterRole, setFilterRole] = useState('');

    // Column visibility - new fields disabled by default
    const [visibleColumns, setVisibleColumns] = useState({
        avatar: true,
        name: true,
        email: true,
        phone: false,
        dateOfBirth: false,
        address: false,
        city: false,
        state: false,
        pincode: false,
        aadhaarNumber: false,
        joiningDate: false,
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

    // Fetch users - only ADMIN and SUPER_ADMIN
    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${API_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const adminUsers = (res.data.data || []).filter(u =>
                u.role === 'ADMIN' || u.role === 'SUPER_ADMIN'
            );
            setUsers(adminUsers);
        } catch (error) {
            toast.error('Failed to fetch admins');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const openModal = (item = null) => {
        if (item) {
            setIsEditMode(true);
            setFormData({
                ...item,
                password: '',
                permissions: item.permissions || []
            });
        } else {
            setIsEditMode(false);
            setFormData(initialFormState);
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData };
            if (isEditMode && !payload.password) {
                delete payload.password;
            }

            if (isEditMode) {
                await axios.put(`${API_URL}/admin/users/${formData.id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Admin updated successfully');
            } else {
                await axios.post(`${API_URL}/admin/users`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Admin created successfully');
            }
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL}/admin/users/${itemToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Admin deleted successfully');
            setShowDeleteModal(false);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete admin');
        }
    };

    const togglePermission = (permId) => {
        const current = formData.permissions || [];
        if (current.includes(permId)) {
            setFormData({ ...formData, permissions: current.filter(p => p !== permId) });
        } else {
            setFormData({ ...formData, permissions: [...current, permId] });
        }
    };

    const selectAllPermissions = () => {
        setFormData({ ...formData, permissions: permissionModules.map(p => p.id) });
    };

    const clearAllPermissions = () => {
        setFormData({ ...formData, permissions: [] });
    };

    const getFilteredData = () => {
        return users.filter(u => {
            const matchesSearch = !searchQuery ||
                u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.phone?.includes(searchQuery);
            const matchesRole = !filterRole || u.role === filterRole;
            return matchesSearch && matchesRole;
        });
    };

    const getRoleStyle = (role) => {
        const r = adminRoles.find(r => r.value === role);
        return r?.color || 'bg-gray-100 text-gray-600';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="relative inline-block">
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
                            Admin Management
                        </h1>
                        <div className="h-1 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full mt-2" />
                    </div>
                    <p className="text-gray-500 mt-4">Manage system administrators with granular permissions</p>
                </div>

                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-sm p-6 sm:p-8">
                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <h2 className="text-xl font-black text-gray-900">Admins ({getFilteredData().length})</h2>
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                            {showSearchInput && (
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                    className="w-36 sm:w-48 px-4 py-2.5 bg-gray-100 rounded-full text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
                                />
                            )}
                            <motion.button
                                onClick={() => { setShowSearchInput(!showSearchInput); if (showSearchInput) setSearchQuery(''); }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${showSearchInput ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                            >
                                {showSearchInput ? <X size={18} /> : <Search size={18} />}
                            </motion.button>

                            {/* Filter */}
                            <div className="relative">
                                <motion.button
                                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${filterRole ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    <SlidersHorizontal size={18} />
                                </motion.button>
                                <AnimatePresence>
                                    {showFilterDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-12 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 min-w-[180px]"
                                        >
                                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Filter by Role</p>
                                            <button onClick={() => { setFilterRole(''); setShowFilterDropdown(false); }} className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${!filterRole ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}>All Roles</button>
                                            {adminRoles.map(r => (
                                                <button key={r.value} onClick={() => { setFilterRole(r.value); setShowFilterDropdown(false); }} className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${filterRole === r.value ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}>{r.label}</button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Columns */}
                            <div className="relative">
                                <motion.button
                                    onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"
                                >
                                    <Columns3 size={18} />
                                </motion.button>
                                <AnimatePresence>
                                    {showColumnDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-12 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 min-w-[160px]"
                                        >
                                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Columns</p>
                                            {Object.keys(visibleColumns).map(col => (
                                                <label key={col} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-xl cursor-pointer">
                                                    <input type="checkbox" checked={visibleColumns[col]} onChange={() => setVisibleColumns({ ...visibleColumns, [col]: !visibleColumns[col] })} className="w-4 h-4 rounded" />
                                                    <span className="text-sm font-medium capitalize">{col}</span>
                                                </label>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Add Button */}
                            <motion.button
                                onClick={() => openModal()}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg"
                            >
                                <Plus size={20} />
                            </motion.button>
                        </div>
                    </div>

                    {/* Table */}
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : getFilteredData().length === 0 ? (
                        <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            <Shield size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-400 font-bold mb-2">No admins found</p>
                            <button onClick={() => openModal()} className="text-blue-600 text-sm font-bold hover:underline">Add your first admin</button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                        {visibleColumns.avatar && <th className="px-4 py-4">Avatar</th>}
                                        {visibleColumns.name && <th className="px-4 py-4">Name</th>}
                                        {visibleColumns.email && <th className="px-4 py-4">Email</th>}
                                        {visibleColumns.phone && <th className="px-4 py-4">Phone</th>}
                                        {visibleColumns.dateOfBirth && <th className="px-4 py-4">DOB</th>}
                                        {visibleColumns.address && <th className="px-4 py-4">Address</th>}
                                        {visibleColumns.city && <th className="px-4 py-4">City</th>}
                                        {visibleColumns.state && <th className="px-4 py-4">State</th>}
                                        {visibleColumns.pincode && <th className="px-4 py-4">Pincode</th>}
                                        {visibleColumns.aadhaarNumber && <th className="px-4 py-4">Aadhaar</th>}
                                        {visibleColumns.joiningDate && <th className="px-4 py-4">Joining Date</th>}
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
                                            {visibleColumns.avatar && (
                                                <td className="px-4 py-4">
                                                    {u.avatar ? (
                                                        <img src={u.avatar} alt={u.name || 'Avatar'} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                            {u.name?.charAt(0) || u.email?.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </td>
                                            )}
                                            {visibleColumns.name && <td className="px-4 py-4"><span className="font-bold text-gray-700">{u.name || '-'}</span></td>}
                                            {visibleColumns.email && <td className="px-4 py-4 text-gray-500 font-medium">{u.email}</td>}
                                            {visibleColumns.phone && <td className="px-4 py-4 text-gray-500 font-medium">{u.phone || '-'}</td>}
                                            {visibleColumns.dateOfBirth && <td className="px-4 py-4 text-gray-500 font-medium">{u.dateOfBirth || '-'}</td>}
                                            {visibleColumns.address && <td className="px-4 py-4 text-gray-500 font-medium">{u.address || '-'}</td>}
                                            {visibleColumns.city && <td className="px-4 py-4 text-gray-500 font-medium">{u.city || '-'}</td>}
                                            {visibleColumns.state && <td className="px-4 py-4 text-gray-500 font-medium">{u.state || '-'}</td>}
                                            {visibleColumns.pincode && <td className="px-4 py-4 text-gray-500 font-medium">{u.pincode || '-'}</td>}
                                            {visibleColumns.aadhaarNumber && <td className="px-4 py-4 text-gray-500 font-medium">{u.aadhaarNumber || '-'}</td>}
                                            {visibleColumns.joiningDate && <td className="px-4 py-4 text-gray-500 font-medium">{u.joiningDate || '-'}</td>}
                                            {visibleColumns.role && (
                                                <td className="px-4 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getRoleStyle(u.role)}`}>
                                                        {u.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
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
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => openModal(u)} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">Edit</button>
                                                    <button onClick={() => { setItemToDelete(u); setShowDeleteModal(true); }} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">Delete</button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Add/Edit Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
                            >
                                <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between z-10">
                                    <h3 className="text-xl font-black text-gray-900">
                                        {isEditMode ? 'Edit Admin' : 'Add New Admin'}
                                    </h3>
                                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    {/* Personal Information */}
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                            <Users size={16} /> Personal Information
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name *</label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="Enter full name"
                                                    required
                                                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-medium text-gray-900 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email *</label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="admin@example.com"
                                                    required
                                                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-medium text-gray-900 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    placeholder="+91 98765 43210"
                                                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-medium text-gray-900 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Date of Birth</label>
                                                <input
                                                    type="date"
                                                    value={formData.dateOfBirth || ''}
                                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-medium text-gray-900 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                            <MapPin size={16} /> Address
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="sm:col-span-2 space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Street Address</label>
                                                <input
                                                    type="text"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    placeholder="123 Main Street, Apt 4B"
                                                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-medium text-gray-900 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">City</label>
                                                <input
                                                    type="text"
                                                    value={formData.city}
                                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                    placeholder="Mumbai"
                                                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-medium text-gray-900 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">State</label>
                                                <input
                                                    type="text"
                                                    value={formData.state}
                                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                    placeholder="Maharashtra"
                                                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-medium text-gray-900 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pincode</label>
                                                <input
                                                    type="text"
                                                    value={formData.pincode}
                                                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                                    placeholder="400001"
                                                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-medium text-gray-900 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Documents & Employment */}
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                            <CreditCard size={16} /> Documents & Employment
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Aadhaar Number</label>
                                                <input
                                                    type="text"
                                                    value={formData.aadhaarNumber}
                                                    onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                                                    placeholder="XXXX XXXX XXXX"
                                                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-medium text-gray-900 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Joining Date</label>
                                                <input
                                                    type="date"
                                                    value={formData.joiningDate || ''}
                                                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                                                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-medium text-gray-900 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Account Settings */}
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                            <Shield size={16} /> Account Settings
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                    Password {isEditMode && '(leave blank to keep)'}
                                                </label>
                                                <input
                                                    type="password"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    placeholder="••••••••"
                                                    required={!isEditMode}
                                                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-medium text-gray-900 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Role *</label>
                                                <select
                                                    value={formData.role}
                                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-medium text-gray-900 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                >
                                                    {adminRoles.map(r => (
                                                        <option key={r.value} value={r.value}>{r.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {isEditMode && (
                                                <div className="sm:col-span-2 flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        id="isActive"
                                                        checked={formData.isActive}
                                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                        className="w-5 h-5 rounded"
                                                    />
                                                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active Account</label>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Permissions */}
                                    {formData.role === 'ADMIN' && (
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                    <Building size={16} /> Module Permissions
                                                </h4>
                                                <div className="flex gap-2">
                                                    <button type="button" onClick={selectAllPermissions} className="text-xs font-bold text-blue-600 hover:underline">Select All</button>
                                                    <span className="text-gray-300">|</span>
                                                    <button type="button" onClick={clearAllPermissions} className="text-xs font-bold text-gray-500 hover:underline">Clear All</button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-400 mb-4">Select which modules this admin can access</p>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {permissionModules.map(perm => (
                                                    <label
                                                        key={perm.id}
                                                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 ${(formData.permissions || []).includes(perm.id)
                                                            ? 'bg-blue-50 border-blue-200'
                                                            : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                                                            }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={(formData.permissions || []).includes(perm.id)}
                                                            onChange={() => togglePermission(perm.id)}
                                                            className="w-4 h-4 rounded"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700">{perm.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {formData.role === 'SUPER_ADMIN' && (
                                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                                            <p className="text-sm font-medium text-purple-700">
                                                <Shield size={16} className="inline mr-2" />
                                                Super Admins have access to all modules automatically.
                                            </p>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity shadow-lg"
                                    >
                                        {isEditMode ? 'Update Admin' : 'Create Admin'}
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
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
                            >
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <AlertTriangle size={32} className="text-red-600" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-2">Delete Admin?</h3>
                                    <p className="text-gray-500 mb-6">Are you sure you want to delete <strong>{itemToDelete?.name || itemToDelete?.email}</strong>? This action cannot be undone.</p>
                                    <div className="flex gap-3">
                                        <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                                        <button onClick={handleDelete} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors">Delete</button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Admin;
