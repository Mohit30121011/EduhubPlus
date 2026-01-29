import React, { useState } from 'react';
import {
    Download, Calendar, Users, TrendingUp,
    BarChart2, PieChart as PieIcon, FileText, ChevronDown
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';

// Mock Data
const performanceData = [
    { month: 'Jul', avg: 72, top: 95 },
    { month: 'Aug', avg: 75, top: 96 },
    { month: 'Sep', avg: 71, top: 94 },
    { month: 'Oct', avg: 78, top: 98 },
    { month: 'Nov', avg: 82, top: 97 },
    { month: 'Dec', avg: 85, top: 99 },
];

const attendanceData = [
    { day: 'Mon', present: 92, absent: 8 },
    { day: 'Tue', present: 94, absent: 6 },
    { day: 'Wed', present: 91, absent: 9 },
    { day: 'Thu', present: 95, absent: 5 },
    { day: 'Fri', present: 88, absent: 12 },
];

const genderData = [
    { name: 'Boys', value: 650, color: '#6366f1' },
    { name: 'Girls', value: 598, color: '#ec4899' },
];

const reportList = [
    { id: 1, name: 'Annual Academic Report 2024', date: '15 Jan 2025', size: '2.4 MB', type: 'PDF' },
    { id: 2, name: 'Student Attendance Summary (Q3)', date: '10 Jan 2025', size: '1.1 MB', type: 'XLSX' },
    { id: 3, name: 'Fee Collection Audit Dec 2024', date: '05 Jan 2025', size: '3.5 MB', type: 'PDF' },
    { id: 4, name: 'Teacher Performance Review', date: '02 Jan 2025', size: '850 KB', type: 'PDF' },
];

const Insights = () => {
    const [period, setPeriod] = useState('This Semester');

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 header-accent">Insights & Reports</h1>
                    <p className="text-gray-500 text-sm mt-1">Deep dive into academic and operational metrics.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative group">
                        <button className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 shadow-sm flex items-center gap-2">
                            <Calendar size={16} /> {period} <ChevronDown size={14} />
                        </button>
                    </div>
                    <button className="px-4 py-2 bg-secondary-900 text-white rounded-xl text-sm font-medium hover:bg-secondary-800 shadow-lg shadow-gray-900/20 flex items-center gap-2">
                        <Download size={18} /> Export All
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute right-0 top-0 p-4 bg-indigo-50 rounded-bl-3xl">
                        <TrendingUp size={24} className="text-indigo-600" />
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg. Class Performance</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">78.5%</h3>
                    <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1">
                        +4.2% <span className="text-gray-400 font-medium">vs last month</span>
                    </p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute right-0 top-0 p-4 bg-rose-50 rounded-bl-3xl">
                        <Users size={24} className="text-rose-600" />
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg. Attendance</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">92.4%</h3>
                    <p className="text-xs text-rose-500 font-bold mt-2 flex items-center gap-1">
                        -1.1% <span className="text-gray-400 font-medium">due to flu season</span>
                    </p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute right-0 top-0 p-4 bg-amber-50 rounded-bl-3xl">
                        <FileText size={24} className="text-amber-600" />
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Reports Generated</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">124</h3>
                    <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1">
                        All systems normal
                    </p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Academic Performance Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <BarChart2 size={18} className="text-indigo-500" /> Academic Trends
                        </h3>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorTop" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Legend />
                                <Area type="monotone" dataKey="avg" name="Average Score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAvg)" />
                                <Area type="monotone" dataKey="top" name="Top Scorer" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTop)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Demographics / Pie Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <PieIcon size={18} className="text-pink-500" /> Demographics
                    </h3>
                    <div className="h-56 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={genderData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {genderData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <span className="block text-xl font-bold text-gray-900">1,248</span>
                            <span className="text-[10px] text-gray-400 uppercase">Students</span>
                        </div>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        {genderData.map(entry => (
                            <div key={entry.name} className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                <span className="text-gray-600">{entry.name}</span>
                                <span className="font-bold text-gray-900">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Attendance Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Users size={18} className="text-amber-500" /> Weekly Attendance
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attendanceData} barSize={20}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Bar dataKey="present" name="Present %" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="absent" name="Absent %" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Downloadable Reports */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <FileText size={18} className="text-blue-500" /> Recent Reports
                        </h3>
                        <a href="#" className="text-xs text-primary-600 font-bold hover:underline">View Archive</a>
                    </div>
                    <div className="space-y-4">
                        {reportList.map(report => (
                            <div key={report.id} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 text-sm">{report.name}</h4>
                                        <p className="text-xs text-gray-400">{report.date} • {report.size}</p>
                                    </div>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-primary-600 bg-white border border-gray-200 rounded-lg shadow-sm group-hover:border-primary-200 transition-all">
                                    <Download size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Insights;
