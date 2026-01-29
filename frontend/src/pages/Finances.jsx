import React, { useState } from 'react';
import {
    DollarSign, CreditCard, TrendingUp, TrendingDown,
    Download, Filter, Search, MoreHorizontal, FileText, AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data
const transactions = [
    { id: 'TXN-1001', student: 'Aarav Patel', class: 'Class 10 A', amount: '₹12,500', date: '29 Jan 2025', type: 'Credit', status: 'Success', mode: 'UPI' },
    { id: 'TXN-1002', student: 'Vihaan Gupta', class: 'Class 9 B', amount: '₹8,000', date: '29 Jan 2025', type: 'Credit', status: 'Pending', mode: 'Cash' },
    { id: 'TXN-1003', student: 'School Supplies', class: 'Vendor: ABC Corp', amount: '₹5,400', date: '28 Jan 2025', type: 'Debit', status: 'Success', mode: 'Bank Transfer' },
    { id: 'TXN-1004', student: 'Ishita Sharma', class: 'Class 11 A', amount: '₹15,000', date: '28 Jan 2025', type: 'Credit', status: 'Success', mode: 'Card' },
    { id: 'TXN-1005', student: 'Maintenance', class: 'Electric Bill', amount: '₹12,200', date: '27 Jan 2025', type: 'Debit', status: 'Success', mode: 'Auto-Debit' },
];

const invoices = [
    { id: 'INV-2024-001', student: 'Rahul Khanna', amount: '₹12,500', due: '05 Feb 2025', status: 'Unpaid' },
    { id: 'INV-2024-002', student: 'Sanya Kapoor', amount: '₹12,500', due: '01 Feb 2025', status: 'Overdue' },
    { id: 'INV-2024-003', student: 'Kabir Singh', amount: '₹10,000', due: '10 Feb 2025', status: 'Unpaid' },
];

const revenueData = [
    { month: 'Aug', fees: 45000, expenses: 12000 },
    { month: 'Sep', fees: 52000, expenses: 15000 },
    { month: 'Oct', fees: 48000, expenses: 10000 },
    { month: 'Nov', fees: 61000, expenses: 22000 },
    { month: 'Dec', fees: 55000, expenses: 18000 },
    { month: 'Jan', fees: 67000, expenses: 14000 },
];

const FinanceCard = ({ title, amount, trend, trendValue, icon: Icon, color }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className={`absolute top-0 right-0 p-4 opacity-10 ${color.replace('text-', 'bg-')}`}>
            <Icon size={40} />
        </div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-2">{amount}</h3>
            <div className="flex items-center gap-1 mt-2">
                <span className={`text-xs font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'} flex items-center`}>
                    {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {trendValue}
                </span>
                <span className="text-xs text-gray-400 ml-1">vs last month</span>
            </div>
        </div>
    </div>
);

const Finances = () => {
    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 header-accent">Financial Overview</h1>
                    <p className="text-gray-500 text-sm mt-1">Track fee collections, expenses, and invoices.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 shadow-sm flex items-center gap-2">
                        <Download size={16} /> Reports
                    </button>
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                        <DollarSign size={18} /> Collect Fees
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FinanceCard title="Total Collection" amount="₹4,25,000" trend="up" trendValue="12.5%" icon={DollarSign} color="text-emerald-600" />
                <FinanceCard title="Total Expenses" amount="₹1,12,400" trend="down" trendValue="5.2%" icon={CreditCard} color="text-rose-600" />
                <FinanceCard title="Pending Fees" amount="₹85,000" trend="up" trendValue="2.1%" icon={AlertCircle} color="text-amber-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Transaction List */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Chart Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-900">Revenue vs Expenses</h3>
                            <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-500 focus:outline-none">
                                <option>Last 6 Months</option>
                                <option>This Year</option>
                            </select>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData} barSize={12}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                    <Bar dataKey="fees" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-800 text-sm">Recent Transactions</h3>
                            <button className="text-xs text-primary-600 font-medium hover:underline">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left py-3 px-5 text-xs font-bold text-gray-400 uppercase">Description</th>
                                        <th className="text-left py-3 px-5 text-xs font-bold text-gray-400 uppercase">Date</th>
                                        <th className="text-left py-3 px-5 text-xs font-bold text-gray-400 uppercase">Mode</th>
                                        <th className="text-right py-3 px-5 text-xs font-bold text-gray-400 uppercase">Amount</th>
                                        <th className="text-right py-3 px-5 text-xs font-bold text-gray-400 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {transactions.map((txn) => (
                                        <tr key={txn.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-3 px-5">
                                                <div className="font-semibold text-gray-800 text-sm">{txn.student}</div>
                                                <div className="text-xs text-gray-500">{txn.class}</div>
                                            </td>
                                            <td className="py-3 px-5 text-sm text-gray-500">{txn.date}</td>
                                            <td className="py-3 px-5 text-xs">
                                                <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">{txn.mode}</span>
                                            </td>
                                            <td className={`py-3 px-5 text-right font-bold text-sm ${txn.type === 'Credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {txn.type === 'Credit' ? '+' : '-'}{txn.amount}
                                            </td>
                                            <td className="py-3 px-5 text-right">
                                                <span className={`text-[10px] font-bold uppercase ${txn.status === 'Success' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                    {txn.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Invoices */}
                <div className="space-y-6">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800 text-sm">Unpaid Invoices</h3>
                            <button className="p-1 rounded hover:bg-gray-100 text-gray-400">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {invoices.map(inv => (
                                <div key={inv.id} className="p-3 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs font-bold text-gray-700">{inv.student}</span>
                                        <span className="text-xs font-bold text-gray-900">{inv.amount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-gray-400">Due: {inv.due}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${inv.status === 'Overdue' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {inv.status}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        <button className="flex-1 py-1 text-xs border border-gray-200 rounded text-gray-600 hover:bg-gray-50">Remind</button>
                                        <button className="flex-1 py-1 text-xs bg-emerald-50 text-emerald-600 rounded font-medium hover:bg-emerald-100">Pay Now</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 text-xs font-medium text-gray-500 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50">
                            + Generate New Invoice
                        </button>
                    </div>

                    {/* Quick Transfer / Action Placeholder */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
                        <h3 className="font-bold text-lg mb-1">Pro Plan</h3>
                        <p className="text-xs text-indigo-100 opacity-80 mb-4">Unlock automated payment gateways and GST reports.</p>
                        <button className="w-full py-2 bg-white text-indigo-600 font-bold text-xs rounded-lg shadow-sm hover:bg-indigo-50">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Finances;
