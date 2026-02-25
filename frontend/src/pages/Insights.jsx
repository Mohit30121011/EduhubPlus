import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    Download, Calendar, Users, TrendingUp, TrendingDown,
    BarChart2, PieChart as PieIcon, FileText, ChevronDown,
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

// ─── Download a chart container as PNG ──────────────────────────────
const downloadChartAsPNG = (containerRef, filename = 'chart') => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) { toast.error('No chart found to export'); return; }

    const svgClone = svgEl.cloneNode(true);
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    // Set white background
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('fill', 'white');
    svgClone.insertBefore(rect, svgClone.firstChild);

    const svgData = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new window.Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = 2; // High-res
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

// ─── KPI Card Component ─────────────────────────────────────────────
const KPICard = ({ title, value, trend, trendLabel, icon: Icon, iconBg, iconColor, loading }) => (
    <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-sm border border-white/60 relative overflow-hidden group hover:shadow-md transition-all">
        <div className={`absolute right-0 top-0 p-4 ${iconBg} rounded-bl-3xl`}>
            <Icon size={24} className={iconColor} />
        </div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        {loading ? (
            <div className="h-10 w-24 bg-gray-100 rounded-lg animate-pulse mt-2" />
        ) : (
            <>
                <h3 className="text-3xl font-black text-gray-900 mt-2">{value}</h3>
                {trend !== undefined && (
                    <p className={`text-xs font-bold mt-2 flex items-center gap-1 ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {trend >= 0 ? '+' : ''}{trend}%
                        {trendLabel && <span className="text-gray-400 font-medium">{trendLabel}</span>}
                    </p>
                )}
            </>
        )}
    </div>
);

// ─── Chart Card Wrapper (with download button) ─────────────────────
const ChartCard = ({ title, icon: Icon, iconColor, children, chartRef, filename, colSpan }) => (
    <div className={`bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white/60 ${colSpan || ''}`}>
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
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

// ─── MAIN COMPONENT ─────────────────────────────────────────────────
const Insights = () => {
    const { user } = useSelector((state) => state.auth);
    const token = user?.token || localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [attendanceTrend, setAttendanceTrend] = useState([]);
    const [feeTrend, setFeeTrend] = useState([]);
    const [feeSummary, setFeeSummary] = useState(null);
    const [genderData, setGenderData] = useState([]);
    const [exporting, setExporting] = useState(false);

    // Chart refs for PNG download
    const academicChartRef = useRef(null);
    const attendanceChartRef = useRef(null);
    const feeChartRef = useRef(null);
    const demographicChartRef = useRef(null);

    // ── Fetch all data ──────────────────────────────────────────────
    useEffect(() => {
        if (!token) return;
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [statsRes, attendanceRes, feeRes, studentsRes] = await Promise.all([
                    axios.get(`${API_URL}/academic/dashboard-stats`, { headers }).catch(() => ({ data: {} })),
                    axios.get(`${API_URL}/attendance/summary`, { headers }).catch(() => ({ data: { today: {}, trend: [] } })),
                    axios.get(`${API_URL}/fees/summary`, { headers }).catch(() => ({ data: { totalCollected: 0, pendingPayments: 0, totalExpected: 0, monthlyTrend: [] } })),
                    axios.get(`${API_URL}/students`, { headers }).catch(() => ({ data: [] })),
                ]);

                setStats(statsRes.data);
                setAttendanceTrend(attendanceRes.data.trend || []);
                setFeeSummary(feeRes.data);
                setFeeTrend(feeRes.data.monthlyTrend || []);

                // Demographics from student data
                const studentsList = Array.isArray(studentsRes.data) ? studentsRes.data : studentsRes.data?.data || [];
                const maleCount = studentsList.filter(s => s.gender === 'MALE').length;
                const femaleCount = studentsList.filter(s => s.gender === 'FEMALE').length;
                const otherCount = studentsList.filter(s => s.gender === 'OTHER').length;
                const unknownCount = studentsList.length - maleCount - femaleCount - otherCount;
                const gData = [];
                if (maleCount > 0) gData.push({ name: 'Male', value: maleCount, color: '#6366f1' });
                if (femaleCount > 0) gData.push({ name: 'Female', value: femaleCount, color: '#ec4899' });
                if (otherCount > 0) gData.push({ name: 'Other', value: otherCount, color: '#f59e0b' });
                if (unknownCount > 0) gData.push({ name: 'Not Specified', value: unknownCount, color: '#94a3b8' });
                if (gData.length === 0) gData.push({ name: 'No Data', value: 1, color: '#e5e7eb' });
                setGenderData(gData);
            } catch (error) {
                console.error('Insights fetch error:', error);
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

            // Title
            pdf.setFontSize(20);
            pdf.setFont(undefined, 'bold');
            pdf.text('EduhubPlus — Insights Report', pageWidth / 2, y, { align: 'center' });
            y += 8;
            pdf.setFontSize(10);
            pdf.setFont(undefined, 'normal');
            pdf.setTextColor(120);
            pdf.text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`, pageWidth / 2, y, { align: 'center' });
            y += 12;
            pdf.setTextColor(0);

            // KPIs
            pdf.setFontSize(14);
            pdf.setFont(undefined, 'bold');
            pdf.text('Key Metrics', 14, y);
            y += 8;

            pdf.setFontSize(10);
            pdf.setFont(undefined, 'normal');
            const kpis = [
                ['Total Students', String(stats?.studentCount || 0)],
                ['Faculty Members', String(stats?.facultyCount || 0)],
                ['Today\'s Attendance', `${stats?.attendance?.percentage || 0}% (${stats?.attendance?.present || 0}/${stats?.attendance?.total || 0})`],
                ['Fees Collected', `₹${(feeSummary?.totalCollected || 0).toLocaleString('en-IN')}`],
                ['Pending Fees', `₹${(feeSummary?.pendingPayments || 0).toLocaleString('en-IN')}`],
            ];
            kpis.forEach(([label, value]) => {
                pdf.text(`${label}: ${value}`, 18, y);
                y += 6;
            });
            y += 6;

            // Helper to convert chart ref SVG to image and add to PDF
            const addChartToPdf = async (ref, title) => {
                if (!ref.current) return y;
                const svgEl = ref.current.querySelector('svg');
                if (!svgEl) return y;

                if (y > 200) { pdf.addPage(); y = 15; }

                pdf.setFontSize(14);
                pdf.setFont(undefined, 'bold');
                pdf.text(title, 14, y);
                y += 6;

                const svgClone = svgEl.cloneNode(true);
                svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('width', '100%');
                rect.setAttribute('height', '100%');
                rect.setAttribute('fill', 'white');
                svgClone.insertBefore(rect, svgClone.firstChild);

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
                        pdf.addImage(imgData, 'PNG', 14, y, imgWidth, imgHeight);
                        y += imgHeight + 10;
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

        // KPIs sheet
        const kpiData = [
            { Metric: 'Total Students', Value: stats?.studentCount || 0 },
            { Metric: 'Faculty Members', Value: stats?.facultyCount || 0 },
            { Metric: 'Attendance Today (%)', Value: stats?.attendance?.percentage || 0 },
            { Metric: 'Present Today', Value: stats?.attendance?.present || 0 },
            { Metric: 'Total Marked Today', Value: stats?.attendance?.total || 0 },
            { Metric: 'Fees Collected (₹)', Value: feeSummary?.totalCollected || 0 },
            { Metric: 'Pending Fees (₹)', Value: feeSummary?.pendingPayments || 0 },
            { Metric: 'Total Expected (₹)', Value: feeSummary?.totalExpected || 0 },
        ];
        const wsKPI = XLSX.utils.json_to_sheet(kpiData);
        XLSX.utils.book_append_sheet(wb, wsKPI, 'Key Metrics');

        // Attendance trend sheet
        if (attendanceTrend.length > 0) {
            const wsAttendance = XLSX.utils.json_to_sheet(attendanceTrend.map(d => ({ Date: d.date, 'Attendance %': d.percentage })));
            XLSX.utils.book_append_sheet(wb, wsAttendance, 'Attendance Trend');
        }

        // Fee trend sheet
        if (feeTrend.length > 0) {
            const wsFee = XLSX.utils.json_to_sheet(feeTrend.map(d => ({ Month: d.month, 'Amount (₹)': d.amount })));
            XLSX.utils.book_append_sheet(wb, wsFee, 'Fee Collection');
        }

        // Demographics sheet
        if (genderData.length > 0) {
            const wsDemographics = XLSX.utils.json_to_sheet(genderData.map(d => ({ Category: d.name, Count: d.value })));
            XLSX.utils.book_append_sheet(wb, wsDemographics, 'Demographics');
        }

        XLSX.writeFile(wb, 'EduhubPlus_Insights.xlsx');
        toast.success('Excel report downloaded!');
    }, [stats, feeSummary, attendanceTrend, feeTrend, genderData]);

    // ── Computed values ──────────────────────────────────────────────
    const totalStudents = stats?.studentCount || 0;
    const attendancePct = stats?.attendance?.percentage || 0;
    const formatCurrency = (n) => `₹${(n || 0).toLocaleString('en-IN')}`;

    return (
        <div className="space-y-8 pb-20 lg:pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 header-accent">Insights & Reports</h1>
                    <p className="text-gray-500 text-sm mt-1">Deep dive into academic and operational metrics.</p>
                </div>
                <div className="flex gap-2 flex-wrap">
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
                    title="Total Students" value={totalStudents}
                    icon={GraduationCap} iconBg="bg-indigo-50" iconColor="text-indigo-600"
                    loading={loading}
                />
                <KPICard
                    title="Faculty Members" value={stats?.facultyCount || 0}
                    icon={Users} iconBg="bg-rose-50" iconColor="text-rose-600"
                    loading={loading}
                />
                <KPICard
                    title="Today's Attendance" value={`${attendancePct}%`}
                    trendLabel={`${stats?.attendance?.present || 0} / ${stats?.attendance?.total || 0}`}
                    icon={UserCheck} iconBg="bg-emerald-50" iconColor="text-emerald-600"
                    loading={loading}
                />
                <KPICard
                    title="Fees Collected" value={formatCurrency(feeSummary?.totalCollected)}
                    icon={DollarSign} iconBg="bg-amber-50" iconColor="text-amber-600"
                    loading={loading}
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Attendance Trend (30 Days) */}
                <ChartCard
                    title="Attendance Trend" icon={BarChart2} iconColor="text-indigo-500"
                    chartRef={attendanceChartRef} filename="attendance_trend" colSpan="lg:col-span-2"
                >
                    <div className="h-72">
                        {loading ? (
                            <div className="h-full bg-gray-50 rounded-xl animate-pulse" />
                        ) : attendanceTrend.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm font-medium">No attendance data available</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={attendanceTrend}>
                                    <defs>
                                        <linearGradient id="gradAtt" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} tickFormatter={(d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} interval="preserveStartEnd" />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} domain={[0, 100]} unit="%" />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                        formatter={(value) => [`${value}%`, 'Attendance']}
                                        labelFormatter={(d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    />
                                    <Area type="monotone" dataKey="percentage" name="Attendance %" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#gradAtt)" dot={false} activeDot={{ r: 5, strokeWidth: 2, fill: '#fff' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </ChartCard>

                {/* Demographics Pie */}
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
                                        data={genderData}
                                        cx="50%" cy="50%"
                                        innerRadius={55} outerRadius={80}
                                        paddingAngle={4} dataKey="value"
                                    >
                                        {genderData.map((entry, i) => (
                                            <Cell key={`cell-${i}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <span className="block text-xl font-black text-gray-900">{totalStudents}</span>
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Students</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {genderData.map(entry => (
                            <div key={entry.name} className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                <span className="text-gray-600 text-xs font-medium">{entry.name}</span>
                                <span className="font-bold text-gray-900 text-xs">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </ChartCard>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Fee Collection Trend */}
                <ChartCard
                    title="Fee Collection" icon={DollarSign} iconColor="text-emerald-500"
                    chartRef={feeChartRef} filename="fee_collection"
                >
                    <div className="h-64">
                        {loading ? (
                            <div className="h-full bg-gray-50 rounded-xl animate-pulse" />
                        ) : feeTrend.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm font-medium">No fee collection data</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={feeTrend} barSize={24}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip
                                        cursor={{ fill: '#f9fafb' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                        formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Collected']}
                                    />
                                    <Bar dataKey="amount" name="Amount" fill="#10b981" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </ChartCard>

                {/* Financial Summary Card */}
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white/60">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <FileText size={18} className="text-blue-500" /> Financial Summary
                    </h3>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100">
                                <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Total Collected</p>
                                <p className="text-2xl font-black text-emerald-700 mt-1">{formatCurrency(feeSummary?.totalCollected)}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100">
                                <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Pending Payments</p>
                                <p className="text-2xl font-black text-amber-700 mt-1">{formatCurrency(feeSummary?.pendingPayments)}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">Total Expected</p>
                                <p className="text-2xl font-black text-blue-700 mt-1">{formatCurrency(feeSummary?.totalExpected)}</p>
                            </div>
                            {feeSummary?.totalExpected > 0 && (
                                <div className="pt-2">
                                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                                        <span>Collection Progress</span>
                                        <span>{Math.round((feeSummary?.totalCollected / feeSummary?.totalExpected) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-emerald-500 to-green-400 h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(100, Math.round((feeSummary?.totalCollected / feeSummary?.totalExpected) * 100))}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Insights;
