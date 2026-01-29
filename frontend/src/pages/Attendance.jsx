import React, { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_STUDENTS = [
    { id: 1, name: 'Alice Johnson', enrollment: 'CS2024001' },
    { id: 2, name: 'Bob Smith', enrollment: 'ME2024045' },
    { id: 3, name: 'Charlie Brown', enrollment: 'CS2024002' },
    { id: 4, name: 'Diana Prince', enrollment: 'CS2024003' },
    { id: 5, name: 'Evan Wright', enrollment: 'CS2024004' },
];

const Attendance = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState({}); // { studentId: 'PRESENT' }

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const submitAttendance = () => {
        console.log('Submitting Attendance for', date, attendance);
        alert('Attendance Marked Successfully!');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Mark and view daily class attendance</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                    <Calendar size={18} className="text-primary-500" />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="text-sm border-none focus:ring-0 text-gray-700 font-medium"
                    />
                </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">Class: Computer Science - Sem 6</h3>
                    <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                        Total Students: {MOCK_STUDENTS.length}
                    </span>
                </div>

                <div className="divide-y divide-gray-100">
                    {MOCK_STUDENTS.map((student) => {
                        const status = attendance[student.id] || 'PRESENT';

                        return (
                            <motion.div
                                key={student.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{student.name}</p>
                                        <p className="text-xs text-gray-500 font-mono">{student.enrollment}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleStatusChange(student.id, 'PRESENT')}
                                        className={`p-2 rounded-lg flex items-center gap-1 transition-all ${status === 'PRESENT'
                                                ? 'bg-green-100 text-green-700 ring-2 ring-green-500 ring-offset-1'
                                                : 'bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-600'
                                            }`}
                                    >
                                        <CheckCircle size={18} />
                                        <span className="text-xs font-bold">P</span>
                                    </button>

                                    <button
                                        onClick={() => handleStatusChange(student.id, 'ABSENT')}
                                        className={`p-2 rounded-lg flex items-center gap-1 transition-all ${status === 'ABSENT'
                                                ? 'bg-red-100 text-red-700 ring-2 ring-red-500 ring-offset-1'
                                                : 'bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600'
                                            }`}
                                    >
                                        <XCircle size={18} />
                                        <span className="text-xs font-bold">A</span>
                                    </button>

                                    <button
                                        onClick={() => handleStatusChange(student.id, 'LATE')}
                                        className={`p-2 rounded-lg flex items-center gap-1 transition-all ${status === 'LATE'
                                                ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-500 ring-offset-1'
                                                : 'bg-gray-50 text-gray-400 hover:bg-amber-50 hover:text-amber-600'
                                            }`}
                                    >
                                        <Clock size={18} />
                                        <span className="text-xs font-bold">L</span>
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
                    <button
                        onClick={submitAttendance}
                        className="px-8 py-2 bg-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all"
                    >
                        Save Attendance
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
