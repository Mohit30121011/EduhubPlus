import React, { useState } from 'react';
import {
    BookOpen, Users, Clock, Calendar, MoreHorizontal,
    Plus, Search, ChevronRight, Layers, FileText
} from 'lucide-react';

// Mock Data for Classes
const classes = [
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
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
            <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{count}</h3>
        </div>
    </div>
);

const Academics = () => {
    const [activeTab, setActiveTab] = useState(() => localStorage.getItem('academicsTab') || 'classes');

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-600 header-accent">Academics & Curriculum</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage classes, subjects, and timetables efficiently.</p>
                </div>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 shadow-lg shadow-primary-500/20 flex items-center gap-2">
                    <Plus size={18} /> Add New {activeTab === 'classes' ? 'Class' : 'Subject'}
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Classes" count="24" icon={Layers} color="bg-indigo-500 text-indigo-600" />
                <StatCard title="Active Subjects" count="18" icon={BookOpen} color="bg-rose-500 text-rose-600" />
                <StatCard title="Teaching Staff" count="42" icon={Users} color="bg-emerald-500 text-emerald-600" />
                <StatCard title="Avg Class Size" count="38" icon={Users} color="bg-amber-500 text-amber-600" />
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200">
                <button
                    onClick={() => { setActiveTab('classes'); localStorage.setItem('academicsTab', 'classes'); }}
                    className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'classes' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Classes & Sections
                    {activeTab === 'classes' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => { setActiveTab('subjects'); localStorage.setItem('academicsTab', 'subjects'); }}
                    className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'subjects' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Subjects
                    {activeTab === 'subjects' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => { setActiveTab('timetables'); localStorage.setItem('academicsTab', 'timetables'); }}
                    className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'timetables' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Timetables
                    {activeTab === 'timetables' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></div>}
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="font-semibold text-gray-900">{activeTab === 'classes' ? classes.length : subjects.length}</span> items found
                    </div>
                </div>

                {/* List View */}
                {activeTab === 'classes' && (
                    <div className="divide-y divide-gray-50">
                        {classes.map(cls => (
                            <div key={[cls.id, cls.section].join('-')} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                                        {cls.name.replace('Class ', '')}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-sm">{cls.name} - Section {cls.section}</h4>
                                        <p className="text-xs text-gray-500 flex items-center gap-2">
                                            <Users size={12} /> {cls.teacher} (Class Teacher)
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Students</p>
                                        <p className="font-semibold text-gray-700">{cls.students}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Stream</p>
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-semibold">{cls.stream}</span>
                                    </div>
                                    <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'subjects' && (
                    <div className="divide-y divide-gray-50">
                        {subjects.map(sub => (
                            <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                                        <BookOpen size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-sm">{sub.name}</h4>
                                        <p className="text-xs text-gray-500 font-mono">{sub.code}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Faculty</p>
                                        <p className="font-semibold text-gray-700">{sub.teachers} Teachers</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Classes</p>
                                        <p className="font-semibold text-gray-700">{sub.classes} Assigned</p>
                                    </div>
                                    <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

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
        </div>
    );
};

export default Academics;
