import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Folder, FileText, Image, Film, MoreVertical, Eye, X,
    UploadCloud, Search, Filter, Grid, List, Download, Trash2,
    BookOpen, Video, Music, FileArchive, Star, Clock, ChevronRight,
    Plus, FolderOpen, HardDrive, TrendingUp, Users, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Category Data ──────────────────────────────────────────────────
const categories = [
    { id: 'all', name: 'All Files', icon: FolderOpen, count: 80, gradient: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50' },
    { id: 'syllabus', name: 'Syllabus', icon: BookOpen, count: 12, gradient: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-50' },
    { id: 'assignments', name: 'Assignments', icon: FileText, count: 45, gradient: 'from-rose-500 to-pink-500', bg: 'bg-rose-50' },
    { id: 'lectures', name: 'Lectures', icon: Video, count: 8, gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50' },
    { id: 'circulars', name: 'Circulars', icon: Folder, count: 8, gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50' },
    { id: 'exams', name: 'Exam Papers', icon: FileArchive, count: 15, gradient: 'from-cyan-500 to-blue-500', bg: 'bg-cyan-50' },
];

// ─── Mock Files ─────────────────────────────────────────────────────
const initialFiles = [
    { id: 1, name: 'Mathematics Syllabus - Class 10', ext: 'PDF', size: '2.4 MB', date: '2026-02-22', category: 'syllabus', starred: true, author: 'Dr. Sharma', downloads: 128 },
    { id: 2, name: 'Physics Lab Manual - Practical Experiments', ext: 'DOCX', size: '1.8 MB', date: '2026-02-21', category: 'assignments', starred: false, author: 'Prof. Verma', downloads: 95 },
    { id: 3, name: 'Computer Science - DSA Notes', ext: 'PDF', size: '5.2 MB', date: '2026-02-20', category: 'lectures', starred: true, author: 'Dr. Patel', downloads: 312 },
    { id: 4, name: 'Annual Day Circular - 2026', ext: 'PDF', size: '150 KB', date: '2026-02-19', category: 'circulars', starred: false, author: 'Admin Office', downloads: 456 },
    { id: 5, name: 'Chemistry Project Guidelines', ext: 'PDF', size: '1.2 MB', date: '2026-02-18', category: 'assignments', starred: false, author: 'Ms. Joshi', downloads: 67 },
    { id: 6, name: 'English Literature - Shakespeare', ext: 'PPTX', size: '8.5 MB', date: '2026-02-17', category: 'lectures', starred: true, author: 'Dr. Reddy', downloads: 89 },
    { id: 7, name: 'Mid-Term Exam - Mathematics', ext: 'PDF', size: '980 KB', date: '2026-02-16', category: 'exams', starred: false, author: 'Exam Cell', downloads: 234 },
    { id: 8, name: 'Biology Syllabus - Class 12', ext: 'PDF', size: '3.1 MB', date: '2026-02-15', category: 'syllabus', starred: false, author: 'Dr. Gupta', downloads: 156 },
    { id: 9, name: 'Web Development - React Basics', ext: 'MP4', size: '45 MB', date: '2026-02-14', category: 'lectures', starred: true, author: 'Prof. Kumar', downloads: 278 },
    { id: 10, name: 'Holiday Notice - Holi Festival', ext: 'PDF', size: '85 KB', date: '2026-02-13', category: 'circulars', starred: false, author: 'Admin Office', downloads: 789 },
    { id: 11, name: 'Final Exam - Physics Paper A', ext: 'PDF', size: '1.5 MB', date: '2026-02-12', category: 'exams', starred: false, author: 'Exam Cell', downloads: 198 },
    { id: 12, name: 'Machine Learning Assignment', ext: 'IPYNB', size: '3.7 MB', date: '2026-02-11', category: 'assignments', starred: true, author: 'Dr. Singh', downloads: 145 },
];

// ─── File Icon Helper ───────────────────────────────────────────────
const getFileIcon = (ext) => {
    const map = {
        PDF: { icon: FileText, color: 'text-red-500', bg: 'bg-red-50' },
        DOCX: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
        PPTX: { icon: FileText, color: 'text-orange-500', bg: 'bg-orange-50' },
        MP4: { icon: Film, color: 'text-purple-500', bg: 'bg-purple-50' },
        MP3: { icon: Music, color: 'text-pink-500', bg: 'bg-pink-50' },
        ZIP: { icon: FileArchive, color: 'text-amber-500', bg: 'bg-amber-50' },
        IPYNB: { icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        IMG: { icon: Image, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    };
    return map[ext] || { icon: FileText, color: 'text-gray-400', bg: 'bg-gray-50' };
};

const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ─── Upload Modal ───────────────────────────────────────────────────
const UploadModal = ({ isOpen, onClose }) => {
    const [dragOver, setDragOver] = useState(false);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 relative"
                    onClick={e => e.stopPropagation()}
                >
                    <button onClick={onClose} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <X size={20} />
                    </button>
                    <h2 className="text-xl font-black text-gray-900 mb-1">Upload Files</h2>
                    <p className="text-sm text-gray-500 mb-6">Add new resources to the content library</p>

                    <div
                        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'}`}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => {
                            e.preventDefault(); setDragOver(false);
                            toast.success(`${e.dataTransfer.files.length} file(s) uploaded!`);
                            onClose();
                        }}
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                            <UploadCloud size={28} className="text-white" />
                        </div>
                        <p className="font-bold text-gray-800 mb-1">Drag & drop files here</p>
                        <p className="text-xs text-gray-400 mb-4">PDF, DOCX, PPTX, MP4, ZIP up to 100MB</p>
                        <button
                            onClick={() => { toast.success('File browser opened!'); onClose(); }}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-xl hover:opacity-90 shadow-lg shadow-blue-500/20 transition-all"
                        >
                            Browse Files
                        </button>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <select className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700">
                            <option>Select Category</option>
                            <option>Syllabus</option>
                            <option>Assignments</option>
                            <option>Lectures</option>
                            <option>Circulars</option>
                            <option>Exam Papers</option>
                        </select>
                        <select className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700">
                            <option>All Classes</option>
                            <option>Class 10</option>
                            <option>Class 11</option>
                            <option>Class 12</option>
                        </select>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────
const Content = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [files, setFiles] = useState(initialFiles);
    const [showUpload, setShowUpload] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

    const filteredFiles = files.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDelete = (id) => {
        setFiles(prev => prev.filter(f => f.id !== id));
        toast.success('File deleted');
    };

    const handleStar = (id) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, starred: !f.starred } : f));
    };

    const storageUsed = 72.4;
    const storageTotal = 100;

    return (
        <div className="space-y-6 pb-20 lg:pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">
                        Content Library
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage syllabus, assignments, lectures & resources</p>
                </div>
                <button
                    onClick={() => setShowUpload(true)}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:opacity-90 shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all"
                >
                    <Plus size={18} /> Upload Resource
                </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Folder size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-gray-900">{files.length}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Files</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                            <TrendingUp size={20} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-gray-900">3.2K</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Downloads</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                            <Users size={20} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-gray-900">8</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contributors</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                            <HardDrive size={20} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-gray-900">{storageUsed}GB</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Storage Used</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
                {categories.map(cat => {
                    const Icon = cat.icon;
                    const isActive = selectedCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all shrink-0 ${isActive
                                ? `bg-gradient-to-r ${cat.gradient} text-white shadow-lg shadow-blue-500/15`
                                : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                                }`}
                        >
                            <Icon size={16} />
                            {cat.name}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20' : 'bg-gray-100'
                                }`}>
                                {cat.id === 'all' ? files.length : files.filter(f => f.category === cat.id).length}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Search + Controls */}
            <div className="flex flex-col md:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search files, documents, resources..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className={`p-2.5 rounded-xl border transition-all ${viewMode === 'list' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                        onClick={() => setViewMode('list')}
                    >
                        <List size={18} />
                    </button>
                    <button
                        className={`p-2.5 rounded-xl border transition-all ${viewMode === 'grid' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid size={18} />
                    </button>
                    <button
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${filterOpen ? 'bg-blue-50 border-blue-200 text-blue-600 border' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        onClick={() => setFilterOpen(!filterOpen)}
                    >
                        <Filter size={16} /> Filter
                    </button>
                </div>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
                {filterOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap gap-3 items-center">
                            <select className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700">
                                <option>All File Types</option>
                                <option>PDF</option>
                                <option>DOCX</option>
                                <option>PPTX</option>
                                <option>MP4</option>
                            </select>
                            <select className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700">
                                <option>All Authors</option>
                                <option>Dr. Sharma</option>
                                <option>Prof. Verma</option>
                                <option>Dr. Patel</option>
                            </select>
                            <select className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700">
                                <option>Sort: Newest First</option>
                                <option>Sort: Oldest First</option>
                                <option>Sort: Most Downloaded</option>
                                <option>Sort: Name A-Z</option>
                            </select>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                                <span className="text-sm font-medium text-gray-700">Starred Only</span>
                            </label>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* File Content */}
            {viewMode === 'grid' ? (
                /* ─── Grid View ────────────────────────────────────────── */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <AnimatePresence>
                        {filteredFiles.map(file => {
                            const { icon: FileIcon, color, bg } = getFileIcon(file.ext);
                            return (
                                <motion.div
                                    key={file.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all group overflow-hidden"
                                >
                                    {/* Preview Bar */}
                                    <div className={`h-2 bg-gradient-to-r ${categories.find(c => c.id === file.category)?.gradient || 'from-gray-400 to-gray-500'}`} />

                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
                                                <FileIcon size={24} className={color} />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => handleStar(file.id)} className="p-1.5 rounded-lg hover:bg-amber-50 transition-colors">
                                                    <Star size={14} className={file.starred ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                                                </button>
                                                <button onClick={() => handleDelete(file.id)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <h3 className="font-bold text-gray-800 text-sm leading-snug mb-1 line-clamp-2 min-h-[2.5rem]">{file.name}</h3>
                                        <p className="text-[11px] text-gray-400 font-medium">{file.author}</p>

                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                                            <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                                                <span className="px-2 py-0.5 bg-gray-100 rounded-md uppercase">{file.ext}</span>
                                                <span>{file.size}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                                <Download size={10} />
                                                {file.downloads}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => toast.success('Opening preview...')}
                                                className="flex-1 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                                            >
                                                <Eye size={12} /> View
                                            </button>
                                            <button
                                                onClick={() => toast.success(`${file.name} downloaded!`)}
                                                className="flex-1 py-2 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1"
                                            >
                                                <Download size={12} /> Download
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            ) : (
                /* ─── List View ────────────────────────────────────────── */
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/80 border-b border-gray-100">
                                <tr>
                                    <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">File</th>
                                    <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Author</th>
                                    <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Size</th>
                                    <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Modified</th>
                                    <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Downloads</th>
                                    <th className="text-right py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                <AnimatePresence>
                                    {filteredFiles.map(file => {
                                        const { icon: FileIcon, color, bg } = getFileIcon(file.ext);
                                        return (
                                            <motion.tr
                                                key={file.id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="hover:bg-blue-50/30 transition-colors group"
                                            >
                                                <td className="py-3 px-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center shrink-0`}>
                                                            <FileIcon size={20} className={color} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-gray-800 truncate max-w-[200px] lg:max-w-none">{file.name}</p>
                                                            <p className="text-[10px] text-gray-400 flex items-center gap-2 mt-0.5">
                                                                <span className="px-1.5 py-0.5 bg-gray-100 rounded uppercase font-bold">{file.ext}</span>
                                                                <span className="md:hidden">{file.size}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-5 text-sm text-gray-600 font-medium hidden md:table-cell">{file.author}</td>
                                                <td className="py-3 px-5 text-sm text-gray-500 font-mono hidden sm:table-cell">{file.size}</td>
                                                <td className="py-3 px-5 text-sm text-gray-500 hidden lg:table-cell">{formatDate(file.date)}</td>
                                                <td className="py-3 px-5 hidden lg:table-cell">
                                                    <span className="text-sm text-gray-500 flex items-center gap-1"><Download size={12} /> {file.downloads}</span>
                                                </td>
                                                <td className="py-3 px-5 text-right">
                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleStar(file.id)} className="p-1.5 rounded-lg hover:bg-amber-50 transition-colors">
                                                            <Star size={14} className={file.starred ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                                                        </button>
                                                        <button onClick={() => toast.success(`${file.name} downloaded!`)} className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                                            <Download size={14} />
                                                        </button>
                                                        <button onClick={() => handleDelete(file.id)} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                    {filteredFiles.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                            <Search size={40} className="mb-3 opacity-20" />
                            <p className="font-bold text-gray-500">No files found</p>
                            <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            )}

            {filteredFiles.length === 0 && viewMode === 'grid' && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <Search size={40} className="mb-3 opacity-20" />
                    <p className="font-bold text-gray-500">No files found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                </div>
            )}

            {/* Storage Footer */}
            <div className="bg-gradient-to-r from-gray-900 to-indigo-900 rounded-2xl p-6 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-lg mb-1 text-white flex items-center gap-2">
                            <HardDrive size={18} /> Storage Usage
                        </h3>
                        <p className="text-gray-300 text-xs">You have used {Math.round((storageUsed / storageTotal) * 100)}% of your available storage space.</p>
                    </div>
                    <div className="flex items-end gap-2 shrink-0">
                        <span className="text-3xl font-black text-white">{storageUsed}</span>
                        <span className="text-sm text-gray-400 mb-1">GB / {storageTotal} GB</span>
                    </div>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2.5 mt-4 relative z-10">
                    <div
                        className="bg-gradient-to-r from-blue-400 to-indigo-400 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${(storageUsed / storageTotal) * 100}%` }}
                    ></div>
                </div>
                <div className="flex justify-between mt-2 relative z-10">
                    <span className="text-[10px] text-gray-400 font-bold">0 GB</span>
                    <span className="text-[10px] text-gray-400 font-bold">{storageTotal} GB</span>
                </div>
            </div>

            <UploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} />
        </div>
    );
};

export default Content;
