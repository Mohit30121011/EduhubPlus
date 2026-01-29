import React, { useState } from 'react';
import { Plus, Search, Mail, Phone, MoreVertical, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Data
const MOCK_FACULTY = [
    { id: 1, name: 'Dr. Sarah Wilson', designation: 'Professor', dept: 'Computer Science', specialization: 'AI/ML', email: 'sarah.w@college.edu', phone: '+91 98765 43210' },
    { id: 2, name: 'Prof. James Carter', designation: 'Assistant Professor', dept: 'Mechanical', specialization: 'Thermodynamics', email: 'james.c@college.edu', phone: '+91 98765 43211' },
    { id: 3, name: 'Dr. Emily Chen', designation: 'Associate Professor', dept: 'Computer Science', specialization: 'Cyber Security', email: 'emily.c@college.edu', phone: '+91 98765 43212' },
];

const FacultyList = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Faculty Directory</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage teaching staff and departments</p>
                </div>
                <button className="px-4 py-2 bg-primary-500 text-white rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-all flex items-center gap-2 font-medium">
                    <Plus size={18} />
                    Add Faculty
                </button>
            </div>

            <div className="glass-card p-4 rounded-xl flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search faculty by name or department..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_FACULTY.map((faculty, index) => (
                    <motion.div
                        key={faculty.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card p-6 rounded-2xl group hover:border-primary-200 transition-all hover:shadow-lg"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-primary-700 font-bold text-lg">
                                {faculty.name.charAt(0)}
                            </div>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900">{faculty.name}</h3>
                        <p className="text-primary-600 font-medium text-sm mb-1">{faculty.designation}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                            <Briefcase size={14} />
                            {faculty.dept} • {faculty.specialization}
                        </div>

                        <div className="space-y-2 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail size={16} className="text-gray-400" />
                                {faculty.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone size={16} className="text-gray-400" />
                                {faculty.phone}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FacultyList;
