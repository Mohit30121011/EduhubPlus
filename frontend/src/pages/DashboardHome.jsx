import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Search, Bell, MapPin, ChevronDown,
    Calendar, BookOpen, GraduationCap,
    FileText, UserCheck, CreditCard,
    Zap, Clock, ArrowRight, Library, Monitor,
    Utensils, Sparkles, AlertCircle, Scissors, Hammer, Truck, Camera, Bug
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
    const { user } = useSelector((state) => state.auth);

    // Quick Actions
    const quickActions = [
        { icon: UserCheck, label: 'Attendance', color: 'bg-blue-50 text-blue-600', link: '/dashboard/attendance' },
        { icon: FileText, label: 'Results', color: 'bg-indigo-50 text-indigo-600', link: '/dashboard/academics' },
        { icon: Library, label: 'Library', color: 'bg-sky-50 text-sky-600', link: '/dashboard/content' },
        { icon: Calendar, label: 'Timetable', color: 'bg-violet-50 text-violet-600', link: '/dashboard/academics' },
        { icon: CreditCard, label: 'Fees', color: 'bg-blue-50 text-blue-600', link: '/dashboard/finances' },
        { icon: Monitor, label: 'LMS', color: 'bg-indigo-50 text-indigo-600', link: '/dashboard/content' },
    ];

    const upcomingClasses = [
        { subject: 'Data Structures', time: '10:00 AM', room: 'Lab 3', teacher: 'Dr. Smith', color: 'from-blue-500 to-indigo-500' },
        { subject: 'Web Development', time: '12:00 PM', room: 'Hall A', teacher: 'Prof. Doe', color: 'from-sky-500 to-blue-500' },
        { subject: 'Database Systems', time: '02:00 PM', room: 'Lab 1', teacher: 'Ms. Johnson', color: 'from-indigo-500 to-violet-500' },
    ];

    // Reference-style Cards (Exact NeedFul Props)
    const deals = [
        {
            title: 'Mid-Sem Exams',
            subtitle: 'Schedule Released for Fall 2024',
            icon: FileText,
            btnText: 'View Dates',
            gradient: "from-orange-600/90 via-orange-600/60 to-transparent"
        },
        {
            title: 'Tech Fest 2024',
            subtitle: 'Register for Hackathons & Events',
            icon: Sparkles,
            btnText: 'Register Now',
            gradient: "from-pink-600/90 via-pink-600/60 to-transparent"
        },
        {
            title: 'Library Due',
            subtitle: 'Return Books by Friday 5 PM',
            icon: BookOpen,
            btnText: 'Check Books',
            gradient: "from-blue-600/90 via-blue-600/60 to-transparent"
        },
    ];

    return (
        <div className="flex flex-col gap-8 pb-24 lg:pb-0">
            {/* 1. Header Section */}
            <div className="flex flex-col gap-5">
                {/* Top Bar: Clean Name Only */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-black text-gray-900 leading-none tracking-tight">
                            Hello, <span className="text-blue-600">{user?.name?.split(' ')[0] || 'Student'}!</span>
                        </h1>
                        <p className="text-gray-500 text-sm font-medium mt-1">Welcome back to campus.</p>
                    </div>
                    <button className="p-2.5 relative bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                        <Bell size={22} className="text-gray-700" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search for 'assignments'..."
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-semibold placeholder:text-gray-400 group-hover:shadow-md"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 border-l border-gray-200 pl-3">
                        <Zap size={18} className="text-blue-500" fill="currentColor" />
                    </div>
                </div>
            </div>

            {/* 2. Premium Cards (Exact NeedFul Replica) */}
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-6 px-6 pb-4">
                {deals.map((deal, index) => (
                    <div
                        key={index}
                        className={`
                            relative flex-shrink-0 w-[85vw] sm:w-[340px] h-[300px] rounded-[32px] overflow-hidden snap-center group cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-500 ease-out
                        `}
                    >
                        {/* Background Image Placeholder (Abstract) */}
                        <div className="absolute inset-0 bg-white z-0" />

                        {/* Gradient Overlay for Translucency */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${deal.gradient} z-10`} />

                        {/* Decorative Glass Reflection */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-20 opacity-30" />

                        {/* Content */}
                        <div className="relative z-30 h-full flex flex-col justify-between p-8 text-white w-full">
                            <div className="flex flex-col gap-4">
                                {/* Category Icon */}
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/20 shadow-sm">
                                    <deal.icon className="w-6 h-6 text-white" strokeWidth={2} />
                                </div>

                                {/* Title & Subtitle */}
                                <div>
                                    <h3 className="text-4xl font-extrabold leading-[1.1] tracking-tight mb-2 text-white drop-shadow-sm">
                                        {deal.title}
                                    </h3>
                                    <p className="text-white/90 text-sm font-medium line-clamp-2 leading-relaxed tracking-wide opacity-95">
                                        {deal.subtitle}
                                    </p>
                                </div>
                            </div>

                            {/* Button */}
                            <button className="self-start px-8 py-3.5 bg-white/20 backdrop-blur-xl border border-white/40 text-white rounded-full text-sm font-bold flex items-center gap-2 group-hover:bg-white group-hover:text-black transition-all duration-300 shadow-md">
                                {deal.btnText}
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
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
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition-colors">Explore</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {quickActions.map((action, idx) => (
                        <Link to={action.link} key={idx} className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100/50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
                            <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center shadow-sm`}>
                                <action.icon size={26} strokeWidth={2.5} />
                            </div>
                            <span className="text-xs font-bold text-gray-600 text-center leading-tight">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* 4. Horizontal Scroll (Class Schedule) */}
            <div>
                <div className="flex items-center gap-2 mb-4 px-1 mt-2">
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
                            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-[-45deg]">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
