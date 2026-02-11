import React, { useState, useEffect } from 'react';
import {
    DollarSign, CreditCard, TrendingUp, TrendingDown,
    Download, Search, FileText, AlertCircle, Plus, Trash2, Edit, X, Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FinanceCard = ({ title, amount, trend, trendValue, icon: Icon, color }) => (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-5 relative overflow-hidden">
        <div className={`absolute top-0 right-0 p-4 opacity-10`}>
            <Icon size={40} className={color} />
        </div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-black text-gray-900 mt-2">{amount}</h3>
        {trendValue && (
            <div className="flex items-center gap-1 mt-2">
                <span className={`text-xs font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'} flex items-center gap-0.5`}>
                    {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {trendValue}
                </span>
            </div>
        )}
    </div>
);

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
};

// ─── ADMIN VIEW ─────────────────────────────────────────────────────
const AdminFinanceView = ({ token }) => {
    const [summary, setSummary] = useState({ totalCollected: 0, pendingPayments: 0, totalExpected: 0, monthlyTrend: [] });
    const [payments, setPayments] = useState([]);
    const [structures, setStructures] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showStructureModal, setShowStructureModal] = useState(false);
    const [students, setStudents] = useState([]);
    const [paymentForm, setPaymentForm] = useState({ studentId: '', feeStructureId: '', amountPaid: '', paymentMethod: 'ONLINE', transactionId: '' });
    const [structureForm, setStructureForm] = useState({ programId: '', academicYearId: '', category: 'TUITION', amount: '', dueDate: '' });
    const [programs, setPrograms] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [loading, setLoading] = useState(true);

    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchAll();
    }, [token]);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [sumRes, payRes, strRes, stuRes] = await Promise.all([
                axios.get(`${API_URL}/fees/summary`, { headers }).catch(() => ({ data: {} })),
                axios.get(`${API_URL}/fees/payments`, { headers }).catch(() => ({ data: { payments: [] } })),
                axios.get(`${API_URL}/fees/structures`, { headers }).catch(() => ({ data: [] })),
                axios.get(`${API_URL}/students`, { headers }).catch(() => ({ data: [] }))
            ]);
            setSummary(sumRes.data);
            setPayments(payRes.data.payments || []);
            setStructures(Array.isArray(strRes.data) ? strRes.data : []);
            const stuData = Array.isArray(stuRes.data) ? stuRes.data : stuRes.data?.data || [];
            setStudents(stuData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRecordPayment = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/fees/payments`, paymentForm, { headers });
            toast.success('Payment recorded!');
            setShowPaymentModal(false);
            setPaymentForm({ studentId: '', feeStructureId: '', amountPaid: '', paymentMethod: 'ONLINE', transactionId: '' });
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to record payment');
        }
    };

    const handleCreateStructure = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/fees/structures`, structureForm, { headers });
            toast.success('Fee structure created!');
            setShowStructureModal(false);
            setStructureForm({ programId: '', academicYearId: '', category: 'TUITION', amount: '', dueDate: '' });
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create structure');
        }
    };

    const handleDeleteStructure = async (id) => {
        if (!window.confirm('Delete this fee structure?')) return;
        try {
            await axios.delete(`${API_URL}/fees/structures/${id}`, { headers });
            toast.success('Deleted');
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete');
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

    return (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FinanceCard title="Total Collection" amount={formatCurrency(summary.totalCollected)} icon={DollarSign} color="text-emerald-600" />
                <FinanceCard title="Pending Payments" amount={formatCurrency(summary.pendingPayments)} icon={AlertCircle} color="text-amber-600" />
                <FinanceCard title="Total Expected" amount={formatCurrency(summary.totalExpected)} icon={CreditCard} color="text-blue-600" />
            </div>

            {/* Chart */}
            {summary.monthlyTrend?.length > 0 && (
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Monthly Collection</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={summary.monthlyTrend} barSize={16}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Fee Structures */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800 text-sm">Fee Structures</h3>
                        <button
                            onClick={() => setShowStructureModal(true)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={14} /> Add
                        </button>
                    </div>
                    <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                        {structures.map(s => (
                            <div key={s.id} className="p-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors">
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">{s.category}</p>
                                    <p className="text-xs text-gray-500">{s.Program?.name || 'N/A'} • {s.AcademicYear?.name || 'N/A'}</p>
                                    {s.dueDate && <p className="text-xs text-gray-400">Due: {s.dueDate}</p>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-black text-gray-900">{formatCurrency(s.amount)}</span>
                                    <button onClick={() => handleDeleteStructure(s.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {structures.length === 0 && (
                            <div className="p-8 text-center text-gray-400 text-sm">No fee structures yet</div>
                        )}
                    </div>
                </div>

                {/* Recent Payments */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800 text-sm">Recent Payments</h3>
                        <button
                            onClick={() => setShowPaymentModal(true)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
                        >
                            <Plus size={14} /> Record Payment
                        </button>
                    </div>
                    <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                        {payments.slice(0, 10).map(p => (
                            <div key={p.id} className="p-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors">
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">{p.Student?.firstName} {p.Student?.lastName}</p>
                                    <p className="text-xs text-gray-500">{p.paymentMethod} • {p.paymentDate}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-emerald-600">{formatCurrency(p.amountPaid)}</p>
                                    <span className={`text-[10px] font-extrabold uppercase ${p.status === 'SUCCESS' ? 'text-emerald-500' : p.status === 'PENDING' ? 'text-amber-500' : 'text-red-500'}`}>{p.status}</span>
                                </div>
                            </div>
                        ))}
                        {payments.length === 0 && (
                            <div className="p-8 text-center text-gray-400 text-sm">No payments recorded yet</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Record Payment Modal */}
            <AnimatePresence>
                {showPaymentModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Record Payment</h3>
                                <button onClick={() => setShowPaymentModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleRecordPayment} className="space-y-4">
                                <select value={paymentForm.studentId} onChange={(e) => setPaymentForm(p => ({ ...p, studentId: e.target.value }))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" required>
                                    <option value="">Select Student</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.enrollmentNo})</option>)}
                                </select>
                                <select value={paymentForm.feeStructureId} onChange={(e) => setPaymentForm(p => ({ ...p, feeStructureId: e.target.value }))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                                    <option value="">Fee Structure (optional)</option>
                                    {structures.map(s => <option key={s.id} value={s.id}>{s.category} - {formatCurrency(s.amount)}</option>)}
                                </select>
                                <input type="number" placeholder="Amount" value={paymentForm.amountPaid} onChange={(e) => setPaymentForm(p => ({ ...p, amountPaid: e.target.value }))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" required />
                                <select value={paymentForm.paymentMethod} onChange={(e) => setPaymentForm(p => ({ ...p, paymentMethod: e.target.value }))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                                    <option value="ONLINE">Online</option>
                                    <option value="CASH">Cash</option>
                                    <option value="CHEQUE">Cheque</option>
                                    <option value="DD">DD</option>
                                </select>
                                <input type="text" placeholder="Transaction ID (optional)" value={paymentForm.transactionId} onChange={(e) => setPaymentForm(p => ({ ...p, transactionId: e.target.value }))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                                <button type="submit" className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity">Record Payment</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Structure Modal */}
            <AnimatePresence>
                {showStructureModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Create Fee Structure</h3>
                                <button onClick={() => setShowStructureModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleCreateStructure} className="space-y-4">
                                <input type="text" placeholder="Program ID" value={structureForm.programId} onChange={(e) => setStructureForm(p => ({ ...p, programId: e.target.value }))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" required />
                                <input type="text" placeholder="Academic Year ID" value={structureForm.academicYearId} onChange={(e) => setStructureForm(p => ({ ...p, academicYearId: e.target.value }))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" required />
                                <select value={structureForm.category} onChange={(e) => setStructureForm(p => ({ ...p, category: e.target.value }))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                                    <option value="TUITION">Tuition</option>
                                    <option value="HOSTEL">Hostel</option>
                                    <option value="TRANSPORT">Transport</option>
                                    <option value="EXAM">Exam</option>
                                    <option value="LIBRARY">Library</option>
                                    <option value="OTHER">Other</option>
                                </select>
                                <input type="number" placeholder="Amount" value={structureForm.amount} onChange={(e) => setStructureForm(p => ({ ...p, amount: e.target.value }))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" required />
                                <input type="date" placeholder="Due Date" value={structureForm.dueDate} onChange={(e) => setStructureForm(p => ({ ...p, dueDate: e.target.value }))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                                <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity">Create Structure</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

// ─── STUDENT VIEW ─────────────────────────────────────────────────
const StudentFinanceView = ({ token }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyFees = async () => {
            try {
                const res = await axios.get(`${API_URL}/fees/my`, { headers: { Authorization: `Bearer ${token}` } });
                setData(res.data);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load fee data');
            } finally {
                setLoading(false);
            }
        };
        fetchMyFees();
    }, [token]);

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

    if (!data) return <div className="text-center text-gray-400 py-12">No fee data found</div>;

    return (
        <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FinanceCard title="Total Paid" amount={formatCurrency(data.totalPaid)} icon={DollarSign} color="text-emerald-600" />
                <FinanceCard title="Total Due" amount={formatCurrency(data.totalDue)} icon={CreditCard} color="text-blue-600" />
                <FinanceCard title="Balance" amount={formatCurrency(data.balance)} icon={AlertCircle} color={data.balance > 0 ? 'text-red-600' : 'text-emerald-600'} />
            </div>

            {/* Payment History */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-gray-800">Payment History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-3 px-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="text-left py-3 px-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="text-left py-3 px-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Method</th>
                                <th className="text-right py-3 px-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="text-right py-3 px-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data.payments.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="py-3 px-4 text-sm text-gray-600 font-medium">{p.paymentDate}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800 font-semibold">{p.FeeStructure?.category || 'General'}</td>
                                    <td className="py-3 px-4"><span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600 font-medium">{p.paymentMethod}</span></td>
                                    <td className="py-3 px-4 text-right font-black text-emerald-600">{formatCurrency(p.amountPaid)}</td>
                                    <td className="py-3 px-4 text-right">
                                        <span className={`text-[10px] font-extrabold uppercase ${p.status === 'SUCCESS' ? 'text-emerald-500' : p.status === 'PENDING' ? 'text-amber-500' : 'text-red-500'}`}>{p.status}</span>
                                    </td>
                                </tr>
                            ))}
                            {data.payments.length === 0 && (
                                <tr><td colSpan={5} className="py-8 text-center text-gray-400 text-sm">No payments found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────
const Finances = () => {
    const { user } = useSelector((state) => state.auth);
    const token = user?.token;
    const role = user?.role;
    const isStudent = role === 'STUDENT';

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Financial Overview</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {isStudent ? 'View your fee status and payment history' : 'Track fee collections, manage structures, and record payments.'}
                    </p>
                </div>
            </div>

            {isStudent ? <StudentFinanceView token={token} /> : <AdminFinanceView token={token} />}
        </div>
    );
};

export default Finances;
