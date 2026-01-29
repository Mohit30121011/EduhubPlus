import React, { useState } from 'react';
import {
    Search, Filter, Plus, MoreHorizontal, Phone, Mail,
    Calendar, CheckCircle2, Clock, XCircle, TrendingUp
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

// Mock Data for Enquiries
const mockEnquiries = [
    { id: 1, name: 'Aarav Patel', email: 'aarav.p@gmail.com', phone: '+91 98765 43210', source: 'Website', course: 'Class 11 (Science)', status: 'New', date: '29 Jan 2025' },
    { id: 2, name: 'Vihaan Gupta', email: 'vihaan.g@yahoo.com', phone: '+91 98765 12345', source: 'Referral', course: 'Class 10 (CBSE)', status: 'Contacted', date: '28 Jan 2025' },
    { id: 3, name: 'Ananya Singh', email: 'ananya.singh@outlook.com', phone: '+91 99887 77665', source: 'Social Media', course: 'Class 9 (ICSE)', status: 'Demo Scheduled', date: '27 Jan 2025' },
    { id: 4, name: 'Ishita Sharma', email: 'ishita.s@gmail.com', phone: '+91 88776 66554', source: 'Walk-in', course: 'Class 12 (Commerce)', status: 'Converted', date: '25 Jan 2025' },
    { id: 5, name: 'Rohan Mehta', email: 'rohan.m@gmail.com', phone: '+91 76543 21098', source: 'Website', course: 'Class 11 (Science)', status: 'Lost', date: '24 Jan 2025' },
    { id: 6, name: 'Sanya Kapoor', email: 'sanya.k@gmail.com', phone: '+91 91234 56789', source: 'Referral', course: 'Class 10 (CBSE)', status: 'New', date: '24 Jan 2025' },
];

const statusColors = {
    'New': 'bg-blue-50 text-blue-600',
    'Contacted': 'bg-amber-50 text-amber-600',
    'Demo Scheduled': 'bg-purple-50 text-purple-600',
    'Converted': 'bg-emerald-50 text-emerald-600',
    'Lost': 'bg-rose-50 text-rose-600',
};

// Simple Sparkline Data
const trendData = [
    { value: 12 }, { value: 18 }, { value: 15 }, { value: 25 }, { value: 22 }, { value: 30 }, { value: 28 }
];

const EnquiryList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const filteredEnquiries = mockEnquiries.filter(enquiry => {
        const matchesSearch = enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.phone.includes(searchTerm) ||
            enquiry.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || enquiry.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Enquiries & Leads</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-500 text-sm">Manage incoming student enquiries and track conversions.</p>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
                            +12% this week
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 shadow-sm flex items-center gap-2">
                        <CheckCircle2 size={16} /> Mark as Read
                    </button>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 shadow-lg shadow-primary-500/20 flex items-center gap-2 transition-all">
                        <Plus size={18} /> Add Enquiry
                    </button>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/50 flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Leads</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">1,248</h3>
                    </div>
                    <div className="w-24 h-12">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <Area type="monotone" dataKey="value" stroke="#4da8da" fill="#4da8da" fillOpacity={0.1} strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/50">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Conversion Rate</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">24.5%</h3>
                        </div>
                        <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <TrendingUp size={20} />
                        </span>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/50">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Follow-ups</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">34</h3>
                        </div>
                        <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                            <Clock size={20} />
                        </span>
                    </div>
                </div>
            </div>

            {/* Filters & Toolbar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {['All', 'New', 'Contacted', 'Demo Scheduled', 'Converted', 'Lost'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${filterStatus === status
                                ? 'bg-primary-50 text-primary-700 border border-primary-100'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                    <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Info</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Interest</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Enquiry Date</th>
                                <th className="text-right py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredEnquiries.map((enquiry) => (
                                <tr key={enquiry.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-primary-500 text-white flex items-center justify-center text-xs font-bold">
                                                {enquiry.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{enquiry.name}</p>
                                                <p className="text-xs text-gray-500">{enquiry.source}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Phone size={12} className="text-gray-400" /> {enquiry.phone}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Mail size={12} className="text-gray-400" /> {enquiry.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-medium text-gray-700">{enquiry.course}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[enquiry.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {enquiry.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar size={14} className="text-gray-400" />
                                            {enquiry.date}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="text-gray-400 hover:text-primary-600 p-1 rounded-md transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination (Static) */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Showing 6 of 1,248 entries</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnquiryList;
