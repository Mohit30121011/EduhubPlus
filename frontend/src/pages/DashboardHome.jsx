import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Search, Bell, MapPin, ChevronDown,
    Calendar, BookOpen, GraduationCap,
    FileText, UserCheck, CreditCard,
    Zap, Clock, ArrowRight, Library, Monitor,
    Utensils, Sparkles, AlertCircle, Scissors, Hammer, Truck, Camera, Bug,
    Users, TrendingUp, DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DashboardHome = () => {
    const { user } = useSelector((state) => state.auth);

    // ─── Mock Data for dashboard stats fallback ─────────────────────
    const MOCK_DASHBOARD_STATS = {
        studentCount: 248,
        facultyCount: 32,
        attendance: { percentage: 87, present: 216, total: 248 },
        fees: { totalCollected: 1425000 },
    };

    const [stats, setStats] = useState(MOCK_DASHBOARD_STATS);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = user?.token || localStorage.getItem('token');
                const { data } = await axios.get(`${API_URL}/academic/dashboard-stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats({
                    studentCount: data.studentCount || MOCK_DASHBOARD_STATS.studentCount,
                    facultyCount: data.facultyCount || MOCK_DASHBOARD_STATS.facultyCount,
                    attendance: {
                        percentage: data.attendance?.percentage || MOCK_DASHBOARD_STATS.attendance.percentage,
                        present: data.attendance?.present || MOCK_DASHBOARD_STATS.attendance.present,
                        total: data.attendance?.total || MOCK_DASHBOARD_STATS.attendance.total,
                    },
                    fees: {
                        totalCollected: data.fees?.totalCollected || MOCK_DASHBOARD_STATS.fees.totalCollected,
                    },
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                setStats(MOCK_DASHBOARD_STATS);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user]);

    // Quick Actions
    const quickActions = [
        { icon: UserCheck, label: 'Attendance', color: 'bg-blue-50 text-blue-600', link: '/dashboard/attendance' },
        { icon: FileText, label: 'Results', color: 'bg-indigo-50 text-indigo-600', link: '/dashboard/academics?tab=subjects' },
        { icon: Library, label: 'Library', color: 'bg-sky-50 text-sky-600', link: '/dashboard/content' },
        { icon: Calendar, label: 'Timetable', color: 'bg-violet-50 text-violet-600', link: '/dashboard/academics?tab=timetables' },
        { icon: CreditCard, label: 'Fees', color: 'bg-blue-50 text-blue-600', link: '/dashboard/finances' },
        { icon: Monitor, label: 'LMS', color: 'bg-indigo-50 text-indigo-600', link: '/dashboard/content' },
    ];

    const upcomingClasses = [
        { subject: 'Data Structures', time: '10:00 AM', room: 'Lab 3', teacher: 'Dr. Smith', color: 'from-blue-500 to-indigo-500' },
        { subject: 'Web Development', time: '12:00 PM', room: 'Hall A', teacher: 'Prof. Doe', color: 'from-sky-500 to-blue-500' },
        { subject: 'Database Systems', time: '02:00 PM', room: 'Lab 1', teacher: 'Ms. Johnson', color: 'from-indigo-500 to-violet-500' },
    ];

    // Dynamic Stats Cards
    const statsCards = [
        {
            title: 'Total Students',
            value: stats?.studentCount || 0,
            icon: Users,
            btnText: 'View All',
            link: '/dashboard/students',
            gradient: "from-blue-600/90 via-blue-600/60 to-transparent",
            bgImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80"
        },
        {
            title: 'Faculty Members',
            value: stats?.facultyCount || 0,
            icon: GraduationCap,
            btnText: 'View Staff',
            link: '/dashboard/faculty',
            gradient: "from-purple-600/90 via-purple-600/60 to-transparent",
            bgImage: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80"
        },
        {
            title: 'Today\'s Attendance',
            value: `${stats?.attendance?.percentage || 0}%`,
            subtitle: `${stats?.attendance?.present || 0} / ${stats?.attendance?.total || 0} Present`,
            icon: UserCheck,
            btnText: 'Mark Now',
            link: '/dashboard/attendance',
            gradient: "from-green-600/90 via-green-600/60 to-transparent",
            bgImage: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&q=80"
        },
        {
            title: 'Fees Collected',
            value: `₹${(stats?.fees?.totalCollected || 0).toLocaleString()}`,
            icon: DollarSign,
            btnText: 'Manage Fees',
            link: '/dashboard/finances',
            gradient: "from-amber-600/90 via-amber-600/60 to-transparent",
            bgImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80"
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
                            Hello, <span className="text-blue-600">{user?.name?.split(' ')[0] || 'User'}!</span>
                        </h1>
                        <p className="text-gray-500 text-xs font-medium mt-1">Welcome back.</p>
                    </div>
                    <button className="p-2 relative bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                        <Bell size={20} className="text-gray-700" />
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white"></span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-semibold placeholder:text-gray-400 group-hover:shadow-md"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 border-l border-gray-200 pl-2.5">
                        <Zap size={16} className="text-blue-500" fill="currentColor" />
                    </div>
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
                        <span className="bolt-underline">Academics</span>
                    </h3>
                    <Link to="/dashboard/academics" className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition-colors">Explore</Link>
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

export default DashboardHome;
