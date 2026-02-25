import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Users, Clock, Calendar, MoreHorizontal, Trash2, Edit, Eye,
    Plus, Search, ChevronRight, Layers, FileText, X, Check, GraduationCap
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Mock Data (shown alongside real data) ──────────────────────────
const MOCK_COURSES = [
    { id: 'mock-1', name: 'B.Tech Computer Science', code: 'BTCS', duration: 4, type: 'Semester', fees: 125000, isMock: true },
    { id: 'mock-2', name: 'B.Tech Electronics', code: 'BTEC', duration: 4, type: 'Semester', fees: 115000, isMock: true },
    { id: 'mock-3', name: 'MBA Finance', code: 'MBAF', duration: 2, type: 'Semester', fees: 200000, isMock: true },
    { id: 'mock-4', name: 'BBA General', code: 'BBA', duration: 3, type: 'Yearly', fees: 85000, isMock: true },
    { id: 'mock-5', name: 'M.Sc Mathematics', code: 'MSCM', duration: 2, type: 'Semester', fees: 60000, isMock: true },
];

const MOCK_SUBJECTS = [
    { id: 'mock-s1', name: 'Data Structures', code: 'CS201', credits: 4, type: 'CORE', isMock: true },
    { id: 'mock-s2', name: 'Database Management', code: 'CS301', credits: 4, type: 'CORE', isMock: true },
    { id: 'mock-s3', name: 'Digital Electronics', code: 'EC201', credits: 3, type: 'CORE', isMock: true },
    { id: 'mock-s4', name: 'Machine Learning', code: 'CS401', credits: 3, type: 'ELECTIVE', isMock: true },
    { id: 'mock-s5', name: 'Physics Lab', code: 'PH101L', credits: 2, type: 'LAB', isMock: true },
];

const MOCK_DEPARTMENTS = [
    { id: 'mock-d1', name: 'Computer Science', code: 'CSE', headOfDepartment: 'Dr. Rajesh Kumar', isMock: true },
    { id: 'mock-d2', name: 'Electronics', code: 'ECE', headOfDepartment: 'Dr. Priya Sharma', isMock: true },
    { id: 'mock-d3', name: 'Management', code: 'MBA', headOfDepartment: 'Dr. Amit Singh', isMock: true },
    { id: 'mock-d4', name: 'Mathematics', code: 'MATH', headOfDepartment: 'Dr. Sneha Gupta', isMock: true },
];

// ─── Stat Card ──────────────────────────────────────────────────────
const StatCard = ({ title, count, icon: Icon, color, loading }) => (
    <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-sm border border-white/60 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={22} className="text-white" />
        </div>
        <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
            {loading ? (
                <div className="h-7 w-12 bg-gray-100 rounded animate-pulse mt-1" />
            ) : (
                <h3 className="text-xl font-black text-gray-900 mt-0.5">{count}</h3>
            )}
        </div>
    </div>
);

// ─── Add/Edit Modal ─────────────────────────────────────────────────
const Modal = ({ show, onClose, title, children }) => (
    <AnimatePresence>
        {show && (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={e => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                >
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <X size={18} className="text-gray-400" />
                        </button>
                    </div>
                    <div className="p-5">{children}</div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

// ─── Delete Confirmation ────────────────────────────────────────────
const DeleteModal = ({ show, onClose, onConfirm, itemName, loading }) => (
    <Modal show={show} onClose={onClose} title="Confirm Delete">
        <p className="text-gray-600 text-sm mb-6">
            Are you sure you want to delete <strong className="text-gray-900">{itemName}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
            <button onClick={onConfirm} disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50">
                {loading ? 'Deleting...' : 'Delete'}
            </button>
        </div>
    </Modal>
);

// ─── MAIN COMPONENT ─────────────────────────────────────────────────
const Academics = () => {
    const { user } = useSelector((state) => state.auth);
    const token = user?.token || localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const [searchParams] = useSearchParams();
    const tabFromUrl = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(() => tabFromUrl || localStorage.getItem('academicsTab') || 'courses');

    useEffect(() => {
        if (tabFromUrl && ['courses', 'subjects', 'departments'].includes(tabFromUrl)) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({});

    // ── Fetch Data ──────────────────────────────────────────────────
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/academic/all`, { headers });
            const real = res.data;

            // Merge real data with mock data (mock has isMock=true flag)
            const realCourseIds = (real.courses || []).map(c => c.code);
            const realSubjectIds = (real.subjects || []).map(s => s.code);
            const realDeptIds = (real.departments || []).map(d => d.code);

            setCourses([
                ...(real.courses || []).map(c => ({ ...c, isMock: false })),
                ...MOCK_COURSES.filter(m => !realCourseIds.includes(m.code)),
            ]);
            setSubjects([
                ...(real.subjects || []).map(s => ({ ...s, isMock: false })),
                ...MOCK_SUBJECTS.filter(m => !realSubjectIds.includes(m.code)),
            ]);
            setDepartments([
                ...(real.departments || []).map(d => ({ ...d, isMock: false })),
                ...MOCK_DEPARTMENTS.filter(m => !realDeptIds.includes(m.code)),
            ]);
        } catch (error) {
            console.error('Fetch error:', error);
            setCourses(MOCK_COURSES);
            setSubjects(MOCK_SUBJECTS);
            setDepartments(MOCK_DEPARTMENTS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // ── Create / Update ─────────────────────────────────────────────
    const openAddModal = (tab = activeTab) => {
        setEditingItem(null);
        if (tab === 'courses') setFormData({ name: '', code: '', duration: 4, type: 'Semester', fees: 0 });
        else if (tab === 'subjects') setFormData({ name: '', code: '', credits: 3, type: 'CORE' });
        else setFormData({ name: '', code: '', headOfDepartment: '' });
        setShowAddModal(true);
    };

    const openEditModal = (item) => {
        if (item.isMock) { toast.error('Sample data cannot be edited'); return; }
        setEditingItem(item);
        setFormData({ ...item });
        setShowAddModal(true);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.code) {
            toast.error('Name and Code are required');
            return;
        }
        setSaving(true);
        try {
            const endpoint = activeTab === 'courses' ? 'course' : activeTab === 'subjects' ? 'subject' : 'department';
            if (editingItem) {
                await axios.put(`${API_URL}/academic/${endpoint}/${editingItem.id}`, formData, { headers });
                toast.success(`${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)} updated!`);
            } else {
                await axios.post(`${API_URL}/academic/${endpoint}`, formData, { headers });
                toast.success(`${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)} created!`);
            }
            setShowAddModal(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    // ── Delete ──────────────────────────────────────────────────────
    const handleDelete = async () => {
        if (!deleteTarget) return;
        if (deleteTarget.isMock) {
            toast.error('Sample data cannot be deleted');
            setShowDeleteModal(false);
            return;
        }
        setSaving(true);
        try {
            const endpoint = activeTab === 'courses' ? 'course' : activeTab === 'subjects' ? 'subject' : 'department';
            await axios.delete(`${API_URL}/academic/${endpoint}/${deleteTarget.id}`, { headers });
            toast.success('Deleted successfully!');
            setShowDeleteModal(false);
            setDeleteTarget(null);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete');
        } finally {
            setSaving(false);
        }
    };

    // ── Filter ──────────────────────────────────────────────────────
    const getFilteredData = () => {
        const term = searchTerm.toLowerCase();
        if (activeTab === 'courses') return courses.filter(c => c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term));
        if (activeTab === 'subjects') return subjects.filter(s => s.name.toLowerCase().includes(term) || s.code.toLowerCase().includes(term));
        return departments.filter(d => d.name.toLowerCase().includes(term) || d.code.toLowerCase().includes(term));
    };

    const filtered = getFilteredData();
    const tabLabel = activeTab === 'courses' ? 'Course' : activeTab === 'subjects' ? 'Subject' : 'Department';

    return (
        <div className="space-y-6 pb-20 lg:pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Academics & Curriculum</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage courses, subjects, and departments.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => openAddModal()}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 self-start"
                >
                    <Plus size={18} /> Add New {tabLabel}
                </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Total Courses" count={courses.length} icon={Layers} color="bg-indigo-500" loading={loading} />
                <StatCard title="Active Subjects" count={subjects.length} icon={BookOpen} color="bg-rose-500" loading={loading} />
                <StatCard title="Departments" count={departments.length} icon={GraduationCap} color="bg-emerald-500" loading={loading} />
                <StatCard title="Faculty Members" count={departments.reduce((s, d) => s + (d.headOfDepartment ? 1 : 0), 0) || '—'} icon={Users} color="bg-amber-500" loading={loading} />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                {[{ key: 'courses', label: 'Courses' }, { key: 'subjects', label: 'Subjects' }, { key: 'departments', label: 'Departments' }].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => { setActiveTab(tab.key); setSearchTerm(''); localStorage.setItem('academicsTab', tab.key); }}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === tab.key
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/60 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                        />
                    </div>
                    <span className="text-xs text-gray-500 font-bold">
                        <span className="text-gray-900 font-black">{filtered.length}</span> {activeTab} found
                    </span>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="p-6 space-y-3">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center">
                        <BookOpen size={48} className="mx-auto mb-4 text-gray-200" />
                        <h3 className="font-bold text-gray-600">No {activeTab} found</h3>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your search or add a new {tabLabel.toLowerCase()}.</p>
                        <button onClick={() => openAddModal()} className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors">
                            <Plus size={14} className="inline mr-1" /> Add {tabLabel}
                        </button>
                    </div>
                ) : (
                    <>
                        {/* ─── COURSES TABLE ─────────────────────── */}
                        {activeTab === 'courses' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50/80 border-b border-gray-100">
                                            <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Course</th>
                                            <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Code</th>
                                            <th className="text-center px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Duration</th>
                                            <th className="text-center px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Type</th>
                                            <th className="text-right px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Fees</th>
                                            <th className="text-right px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-24">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filtered.map(course => (
                                            <tr key={course.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                                                            <GraduationCap size={18} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-gray-900 text-sm truncate">{course.name}</p>
                                                            <p className="text-xs text-gray-400 sm:hidden">{course.code}</p>
                                                            {course.isMock && <span className="text-[9px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded font-bold">SAMPLE</span>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 hidden sm:table-cell">
                                                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{course.code}</span>
                                                </td>
                                                <td className="px-5 py-4 text-center hidden md:table-cell">
                                                    <span className="text-gray-700 font-medium">{course.duration} {course.type === 'Semester' ? 'Yrs' : 'Yrs'}</span>
                                                </td>
                                                <td className="px-5 py-4 text-center hidden md:table-cell">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${course.type === 'Semester' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                        {course.type}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right hidden lg:table-cell">
                                                    <span className="font-bold text-gray-800">₹{Number(course.fees || 0).toLocaleString('en-IN')}</span>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => openEditModal(course)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                            <Edit size={15} />
                                                        </button>
                                                        <button onClick={() => { setDeleteTarget(course); setShowDeleteModal(true); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* ─── SUBJECTS TABLE ────────────────────── */}
                        {activeTab === 'subjects' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50/80 border-b border-gray-100">
                                            <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Subject</th>
                                            <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Code</th>
                                            <th className="text-center px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Credits</th>
                                            <th className="text-center px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</th>
                                            <th className="text-right px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-24">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filtered.map(sub => (
                                            <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                                                            <BookOpen size={18} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-gray-900 text-sm truncate">{sub.name}</p>
                                                            <p className="text-xs text-gray-400 sm:hidden">{sub.code}</p>
                                                            {sub.isMock && <span className="text-[9px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded font-bold">SAMPLE</span>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 hidden sm:table-cell">
                                                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{sub.code}</span>
                                                </td>
                                                <td className="px-5 py-4 text-center hidden md:table-cell">
                                                    <span className="font-bold text-gray-700">{sub.credits}</span>
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${sub.type === 'CORE' ? 'bg-blue-50 text-blue-600' :
                                                            sub.type === 'ELECTIVE' ? 'bg-violet-50 text-violet-600' :
                                                                'bg-emerald-50 text-emerald-600'
                                                        }`}>
                                                        {sub.type}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => openEditModal(sub)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                            <Edit size={15} />
                                                        </button>
                                                        <button onClick={() => { setDeleteTarget(sub); setShowDeleteModal(true); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* ─── DEPARTMENTS TABLE ─────────────────── */}
                        {activeTab === 'departments' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50/80 border-b border-gray-100">
                                            <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Department</th>
                                            <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Code</th>
                                            <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Head of Department</th>
                                            <th className="text-right px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-24">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filtered.map(dept => (
                                            <tr key={dept.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                                            <Layers size={18} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-gray-900 text-sm truncate">{dept.name}</p>
                                                            <p className="text-xs text-gray-400 sm:hidden">{dept.code}</p>
                                                            {dept.isMock && <span className="text-[9px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded font-bold">SAMPLE</span>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 hidden sm:table-cell">
                                                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{dept.code}</span>
                                                </td>
                                                <td className="px-5 py-4 hidden md:table-cell">
                                                    <span className="text-gray-700 font-medium">{dept.headOfDepartment || '—'}</span>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => openEditModal(dept)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                            <Edit size={15} />
                                                        </button>
                                                        <button onClick={() => { setDeleteTarget(dept); setShowDeleteModal(true); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ─── ADD / EDIT MODAL ───────────────────────────────── */}
            <Modal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                title={editingItem ? `Edit ${tabLabel}` : `Add New ${tabLabel}`}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Name *</label>
                        <input
                            type="text" placeholder={`Enter ${tabLabel.toLowerCase()} name`}
                            value={formData.name || ''}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Code *</label>
                        <input
                            type="text" placeholder={`e.g. ${activeTab === 'courses' ? 'BTCS' : activeTab === 'subjects' ? 'CS201' : 'CSE'}`}
                            value={formData.code || ''}
                            onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 font-mono"
                        />
                    </div>

                    {activeTab === 'courses' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Duration (Years)</label>
                                    <input
                                        type="number" min="1" max="6"
                                        value={formData.duration || 4}
                                        onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Type</label>
                                    <select
                                        value={formData.type || 'Semester'}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                                    >
                                        <option value="Semester">Semester</option>
                                        <option value="Yearly">Yearly</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Annual Fees (₹)</label>
                                <input
                                    type="number" min="0"
                                    value={formData.fees || 0}
                                    onChange={e => setFormData({ ...formData, fees: parseFloat(e.target.value) })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                                />
                            </div>
                        </>
                    )}

                    {activeTab === 'subjects' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Credits</label>
                                <input
                                    type="number" min="1" max="6"
                                    value={formData.credits || 3}
                                    onChange={e => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Type</label>
                                <select
                                    value={formData.type || 'CORE'}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                                >
                                    <option value="CORE">Core</option>
                                    <option value="ELECTIVE">Elective</option>
                                    <option value="LAB">Lab</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {activeTab === 'departments' && (
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Head of Department</label>
                            <input
                                type="text" placeholder="e.g. Dr. Rajesh Kumar"
                                value={formData.headOfDepartment || ''}
                                onChange={e => setFormData({ ...formData, headOfDepartment: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                            />
                        </div>
                    )}

                    <div className="flex gap-3 justify-end pt-2">
                        <button onClick={() => setShowAddModal(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2">
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            {saving ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <DeleteModal
                show={showDeleteModal}
                onClose={() => { setShowDeleteModal(false); setDeleteTarget(null); }}
                onConfirm={handleDelete}
                itemName={deleteTarget?.name || ''}
                loading={saving}
            />
        </div>
    );
};

// Loader2 icon for saving state
const Loader2Icon = ({ size = 14, className = '' }) => (
    <svg className={`animate-spin ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

export default Academics;
