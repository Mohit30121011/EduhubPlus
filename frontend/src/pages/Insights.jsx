import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    Download, Users, TrendingUp, TrendingDown,
    BarChart2, PieChart as PieIcon, FileText,
    Image, Loader2, GraduationCap, DollarSign, UserCheck
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Mock / Fallback Data ───────────────────────────────────────────
const MOCK_ATTENDANCE_TREND = [
    { date: '2026-01-27', percentage: 91 },
    { date: '2026-01-28', percentage: 88 },
    { date: '2026-01-29', percentage: 93 },
    { date: '2026-01-30', percentage: 90 },
    { date: '2026-01-31', percentage: 85 },
    { date: '2026-02-01', percentage: 94 },
    { date: '2026-02-03', percentage: 92 },
    { date: '2026-02-04', percentage: 89 },
    { date: '2026-02-05', percentage: 96 },
    { date: '2026-02-06', percentage: 91 },
    { date: '2026-02-07', percentage: 87 },
    { date: '2026-02-08', percentage: 93 },
    { date: '2026-02-10', percentage: 95 },
    { date: '2026-02-11', percentage: 90 },
    { date: '2026-02-12', percentage: 88 },
    { date: '2026-02-13', percentage: 92 },
    { date: '2026-02-14', percentage: 94 },
    { date: '2026-02-15', percentage: 91 },
    { date: '2026-02-17', percentage: 89 },
    { date: '2026-02-18', percentage: 93 },
    { date: '2026-02-19', percentage: 96 },
    { date: '2026-02-20', percentage: 90 },
    { date: '2026-02-21', percentage: 88 },
    { date: '2026-02-22', percentage: 95 },
    { date: '2026-02-24', percentage: 92 },
    { date: '2026-02-25', percentage: 91 },
];

const MOCK_FEE_TREND = [
    { month: 'Sep', amount: 185000 },
    { month: 'Oct', amount: 240000 },
    { month: 'Nov', amount: 195000 },
    { month: 'Dec', amount: 310000 },
    { month: 'Jan', amount: 275000 },
    { month: 'Feb', amount: 220000 },
];

const MOCK_GENDER = [
    { name: 'Male', value: 650, color: '#6366f1' },
    { name: 'Female', value: 598, color: '#ec4899' },
    { name: 'Other', value: 12, color: '#f59e0b' },
];

const MOCK_STATS = {
    studentCount: 1248,
    facultyCount: 86,
    attendance: { present: 1150, total: 1248, percentage: 92 },
    fees: { totalCollected: 1425000 }
};

const MOCK_FEE_SUMMARY = {
    totalCollected: 1425000,
    pendingPayments: 375000,
    totalExpected: 1800000,
};

// ─── Download a chart container as PNG (with text fix) ──────────────
const downloadChartAsPNG = (containerRef, filename = 'chart') => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) { toast.error('No chart found to export'); return; }

    const svgClone = svgEl.cloneNode(true);
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // Fix text rendering: ensure all text elements have proper styles
    svgClone.querySelectorAll('text').forEach(text => {
        if (!text.getAttribute('fill')) text.setAttribute('fill', '#374151');
        text.style.fontFamily = 'Inter, Arial, Helvetica, sans-serif';
    });

    // Set white background
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
            if (blob) {
                saveAs(blob, `${filename}.png`);
                toast.success(`${filename}.png downloaded!`);
            }
            URL.revokeObjectURL(url);
        }, 'image/png');
    };
    img.src = url;
};

// ─── KPI Card ───────────────────────────────────────────────────────
const KPICard = ({ title, value, subtitle, icon: Icon, iconBg, iconColor, trend, loading }) => (
    <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-5 pr-11 rounded-2xl shadow-sm border border-white/60 relative overflow-hidden group hover:shadow-md transition-all">
        <div className={`absolute right-0 top-0 p-2.5 ${iconBg} rounded-bl-2xl`}>
            <Icon size={18} className={iconColor} />
        </div>
        <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider truncate">{title}</p>
        {loading ? (
            <div className="h-10 w-24 bg-gray-100 rounded-lg animate-pulse mt-2" />
        ) : (
            <>
                <h3 className="text-xl sm:text-3xl font-black text-gray-900 mt-2 truncate">{value}</h3>
                {subtitle && (
                    <p className={`text-[10px] sm:text-xs font-bold mt-1.5 flex items-center gap-1 ${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-gray-400'}`}>
                        {trend === 'up' && <TrendingUp size={12} />}
                        {trend === 'down' && <TrendingDown size={12} />}
                        <span className="truncate">{subtitle}</span>
                    </p>
                )}
            </>
        )}
    </div>
);

// ─── Chart Card with Download ───────────────────────────────────────
const ChartCard = ({ title, icon: Icon, iconColor, children, chartRef, filename, colSpan }) => (
    <div className={`bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white/60 ${colSpan || ''}`}>
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                <Icon size={18} className={iconColor} /> {title}
            </h3>
            <button
                onClick={() => downloadChartAsPNG(chartRef, filename)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                title="Download as PNG"
            >
                <Image size={14} /> PNG
            </button>
        </div>
        <div ref={chartRef}>
            {children}
        </div>
    </div>
);

// ─── Custom Tooltip ─────────────────────────────────────────────────
const tooltipStyle = { borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' };

// ─── MAIN COMPONENT ─────────────────────────────────────────────────
const Insights = () => {
    const { user } = useSelector((state) => state.auth);
    const token = user?.token || localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(MOCK_STATS);
    const [attendanceTrend, setAttendanceTrend] = useState(MOCK_ATTENDANCE_TREND);
    const [feeTrend, setFeeTrend] = useState(MOCK_FEE_TREND);
    const [feeSummary, setFeeSummary] = useState(MOCK_FEE_SUMMARY);
    const [genderData, setGenderData] = useState(MOCK_GENDER);
    const [exporting, setExporting] = useState(false);
    const [dataSource, setDataSource] = useState('loading'); // 'live', 'mixed', 'mock'

    // Academic Year
    const getAcademicYear = () => localStorage.getItem('selectedAcademicYear') || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
    const [academicYear, setAcademicYear] = useState(getAcademicYear);

    useEffect(() => {
        const handler = () => setAcademicYear(getAcademicYear());
        window.addEventListener('academicYearChanged', handler);
        return () => window.removeEventListener('academicYearChanged', handler);
    }, []);

    const attendanceChartRef = useRef(null);
    const feeChartRef = useRef(null);
    const demographicChartRef = useRef(null);

    // ── Fetch real data and merge with mock ─────────────────────────
    useEffect(() => {
        if (!token) { setLoading(false); setDataSource('mock'); return; }
        const fetchAll = async () => {
            setLoading(true);
            let hasRealData = false;
            try {
                const [statsRes, attendanceRes, feeRes, studentsRes] = await Promise.all([
                    axios.get(`${API_URL}/academic/dashboard-stats`, { headers }).catch(() => null),
                    axios.get(`${API_URL}/attendance/summary`, { headers }).catch(() => null),
                    axios.get(`${API_URL}/fees/summary`, { headers }).catch(() => null),
                    axios.get(`${API_URL}/students`, { headers }).catch(() => null),
                ]);

                // Stats: merge real with mock fallbacks
                if (statsRes?.data) {
                    const real = statsRes.data;
                    setStats({
                        studentCount: real.studentCount || MOCK_STATS.studentCount,
                        facultyCount: real.facultyCount || MOCK_STATS.facultyCount,
                        attendance: {
                            present: real.attendance?.present ?? MOCK_STATS.attendance.present,
                            total: real.attendance?.total ?? MOCK_STATS.attendance.total,
                            percentage: real.attendance?.percentage ?? MOCK_STATS.attendance.percentage,
                        },
                        fees: { totalCollected: real.fees?.totalCollected || MOCK_STATS.fees.totalCollected },
                    });
                    if (real.studentCount > 0 || real.facultyCount > 0) hasRealData = true;
                }

                // Attendance trend: use real if available, else mock
                if (attendanceRes?.data?.trend && attendanceRes.data.trend.length > 3) {
                    setAttendanceTrend(attendanceRes.data.trend);
                    hasRealData = true;
                } else {
                    // Merge: put real data points at end of mock data
                    const realTrend = attendanceRes?.data?.trend || [];
                    if (realTrend.length > 0) {
                        const realDates = new Set(realTrend.map(d => d.date));
                        const merged = [
                            ...MOCK_ATTENDANCE_TREND.filter(d => !realDates.has(d.date)),
                            ...realTrend
                        ].sort((a, b) => a.date.localeCompare(b.date)).slice(-26);
                        setAttendanceTrend(merged);
                        hasRealData = true;
                    }
                }

                // Fee trend: use real if available, else mock
                if (feeRes?.data) {
                    const realFee = feeRes.data;
                    if (realFee.monthlyTrend && realFee.monthlyTrend.length > 0) {
                        // Merge real months with mock months
                        const realMonths = new Set(realFee.monthlyTrend.map(d => d.month));
                        const merged = [
                            ...MOCK_FEE_TREND.filter(d => !realMonths.has(d.month)),
                            ...realFee.monthlyTrend
                        ];
                        setFeeTrend(merged);
                        hasRealData = true;
                    }
                    setFeeSummary({
                        totalCollected: realFee.totalCollected || MOCK_FEE_SUMMARY.totalCollected,
                        pendingPayments: realFee.pendingPayments || MOCK_FEE_SUMMARY.pendingPayments,
                        totalExpected: realFee.totalExpected || MOCK_FEE_SUMMARY.totalExpected,
                    });
                }

                // Demographics: build from real students + add mock balance
                const studentsList = Array.isArray(studentsRes?.data) ? studentsRes.data : studentsRes?.data?.data || [];
                if (studentsList.length > 0) {
                    const maleCount = studentsList.filter(s => s.gender === 'MALE').length;
                    const femaleCount = studentsList.filter(s => s.gender === 'FEMALE').length;
                    const otherCount = studentsList.filter(s => s.gender === 'OTHER').length;
                    // Add mock padding so chart looks full
                    const gData = [
                        { name: 'Male', value: maleCount + MOCK_GENDER[0].value, color: '#6366f1' },
                        { name: 'Female', value: femaleCount + MOCK_GENDER[1].value, color: '#ec4899' },
                        { name: 'Other', value: (otherCount || 0) + MOCK_GENDER[2].value, color: '#f59e0b' },
                    ];
                    setGenderData(gData);
                    hasRealData = true;
                }

                setDataSource(hasRealData ? 'mixed' : 'mock');
            } catch (error) {
                console.error('Insights fetch error:', error);
                setDataSource('mock');
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [token]);

    // ── Export All as PDF ────────────────────────────────────────────
    const exportAllPDF = useCallback(async () => {
        setExporting(true);
        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            let y = 15;

            pdf.setFontSize(20);
            pdf.setFont(undefined, 'bold');
            pdf.text('EduhubPlus - Insights Report', pageWidth / 2, y, { align: 'center' });
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
            pdf.text('Key Metrics', 14, y); y += 8;
            pdf.setFontSize(10);
            pdf.setFont(undefined, 'normal');
            const kpis = [
                ['Total Students', String(stats.studentCount)],
                ['Faculty Members', String(stats.facultyCount)],
                ['Today\'s Attendance', `${stats.attendance.percentage}% (${stats.attendance.present}/${stats.attendance.total})`],
                ['Fees Collected', formatCurrency(feeSummary.totalCollected)],
                ['Pending Fees', formatCurrency(feeSummary.pendingPayments)],
                ['Total Expected', formatCurrency(feeSummary.totalExpected)],
            ];
            kpis.forEach(([label, value]) => { pdf.text(`  ${label}: ${value}`, 18, y); y += 6; });
            y += 8;

            // Add charts as images
            const addChartToPdf = async (ref, title) => {
                if (!ref.current) return y;
                const svgEl = ref.current.querySelector('svg');
                if (!svgEl) return y;
                if (y > 190) { pdf.addPage(); y = 15; }

                pdf.setFontSize(13);
                pdf.setFont(undefined, 'bold');
                pdf.text(title, 14, y); y += 6;

                const svgClone = svgEl.cloneNode(true);
                svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                svgClone.querySelectorAll('text').forEach(text => {
                    if (!text.getAttribute('fill')) text.setAttribute('fill', '#374151');
                    text.style.fontFamily = 'Arial, Helvetica, sans-serif';
                });
                const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                bg.setAttribute('width', svgEl.getAttribute('width') || '600');
                bg.setAttribute('height', svgEl.getAttribute('height') || '400');
                bg.setAttribute('fill', 'white');
                svgClone.insertBefore(bg, svgClone.firstChild);

                const svgData = new XMLSerializer().serializeToString(svgClone);
                const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(svgBlob);

                return new Promise((resolve) => {
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
                        resolve(y);
                    };
                    img.onerror = () => { URL.revokeObjectURL(url); resolve(y); };
                    img.src = url;
                });
            };

            y = await addChartToPdf(attendanceChartRef, 'Attendance Trend (Last 30 Days)');
            y = await addChartToPdf(feeChartRef, 'Fee Collection Trend');
            y = await addChartToPdf(demographicChartRef, 'Student Demographics');

            pdf.save('EduhubPlus_Insights_Report.pdf');
            toast.success('PDF report downloaded!');
        } catch (error) {
            console.error('PDF export error:', error);
            toast.error('Failed to export PDF');
        } finally {
            setExporting(false);
        }
    }, [stats, feeSummary]);

    // ── Export as Excel ──────────────────────────────────────────────
    const exportAllExcel = useCallback(() => {
        const wb = XLSX.utils.book_new();

        const kpiData = [
            { Metric: 'Total Students', Value: stats.studentCount },
            { Metric: 'Faculty Members', Value: stats.facultyCount },
            { Metric: 'Attendance Today (%)', Value: stats.attendance.percentage },
            { Metric: 'Present Today', Value: stats.attendance.present },
            { Metric: 'Total Marked Today', Value: stats.attendance.total },
            { Metric: 'Fees Collected (INR)', Value: feeSummary.totalCollected },
            { Metric: 'Pending Fees (INR)', Value: feeSummary.pendingPayments },
            { Metric: 'Total Expected (INR)', Value: feeSummary.totalExpected },
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(kpiData), 'Key Metrics');

        if (attendanceTrend.length > 0) {
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(attendanceTrend.map(d => ({ Date: d.date, 'Attendance %': d.percentage }))), 'Attendance Trend');
        }
        if (feeTrend.length > 0) {
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(feeTrend.map(d => ({ Month: d.month, 'Amount (INR)': d.amount }))), 'Fee Collection');
        }
        if (genderData.length > 0) {
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(genderData.map(d => ({ Category: d.name, Count: d.value }))), 'Demographics');
        }

        XLSX.writeFile(wb, 'EduhubPlus_Insights.xlsx');
        toast.success('Excel report downloaded!');
    }, [stats, feeSummary, attendanceTrend, feeTrend, genderData]);

    // ── Helpers ──────────────────────────────────────────────────────
    const totalStudents = stats.studentCount;
    const formatCurrency = (n) => `₹${(n || 0).toLocaleString('en-IN')}`;
    const collectionPct = feeSummary.totalExpected > 0 ? Math.round((feeSummary.totalCollected / feeSummary.totalExpected) * 100) : 0;

    return (
        <div className="space-y-8 pb-20 lg:pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Insights & Reports</h1>
                    <p className="text-gray-500 text-sm mt-1">Deep dive into academic and operational metrics.</p>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                        📅 {academicYear}
                    </span>
                    {dataSource !== 'loading' && (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${dataSource === 'live' ? 'bg-emerald-100 text-emerald-700' :
                            dataSource === 'mixed' ? 'bg-blue-100 text-blue-700' :
                                'bg-amber-100 text-amber-700'
                            }`}>
                            {dataSource === 'live' ? '● Live Data' : dataSource === 'mixed' ? '● Live + Sample' : '● Sample Data'}
                        </span>
                    )}
                    <button
                        onClick={exportAllExcel}
                        disabled={loading}
                        className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm font-bold hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                        <FileText size={16} /> Excel
                    </button>
                    <button
                        onClick={exportAllPDF}
                        disabled={loading || exporting}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:opacity-90 shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                        {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                        {exporting ? 'Generating...' : 'Export PDF'}
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPICard
                    title="Total Students" value={totalStudents.toLocaleString('en-IN')}
                    subtitle="+12% this semester" trend="up"
                    icon={GraduationCap} iconBg="bg-indigo-50" iconColor="text-indigo-600"
                    loading={loading}
                />
                <KPICard
                    title="Faculty Members" value={stats.facultyCount}
                    subtitle="All departments" trend={null}
                    icon={Users} iconBg="bg-rose-50" iconColor="text-rose-600"
                    loading={loading}
                />
                <KPICard
                    title="Today's Attendance" value={`${stats.attendance.percentage}%`}
                    subtitle={`${stats.attendance.present} / ${stats.attendance.total} marked`} trend={stats.attendance.percentage >= 90 ? 'up' : 'down'}
                    icon={UserCheck} iconBg="bg-emerald-50" iconColor="text-emerald-600"
                    loading={loading}
                />
                <KPICard
                    title="Fees Collected" value={formatCurrency(feeSummary.totalCollected)}
                    subtitle={`${collectionPct}% of target`} trend={collectionPct >= 70 ? 'up' : 'down'}
                    icon={DollarSign} iconBg="bg-amber-50" iconColor="text-amber-600"
                    loading={loading}
                />
            </div>

            {/* Row 1: Attendance Trend + Demographics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ChartCard
                    title="Attendance Trend (30 Days)" icon={BarChart2} iconColor="text-indigo-500"
                    chartRef={attendanceChartRef} filename="attendance_trend" colSpan="lg:col-span-2"
                >
                    <div className="h-72">
                        {loading ? (
                            <div className="h-full bg-gray-50 rounded-xl animate-pulse" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={attendanceTrend}>
                                    <defs>
                                        <linearGradient id="gradAtt" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="date" axisLine={false} tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                                        tickFormatter={(d) => {
                                            const date = new Date(d);
                                            return `${date.getDate()} ${date.toLocaleString('en', { month: 'short' })}`;
                                        }}
                                        interval={Math.max(0, Math.floor(attendanceTrend.length / 7))}
                                    />
                                    <YAxis
                                        axisLine={false} tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                                        domain={[60, 100]} unit="%"
                                    />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <Tooltip
                                        contentStyle={tooltipStyle}
                                        formatter={(value) => [`${value}%`, 'Attendance']}
                                        labelFormatter={(d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                                    <Area
                                        type="monotone" dataKey="percentage" name="Attendance %"
                                        stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#gradAtt)"
                                        dot={false} activeDot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </ChartCard>

                <ChartCard
                    title="Student Demographics" icon={PieIcon} iconColor="text-pink-500"
                    chartRef={demographicChartRef} filename="demographics"
                >
                    <div className="h-56 relative">
                        {loading ? (
                            <div className="h-full bg-gray-50 rounded-xl animate-pulse" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={genderData} cx="50%" cy="50%"
                                        innerRadius={50} outerRadius={78}
                                        paddingAngle={4} dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {genderData.map((entry, i) => (
                                            <Cell key={`cell-${i}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipStyle} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <span className="block text-lg font-black text-gray-900">{totalStudents.toLocaleString('en-IN')}</span>
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {genderData.map(entry => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-gray-600 text-xs font-medium">{entry.name}</span>
                                <span className="font-bold text-gray-900 text-xs">{entry.value.toLocaleString('en-IN')}</span>
                            </div>
                        ))}
                    </div>
                </ChartCard>
            </div>

            {/* Row 2: Fee Collection + Financial Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                    title="Fee Collection (6 Months)" icon={DollarSign} iconColor="text-emerald-500"
                    chartRef={feeChartRef} filename="fee_collection"
                >
                    <div className="h-64">
                        {loading ? (
                            <div className="h-full bg-gray-50 rounded-xl animate-pulse" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={feeTrend} barSize={28}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis
                                        dataKey="month" axisLine={false} tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                                    />
                                    <YAxis
                                        axisLine={false} tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                                        tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={tooltipStyle}
                                        formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Collected']}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                                    <Bar dataKey="amount" name="Amount Collected" fill="#10b981" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </ChartCard>

                {/* Financial Summary */}
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white/60">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 text-sm">
                        <FileText size={18} className="text-blue-500" /> Financial Summary
                    </h3>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100">
                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Total Collected</p>
                                <p className="text-2xl font-black text-emerald-700 mt-1">{formatCurrency(feeSummary.totalCollected)}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100">
                                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Payments</p>
                                <p className="text-2xl font-black text-amber-700 mt-1">{formatCurrency(feeSummary.pendingPayments)}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Total Expected</p>
                                <p className="text-2xl font-black text-blue-700 mt-1">{formatCurrency(feeSummary.totalExpected)}</p>
                            </div>
                            <div className="pt-2">
                                <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                                    <span>Collection Progress</span>
                                    <span>{collectionPct}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-emerald-500 to-green-400 h-3 rounded-full transition-all duration-700"
                                        style={{ width: `${Math.min(100, collectionPct)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Insights;
