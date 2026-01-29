import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Data (Replace with API call later)
const MOCK_STUDENTS = [
    { id: 1, name: 'Alice Johnson', enrollment: 'CS2024001', dept: 'Computer Science', semester: 6, status: 'Active' },
    { id: 2, name: 'Bob Smith', enrollment: 'ME2024045', dept: 'Mechanical', semester: 4, status: 'Active' },
    { id: 3, name: 'Charlie Brown', enrollment: 'CS2024002', dept: 'Computer Science', semester: 6, status: 'Inactive' },
];

const StudentList = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage student records, enrollments, and profiles</p>
                </div>
                <button className="px-4 py-2 bg-primary-500 text-white rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-all flex items-center gap-2 font-medium">
                    <Plus size={18} />
                    Add New Student
                </button>
            </div>

            {/* Filters & Search */}
            <div className="glass-card p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or enrollment..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-200 flex items-center gap-2">
                        <Filter size={18} />
                        <span className="text-sm font-medium">Filters</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-xl overflow-hidden"
            >
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-left">
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrollment No</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Semester</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {MOCK_STUDENTS.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                                            {student.name.charAt(0)}
                                        </div>
                                        <span className="font-medium text-gray-900">{student.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-mono">{student.enrollment}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{student.dept}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Sem {student.semester}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${student.status === 'Active'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                        }`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                            <Eye size={16} />
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                                            <Edit size={16} />
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        </div>
    );
};

export default StudentList;
