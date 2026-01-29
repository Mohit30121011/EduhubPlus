import React from 'react';
import { Users, GraduationCap, CalendarCheck, TrendingUp, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatsCard from '../components/StatsCard';

const data = [
    { name: 'Jan', attendance: 85, performance: 78 },
    { name: 'Feb', attendance: 88, performance: 80 },
    { name: 'Mar', attendance: 92, performance: 85 },
    { name: 'Apr', attendance: 90, performance: 82 },
    { name: 'May', attendance: 95, performance: 88 },
    { name: 'Jun', attendance: 88, performance: 85 },
];

const pieData = [
    { name: 'Present', value: 850 },
    { name: 'Absent', value: 120 },
    { name: 'Late', value: 30 },
];

const COLORS = ['#4da8da', '#ef4444', '#f59e0b']; // Sky Blue, Red, Amber

const AnalyticsDashboard = () => {
    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-secondary-500 header-accent">Analytics Overview</h1>
                <p className="text-gray-500 mt-1">Deep dive into campus performance metrics and trends.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatsCard
                    title="Total Students"
                    value="1,245"
                    icon={GraduationCap}
                    color="bg-gradient-to-br from-primary-500 to-primary-600"
                    trend="up"
                    trendValue="12%"
                />
                <StatsCard
                    title="Total Faculty"
                    value="84"
                    icon={Users}
                    color="bg-gradient-to-br from-violet-500 to-purple-600"
                    trend="up"
                    trendValue="4%"
                />
                <StatsCard
                    title="Avg. Attendance"
                    value="92%"
                    icon={CalendarCheck}
                    color="bg-gradient-to-br from-emerald-500 to-emerald-600"
                    trend="down"
                    trendValue="1%"
                />
                <StatsCard
                    title="Pending Alerts"
                    value="05"
                    icon={AlertCircle}
                    color="bg-gradient-to-br from-red-500 to-red-600"
                    trend="up"
                    trendValue="2"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 glass-card p-6 rounded-2xl border-t-4 border-primary-500 shadow-xl relative overflow-hidden transition-all hover:shadow-2xl">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-500 rounded-full opacity-5 blur-2xl"></div>
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <h3 className="text-lg font-bold text-gray-900">Attendance & Performance Trends</h3>
                        <button className="text-sm text-primary-600 font-medium hover:underline">View Report</button>
                    </div>
                    <div className="h-80 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4da8da" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4da8da" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0b1f3a" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0b1f3a" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area type="monotone" dataKey="attendance" stroke="#4da8da" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
                                <Area type="monotone" dataKey="performance" stroke="#0b1f3a" strokeWidth={3} fillOpacity={1} fill="url(#colorPerf)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Side Chart (Pie) */}
                <div className="glass-card p-6 rounded-2xl border-t-4 border-secondary-500 shadow-xl relative overflow-hidden transition-all hover:shadow-2xl">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary-500 rounded-full opacity-5 blur-2xl"></div>
                    <h3 className="text-lg font-bold text-gray-900 mb-6 relative z-10">Daily Attendance</h3>
                    <div className="h-64 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text Overly */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <span className="block text-2xl font-bold text-gray-900">85%</span>
                            <span className="text-xs text-gray-500">Present</span>
                        </div>
                    </div>
                    <div className="mt-4 space-y-3 relative z-10">
                        {pieData.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                    <span className="text-gray-600">{entry.name}</span>
                                </div>
                                <span className="font-semibold text-gray-900">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
