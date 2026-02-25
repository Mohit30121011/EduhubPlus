import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    DollarSign, CreditCard, TrendingUp, TrendingDown, Wallet,
    Download, Search, FileText, AlertCircle, Plus, Trash2, Edit,
    X, Check, Users, ArrowUpRight, ArrowDownRight, Clock, Filter,
    ChevronDown, Receipt, IndianRupee, Loader2, PieChart, Calendar, Image
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Mock Data for fallback ─────────────────────────────────────────
const MOCK_SUMMARY = {
    totalCollected: 1425000,
    pendingPayments: 375000,
    totalExpected: 1800000,
    monthlyTrend: [
        { month: 'Sep', amount: 185000 },
        { month: 'Oct', amount: 240000 },
        { month: 'Nov', amount: 195000 },
        { month: 'Dec', amount: 310000 },
        { month: 'Jan', amount: 275000 },
        { month: 'Feb', amount: 220000 },
    ]
};

const MOCK_STRUCTURES = [
    { id: 'mock-s1', category: 'TUITION', amount: 125000, dueDate: '2026-03-31', Program: { name: 'B.Tech CSE' }, AcademicYear: { name: '2025-2026' }, isMock: true },
    { id: 'mock-s2', category: 'HOSTEL', amount: 45000, dueDate: '2026-03-31', Program: { name: 'B.Tech CSE' }, AcademicYear: { name: '2025-2026' }, isMock: true },
    { id: 'mock-s3', category: 'TRANSPORT', amount: 18000, dueDate: '2026-03-31', Program: { name: 'MBA Finance' }, AcademicYear: { name: '2025-2026' }, isMock: true },
    { id: 'mock-s4', category: 'EXAM', amount: 5000, dueDate: '2026-04-15', Program: { name: 'B.Tech ECE' }, AcademicYear: { name: '2025-2026' }, isMock: true },
    { id: 'mock-s5', category: 'LIBRARY', amount: 3000, dueDate: '2026-02-28', Program: { name: 'BBA' }, AcademicYear: { name: '2025-2026' }, isMock: true },
];

const MOCK_PAYMENTS = [
    { id: 'mock-p1', amountPaid: 125000, paymentDate: '2026-02-20', paymentMethod: 'ONLINE', status: 'SUCCESS', transactionId: 'TXN2026022001', Student: { firstName: 'Aarav', lastName: 'Sharma', enrollmentNo: 'EN2025001' }, FeeStructure: { category: 'TUITION' }, isMock: true },
    { id: 'mock-p2', amountPaid: 45000, paymentDate: '2026-02-18', paymentMethod: 'CASH', status: 'SUCCESS', transactionId: null, Student: { firstName: 'Priya', lastName: 'Verma', enrollmentNo: 'EN2025002' }, FeeStructure: { category: 'HOSTEL' }, isMock: true },
    { id: 'mock-p3', amountPaid: 125000, paymentDate: '2026-02-15', paymentMethod: 'CHEQUE', status: 'PENDING', transactionId: 'CHQ-4521', Student: { firstName: 'Rohan', lastName: 'Gupta', enrollmentNo: 'EN2025003' }, FeeStructure: { category: 'TUITION' }, isMock: true },
    { id: 'mock-p4', amountPaid: 18000, paymentDate: '2026-02-12', paymentMethod: 'ONLINE', status: 'SUCCESS', transactionId: 'TXN2026021201', Student: { firstName: 'Sneha', lastName: 'Patel', enrollmentNo: 'EN2025004' }, FeeStructure: { category: 'TRANSPORT' }, isMock: true },
    { id: 'mock-p5', amountPaid: 5000, paymentDate: '2026-02-10', paymentMethod: 'ONLINE', status: 'FAILED', transactionId: 'TXN2026021002', Student: { firstName: 'Vikram', lastName: 'Singh', enrollmentNo: 'EN2025005' }, FeeStructure: { category: 'EXAM' }, isMock: true },
    { id: 'mock-p6', amountPaid: 45000, paymentDate: '2026-02-08', paymentMethod: 'DD', status: 'SUCCESS', transactionId: 'DD-78210', Student: { firstName: 'Anita', lastName: 'Mehta', enrollmentNo: 'EN2025006' }, FeeStructure: { category: 'HOSTEL' }, isMock: true },
    { id: 'mock-p7', amountPaid: 125000, paymentDate: '2026-02-05', paymentMethod: 'ONLINE', status: 'SUCCESS', transactionId: 'TXN2026020501', Student: { firstName: 'Karan', lastName: 'Malhotra', enrollmentNo: 'EN2025007' }, FeeStructure: { category: 'TUITION' }, isMock: true },
    { id: 'mock-p8', amountPaid: 3000, paymentDate: '2026-02-03', paymentMethod: 'CASH', status: 'SUCCESS', transactionId: null, Student: { firstName: 'Divya', lastName: 'Joshi', enrollmentNo: 'EN2025008' }, FeeStructure: { category: 'LIBRARY' }, isMock: true },
];

const MOCK_STUDENT_DATA = {
    totalPaid: 170000,
    totalDue: 196000,
    balance: 26000,
    payments: [
        { id: 'ms-p1', amountPaid: 125000, paymentDate: '2026-01-15', paymentMethod: 'ONLINE', status: 'SUCCESS', FeeStructure: { category: 'TUITION', amount: 125000, dueDate: '2026-03-31' } },
        { id: 'ms-p2', amountPaid: 45000, paymentDate: '2025-08-20', paymentMethod: 'ONLINE', status: 'SUCCESS', FeeStructure: { category: 'HOSTEL', amount: 45000, dueDate: '2025-09-30' } },
        { id: 'ms-p3', amountPaid: 0, paymentDate: null, paymentMethod: null, status: 'PENDING', FeeStructure: { category: 'TRANSPORT', amount: 18000, dueDate: '2026-03-31' } },
        { id: 'ms-p4', amountPaid: 0, paymentDate: null, paymentMethod: null, status: 'PENDING', FeeStructure: { category: 'EXAM', amount: 5000, dueDate: '2026-04-15' } },
        { id: 'ms-p5', amountPaid: 0, paymentDate: null, paymentMethod: null, status: 'PENDING', FeeStructure: { category: 'LIBRARY', amount: 3000, dueDate: '2026-02-28' } },
    ]
};

// ─── Helpers ────────────────────────────────────────────────────────
const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

const getCategoryColor = (cat) => {
    const colors = {
        TUITION: 'bg-blue-50 text-blue-600', HOSTEL: 'bg-purple-50 text-purple-600',
        TRANSPORT: 'bg-amber-50 text-amber-600', EXAM: 'bg-rose-50 text-rose-600',
        LIBRARY: 'bg-emerald-50 text-emerald-600', OTHER: 'bg-gray-100 text-gray-600',
    };
    return colors[cat] || colors.OTHER;
};

const getStatusStyle = (status) => {
    if (status === 'SUCCESS') return 'bg-emerald-50 text-emerald-600';
    if (status === 'PENDING') return 'bg-amber-50 text-amber-600';
    return 'bg-red-50 text-red-600';
};

const getMethodIcon = (method) => {
    if (method === 'ONLINE') return '💳';
    if (method === 'CASH') return '💵';
    if (method === 'CHEQUE') return '📝';
    return '🏦';
};

const tooltipStyle = { borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' };

// ─── Stat Card ──────────────────────────────────────────────────────
const FinanceCard = ({ title, amount, icon: Icon, iconBg, iconColor, sub, trend, loading }) => (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-5 pr-14 relative overflow-hidden group hover:shadow-md transition-all">
        <div className={`absolute right-0 top-0 p-3 ${iconBg} rounded-bl-2xl`}>
            <Icon size={20} className={iconColor} />
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        {loading ? (
            <div className="h-8 w-28 bg-gray-100 rounded-lg animate-pulse mt-2" />
        ) : (
            <>
                <h3 className="text-2xl font-black text-gray-900 mt-2">{amount}</h3>
                {sub && (
                    <p className={`text-xs font-bold mt-2 flex items-center gap-1 ${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-gray-400'}`}>
                        {trend === 'up' && <TrendingUp size={12} />}
                        {trend === 'down' && <TrendingDown size={12} />}
                        {sub}
                    </p>
                )}
            </>
        )}
    </div>
);

// ─── Download a chart container as PNG (with text fix) ──────────────
const downloadChartAsPNG = (containerRef, filename = 'chart') => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) { toast.error('No chart found to export'); return; }

    const svgClone = svgEl.cloneNode(true);
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgClone.querySelectorAll('text').forEach(text => {
        if (!text.getAttribute('fill')) text.setAttribute('fill', '#374151');
        text.style.fontFamily = 'Inter, Arial, Helvetica, sans-serif';
    });
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', svgEl.getAttribute('width') || svgEl.viewBox?.baseVal?.width || 600);
    rect.setAttribute('height', svgEl.getAttribute('height') || svgEl.viewBox?.baseVal?.height || 400);
    rect.setAttribute('fill', 'white');
    svgClone.insertBefore(rect, svgClone.firstChild);

    const svgData = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new window.Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = 2;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
            if (blob) { saveAs(blob, `${filename}.png`); toast.success(`${filename}.png downloaded!`); }
            URL.revokeObjectURL(url);
        }, 'image/png');
    };
    img.src = url;
};

// ─── ADMIN VIEW ─────────────────────────────────────────────────────
const AdminFinanceView = ({ token }) => {
    const [summary, setSummary] = useState(MOCK_SUMMARY);
    const [payments, setPayments] = useState(MOCK_PAYMENTS);
    const [structures, setStructures] = useState(MOCK_STRUCTURES);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentSearch, setPaymentSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [exporting, setExporting] = useState(false);

    // Refs
    const trendChartRef = useRef(null);

    // Modal states
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showStructureModal, setShowStructureModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [saving, setSaving] = useState(false);

    // Forms
    const [paymentForm, setPaymentForm] = useState({ studentId: '', feeStructureId: '', amountPaid: '', paymentMethod: 'ONLINE', transactionId: '' });
    const [structureForm, setStructureForm] = useState({ category: 'TUITION', amount: '', dueDate: '', programName: '', academicYear: '2025-2026' });

    const headers = { Authorization: `Bearer ${token}` };

    // ── Fetch All ───────────────────────────────────────────────────
    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [sumRes, payRes, strRes, stuRes] = await Promise.all([
                axios.get(`${API_URL}/fees/summary`, { headers }).catch(() => null),
                axios.get(`${API_URL}/fees/payments`, { headers }).catch(() => null),
                axios.get(`${API_URL}/fees/structures`, { headers }).catch(() => null),
                axios.get(`${API_URL}/students`, { headers }).catch(() => null),
            ]);

            // Summary: merge real with mock
            if (sumRes?.data) {
                const real = sumRes.data;
                setSummary({
                    totalCollected: real.totalCollected || MOCK_SUMMARY.totalCollected,
                    pendingPayments: real.pendingPayments || MOCK_SUMMARY.pendingPayments,
                    totalExpected: real.totalExpected || MOCK_SUMMARY.totalExpected,
                    monthlyTrend: real.monthlyTrend?.length > 0 ? real.monthlyTrend : MOCK_SUMMARY.monthlyTrend,
                });
            }

            // Structures: real data first, then mock
            const realStructures = Array.isArray(strRes?.data) ? strRes.data.map(s => ({ ...s, isMock: false })) : [];
            setStructures([...realStructures, ...MOCK_STRUCTURES]);

            // Payments: real data first, then mock
            const realPayments = payRes?.data?.payments || [];
            setPayments([
                ...realPayments.map(p => ({ ...p, isMock: false })),
                ...MOCK_PAYMENTS,
            ]);

            // Students for dropdown
            const stuData = Array.isArray(stuRes?.data) ? stuRes.data : stuRes?.data?.data || [];
            setStudents(stuData);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ── Record Payment ──────────────────────────────────────────────
    const handleRecordPayment = async (e) => {
        e.preventDefault();
        if (!paymentForm.studentId || !paymentForm.amountPaid) {
            toast.error('Student and amount are required');
            return;
        }
        setSaving(true);
        try {
            await axios.post(`${API_URL}/fees/payments`, paymentForm, { headers });
            toast.success('Payment recorded successfully!');
            setShowPaymentModal(false);
            setPaymentForm({ studentId: '', feeStructureId: '', amountPaid: '', paymentMethod: 'ONLINE', transactionId: '' });
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to record payment');
        } finally {
            setSaving(false);
        }
    };

    // ── Create Structure ────────────────────────────────────────────
    const handleCreateStructure = async (e) => {
        e.preventDefault();
        if (!structureForm.amount || !structureForm.category) {
            toast.error('Category and amount are required');
            return;
        }
        setSaving(true);
        try {
            // We send the data — backend will create it. For now, add locally too.
            await axios.post(`${API_URL}/fees/structures`, {
                programId: structureForm.programId || null,
                academicYearId: structureForm.academicYearId || null,
                category: structureForm.category,
                amount: structureForm.amount,
                dueDate: structureForm.dueDate || null,
            }, { headers });
            toast.success('Fee structure created!');
            setShowStructureModal(false);
            setStructureForm({ category: 'TUITION', amount: '', dueDate: '', programName: '', academicYear: '2025-2026' });
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create structure');
        } finally {
            setSaving(false);
        }
    };

    // ── Delete Structure ────────────────────────────────────────────
    const handleDelete = async () => {
        if (!deleteTarget) return;
        if (deleteTarget.isMock) {
            toast.error('Sample data cannot be deleted');
            setShowDeleteModal(false);
            return;
        }
        setSaving(true);
        try {
            await axios.delete(`${API_URL}/fees/structures/${deleteTarget.id}`, { headers });
            toast.success('Deleted!');
            setShowDeleteModal(false);
            setDeleteTarget(null);
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete');
        } finally {
            setSaving(false);
        }
    };

    // ── Filtered Payments ───────────────────────────────────────────
    const filteredPayments = payments.filter(p => {
        const matchSearch = !paymentSearch ||
            `${p.Student?.firstName} ${p.Student?.lastName}`.toLowerCase().includes(paymentSearch.toLowerCase()) ||
            p.transactionId?.toLowerCase().includes(paymentSearch.toLowerCase());
        const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const collectionPct = summary.totalExpected > 0 ? Math.round((summary.totalCollected / summary.totalExpected) * 100) : 0;

    // ── Export All as PDF ────────────────────────────────────────────
    const exportPDF = useCallback(async () => {
        setExporting(true);
        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            let y = 15;

            pdf.setFontSize(20);
            pdf.setFont(undefined, 'bold');
            pdf.text('EduhubPlus - Financial Report', pageWidth / 2, y, { align: 'center' });
            y += 8;
            pdf.setFontSize(10);
            pdf.setFont(undefined, 'normal');
            pdf.setTextColor(120);
            pdf.text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`, pageWidth / 2, y, { align: 'center' });
            y += 14;
            pdf.setTextColor(0);

            // KPIs
            pdf.setFontSize(14);
            pdf.setFont(undefined, 'bold');
            pdf.text('Financial Summary', 14, y); y += 8;
            pdf.setFontSize(10);
            pdf.setFont(undefined, 'normal');
            const kpis = [
                ['Total Collection', formatCurrency(summary.totalCollected)],
                ['Pending Payments', formatCurrency(summary.pendingPayments)],
                ['Total Expected', formatCurrency(summary.totalExpected)],
                ['Collection Rate', `${collectionPct}%`],
                ['Total Transactions', String(payments.length)],
                ['Successful Payments', String(payments.filter(p => p.status === 'SUCCESS').length)],
            ];
            kpis.forEach(([label, value]) => { pdf.text(`  ${label}: ${value}`, 18, y); y += 6; });
            y += 8;

            // Fee Structures
            pdf.setFontSize(14);
            pdf.setFont(undefined, 'bold');
            pdf.text('Fee Structures', 14, y); y += 7;
            pdf.setFontSize(9);
            pdf.setFont(undefined, 'normal');
            structures.forEach(s => {
                if (y > 270) { pdf.addPage(); y = 15; }
                pdf.text(`  ${s.category} — ${formatCurrency(s.amount)} — ${s.Program?.name || 'General'} — Due: ${s.dueDate || 'N/A'}${s.isMock ? ' [SAMPLE]' : ''}`, 18, y);
                y += 5;
            });
            y += 8;

            // Chart image
            if (trendChartRef.current) {
                const svgEl = trendChartRef.current.querySelector('svg');
                if (svgEl) {
                    if (y > 190) { pdf.addPage(); y = 15; }
                    pdf.setFontSize(13);
                    pdf.setFont(undefined, 'bold');
                    pdf.text('Monthly Collection Trend', 14, y); y += 6;

                    const svgClone = svgEl.cloneNode(true);
                    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                    svgClone.querySelectorAll('text').forEach(t => {
                        if (!t.getAttribute('fill')) t.setAttribute('fill', '#374151');
                        t.style.fontFamily = 'Arial, Helvetica, sans-serif';
                    });
                    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    bg.setAttribute('width', svgEl.getAttribute('width') || '600');
                    bg.setAttribute('height', svgEl.getAttribute('height') || '400');
                    bg.setAttribute('fill', 'white');
                    svgClone.insertBefore(bg, svgClone.firstChild);
                    const svgData = new XMLSerializer().serializeToString(svgClone);
                    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                    const url = URL.createObjectURL(svgBlob);

                    await new Promise((resolve) => {
                        const img = new window.Image();
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const scale = 2;
                            canvas.width = img.width * scale;
                            canvas.height = img.height * scale;
                            const ctx = canvas.getContext('2d');
                            ctx.scale(scale, scale);
                            ctx.fillStyle = '#ffffff';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            ctx.drawImage(img, 0, 0);
                            const imgData = canvas.toDataURL('image/png');
                            const imgWidth = pageWidth - 28;
                            const imgHeight = (img.height / img.width) * imgWidth;
                            pdf.addImage(imgData, 'PNG', 14, y, imgWidth, Math.min(imgHeight, 80));
                            y += Math.min(imgHeight, 80) + 10;
                            URL.revokeObjectURL(url);
                            resolve();
                        };
                        img.onerror = () => { URL.revokeObjectURL(url); resolve(); };
                        img.src = url;
                    });
                }
            }

            // Recent Payments
            if (y > 200) { pdf.addPage(); y = 15; }
            pdf.setFontSize(14);
            pdf.setFont(undefined, 'bold');
            pdf.text('Recent Payments', 14, y); y += 7;
            pdf.setFontSize(9);
            pdf.setFont(undefined, 'normal');
            payments.slice(0, 20).forEach(p => {
                if (y > 275) { pdf.addPage(); y = 15; }
                pdf.text(`  ${p.Student?.firstName || ''} ${p.Student?.lastName || ''} — ${formatCurrency(p.amountPaid)} — ${p.paymentMethod} — ${p.status} — ${p.paymentDate || 'N/A'}`, 18, y);
                y += 5;
            });

            pdf.save('EduhubPlus_Financial_Report.pdf');
            toast.success('PDF report downloaded!');
        } catch (error) {
            console.error('PDF export error:', error);
            toast.error('Failed to export PDF');
        } finally {
            setExporting(false);
        }
    }, [summary, payments, structures, collectionPct]);

    // ── Export as Excel ──────────────────────────────────────────────
    const exportExcel = useCallback(() => {
        const wb = XLSX.utils.book_new();

        // Summary Sheet
        const summaryData = [
            { Metric: 'Total Collection (INR)', Value: summary.totalCollected },
            { Metric: 'Pending Payments (INR)', Value: summary.pendingPayments },
            { Metric: 'Total Expected (INR)', Value: summary.totalExpected },
            { Metric: 'Collection Rate (%)', Value: collectionPct },
            { Metric: 'Total Transactions', Value: payments.length },
            { Metric: 'Successful Payments', Value: payments.filter(p => p.status === 'SUCCESS').length },
            { Metric: 'Failed Payments', Value: payments.filter(p => p.status === 'FAILED').length },
            { Metric: 'Pending Payments Count', Value: payments.filter(p => p.status === 'PENDING').length },
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryData), 'Summary');

        // Monthly Trend
        if (summary.monthlyTrend?.length > 0) {
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
                summary.monthlyTrend.map(d => ({ Month: d.month, 'Amount (INR)': d.amount }))
            ), 'Monthly Trend');
        }

        // Fee Structures
        const structureData = structures.map(s => ({
            Category: s.category,
            'Amount (INR)': s.amount,
            Program: s.Program?.name || 'General',
            'Academic Year': s.AcademicYear?.name || '2025-2026',
            'Due Date': s.dueDate || 'N/A',
            Source: s.isMock ? 'Sample' : 'Live',
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(structureData), 'Fee Structures');

        // Payments
        const paymentData = payments.map(p => ({
            'Student Name': `${p.Student?.firstName || ''} ${p.Student?.lastName || ''}`.trim(),
            'Enrollment No': p.Student?.enrollmentNo || 'N/A',
            'Amount (INR)': p.amountPaid,
            'Payment Date': p.paymentDate || 'N/A',
            Method: p.paymentMethod,
            Status: p.status,
            'Transaction ID': p.transactionId || 'N/A',
            Category: p.FeeStructure?.category || 'General',
            Source: p.isMock ? 'Sample' : 'Live',
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(paymentData), 'Payments');

        XLSX.writeFile(wb, 'EduhubPlus_Financial_Report.xlsx');
        toast.success('Excel report downloaded!');
    }, [summary, payments, structures, collectionPct]);

    return (
        <>
            {/* Export Buttons */}
            <div className="flex gap-2 flex-wrap justify-end -mt-2 mb-2">
                <button
                    onClick={exportExcel}
                    disabled={loading}
                    className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm font-bold hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
                >
                    <FileText size={16} /> Excel
                </button>
                <button
                    onClick={exportPDF}
                    disabled={loading || exporting}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:opacity-90 shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                    {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    {exporting ? 'Generating...' : 'Export PDF'}
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <FinanceCard title="Total Collection" amount={formatCurrency(summary.totalCollected)}
                    icon={IndianRupee} iconBg="bg-emerald-50" iconColor="text-emerald-600"
                    sub={`${collectionPct}% of target`} trend="up" loading={loading} />
                <FinanceCard title="Pending Payments" amount={formatCurrency(summary.pendingPayments)}
                    icon={Clock} iconBg="bg-amber-50" iconColor="text-amber-600"
                    sub="Awaiting clearance" trend="down" loading={loading} />
                <FinanceCard title="Total Expected" amount={formatCurrency(summary.totalExpected)}
                    icon={CreditCard} iconBg="bg-blue-50" iconColor="text-blue-600"
                    sub="This academic year" loading={loading} />
                <FinanceCard title="Total Transactions" amount={payments.length}
                    icon={Receipt} iconBg="bg-violet-50" iconColor="text-violet-600"
                    sub={`${payments.filter(p => p.status === 'SUCCESS').length} successful`} loading={loading} />
            </div>

            {/* Collection Progress */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                        <PieChart size={16} className="text-blue-500" /> Collection Progress
                    </h3>
                    <span className="text-sm font-black text-gray-900">{collectionPct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, collectionPct)}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="bg-gradient-to-r from-emerald-500 to-green-400 h-3 rounded-full"
                    />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <span>Collected: {formatCurrency(summary.totalCollected)}</span>
                    <span>Target: {formatCurrency(summary.totalExpected)}</span>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                        <TrendingUp size={16} className="text-emerald-500" /> Monthly Collection Trend
                    </h3>
                    <button
                        onClick={() => downloadChartAsPNG(trendChartRef, 'Finance_Monthly_Trend')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                        title="Download as PNG"
                    >
                        <Image size={14} /> PNG
                    </button>
                </div>
                <div className="h-64" ref={trendChartRef}>
                    {loading ? (
                        <div className="h-full bg-gray-50 rounded-xl animate-pulse" />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={summary.monthlyTrend}>
                                <defs>
                                    <linearGradient id="gradFee" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                                <Tooltip contentStyle={tooltipStyle} formatter={v => [formatCurrency(v), 'Collected']} />
                                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#gradFee)" dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Two-column: Structures + Payments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Fee Structures */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                            <FileText size={16} className="text-blue-500" /> Fee Structures
                        </h3>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => setShowStructureModal(true)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-90"
                        >
                            <Plus size={14} /> Add
                        </motion.button>
                    </div>
                    <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}</div>
                        ) : structures.length === 0 ? (
                            <div className="p-8 text-center">
                                <FileText size={36} className="mx-auto mb-3 text-gray-200" />
                                <p className="text-gray-400 text-sm">No fee structures yet</p>
                                <button onClick={() => setShowStructureModal(true)} className="mt-3 text-blue-600 text-sm font-bold hover:underline">Create one →</button>
                            </div>
                        ) : (
                            structures.map(s => (
                                <div key={s.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${getCategoryColor(s.category)}`}>
                                            {s.category}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-800 text-sm truncate">{s.Program?.name || 'General'}</p>
                                            <p className="text-[10px] text-gray-400">
                                                {s.AcademicYear?.name || '2025-2026'}
                                                {s.dueDate && ` • Due: ${s.dueDate}`}
                                            </p>
                                            {s.isMock && <span className="text-[9px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded font-bold">SAMPLE</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="font-black text-gray-900 text-sm">{formatCurrency(s.amount)}</span>
                                        <button onClick={() => { setDeleteTarget(s); setShowDeleteModal(true); }}
                                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Payments */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                            <Receipt size={16} className="text-emerald-500" /> Recent Payments
                        </h3>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => setShowPaymentModal(true)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-90 self-start"
                        >
                            <Plus size={14} /> Record Payment
                        </motion.button>
                    </div>
                    {/* Search & Filter */}
                    <div className="p-3 border-b border-gray-50 flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                            <input type="text" placeholder="Search name or txn ID..." value={paymentSearch}
                                onChange={e => setPaymentSearch(e.target.value)}
                                className="w-full pl-8 pr-4 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                            />
                        </div>
                        <div className="flex gap-1">
                            {['ALL', 'SUCCESS', 'PENDING', 'FAILED'].map(s => (
                                <button key={s} onClick={() => setStatusFilter(s)}
                                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${statusFilter === s ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                                    {s === 'ALL' ? '🔍 All' : s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 space-y-3">{[1, 2, 3, 4].map(i => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}</div>
                        ) : filteredPayments.length === 0 ? (
                            <div className="p-8 text-center">
                                <Receipt size={36} className="mx-auto mb-3 text-gray-200" />
                                <p className="text-gray-400 text-sm">No payments found</p>
                            </div>
                        ) : (
                            filteredPayments.slice(0, 15).map(p => (
                                <div key={p.id} className="p-3 px-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="text-lg">{getMethodIcon(p.paymentMethod)}</span>
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-800 text-sm truncate">
                                                {p.Student?.firstName} {p.Student?.lastName}
                                            </p>
                                            <p className="text-[10px] text-gray-400">
                                                {p.paymentDate} • {p.FeeStructure?.category || 'General'}
                                                {p.transactionId && ` • ${p.transactionId}`}
                                            </p>
                                            {p.isMock && <span className="text-[9px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded font-bold">SAMPLE</span>}
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-2">
                                        <p className="font-black text-gray-900 text-sm">{formatCurrency(p.amountPaid)}</p>
                                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${getStatusStyle(p.status)}`}>
                                            {p.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* ─── Record Payment Modal ───────────────────────────── */}
            <AnimatePresence>
                {showPaymentModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowPaymentModal(false)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Receipt size={20} className="text-emerald-500" /> Record Payment
                                </h3>
                                <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={18} className="text-gray-400" /></button>
                            </div>
                            <form onSubmit={handleRecordPayment} className="p-5 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Student *</label>
                                    <select value={paymentForm.studentId} onChange={e => setPaymentForm(p => ({ ...p, studentId: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" required>
                                        <option value="">Select Student</option>
                                        {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.enrollmentNo})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Fee Structure</label>
                                    <select value={paymentForm.feeStructureId} onChange={e => setPaymentForm(p => ({ ...p, feeStructureId: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                                        <option value="">General Payment</option>
                                        {structures.filter(s => !s.isMock).map(s => <option key={s.id} value={s.id}>{s.category} - {formatCurrency(s.amount)}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Amount (₹) *</label>
                                        <input type="number" placeholder="₹ 0" value={paymentForm.amountPaid}
                                            onChange={e => setPaymentForm(p => ({ ...p, amountPaid: e.target.value }))}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Method</label>
                                        <select value={paymentForm.paymentMethod} onChange={e => setPaymentForm(p => ({ ...p, paymentMethod: e.target.value }))}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                                            <option value="ONLINE">💳 Online</option>
                                            <option value="CASH">💵 Cash</option>
                                            <option value="CHEQUE">📝 Cheque</option>
                                            <option value="DD">🏦 DD</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Transaction ID</label>
                                    <input type="text" placeholder="Optional" value={paymentForm.transactionId}
                                        onChange={e => setPaymentForm(p => ({ ...p, transactionId: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                                </div>
                                <div className="flex gap-3 justify-end pt-2">
                                    <button type="button" onClick={() => setShowPaymentModal(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
                                    <button type="submit" disabled={saving}
                                        className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
                                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                        {saving ? 'Recording...' : 'Record Payment'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Create Structure Modal ─────────────────────────── */}
            <AnimatePresence>
                {showStructureModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowStructureModal(false)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <FileText size={20} className="text-blue-500" /> Create Fee Structure
                                </h3>
                                <button onClick={() => setShowStructureModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={18} className="text-gray-400" /></button>
                            </div>
                            <form onSubmit={handleCreateStructure} className="p-5 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category *</label>
                                    <select value={structureForm.category} onChange={e => setStructureForm(p => ({ ...p, category: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                                        <option value="TUITION">Tuition Fee</option>
                                        <option value="HOSTEL">Hostel Fee</option>
                                        <option value="TRANSPORT">Transport Fee</option>
                                        <option value="EXAM">Exam Fee</option>
                                        <option value="LIBRARY">Library Fee</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Amount (₹) *</label>
                                        <input type="number" placeholder="₹ 0" value={structureForm.amount}
                                            onChange={e => setStructureForm(p => ({ ...p, amount: e.target.value }))}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Due Date</label>
                                        <input type="date" value={structureForm.dueDate}
                                            onChange={e => setStructureForm(p => ({ ...p, dueDate: e.target.value }))}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-end pt-2">
                                    <button type="button" onClick={() => setShowStructureModal(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
                                    <button type="submit" disabled={saving}
                                        className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
                                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                        {saving ? 'Creating...' : 'Create Structure'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Delete Confirmation ────────────────────────────── */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowDeleteModal(false)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Delete Fee Structure?</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Are you sure you want to delete the <strong>{deleteTarget?.category}</strong> fee structure of <strong>{formatCurrency(deleteTarget?.amount)}</strong>?
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
                                <button onClick={handleDelete} disabled={saving}
                                    className="px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 disabled:opacity-50">
                                    {saving ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

// ─── STUDENT VIEW ───────────────────────────────────────────────────
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
                // Use mock data as fallback
                setData(MOCK_STUDENT_DATA);
            } finally {
                setLoading(false);
            }
        };
        fetchMyFees();
    }, [token]);

    if (loading) return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => <div key={i} className="h-28 bg-gray-50 rounded-2xl animate-pulse" />)}
            </div>
            <div className="h-64 bg-gray-50 rounded-2xl animate-pulse" />
        </div>
    );

    const info = data || MOCK_STUDENT_DATA;

    return (
        <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FinanceCard title="Total Paid" amount={formatCurrency(info.totalPaid)}
                    icon={IndianRupee} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
                <FinanceCard title="Total Due" amount={formatCurrency(info.totalDue)}
                    icon={CreditCard} iconBg="bg-blue-50" iconColor="text-blue-600" />
                <FinanceCard title="Balance Due" amount={formatCurrency(info.balance)}
                    icon={AlertCircle} iconBg={info.balance > 0 ? 'bg-red-50' : 'bg-emerald-50'}
                    iconColor={info.balance > 0 ? 'text-red-600' : 'text-emerald-600'}
                    sub={info.balance > 0 ? 'Payment pending' : 'All clear ✓'} trend={info.balance > 0 ? 'down' : 'up'} />
            </div>

            {/* Payment History */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                    <Receipt size={16} className="text-blue-500" />
                    <h3 className="font-bold text-gray-800 text-sm">Payment History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</th>
                                <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Method</th>
                                <th className="text-right py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                                <th className="text-right py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {info.payments.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3 px-5 text-gray-600 font-medium">{p.paymentDate || '—'}</td>
                                    <td className="py-3 px-5">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${getCategoryColor(p.FeeStructure?.category)}`}>
                                            {p.FeeStructure?.category || 'General'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-5 hidden sm:table-cell">
                                        {p.paymentMethod ? (
                                            <span className="text-xs text-gray-500 font-medium">{getMethodIcon(p.paymentMethod)} {p.paymentMethod}</span>
                                        ) : '—'}
                                    </td>
                                    <td className="py-3 px-5 text-right font-black text-gray-900">{p.amountPaid > 0 ? formatCurrency(p.amountPaid) : formatCurrency(p.FeeStructure?.amount)}</td>
                                    <td className="py-3 px-5 text-right">
                                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${getStatusStyle(p.status)}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {info.payments.length === 0 && (
                                <tr><td colSpan={5} className="py-8 text-center text-gray-400 text-sm">No payments found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────
const Finances = () => {
    const { user } = useSelector((state) => state.auth);
    const token = user?.token || localStorage.getItem('token');
    const role = user?.role;
    const isStudent = role === 'STUDENT';

    // Academic Year
    const getAcademicYear = () => localStorage.getItem('selectedAcademicYear') || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
    const [academicYear, setAcademicYear] = useState(getAcademicYear);

    useEffect(() => {
        const handler = () => setAcademicYear(getAcademicYear());
        window.addEventListener('academicYearChanged', handler);
        return () => window.removeEventListener('academicYearChanged', handler);
    }, []);

    return (
        <div className="space-y-6 pb-20 lg:pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Financial Overview</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {isStudent ? 'View your fee status and payment history.' : 'Track fee collections, manage structures, and record payments.'}
                    </p>
                </div>
                <span className="self-start sm:self-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                    📅 {academicYear}
                </span>
            </div>

            {isStudent ? <StudentFinanceView token={token} /> : <AdminFinanceView token={token} />}
        </div>
    );
};

export default Finances;
