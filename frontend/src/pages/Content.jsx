import React, { useState } from 'react';
import {
    Folder, FileText, Image, Film, MoreVertical,
    UploadCloud, Search, Filter, Grid, List, Download, Trash2
} from 'lucide-react';

const categories = [
    { id: 'cat-1', name: 'Syllabus', count: 12, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'cat-2', name: 'Assignments', count: 45, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'cat-3', name: 'Circulars', count: 8, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'cat-4', name: 'Exam Papers', count: 15, color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

const files = [
    { id: 1, name: 'Math_Syllabus_Class10.pdf', size: '2.4 MB', date: '29 Jan 2025', type: 'PDF', category: 'Syllabus' },
    { id: 2, name: 'Physics_Lab_Manual.docx', size: '1.8 MB', date: '28 Jan 2025', type: 'DOC', category: 'Assignments' },
    { id: 3, name: 'Annual_Day_Photos.zip', size: '45 MB', date: '27 Jan 2025', type: 'ZIP', category: 'Events' },
    { id: 4, name: 'Holiday_Notice.pdf', size: '150 KB', date: '25 Jan 2025', type: 'PDF', category: 'Circulars' },
    { id: 5, name: 'Chemistry_Project_Guidelines.pdf', size: '1.2 MB', date: '24 Jan 2025', type: 'PDF', category: 'Assignments' },
];

const FileIcon = ({ type }) => {
    switch (type) {
        case 'PDF': return <FileText size={24} className="text-red-500" />;
        case 'DOC': return <FileText size={24} className="text-blue-500" />;
        case 'ZIP': return <Folder size={24} className="text-amber-500" />;
        case 'IMG': return <Image size={24} className="text-purple-500" />;
        case 'VID': return <Film size={24} className="text-rose-500" />;
        default: return <FileText size={24} className="text-gray-400" />;
    }
};

const Content = () => {
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid' [Grid view not implemented in this snippet for brevity but state is ready]
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 header-accent">Content Library</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage syllabus, assignments, and school resources.</p>
                </div>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 shadow-lg shadow-primary-500/20 flex items-center gap-2">
                    <UploadCloud size={18} /> Upload New File
                </button>
            </div>

            {/* Storage Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {categories.map(cat => (
                    <div key={cat.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className={`w-12 h-12 rounded-lg ${cat.bg} ${cat.color} flex items-center justify-center`}>
                            <Folder size={24} fill="currentColor" className="opacity-80" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm">{cat.name}</h3>
                            <p className="text-xs text-gray-500">{cat.count} files</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main File Browser */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search files..."
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button className={`p-2 rounded-lg border ${viewMode === 'list' ? 'bg-gray-100 border-gray-300' : 'border-gray-200 text-gray-400'}`} onClick={() => setViewMode('list')}>
                                <List size={18} />
                            </button>
                            <button className={`p-2 rounded-lg border ${viewMode === 'grid' ? 'bg-gray-100 border-gray-300' : 'border-gray-200 text-gray-400'}`} onClick={() => setViewMode('grid')}>
                                <Grid size={18} />
                            </button>
                            <div className="h-6 w-px bg-gray-200 mx-2"></div>
                            <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
                                <Filter size={16} /> Filter
                            </button>
                        </div>
                    </div>

                    {/* File List */}
                    <div className="min-h-[400px]">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left py-3 px-5 text-xs font-bold text-gray-400 uppercase">Name</th>
                                    <th className="text-left py-3 px-5 text-xs font-bold text-gray-400 uppercase">Category</th>
                                    <th className="text-left py-3 px-5 text-xs font-bold text-gray-400 uppercase">Size</th>
                                    <th className="text-left py-3 px-5 text-xs font-bold text-gray-400 uppercase">Modified</th>
                                    <th className="text-right py-3 px-5 text-xs font-bold text-gray-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredFiles.map((file) => (
                                    <tr key={file.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-3 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gray-100 rounded-lg">
                                                    <FileIcon type={file.type} />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-700 max-w-xs truncate" title={file.name}>{file.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-5">
                                            <span className="inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                                                {file.category}
                                            </span>
                                        </td>
                                        <td className="py-3 px-5 text-sm text-gray-500 font-mono">{file.size}</td>
                                        <td className="py-3 px-5 text-sm text-gray-500">{file.date}</td>
                                        <td className="py-3 px-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Download">
                                                    <Download size={16} />
                                                </button>
                                                <button className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                                <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors" title="More">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredFiles.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <Search size={48} className="mb-4 opacity-20" />
                                <p>No files found matching your search.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Upload Zone & Usage (Sidebar) */}
                <div className="w-full lg:w-80 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center border-dashed border-2 border-primary-100 hover:border-primary-300 transition-colors bg-primary-50/30">
                        <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UploadCloud size={32} />
                        </div>
                        <h3 className="font-bold text-gray-800">Upload Files</h3>
                        <p className="text-xs text-gray-500 mt-2 mb-6">Drag & drop files here or click to browse</p>
                        <button className="w-full py-2 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-lg hover:bg-gray-50">
                            Select Files
                        </button>
                    </div>

                    <div className="bg-[#0b1f3a] rounded-2xl p-6 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
                        <h3 className="font-bold text-lg mb-1 relative z-10 text-white">Storage Usage</h3>
                        <p className="text-gray-300 text-xs mb-4 relative z-10">You have used 72% of your available storage space.</p>

                        <div className="flex items-end gap-2 mb-2 relative z-10">
                            <span className="text-3xl font-bold text-white">72.4</span>
                            <span className="text-sm text-gray-400 mb-1">GB / 100 GB</span>
                        </div>

                        <div className="w-full bg-gray-700/50 rounded-full h-2 relative z-10">
                            <div className="bg-gradient-to-r from-blue-400 to-indigo-400 h-2 rounded-full" style={{ width: '72%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Content;
