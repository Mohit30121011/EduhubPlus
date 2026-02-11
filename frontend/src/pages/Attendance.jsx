import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle, Search, Download, BarChart3, Users, TrendingUp, FileText, Edit3, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── ADMIN / FACULTY VIEW ───────────────────────────────────────────
const MarkAttendance = ({ token }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [subject, setSubject] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(false);
    const [alreadyMarked, setAlreadyMarked] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // Fetch subjects
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await axios.get(`${API_URL}/academic/all`, { headers: { Authorization: `Bearer ${token}` } });
                setSubjects(res.data.subjects || []);
            } catch (err) {
                console.error('Error fetching subjects:', err);
            }
        };
        fetchSubjects();
    }, [token]);

    // Fetch students
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await axios.get(`${API_URL}/students`, { headers: { Authorization: `Bearer ${token}` } });
                const data = Array.isArray(res.data) ? res.data : res.data.data || [];
                setStudents(data);
                // Initialize all as PRESENT
                const init = {};
                data.forEach(s => { init[s.id] = 'PRESENT'; });
                setAttendance(init);
            } catch (err) {
                console.error('Error fetching students:', err);
            }
        };
        fetchStudents();
    }, [token]);

    // Check if attendance already exists
    useEffect(() => {
        if (!subject || !date) return;
        const check = async () => {
            try {
                const res = await axios.get(`${API_URL}/attendance/check?subject=${encodeURIComponent(subject)}&date=${date}`, { headers: { Authorization: `Bearer ${token}` } });
                setAlreadyMarked(res.data.exists);
                setEditMode(false);
                if (res.data.exists) {
                    // Load existing records
                    const existing = await axios.get(`${API_URL}/attendance/subject/${encodeURIComponent(subject)}?date=${date}`, { headers: { Authorization: `Bearer ${token}` } });
                    const map = {};
                    existing.data.forEach(r => { map[r.studentId] = r.status; });
                    setAttendance(prev => ({ ...prev, ...map }));
                }
            } catch (err) {
                console.error(err);
            }
        };
        check();
    }, [subject, date, token]);

    const handleStatusChange = (studentId, status) => {
        if (alreadyMarked && !editMode) return;
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const submitAttendance = async () => {
        if (!subject) return toast.error('Please select a subject');
        setLoading(true);
        try {
            const records = students.map(s => ({
                studentId: s.id,
                status: attendance[s.id] || 'PRESENT'
            }));

            if (editMode) {
                await axios.put(`${API_URL}/attendance/update`, { subject, date, records }, { headers: { Authorization: `Bearer ${token}` } });
                toast.success('Attendance updated!');
                setEditMode(false);
            } else {
                await axios.post(`${API_URL}/attendance`, { subject, date, records }, { headers: { Authorization: `Bearer ${token}` } });
                toast.success('Attendance marked successfully!');
                setAlreadyMarked(true);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save attendance');
        } finally {
            setLoading(false);
        }
    };

    const statusButtons = [
        { key: 'PRESENT', label: 'P', icon: CheckCircle, color: 'green' },
        { key: 'ABSENT', label: 'A', icon: XCircle, color: 'red' },
        { key: 'LATE', label: 'L', icon: Clock, color: 'amber' },
    ];

    const presentCount = Object.values(attendance).filter(s => s === 'PRESENT').length;
    const absentCount = Object.values(attendance).filter(s => s === 'ABSENT').length;
    const lateCount = Object.values(attendance).filter(s => s === 'LATE').length;

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-5">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
                        <Calendar size={18} className="text-blue-500" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="text-sm border-none bg-transparent focus:ring-0 text-gray-700 font-medium"
                        />
                    </div>

                    <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="">Select Subject</option>
                        {subjects.map(s => (
                            <option key={s.id} value={s.name}>{s.name} ({s.code})</option>
                        ))}
                    </select>

                    {alreadyMarked && !editMode && (
                        <button
                            onClick={() => setEditMode(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold hover:bg-amber-100 transition-colors"
                        >
                            <Edit3 size={16} /> Edit Attendance
                        </button>
                    )}
                </div>

                {alreadyMarked && !editMode && (
                    <div className="mt-3 px-3 py-2 bg-green-50 rounded-xl flex items-center gap-2 text-green-700 text-sm font-medium">
                        <CheckCircle size={16} /> Attendance already marked for this date & subject
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-4 text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase">Present</p>
                    <p className="text-2xl font-black text-green-600">{presentCount}</p>
                </div>
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-4 text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase">Absent</p>
                    <p className="text-2xl font-black text-red-600">{absentCount}</p>
                </div>
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-4 text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase">Late</p>
                    <p className="text-2xl font-black text-amber-600">{lateCount}</p>
                </div>
            </div>

            {/* Student List */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">
                        Students <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full ml-2">{students.length}</span>
                    </h3>
                </div>

                <div className="divide-y divide-gray-50">
                    {students.map((student, idx) => {
                        const status = attendance[student.id] || 'PRESENT';
                        return (
                            <motion.div
                                key={student.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.02 }}
                                className="p-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                        {(student.firstName || student.name || '?')[0]}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{student.firstName} {student.lastName}</p>
                                        <p className="text-xs text-gray-500 font-mono">{student.enrollmentNo || student.email}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {statusButtons.map(btn => {
                                        const active = status === btn.key;
                                        const Icon = btn.icon;
                                        return (
                                            <button
                                                key={btn.key}
                                                onClick={() => handleStatusChange(student.id, btn.key)}
                                                disabled={alreadyMarked && !editMode}
                                                className={`p-2 rounded-xl flex items-center gap-1 transition-all text-xs font-bold ${active
                                                        ? `bg-${btn.color}-100 text-${btn.color}-700 ring-2 ring-${btn.color}-500 ring-offset-1`
                                                        : `bg-gray-50 text-gray-400 hover:bg-${btn.color}-50 hover:text-${btn.color}-600 disabled:opacity-50`
                                                    }`}
                                            >
                                                <Icon size={16} />
                                                <span>{btn.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })}

                    {students.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            <Users size={40} className="mx-auto mb-3 opacity-50" />
                            <p className="font-medium">No students found</p>
                        </div>
                    )}
                </div>

                {students.length > 0 && subject && (!alreadyMarked || editMode) && (
                    <div className="p-4 bg-gray-50/80 border-t border-gray-100 text-right">
                        <button
                            onClick={submitAttendance}
                            disabled={loading}
                            className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : editMode ? 'Update Attendance' : 'Save Attendance'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── STUDENT VIEW ─────────────────────────────────────────────────
const StudentAttendanceView = ({ token }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyAttendance = async () => {
            try {
                const res = await axios.get(`${API_URL}/attendance/my`, { headers: { Authorization: `Bearer ${token}` } });
                setData(res.data);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load attendance');
            } finally {
                setLoading(false);
            }
        };
        fetchMyAttendance();
    }, [token]);

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

    if (!data) return <div className="text-center text-gray-400 py-12">No attendance data found</div>;

    const getColor = (pct) => {
        if (pct >= 75) return 'green';
        if (pct >= 50) return 'amber';
        return 'red';
    };

    return (
        <div className="space-y-6">
            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-5">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Overall Attendance</p>
                    <div className="flex items-end gap-2 mt-2">
                        <p className={`text-3xl font-black text-${getColor(data.overallPercentage)}-600`}>{data.overallPercentage}%</p>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
                        <div className={`bg-${getColor(data.overallPercentage)}-500 h-2 rounded-full transition-all`} style={{ width: `${data.overallPercentage}%` }}></div>
                    </div>
                </div>
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-5">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Classes</p>
                    <p className="text-3xl font-black text-gray-900 mt-2">{data.totalClasses}</p>
                </div>
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-5">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Classes Attended</p>
                    <p className="text-3xl font-black text-blue-600 mt-2">{data.totalPresent}</p>
                </div>
            </div>

            {/* Per Subject */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-gray-800">Subject-wise Attendance</h3>
                </div>
                <div className="divide-y divide-gray-50">
                    {Object.entries(data.subjectStats).map(([subjectName, stats]) => (
                        <div key={subjectName} className="p-4 flex items-center justify-between">
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900 text-sm">{subjectName}</p>
                                <p className="text-xs text-gray-500">{stats.present + stats.late}/{stats.total} classes</p>
                                <div className="w-full max-w-xs bg-gray-100 rounded-full h-1.5 mt-2">
                                    <div className={`bg-${getColor(stats.percentage)}-500 h-1.5 rounded-full transition-all`} style={{ width: `${stats.percentage}%` }}></div>
                                </div>
                            </div>
                            <span className={`text-lg font-black text-${getColor(stats.percentage)}-600`}>{stats.percentage}%</span>
                        </div>
                    ))}
                    {Object.keys(data.subjectStats).length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            <BarChart3 size={40} className="mx-auto mb-3 opacity-50" />
                            <p className="font-medium">No attendance records yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Records */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-gray-800">Recent Records</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-3 px-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="text-left py-3 px-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Subject</th>
                                <th className="text-left py-3 px-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data.records.slice(0, 20).map((r, i) => (
                                <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="py-3 px-4 text-sm text-gray-600 font-medium">{r.date}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800 font-semibold">{r.subject}</td>
                                    <td className="py-3 px-4">
                                        <span className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded-full ${r.status === 'PRESENT' ? 'bg-green-50 text-green-600' :
                                                r.status === 'ABSENT' ? 'bg-red-50 text-red-600' :
                                                    r.status === 'LATE' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-blue-50 text-blue-600'
                                            }`}>
                                            {r.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────
const Attendance = () => {
    const { user } = useSelector((state) => state.auth);
    const token = user?.token;
    const role = user?.role;
    const isStudent = role === 'STUDENT';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {isStudent ? 'View your attendance records and statistics' : 'Mark and manage daily class attendance'}
                    </p>
                </div>
            </div>

            {isStudent ? (
                <StudentAttendanceView token={token} />
            ) : (
                <MarkAttendance token={token} />
            )}
        </div>
    );
};

export default Attendance;
