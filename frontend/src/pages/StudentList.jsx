import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ExportDropdown from '../components/ExportDropdown';
import ImportModal from '../components/ImportModal';
import {
    Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2,
    Download, Upload, SlidersHorizontal, Columns3, X, Check, ChevronDown, Sparkles
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StudentList = () => {
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearchInput, setShowSearchInput] = useState(false);

    // Modals
    const [showImportModal, setShowImportModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);

    // Filters & Visibility
    const [filterDept, setFilterDept] = useState('');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState({
        scNumber: true,
        name: true,
        enrollment: true,
        dept: true,
        semester: true,
        status: true,
        actions: true
    });
    const [showColumnDropdown, setShowColumnDropdown] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/students`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!studentToDelete) return;
        try {
            await axios.delete(`${API_URL}/students/${studentToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Student deleted successfully');
            setStudents(students.filter(s => s.id !== studentToDelete.id));
            setShowDeleteModal(false);
        } catch (error) {
            toast.error('Failed to delete student');
        }
    };

    const getFilteredData = () => {
        return students.filter(student => {
            const matchesSearch = !searchTerm ||
                student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.enrollmentNo?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesDept = !filterDept || student.department === filterDept;

            return matchesSearch && matchesDept;
        });
    };

    // Helper for Avatar Color
    const getAvatarColor = (name) => {
        const colors = ['bg-red-100 text-red-600', 'bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-600', 'bg-amber-100 text-amber-600', 'bg-pink-100 text-pink-600'];
        const index = name.length % colors.length;
        return colors[index];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="Student Management"
                    subtitle="Manage student profiles, enrollments, and academic records"
                />

                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-sm p-6 sm:p-8">
                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <h2 className="text-xl font-black text-gray-900">
                            Students <span className="text-gray-400 font-medium">({getFilteredData().length})</span>
                        </h2>

                        <div className="flex items-center gap-2 justify-end flex-wrap">
                            {/* Search */}
                            {showSearchInput && (
                                <motion.input
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 200, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                    className="px-4 py-2.5 bg-gray-100 rounded-full text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
                                />
                            )}
                            <motion.button
                                onClick={() => { setShowSearchInput(!showSearchInput); if (showSearchInput) setSearchTerm(''); }}
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${showSearchInput ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                            >
                                {showSearchInput ? <X size={18} /> : <Search size={18} />}
                            </motion.button>

                            {/* Filter */}
                            <div className="relative">
                                <motion.button
                                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${filterDept ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    <Filter size={18} />
                                </motion.button>
                                <AnimatePresence>
                                    {showFilterDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-12 right-0 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-20"
                                        >
                                            <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Filter by Department</div>
                                            {['Computer Science', 'Mechanical', 'Civil', 'Electrical'].map(dept => (
                                                <button
                                                    key={dept}
                                                    onClick={() => { setFilterDept(dept === filterDept ? '' : dept); setShowFilterDropdown(false); }}
                                                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${filterDept === dept ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'}`}
                                                >
                                                    {dept}
                                                    {filterDept === dept && <Check size={14} />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Columns */}
                            <div className="relative">
                                <motion.button
                                    onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200"
                                >
                                    <Columns3 size={18} />
                                </motion.button>
                                <AnimatePresence>
                                    {showColumnDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-12 right-0 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-20"
                                        >
                                            <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Visible Columns</div>
                                            {Object.keys(visibleColumns).map(key => (
                                                <button
                                                    key={key}
                                                    onClick={() => setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }))}
                                                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-between hover:bg-gray-50 text-gray-700"
                                                >
                                                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                    {visibleColumns[key] && <Check size={14} className="text-blue-600" />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Import Button (Emerald Circular) */}
                            <motion.button
                                onClick={() => setShowImportModal(true)}
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-200 transition-all"
                                title="Import Students"
                            >
                                <Upload size={18} />
                            </motion.button>

                            {/* Export Button (Circular via Prop) */}
                            <ExportDropdown
                                data={getFilteredData()}
                                columns={[
                                    { header: 'Name', key: 'firstName' },
                                    { header: 'Last Name', key: 'lastName' },
                                    { header: 'Enrollment', key: 'enrollmentNo' },
                                    { header: 'Department', key: 'department' },
                                    { header: 'Email', key: 'email' },
                                ]}
                                filename="Students_List"
                                circular={true}
                            />

                            {/* Add Button (Circular Gradient) */}
                            <motion.button
                                onClick={() => navigate('/dashboard/students/add')}
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                                title="Add New Student"
                            >
                                <Plus size={20} />
                            </motion.button>
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : getFilteredData().length === 0 ? (
                        <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <Search size={24} />
                            </div>
                            <p className="text-gray-400 font-bold mb-2">No students found</p>
                            <button onClick={() => navigate('/dashboard/students/add')} className="text-blue-600 text-sm font-bold hover:underline">Add your first student</button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                        <th className="px-4 py-4">#</th>
                                        {visibleColumns.name && <th className="px-4 py-4">Student Name</th>}
                                        {visibleColumns.enrollment && <th className="px-4 py-4">Enrollment</th>}
                                        {visibleColumns.dept && <th className="px-4 py-4">Department</th>}
                                        {visibleColumns.semester && <th className="px-4 py-4">Sem</th>}
                                        {visibleColumns.status && <th className="px-4 py-4">Status</th>}
                                        {visibleColumns.actions && <th className="px-4 py-4 text-right">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {getFilteredData().map((student, index) => (
                                        <motion.tr
                                            key={student.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-blue-50/50 transition-colors group"
                                        >
                                            <td className="px-4 py-4 text-sm font-medium text-gray-400">{index + 1}</td>

                                            {visibleColumns.name && (
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {/* Avatar Logic matching Admin */}
                                                        {student.avatar ? (
                                                            <img src={student.avatar} alt={student.firstName} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                                                        ) : (
                                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm border-2 border-white">
                                                                {student.firstName?.[0]}{student.lastName?.[0]}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-bold text-gray-900">{student.firstName} {student.lastName}</div>
                                                            <div className="text-xs text-gray-500">{student.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                            )}

                                            {visibleColumns.enrollment && (
                                                <td className="px-4 py-4">
                                                    <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-mono font-bold text-gray-600">
                                                        {student.enrollmentNo}
                                                    </span>
                                                </td>
                                            )}

                                            {visibleColumns.dept && (
                                                <td className="px-4 py-4 text-sm font-bold text-gray-600">{student.department || '-'}</td>
                                            )}

                                            {visibleColumns.semester && (
                                                <td className="px-4 py-4 text-sm font-bold text-gray-600">
                                                    <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-black">
                                                        {student.currentSemester}
                                                    </span>
                                                </td>
                                            )}

                                            {visibleColumns.status && (
                                                <td className="px-4 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${student.applicationStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' :
                                                        student.applicationStatus === 'REJECTED' ? 'bg-red-100 text-red-600' :
                                                            'bg-amber-100 text-amber-600'
                                                        }`}>
                                                        {student.applicationStatus || 'PENDING'}
                                                    </span>
                                                </td>
                                            )}

                                            {visibleColumns.actions && (
                                                <td className="px-4 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <motion.button onClick={() => navigate(`/dashboard/students/view/${student.id}`)} whileHover={{ scale: 1.1 }} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100" title="View Student">
                                                            <Eye size={16} />
                                                        </motion.button>
                                                        <motion.button onClick={() => navigate(`/dashboard/students/edit/${student.id}`)} whileHover={{ scale: 1.1 }} className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100" title="Edit Student">
                                                            <Edit size={16} />
                                                        </motion.button>
                                                        <motion.button
                                                            onClick={() => { setStudentToDelete(student); setShowDeleteModal(true); }}
                                                            whileHover={{ scale: 1.1 }}
                                                            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"
                                                        >
                                                            <Trash2 size={16} />
                                                        </motion.button>
                                                    </div>
                                                </td>
                                            )}
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <ImportModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                category="students"
                token={token}
                onSuccess={() => { fetchStudents(); setShowImportModal(false); }}
            />

            {/* Delete Modal - Matching Admin Trash Design */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteModal(false)} className="absolute inset-0 bg-red-900/20 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full relative z-10 shadow-2xl text-center border border-red-50 overflow-hidden">
                            {/* Decorative Background Blobs */}
                            <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-50"></div>

                            <div className="relative w-24 h-24 mx-auto mb-6">
                                <div className="w-full h-full bg-red-50 rounded-full flex items-center justify-center border-4 border-red-100 relative z-10">
                                    <Trash2 size={40} className="text-red-500" strokeWidth={2.5} />
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 mb-2">Delete Student?</h3>
                            <p className="text-gray-500 font-medium mb-8">Are you sure you want to delete <span className="font-bold text-gray-900">{studentToDelete?.firstName}</span>? This action cannot be undone.</p>

                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setShowDeleteModal(false)} className="py-4 bg-gray-50 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-colors">Cancel</button>
                                <button onClick={handleDelete} className="py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-red-500/30 transition-all">Delete</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentList;
