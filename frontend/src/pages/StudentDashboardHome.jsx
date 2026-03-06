import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Search, Bell, MapPin,
    Calendar, BookOpen, GraduationCap,
    FileText, UserCheck, CreditCard,
    Zap, Clock, ArrowRight, Library, Monitor,
    DollarSign, Trophy
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboardHome = () => {
    const { user } = useSelector((state) => state.auth);

    // ─── Mock Data for student dashboard stats fallback ─────────────────────
    const MOCK_DASHBOARD_STATS = {
        attendance: { percentage: 92, present: 46, total: 50 },
        fees: { totalPaid: 45000, totalDue: 15000, nextDueDate: '2026-04-15' },
        cgpa: 8.4,
        assignments: { pending: 3 },
    };

    const [stats, setStats] = useState(MOCK_DASHBOARD_STATS);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchStudentStats = async () => {
            try {
                const token = user?.token || localStorage.getItem('token');
                const { data } = await axios.get(`${API_URL}/students/me/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Map the backend response shape to our frontend stats structure
                const s = data.stats || {};
                setStats({
                    attendance: {
                        percentage: s.attendancePercentage ?? MOCK_DASHBOARD_STATS.attendance.percentage,
                        present: s.totalPresent ?? MOCK_DASHBOARD_STATS.attendance.present,
                        total: s.totalClasses ?? MOCK_DASHBOARD_STATS.attendance.total,
                    },
                    fees: {
                        totalPaid: s.totalPaid ?? MOCK_DASHBOARD_STATS.fees.totalPaid,
                        totalDue: s.feeBalance ?? MOCK_DASHBOARD_STATS.fees.totalDue,
                        nextDueDate: MOCK_DASHBOARD_STATS.fees.nextDueDate,
                    },
                    cgpa: s.cgpa || MOCK_DASHBOARD_STATS.cgpa,
                    assignments: { pending: MOCK_DASHBOARD_STATS.assignments.pending },
                    studentInfo: data.student || null,
                });
            } catch (error) {
                console.error('Error fetching student dashboard stats:', error);
                setStats(MOCK_DASHBOARD_STATS);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchStudentStats();
        }
    }, [user]);

    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);

    // All searchable pages for a student
    const searchablePages = [
        { label: 'My Profile', link: '/dashboard/settings', keywords: 'profile account settings details' },
        { label: 'My Attendance', link: '/dashboard/attendance', keywords: 'attendance mark present absent' },
        { label: 'My Fees & Payments', link: '/dashboard/finances', keywords: 'fee payment finance money due' },
        { label: 'My Subjects', link: '/dashboard/academics', keywords: 'academic department course subject' },
        { label: 'Assignments & Tasks', link: '/dashboard/tasks', keywords: 'task manager homework assignment' },
        { label: 'Notifications', link: '/dashboard/notifications', keywords: 'notification alert message' },
        { label: 'LMS / Library', link: '/dashboard/content', keywords: 'content library lms learning materials' },
    ];

    const filteredPages = searchQuery.trim()
        ? searchablePages.filter(p =>
            `${p.label} ${p.keywords}`.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    const handleSearchSelect = (link) => {
        setSearchQuery('');
        setShowSearchResults(false);
        navigate(link);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter' && filteredPages.length > 0) {
            handleSearchSelect(filteredPages[0].link);
        }
    };

    // Quick Actions tailored for students
    const quickActions = [
        { icon: UserCheck, label: 'Attendance', color: 'bg-blue-50 text-blue-600', link: '/dashboard/attendance' },
        { icon: BookOpen, label: 'Subjects', color: 'bg-indigo-50 text-indigo-600', link: '/dashboard/academics?tab=subjects' },
        { icon: Library, label: 'Materials', color: 'bg-sky-50 text-sky-600', link: '/dashboard/content' },
        { icon: Calendar, label: 'Timetable', color: 'bg-violet-50 text-violet-600', link: '/dashboard/academics?tab=timetables' },
        { icon: CreditCard, label: 'Pay Fee', color: 'bg-blue-50 text-blue-600', link: '/dashboard/finances' },
        { icon: Monitor, label: 'LMS', color: 'bg-indigo-50 text-indigo-600', link: '/dashboard/content' },
    ];

    const upcomingClasses = [
        { subject: 'Data Structures', time: '10:00 AM', room: 'Lab 3', teacher: 'Dr. Smith', color: 'from-blue-500 to-indigo-500' },
        { subject: 'Web Development', time: '12:00 PM', room: 'Hall A', teacher: 'Prof. Doe', color: 'from-sky-500 to-blue-500' },
        { subject: 'Database Systems', time: '02:00 PM', room: 'Lab 1', teacher: 'Ms. Johnson', color: 'from-indigo-500 to-violet-500' },
    ];

    // Dynamic Stats Cards tailored for students
    const statsCards = [
        {
            title: 'My Attendance',
            value: `${stats?.attendance?.percentage || 0}%`,
            subtitle: `${stats?.attendance?.present || 0} / ${stats?.attendance?.total || 0} Classes Attended`,
            icon: UserCheck,
            btnText: 'View Log',
            link: '/dashboard/attendance',
            gradient: "from-blue-600/90 via-blue-600/60 to-transparent",
            bgImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80"
        },
        {
            title: 'Fees Due',
            value: `₹${(stats?.fees?.totalDue || 0).toLocaleString()}`,
            subtitle: stats?.fees?.totalDue > 0 ? `Next DD: ${new Date(stats?.fees?.nextDueDate).toLocaleDateString()}` : 'No Pending Dues',
            icon: DollarSign,
            btnText: 'Pay Now',
            link: '/dashboard/finances',
            gradient: stats?.fees?.totalDue > 0 ? "from-red-600/90 via-red-600/60 to-transparent" : "from-green-600/90 via-green-600/60 to-transparent",
            bgImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80"
        },
        {
            title: 'Current CGPA',
            value: stats?.cgpa || 'N/A',
            subtitle: 'Last Semester: 8.2',
            icon: Trophy,
            btnText: 'View Report',
            link: '/dashboard/academics',
            gradient: "from-purple-600/90 via-purple-600/60 to-transparent",
            bgImage: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80"
        },
        {
            title: 'Pending Tasks',
            value: stats?.assignments?.pending || 0,
            subtitle: 'Assignments & Projects',
            icon: FileText,
            btnText: 'View Tasks',
            link: '/dashboard/tasks',
            gradient: "from-amber-600/90 via-amber-600/60 to-transparent",
            bgImage: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&q=80"
        }
    ];

    return (
        <div className="flex flex-col gap-5 pb-20 lg:pb-0">
            {/* 1. Header Section */}
            <div className="flex flex-col gap-4">
                {/* Top Bar: Clean Name Only */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black text-gray-900 leading-none tracking-tight">
                            Hello, <span className="text-blue-600">{user?.name?.split(' ')[0] || 'Student'}!</span>
                        </h1>
                        <p className="text-gray-500 text-xs font-medium mt-1">Welcome back to your dashboard.</p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/notifications')}
                        className="p-2 relative bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                        <Bell size={20} className="text-gray-700" />
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white"></span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search your portal..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setShowSearchResults(true); }}
                        onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                        onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                        onKeyDown={handleSearchKeyDown}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-semibold placeholder:text-gray-400 group-hover:shadow-md"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 border-l border-gray-200 pl-2.5">
                        <Zap size={16} className="text-blue-500" fill="currentColor" />
                    </div>

                    {/* Search Results Dropdown */}
                    {showSearchResults && filteredPages.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                            {filteredPages.map((page, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSearchSelect(page.link)}
                                    className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                                >
                                    <Search size={14} className="text-gray-400" />
                                    {page.label}
                                    <ArrowRight size={14} className="ml-auto text-gray-300" />
                                </button>
                            ))}
                        </div>
                    )}

                    {showSearchResults && searchQuery.trim() && filteredPages.length === 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-4 text-center text-sm text-gray-400">
                            No pages found for "{searchQuery}"
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Stats Cards */}
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-5 px-5 pb-2">
                {statsCards.map((stat, index) => (
                    <div
                        key={index}
                        className={`
                            relative flex-shrink-0 w-[85vw] sm:w-[260px] h-[150px] rounded-[24px] overflow-hidden snap-center group cursor-pointer shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300 ease-out
                        `}
                    >
                        {/* Background & Overlays */}
                        <div className="absolute inset-0 bg-gray-900 z-0">
                            <img
                                src={stat.bgImage}
                                alt=""
                                className="w-full h-full object-cover opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                        <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} z-10 opacity-95`} />
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-20 opacity-20" />

                        {/* Content */}
                        <div className="relative z-30 h-full flex flex-col justify-between p-5 text-white w-full">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-3xl font-black leading-none tracking-tight mb-1 text-white drop-shadow-sm">
                                        {stat.value}
                                    </h3>
                                    <p className="text-white/90 text-xs font-bold uppercase tracking-wider opacity-90">
                                        {stat.title}
                                    </p>
                                    {stat.subtitle && (
                                        <p className="text-[10px] text-white/80 mt-0.5 font-medium">{stat.subtitle}</p>
                                    )}
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 ml-2">
                                    <stat.icon className="w-4 h-4 text-white" strokeWidth={2.5} />
                                </div>
                            </div>

                            <Link to={stat.link} className="self-start px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full text-[10px] font-bold flex items-center gap-1.5 group-hover:bg-white group-hover:text-black transition-all duration-300">
                                {stat.btnText}
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Quick Actions Grid */}
            <div>
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="font-extrabold text-gray-900 text-lg tracking-tight">
                        <span className="bolt-underline">Quick Actions</span>
                    </h3>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                    {quickActions.map((action, idx) => (
                        <Link to={action.link} key={idx} className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100/50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
                            <div className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center shadow-sm`}>
                                <action.icon size={22} strokeWidth={2.5} />
                            </div>
                            <span className="text-xs font-bold text-gray-600 text-center leading-tight">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* 4. Horizontal Scroll (Class Schedule) */}
            <div>
                <div className="flex items-center gap-2 mb-4 px-1 mt-6">
                    <Clock size={20} className="text-blue-600" fill="currentColor" />
                    <h3 className="font-extrabold text-gray-900 text-lg tracking-tight">Today's Classes</h3>
                </div>
                <div className="flex flex-col gap-3">
                    {upcomingClasses.map((item, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:border-blue-200 transition-colors">
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${item.color}`}></div>
                            <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-gray-50 text-gray-800 font-bold text-xs ring-1 ring-gray-100 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                                <span className="text-sm">{item.time.split(' ')[0]}</span>
                                <span className="text-[10px] text-gray-400 font-medium">{item.time.split(' ')[1]}</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-base">{item.subject}</h4>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 font-medium">
                                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-blue-400" /> {item.room}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span className="flex items-center gap-1.5"><UserCheck size={12} className="text-blue-400" /> {item.teacher}</span>
                                </div>
                            </div>
                            <Link to="/dashboard/academics?tab=timetables" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-[-45deg]">
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboardHome;
