import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, GraduationCap, CalendarCheck,
    FileText, BookOpen, Settings, LogOut, ChevronRight, TrendingUp, AlertCircle,
    FolderCog
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../redux/features/authSlice';

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { href: '/dashboard/analytics', icon: TrendingUp, label: 'Dashboard' },
    { href: '/dashboard/enquiries', icon: Users, label: 'Enquiries' },
    { href: '/dashboard/admissions', icon: GraduationCap, label: 'Admissions' },
    { href: '/dashboard/academics', icon: BookOpen, label: 'Academics' },
    { href: '/dashboard/finances', icon: CalendarCheck, label: 'Finances' },
    { href: '/dashboard/content', icon: FileText, label: 'Content' },
    { href: '/dashboard/insights', icon: AlertCircle, label: 'Insights' },
    { href: '/dashboard/staff', icon: Users, label: 'Staff' },
    { href: '/dashboard/tasks', icon: CalendarCheck, label: 'Tasks' },
    { href: '/dashboard/master', icon: FolderCog, label: 'Academic Data' },
];

const quickLinks = [
    { href: '/dashboard/students/add', label: 'Enroll Student' },
    { href: '/dashboard/students', label: 'Student List' },
    { href: '/dashboard/enquiries', label: 'Enquiry List' },
];

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(reset());
    };

    const isActive = (path) => location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));

    return (
        <aside className={`
            sidebar flex flex-col shrink-0
            fixed inset-y-0 right-0 z-50 w-64 border-l border-gray-100 
            transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:left-0 lg:right-auto lg:border-r lg:border-l-0
            ${isOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full lg:translate-x-0'}
            bg-white pb-16 lg:pb-0
        `}>
            {/* Logo Section - Fixed */}
            <div className="p-6 pb-4 flex items-center justify-between gap-4 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/30">
                        IC
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-secondary-600 leading-none tracking-tight header-accent">ICMS</h1>
                        <p className="text-xs font-medium text-gray-400 mt-0.5 uppercase tracking-wider">Campus Manager</p>
                    </div>
                </div>
            </div>

            {/* Scrollable Navigation Section */}
            <div className="flex-1 overflow-y-auto pb-20">
                <nav className="mt-4 space-y-1 px-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = location.pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => onClose && onClose()}
                                className={`sidebar-nav-item ${active ? 'active' : ''}`}
                            >
                                <Icon size={20} className={active ? 'text-white' : 'text-gray-400 group-hover:text-primary-500'} strokeWidth={active ? 2.5 : 2} />
                                <span className={`text-sm ${active ? 'font-semibold' : ''}`}>{item.label}</span>
                                {active && (
                                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Quick Links Section - Styled to match */}
                <div className="mt-6 px-2">
                    <p className="mb-2 px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Quick Links
                    </p>
                    <div className="space-y-1">
                        {quickLinks.map((link) => {
                            const active = location.pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    onClick={() => onClose && onClose()}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active
                                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                                        }`}
                                >
                                    <ChevronRight size={16} strokeWidth={active ? 2.5 : 2} />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Section: User Profile - Fixed above bottom nav on mobile */}
            <div className="absolute bottom-16 lg:bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white/95 backdrop-blur-sm">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {user?.name?.[0] || 'A'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <h4 className="text-sm font-bold text-gray-800 truncate group-hover:text-primary-600 transition-colors">{user?.name || 'Admin User'}</h4>
                        <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@icms.com'}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Logout"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
