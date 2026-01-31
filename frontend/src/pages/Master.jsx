import { useState, useEffect } from 'react';
import { BookOpen, FolderPlus, Layers, Plus, ArrowRight, ArrowLeft, X, ChevronDown, Check, Sparkles, Trash2, AlertTriangle, Upload, Download, FileSpreadsheet, Search, SlidersHorizontal, Columns3, Eye, EyeOff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMasterData, createCourse, deleteCourse, createSubject, createDepartment, updateCourse, updateSubject, updateDepartment } from '../redux/features/masterSlice';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ExportDropdown from '../components/ExportDropdown';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


const CustomSelect = ({ label, options, value, onChange, placeholder, name }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="space-y-2 relative">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-gray-900 flex justify-between items-center focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-left"
                >
                    <span className={!selectedOption ? "text-gray-400" : ""}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-60 overflow-y-auto"
                        >
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        onChange({ target: { name, value: opt.value } });
                                        setIsOpen(false);
                                    }}
                                    className="w-full p-4 text-left font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex justify-between items-center transition-colors"
                                >
                                    {opt.label}
                                    {value === opt.value && <Check size={16} className="text-blue-600" />}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

    );
};

const SuccessModal = ({ isOpen, onClose, message }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
                ></motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotateX: 180 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotateX: 180 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="relative bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-sm w-full text-center overflow-hidden"
                >
                    {/* Decorative Background Blobs */}
                    <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-60"></div>
                    <div className="absolute bottom-[-50px] left-[-50px] w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-60"></div>

                    <div className="relative w-28 h-28 mx-auto mb-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-full h-full bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-green-200 relative z-10"
                        >
                            <Check size={48} className="text-white drop-shadow-md" strokeWidth={3} />
                        </motion.div>

                        {/* Pulsing Rings */}
                        <motion.div
                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                            className="absolute inset-0 bg-green-400/30 rounded-full -z-10"
                        ></motion.div>

                        {/* Floating Sparkle Badge */}
                        <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.5, type: "spring" }}
                            className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 border-4 border-white shadow-lg z-20"
                        >
                            <Sparkles size={16} className="text-white fill-white" />
                        </motion.div>
                    </div>

                    <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Awesome!</h3>
                    <p className="text-gray-500 font-medium mb-8 leading-relaxed">{message}</p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-gray-900/20 hover:shadow-2xl transition-all"
                    >
                        Continue
                    </motion.button>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

const DeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-red-900/20 backdrop-blur-md"
                ></motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 50 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="relative bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-sm w-full text-center overflow-hidden border border-red-50"
                >
                    <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-50"></div>

                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <motion.div
                            initial={{ rotate: -180, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ delay: 0.1, type: "spring" }}
                            className="w-full h-full bg-red-50 rounded-full flex items-center justify-center border-4 border-red-100 relative z-10"
                        >
                            <Trash2 size={40} className="text-red-500" strokeWidth={2.5} />
                        </motion.div>
                        <motion.div
                            animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                            className="absolute inset-0 bg-red-100 rounded-full -z-10"
                        ></motion.div>
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 mb-3">{title}</h3>
                    <p className="text-gray-500 font-medium mb-8 leading-relaxed">{message}</p>

                    <div className="grid grid-cols-2 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: "#f3f4f6" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            className="py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold transition-colors"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 20px -5px rgba(239, 68, 68, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onConfirm}
                            className="py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl font-bold shadow-lg shadow-red-500/30 transition-all"
                        >
                            Confirm Delete
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

// Import Modal Component
const ImportModal = ({ isOpen, onClose, category, token, onSuccess }) => {
    const [step, setStep] = useState(1); // 1: Upload, 2: Preview
    const [previewData, setPreviewData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleDownloadTemplate = async () => {
        try {
            const response = await axios.get(`${API_URL}/import/template/${category}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${category}_template.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Template downloaded!');
        } catch (error) {
            toast.error('Failed to download template');
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const response = await axios.post(`${API_URL}/import/parse/${category}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setPreviewData(response.data.data);
            setColumns(response.data.columns);
            setStep(2);
            toast.success(`${response.data.data.length} rows parsed!`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to parse file');
        } finally {
            setUploading(false);
        }
    };

    const handleCellChange = (rowIndex, column, value) => {
        const updated = [...previewData];
        updated[rowIndex][column] = value;
        setPreviewData(updated);
    };

    const handleDeleteRow = (index) => {
        setPreviewData(previewData.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (previewData.length === 0) {
            toast.error('No data to save');
            return;
        }

        setSaving(true);
        try {
            const response = await axios.post(`${API_URL}/import/bulk/${category}`,
                { data: previewData },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(response.data.message);
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to import data');
        } finally {
            setSaving(false);
        }
    };

    const resetModal = () => {
        setStep(1);
        setPreviewData([]);
        setColumns([]);
    };

    useEffect(() => {
        if (!isOpen) resetModal();
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <FileSpreadsheet className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Import {category.charAt(0).toUpperCase() + category.slice(1)}s</h2>
                            <p className="text-sm text-gray-500">Step {step} of 2</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/80 rounded-xl transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {step === 1 && (
                        <div className="text-center py-8 space-y-6">
                            <div className="w-20 h-20 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center">
                                <Upload size={36} className="text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Upload Excel File</h3>
                                <p className="text-gray-500 text-sm max-w-md mx-auto">
                                    Download the template, fill in your data, then upload the completed file.
                                </p>
                            </div>

                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={handleDownloadTemplate}
                                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold flex items-center gap-2 transition-colors"
                                >
                                    <Download size={18} /> Download Template
                                </button>
                                <label className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 cursor-pointer transition-colors">
                                    <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload Excel'}
                                    <input type="file" hidden accept=".xlsx,.xls" onChange={handleFileUpload} disabled={uploading} />
                                </label>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 font-medium">
                                    {previewData.length} rows to import
                                </span>
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                                >
                                    <ArrowLeft size={14} /> Choose Different File
                                </button>
                            </div>

                            <div className="border border-gray-200 rounded-xl overflow-x-auto">
                                <table className="w-full text-sm min-w-[600px]">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {columns.map(col => (
                                                <th key={col} className="px-4 py-3 text-left font-bold text-gray-600 uppercase tracking-wider text-xs min-w-[150px]">
                                                    {col}
                                                </th>
                                            ))}
                                            <th className="px-4 py-3 text-right font-bold text-gray-600 uppercase tracking-wider text-xs w-[80px]">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {previewData.map((row, rowIndex) => (
                                            <tr key={rowIndex} className="hover:bg-gray-50">
                                                {columns.map(col => (
                                                    <td key={col} className="px-4 py-2 min-w-[150px]">
                                                        <input
                                                            type="text"
                                                            value={row[col] || ''}
                                                            onChange={(e) => handleCellChange(rowIndex, col, e.target.value)}
                                                            className="w-full min-w-[120px] px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all text-sm"
                                                        />
                                                    </td>
                                                ))}
                                                <td className="px-4 py-2 text-right w-[80px]">
                                                    <button
                                                        onClick={() => handleDeleteRow(rowIndex)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {step === 2 && (
                    <div className="p-6 border-t border-gray-100 flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || previewData.length === 0}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-green-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : <><Check size={18} /> Save {previewData.length} Records</>}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

const MasterData = () => {
    const dispatch = useDispatch();
    const { courses, subjects, departments, isLoading } = useSelector((state) => state.master);
    const { token } = useSelector((state) => state.auth);
    const [view, setView] = useState('grid'); // grid, courses, subjects, departments

    // Import Modal State
    const [showImportModal, setShowImportModal] = useState(false);
    const [importCategory, setImportCategory] = useState('department');

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null); // 'course', 'subject', 'department'
    const [formData, setFormData] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);

    // Confirmation & Success States
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState(null);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Search and Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showColumnDropdown, setShowColumnDropdown] = useState(false);
    const [filterField, setFilterField] = useState('');
    const [filterValue, setFilterValue] = useState('');

    // Column visibility state for each type
    const [visibleColumns, setVisibleColumns] = useState({
        departments: { name: true, code: true },
        courses: { name: true, code: true, department: true, fees: true },
        subjects: { name: true, code: true, course: true }
    });

    // Get filtered data based on search and filter
    const getFilteredData = (data, type) => {
        let filtered = data;

        // Apply search
        if (searchQuery) {
            filtered = filtered.filter(item =>
                item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.code?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply filter
        if (filterField && filterValue) {
            filtered = filtered.filter(item => {
                const value = item[filterField];
                return value?.toString().toLowerCase().includes(filterValue.toLowerCase());
            });
        }

        return filtered;
    };

    useEffect(() => {
        dispatch(getAllMasterData());
    }, [dispatch]);

    // Open Modal
    const openModal = (type, item = null) => {
        setModalType(type);
        if (item) {
            setIsEditMode(true);
            setFormData(item);
        } else {
            setIsEditMode(false);
            setFormData({});
        }
        setShowModal(true);
    };

    // Handle Form Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        let res;

        try {
            if (modalType === 'course') {
                res = isEditMode ? await dispatch(updateCourse({ id: formData.id, data: formData })) : await dispatch(createCourse(formData));
            } else if (modalType === 'subject') {
                res = isEditMode ? await dispatch(updateSubject({ id: formData.id, data: formData })) : await dispatch(createSubject(formData));
            } else if (modalType === 'department') {
                res = isEditMode ? await dispatch(updateDepartment({ id: formData.id, data: formData })) : await dispatch(createDepartment(formData));
            }

            if (res && !res.error) {
                setSuccessMessage(`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} ${isEditMode ? 'Updated' : 'Created'} Successfully!`);
                setShowSuccessModal(true);
                setShowModal(false);
            } else {
                toast.error(res?.payload || 'An error occurred');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const confirmDelete = async () => {
        if (deleteType === 'courses') {
            await dispatch(deleteCourse(itemToDelete.id));
            setSuccessMessage('Course Deleted Successfully');
            setShowSuccessModal(true);
        } else {
            toast.error('Delete not implemented for this type yet');
        }
        setShowDeleteModal(false);
    };

    const modules = [
        { id: 'departments', title: 'Departments', description: 'School Departments', icon: FolderPlus, color: 'text-purple-600', bg: 'bg-purple-50', count: departments?.length || 0 },
        { id: 'courses', title: 'Courses', description: 'Manage Academic Courses', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', count: courses?.length || 0 },
        { id: 'subjects', title: 'Subjects', description: 'Manage Subjects & Topics', icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50', count: subjects?.length || 0 },
    ];

    const renderGridView = () => (
        <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            {modules.map((mod, index) => (
                <motion.div
                    key={mod.id}
                    layoutId={mod.id}
                    onClick={() => setView(mod.id)}
                    whileHover={{ y: -5, boxShadow: "0 20px 40px -5px rgba(0,0,0,0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
                    className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/60 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] cursor-pointer group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="flex justify-between items-start mb-6">
                        <div className={`w-16 h-16 rounded-2xl ${mod.bg} ${mod.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm relative z-10`}>
                            <mod.icon size={28} strokeWidth={2.5} />
                        </div>
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{mod.count} Items</span>
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-gray-900 mb-2">{mod.title}</h3>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">{mod.description}</p>
                        <motion.div
                            className="mt-6 flex items-center text-sm font-bold text-gray-400 group-hover:text-blue-600 transition-colors"
                        >
                            Manage <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                        </motion.div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );

    const renderListView = (type) => {
        const data = type === 'courses' ? courses : type === 'subjects' ? subjects : departments;

        return (
            <motion.div
                key="list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-sm p-8 min-h-[400px]"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <motion.button
                            onClick={() => setView('grid')}
                            whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </motion.button>
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 capitalize">{type} List</h2>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                        {/* Search Input - Always visible when active, no animation */}
                        {showSearchInput && (
                            <input
                                type="text"
                                placeholder="Search by name or code..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                className="w-36 sm:w-48 px-4 py-2.5 bg-gray-100 rounded-full text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
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
                            title="Search"
                        >
                            {showSearchInput ? <X size={18} /> : <Search size={18} />}
                        </motion.button>

                        {/* Filter Button + Dropdown */}
                        <div className="relative">
                            <motion.button
                                onClick={() => {
                                    setShowFilterDropdown(!showFilterDropdown);
                                    setShowColumnDropdown(false);
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${(showFilterDropdown || filterField) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                title="Filter"
                            >
                                <SlidersHorizontal size={18} />
                            </motion.button>
                            <AnimatePresence>
                                {showFilterDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="fixed inset-x-4 sm:inset-auto sm:absolute sm:right-0 top-24 sm:top-auto sm:mt-2 w-auto sm:w-72 max-w-sm mx-auto sm:mx-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-[100]"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-sm font-bold text-gray-900">Advanced Filters</p>
                                            <button onClick={() => setShowFilterDropdown(false)} className="text-gray-400 hover:text-gray-600">
                                                <X size={16} />
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Field</label>
                                                <select
                                                    value={filterField}
                                                    onChange={(e) => setFilterField(e.target.value)}
                                                    className="w-full p-3 bg-gray-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
                                                >
                                                    <option value="">Select Field</option>
                                                    <option value="name">Name</option>
                                                    <option value="code">Code</option>
                                                    {type === 'courses' && <option value="fees">Fees</option>}
                                                    {type === 'courses' && <option value="DepartmentId">Department</option>}
                                                    {type === 'subjects' && <option value="CourseId">Course</option>}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Contains</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter value..."
                                                    value={filterValue}
                                                    onChange={(e) => setFilterValue(e.target.value)}
                                                    className="w-full p-3 bg-gray-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={() => setShowFilterDropdown(false)}
                                                className="flex-1 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700"
                                            >
                                                Apply
                                            </button>
                                            {filterField && (
                                                <button
                                                    onClick={() => { setFilterField(''); setFilterValue(''); }}
                                                    className="px-4 py-2.5 text-sm font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Column Visibility Button + Dropdown */}
                        <div className="relative">
                            <motion.button
                                onClick={() => {
                                    setShowColumnDropdown(!showColumnDropdown);
                                    setShowFilterDropdown(false);
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${showColumnDropdown ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                title="Show/Hide Columns"
                            >
                                <Columns3 size={18} />
                            </motion.button>
                            <AnimatePresence>
                                {showColumnDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="fixed inset-x-4 sm:inset-auto sm:absolute sm:right-0 top-24 sm:top-auto sm:mt-2 w-auto sm:w-56 max-w-sm mx-auto sm:mx-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100]"
                                    >
                                        <div className="flex items-center justify-between p-3 border-b border-gray-100">
                                            <p className="text-sm font-bold text-gray-900">Show Columns</p>
                                            <button onClick={() => setShowColumnDropdown(false)} className="text-gray-400 hover:text-gray-600">
                                                <X size={16} />
                                            </button>
                                        </div>
                                        {Object.keys(visibleColumns[type] || {}).map((col) => (
                                            <button
                                                key={col}
                                                onClick={() => setVisibleColumns(prev => ({
                                                    ...prev,
                                                    [type]: { ...prev[type], [col]: !prev[type][col] }
                                                }))}
                                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                            >
                                                <span className="text-sm font-medium text-gray-700 capitalize">{col}</span>
                                                {visibleColumns[type]?.[col] ? (
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

                        {/* Import Button */}
                        <motion.button
                            onClick={() => {
                                setImportCategory(type.slice(0, -1));
                                setShowImportModal(true);
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-200 transition-all"
                            title={`Import ${type} from Excel`}
                        >
                            <Upload size={18} />
                        </motion.button>

                        {/* Export Button */}
                        <ExportDropdown
                            data={getFilteredData(data, type).map(item => ({
                                ...item,
                                departmentName: type === 'courses' ? (departments.find(d => d.id === item.DepartmentId)?.name || '-') : undefined,
                                courseName: type === 'subjects' ? (courses.find(c => c.id === item.CourseId)?.name || '-') : undefined
                            }))}
                            filename={type}
                            title={`${type.charAt(0).toUpperCase() + type.slice(1)} List`}
                            columns={
                                type === 'courses'
                                    ? [
                                        visibleColumns.courses.name && { key: 'name', header: 'Name' },
                                        visibleColumns.courses.code && { key: 'code', header: 'Code' },
                                        visibleColumns.courses.department && { key: 'departmentName', header: 'Department' },
                                        visibleColumns.courses.fees && { key: 'fees', header: 'Fees (₹)' }
                                    ].filter(Boolean)
                                    : type === 'subjects'
                                        ? [
                                            visibleColumns.subjects.name && { key: 'name', header: 'Name' },
                                            visibleColumns.subjects.code && { key: 'code', header: 'Code' },
                                            visibleColumns.subjects.course && { key: 'courseName', header: 'Course' }
                                        ].filter(Boolean)
                                        : [
                                            visibleColumns.departments.name && { key: 'name', header: 'Name' },
                                            visibleColumns.departments.code && { key: 'code', header: 'Code' }
                                        ].filter(Boolean)
                            }
                            circular={true}
                        />

                        {/* Add Button */}
                        <motion.button
                            onClick={() => openModal(type.slice(0, -1))}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 bg-gray-900 text-white rounded-full shadow-lg shadow-gray-900/20 flex items-center justify-center transition-all"
                            title={`Create New ${type.slice(0, -1)}`}
                        >
                            <Plus size={20} />
                        </motion.button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-20 text-gray-400 font-bold">Loading Data...</div>
                ) : data.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold mb-2">No {type} found</p>
                        <button onClick={() => openModal(type.slice(0, -1))} className="text-blue-600 text-sm font-bold hover:underline">Create your first {type.slice(0, -1)}</button>
                    </div>
                ) : getFilteredData(data, type).length === 0 ? (
                    <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold mb-2">No results found</p>
                        <button onClick={() => { setSearchQuery(''); setFilterField(''); setFilterValue(''); }} className="text-blue-600 text-sm font-bold hover:underline">Clear filters</button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                    {visibleColumns[type]?.name && <th className="px-6 py-4">Name</th>}
                                    {type === 'courses' && visibleColumns.courses?.department && <th className="px-6 py-4 whitespace-nowrap">Department</th>}
                                    {type === 'courses' && visibleColumns.courses?.fees && <th className="px-6 py-4 whitespace-nowrap">Fees (₹)</th>}
                                    {type === 'subjects' && visibleColumns.subjects?.course && <th className="px-6 py-4 whitespace-nowrap">Course</th>}
                                    {visibleColumns[type]?.code && <th className="px-6 py-4 whitespace-nowrap">Code</th>}
                                    <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {getFilteredData(data, type).map((item, index) => (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-blue-50/50 transition-colors group"
                                    >
                                        {visibleColumns[type]?.name && <td className="px-6 py-5 font-bold text-gray-700 leading-relaxed">{item.name}</td>}
                                        {/* Show Department Column for Courses */}
                                        {type === 'courses' && visibleColumns.courses?.department && (
                                            <td className="px-6 py-5 font-medium text-gray-500 whitespace-nowrap">
                                                {departments.find(d => d.id === item.DepartmentId)?.code || 'N/A'}
                                            </td>
                                        )}
                                        {/* Show Fees Column for Courses */}
                                        {type === 'courses' && visibleColumns.courses?.fees && (
                                            <td className="px-6 py-5 font-medium text-emerald-600 whitespace-nowrap">
                                                ₹{Number(item.fees || 0).toLocaleString('en-IN')}
                                            </td>
                                        )}
                                        {/* Show Course Column for Subjects */}
                                        {type === 'subjects' && visibleColumns.subjects?.course && (
                                            <td className="px-6 py-5 font-medium text-gray-500 whitespace-nowrap">
                                                {courses.find(c => c.id === item.CourseId)?.code || 'N/A'}
                                            </td>
                                        )}
                                        {visibleColumns[type]?.code && <td className="px-6 py-5 font-medium text-gray-500 whitespace-nowrap">{item.code}</td>}
                                        <td className="px-6 py-5 text-right whitespace-nowrap">
                                            <div className="flex justify-end gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => openModal(type.slice(0, -1), item)}
                                                    className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-colors"
                                                >
                                                    Edit
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        setItemToDelete(item);
                                                        setDeleteType(type);
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
            </motion.div>
        );
    };

    return (
        <div className="relative isolate min-h-[500px]">
            {/* Theme Background Elements */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-50 fixed pointer-events-none"></div>
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-100/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob -z-10 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob animation-delay-2000 -z-10 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 header-accent tracking-normal">
                        <span className="bolt-underline">Academic Data</span>
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">Manage core academic structures like Courses, Subjects, and Departments.</p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {view === 'grid' ? renderGridView() : renderListView(view)}
            </AnimatePresence>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-black text-gray-900 capitalize">Add New {modalType}</h3>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-200 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Department Form */}
                            {modalType === 'department' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Department Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="e.g. Computer Science & Engineering"
                                            required
                                            value={formData.name || ''}
                                            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-gray-900 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Department Code</label>
                                        <input
                                            type="text"
                                            name="code"
                                            placeholder="e.g. CSE"
                                            required
                                            value={formData.code || ''}
                                            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-gray-900 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Course Form */}
                            {modalType === 'course' && (
                                <>
                                    <CustomSelect
                                        label="Select Department"
                                        name="DepartmentId"
                                        value={formData.DepartmentId}
                                        options={departments.map(d => ({ value: d.id, label: d.name }))}
                                        onChange={handleChange}
                                        placeholder="Select Department"
                                    />
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Course Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="e.g. Bachelor of Technology"
                                            required
                                            value={formData.name || ''}
                                            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-gray-900 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Code</label>
                                            <input
                                                type="text"
                                                name="code"
                                                placeholder="e.g. B.Tech"
                                                required
                                                value={formData.code || ''}
                                                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-gray-900 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Duration (Years)</label>
                                            <input
                                                type="number"
                                                name="duration"
                                                placeholder="e.g. 4"
                                                required
                                                value={formData.duration || ''}
                                                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-gray-900 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Fees (₹)</label>
                                        <input
                                            type="number"
                                            name="fees"
                                            placeholder="e.g. 50000"
                                            value={formData.fees || ''}
                                            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-gray-900 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Subject Form */}
                            {modalType === 'subject' && (
                                <>
                                    {courses.length === 0 ? (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Layers size={32} />
                                            </div>
                                            <h4 className="text-xl font-bold text-gray-900 mb-2">No Courses Found</h4>
                                            <p className="text-gray-500 mb-6">You need to create a course before adding subjects.</p>
                                            <button
                                                type="button"
                                                onClick={() => setModalType('course')}
                                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                                            >
                                                Add Course First
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <CustomSelect
                                                label="Select Course"
                                                name="CourseId" // Changed from courseId to match Case probably, but stick to standard or check logic. Keeping CourseId for consistency.
                                                value={formData.CourseId || formData.courseId} // Handle both potentially
                                                options={courses.map(c => ({ value: c.id, label: `${c.name} (${c.code})` }))}
                                                onChange={handleChange}
                                                placeholder="Select Course"
                                            />
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subject Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="e.g. Data Structures"
                                                    required
                                                    value={formData.name || ''}
                                                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-gray-900 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subject Code</label>
                                                    <input
                                                        type="text"
                                                        name="code"
                                                        placeholder="e.g. CS-102"
                                                        required
                                                        value={formData.code || ''}
                                                        className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-gray-900 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Credits</label>
                                                    <input
                                                        type="number"
                                                        name="credits"
                                                        placeholder="e.g. 4"
                                                        required
                                                        value={formData.credits || ''}
                                                        className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-gray-900 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-3.5 bg-gray-900 text-white rounded-xl font-bold shadow-lg shadow-gray-900/20 hover:bg-gray-800 hover:-translate-y-0.5 transition-all">
                                    {isEditMode ? 'Update' : 'Create'} {modalType}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Modals */}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                message={successMessage}
            />

            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Are you sure?"
                message={`This action cannot be undone. You are about to delete this ${deleteType?.slice(0, -1)}.`}
            />

            <ImportModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                category={importCategory}
                token={token}
                onSuccess={() => dispatch(getAllMasterData())}
            />
        </div>
    );
};

export default MasterData;
