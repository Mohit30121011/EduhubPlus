import React, { useState, useEffect } from 'react';
import {
    BookOpen, Users, Clock, Calendar, MoreHorizontal,
    Plus, Search, ChevronRight, Layers, FileText, X, Check
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Mock Data for Classes
const initialClasses = [
    { id: 1, name: 'Class 10', section: 'A', students: 42, teacher: 'Rajesh Kumar', stream: 'General' },
    { id: 2, name: 'Class 10', section: 'B', students: 40, teacher: 'Priya Sharma', stream: 'General' },
    { id: 3, name: 'Class 12', section: 'A', students: 38, teacher: 'Amit Singh', stream: 'Science' },
    { id: 4, name: 'Class 12', section: 'B', students: 35, teacher: 'Sneha Gupta', stream: 'Commerce' },
    { id: 5, name: 'Class 9', section: 'A', students: 45, teacher: 'Vikram Malhotra', stream: 'General' },
];

const subjects = [
    { id: 101, name: 'Mathematics', code: 'MATH101', teachers: 4, classes: 12 },
    { id: 102, name: 'Physics', code: 'PHY101', teachers: 3, classes: 6 },
    { id: 103, name: 'Chemistry', code: 'CHEM101', teachers: 3, classes: 6 },
    { id: 104, name: 'English', code: 'ENG101', teachers: 5, classes: 12 },
    { id: 105, name: 'Computer Science', code: 'CS101', teachers: 2, classes: 8 },
];

const StatCard = ({ title, count, icon: Icon, color }) => (
    <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-sm border border-white/60 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={22} className="text-white" />
        </div>
        <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
            <h3 className="text-xl font-black text-gray-900 mt-0.5">{count}</h3>
        </div>
    </div>
);

const Academics = () => {
    const [searchParams] = useSearchParams();
    const tabFromUrl = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(() => tabFromUrl || localStorage.getItem('academicsTab') || 'classes');
    const [classes, setClasses] = useState(initialClasses);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', section: '', teacher: '', stream: 'General', students: 0 });

    useEffect(() => {
        if (tabFromUrl && ['classes', 'subjects', 'timetables'].includes(tabFromUrl)) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    // ── Add Class Handler ───────────────────────────────────────────
    const handleAddClass = () => {
        if (!formData.name || !formData.section) {
            toast.error('Class name and section are required');
            return;
        }
        const newClass = {
            id: Date.now(),
            name: formData.name,
            section: formData.section.toUpperCase(),
            students: Number(formData.students) || 0,
            teacher: formData.teacher || 'Unassigned',
            stream: formData.stream || 'General',
        };
        setClasses([...classes, newClass]);
        setShowAddModal(false);
        setFormData({ name: '', section: '', teacher: '', stream: 'General', students: 0 });
        toast.success('Class added successfully!');
    };

    // ── Filtered data ───────────────────────────────────────────────
    const term = searchTerm.toLowerCase();
    const filteredClasses = classes.filter(c =>
        c.name.toLowerCase().includes(term) || c.section.toLowerCase().includes(term) || c.teacher.toLowerCase().includes(term)
    );
    const filteredSubjects = subjects.filter(s =>
        s.name.toLowerCase().includes(term) || s.code.toLowerCase().includes(term)
    );

    return (
        <div className="space-y-6 pb-20 lg:pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Academics & Curriculum</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage classes, subjects, and timetables efficiently.</p>
                </div>
                {activeTab !== 'timetables' && (
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            if (activeTab === 'classes') {
                                setFormData({ name: '', section: '', teacher: '', stream: 'General', students: 0 });
                                setShowAddModal(true);
                            }
                        }}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 self-start"
                    >
                        <Plus size={18} /> Add New {activeTab === 'classes' ? 'Class' : 'Subject'}
                    </motion.button>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Total Classes" count={classes.length} icon={Layers} color="bg-indigo-500" />
                <StatCard title="Active Subjects" count={subjects.length} icon={BookOpen} color="bg-rose-500" />
                <StatCard title="Teaching Staff" count="42" icon={Users} color="bg-emerald-500" />
                <StatCard title="Avg Class Size" count={Math.round(classes.reduce((s, c) => s + c.students, 0) / classes.length)} icon={Users} color="bg-amber-500" />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                {[
                    { key: 'classes', label: 'Classes & Sections' },
                    { key: 'subjects', label: 'Subjects' },
                    { key: 'timetables', label: 'Timetables' },
                ].map(tab => (
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

            {/* Content Area */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/60 overflow-hidden">
                {/* Toolbar */}
                {activeTab !== 'timetables' && (
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
                            <span className="text-gray-900 font-black">{activeTab === 'classes' ? filteredClasses.length : filteredSubjects.length}</span> items found
                        </span>
                    </div>
                )}

                {/* ─── CLASSES LIST ───────────────────────────────── */}
                {activeTab === 'classes' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50/80 border-b border-gray-100">
                                    <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Class</th>
                                    <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Class Teacher</th>
                                    <th className="text-center px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Students</th>
                                    <th className="text-center px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Stream</th>
                                    <th className="text-right px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-16"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredClasses.map(cls => (
                                    <tr key={`${cls.id}-${cls.section}`} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm flex-shrink-0">
                                                    {cls.name.replace('Class ', '')}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-gray-900 text-sm">{cls.name} - Section {cls.section}</p>
                                                    <p className="text-xs text-gray-400 md:hidden flex items-center gap-1 mt-0.5">
                                                        <Users size={10} /> {cls.teacher}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                <Users size={14} className="text-gray-300" />
                                                <span className="text-gray-600 font-medium">{cls.teacher}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className="font-bold text-gray-800">{cls.students}</span>
                                        </td>
                                        <td className="px-5 py-4 text-center hidden sm:table-cell">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${cls.stream === 'Science' ? 'bg-emerald-50 text-emerald-600' :
                                                    cls.stream === 'Commerce' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                {cls.stream}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button className="p-1.5 text-gray-300 hover:text-indigo-600 transition-colors">
                                                <ChevronRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ─── SUBJECTS LIST ──────────────────────────────── */}
                {activeTab === 'subjects' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50/80 border-b border-gray-100">
                                    <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Subject</th>
                                    <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Code</th>
                                    <th className="text-center px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Faculty</th>
                                    <th className="text-center px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Classes</th>
                                    <th className="text-right px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-16"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredSubjects.map(sub => (
                                    <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                                                    <BookOpen size={18} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-gray-900 text-sm">{sub.name}</p>
                                                    <p className="text-xs text-gray-400 font-mono sm:hidden">{sub.code}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 hidden sm:table-cell">
                                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{sub.code}</span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className="font-bold text-gray-800">{sub.teachers}</span>
                                            <span className="text-gray-400 text-xs ml-1">Teachers</span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className="font-bold text-gray-800">{sub.classes}</span>
                                            <span className="text-gray-400 text-xs ml-1">Assigned</span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button className="p-1.5 text-gray-300 hover:text-rose-600 transition-colors">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ─── TIMETABLES ─────────────────────────────────── */}
                {activeTab === 'timetables' && (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
                        <Calendar size={48} className="mb-4 text-gray-200" />
                        <h3 className="text-lg font-semibold text-gray-600">Timetable Management</h3>
                        <p className="max-w-xs mx-auto mt-2 text-sm text-gray-400">Select a class to view or edit its weekly schedule.</p>
                        <button className="mt-6 px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50 text-sm font-medium">
                            Select Class
                        </button>
                    </div>
                )}
            </div>

            {/* ─── ADD CLASS MODAL ────────────────────────────────── */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900">Add New Class</h3>
                                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                    <X size={18} className="text-gray-400" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-5 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Class Name *</label>
                                        <input
                                            type="text" placeholder="e.g. Class 11"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Section *</label>
                                        <input
                                            type="text" placeholder="e.g. A"
                                            value={formData.section}
                                            onChange={e => setFormData({ ...formData, section: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Class Teacher</label>
                                    <input
                                        type="text" placeholder="e.g. Dr. Rajesh Kumar"
                                        value={formData.teacher}
                                        onChange={e => setFormData({ ...formData, teacher: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Stream</label>
                                        <select
                                            value={formData.stream}
                                            onChange={e => setFormData({ ...formData, stream: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                                        >
                                            <option value="General">General</option>
                                            <option value="Science">Science</option>
                                            <option value="Commerce">Commerce</option>
                                            <option value="Arts">Arts</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">No. of Students</label>
                                        <input
                                            type="number" min="0" placeholder="0"
                                            value={formData.students}
                                            onChange={e => setFormData({ ...formData, students: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                                        />
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3 justify-end pt-2">
                                    <button onClick={() => setShowAddModal(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                                        Cancel
                                    </button>
                                    <button onClick={handleAddClass} className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 hover:opacity-90 transition-all flex items-center gap-2">
                                        <Check size={14} /> Add Class
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Academics;
