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
            sidebar flex flex-col justify-between shrink-0
            fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-100 
            transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
            ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}>
            <div>
                {/* Logo Section */}
                <div className="p-8 pb-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30">
                            IC
                        </div>
                        <div>
                            <h1 className="font-bold text-xl text-secondary-600 leading-none tracking-tight header-accent">ICMS</h1>
                            <p className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-wider">Campus Manager</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="mt-2 space-y-1 px-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = location.pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => onClose && onClose()} // Close sidebar on mobile click
                                className={`sidebar-nav-item ${active ? 'active' : ''}`}
                            >
                                <Icon size={22} className={active ? 'text-white' : 'text-gray-400 group-hover:text-primary-500'} strokeWidth={active ? 2.5 : 2} />
                                <span className={active ? 'font-semibold' : ''}>{item.label}</span>
                                {active && (
                                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
                                )}
                            </Link>
                        );
                    })}

                    {/* Quick Links Section */}
                    <div className="mt-8 px-4">
                        <p className="mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Quick Links
                        </p>
                        <div className="space-y-1">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    onClick={() => onClose && onClose()}
                                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 px-2 py-1.5 rounded-md hover:bg-primary-50 transition-colors"
                                >
                                    <ChevronRight size={14} />
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </nav>
            </div>

            {/* Bottom Section: User Profile */}
            <div className="p-6 border-t border-gray-100 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
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
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
