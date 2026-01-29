import React from 'react';
import {
    Users, FileText, CheckCircle, Clock, AlertCircle,
    MoreHorizontal, Search, Filter, Plus, ChevronRight, Download
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data
const applications = [
    { id: 101, name: 'Sarthak Roy', class: 'Class 11 (Sci)', date: '29 Jan', status: 'Under Review', score: '88%', docs: 'Verified' },
    { id: 102, name: 'Tanya Verma', class: 'Class 9', date: '28 Jan', status: 'Interview', score: '92%', docs: 'Pending' },
    { id: 103, name: 'Rahul Khanna', class: 'Class 11 (Com)', date: '28 Jan', status: 'New', score: '76%', docs: 'Uploaded' },
    { id: 104, name: 'Meghan De', class: 'Class 6', date: '27 Jan', status: 'Offer Sent', score: '95%', docs: 'Verified' },
    { id: 105, name: 'Kabir Singh', class: 'Class 8', date: '26 Jan', status: 'Rejected', score: '65%', docs: 'Incomplete' },
];

const pipelineStats = [
    { name: 'New', value: 45, color: '#6366f1' },       // Indigo
    { name: 'Review', value: 30, color: '#f59e0b' },    // Amber
    { name: 'Interview', value: 15, color: '#a855f7' }, // Purple
    { name: 'Admitted', value: 85, color: '#10b981' },  // Emerald
];

const StatusBadge = ({ status }) => {
    const styles = {
        'New': 'bg-indigo-50 text-indigo-600 border-indigo-100',
        'Under Review': 'bg-amber-50 text-amber-600 border-amber-100',
        'Interview': 'bg-purple-50 text-purple-600 border-purple-100',
        'Offer Sent': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Rejected': 'bg-red-50 text-red-600 border-red-100',
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
            {status}
        </span>
    );
};

const PipelineCard = ({ title, count, color, percentage }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{count}</h3>
            </div>
            <div className={`p-2 rounded-lg bg-opacity-10`} style={{ backgroundColor: `${color}20` }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
            </div>
        </div>
        <div className="mt-3">
            <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="h-1.5 rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 font-medium">{percentage}% of total</p>
        </div>
    </div>
);

const Admissions = () => {
    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-600 header-accent">Admissions Portal</h1>
                    <p className="text-gray-500 text-sm mt-1">Track applications, manage workflows, and approve enrollments.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 shadow-sm flex items-center gap-2">
                        <Download size={16} /> Export Data
                    </button>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 shadow-lg shadow-primary-500/20 flex items-center gap-2">
                        <Plus size={18} /> New Application
                    </button>
                </div>
            </div>

            {/* Pipeline Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <PipelineCard title="New Applications" count="45" color="#6366f1" percentage={25} />
                <PipelineCard title="Under Review" count="30" color="#f59e0b" percentage={18} />
                <PipelineCard title="Interview" count="15" color="#a855f7" percentage={8} />
                <PipelineCard title="Admitted" count="85" color="#10b981" percentage={49} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Applications Table */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Toolbar */}
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search applicants..."
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                            />
                        </div>
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-200">
                            <Filter size={18} />
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left py-3 px-5 text-xs font-bold text-gray-400 uppercase">Applicant</th>
                                    <th className="text-left py-3 px-5 text-xs font-bold text-gray-400 uppercase">Applied For</th>
                                    <th className="text-left py-3 px-5 text-xs font-bold text-gray-400 uppercase">Date</th>
                                    <th className="text-left py-3 px-5 text-xs font-bold text-gray-400 uppercase">Status</th>
                                    <th className="text-right py-3 px-5 text-xs font-bold text-gray-400 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50/50 group transition-colors cursor-pointer">
                                        <td className="py-3 px-5">
                                            <div className="font-semibold text-gray-800 text-sm">{app.name}</div>
                                            <div className="text-xs text-gray-500">ID: #{app.id}</div>
                                        </td>
                                        <td className="py-3 px-5 text-sm text-gray-600">{app.class}</td>
                                        <td className="py-3 px-5 text-sm text-gray-500">{app.date}</td>
                                        <td className="py-3 px-5">
                                            <StatusBadge status={app.status} />
                                        </td>
                                        <td className="py-3 px-5 text-right">
                                            <button className="text-gray-400 hover:text-primary-600">
                                                <ChevronRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Side: Quick Actions & Requirements */}
                <div className="space-y-6">
                    {/* Distribution Chart */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 text-sm">Application Distribution</h3>
                        <div className="h-48 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pipelineStats}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pipelineStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                <span className="block text-xl font-bold text-gray-900">175</span>
                                <span className="text-[10px] text-gray-400 uppercase">Total</span>
                            </div>
                        </div>
                        <div className="mt-2 space-y-2">
                            {pipelineStats.map(stat => (
                                <div key={stat.name} className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ background: stat.color }}></div>
                                        <span className="text-gray-600">{stat.name}</span>
                                    </div>
                                    <span className="font-semibold">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pending Tasks */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 text-sm flex items-center gap-2">
                            <AlertCircle size={16} className="text-amber-500" /> Pending Actions
                        </h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                                <p className="text-xs font-bold text-amber-800 mb-1">Verify Documents</p>
                                <p className="text-xs text-amber-600">3 applicants have uploaded new documents waiting for verification.</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                                <p className="text-xs font-bold text-purple-800 mb-1">Schedule Interviews</p>
                                <p className="text-xs text-purple-600">5 applicants shortlisted for interviews.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admissions;
