import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, GraduationCap, CalendarCheck,
    FileText, BookOpen, Settings, LogOut, ChevronRight, TrendingUp, AlertCircle,
    FolderCog, Shield
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../redux/features/authSlice';

// Map of permission IDs to sidebar routes
const permissionRouteMap = {
    'dashboard': ['/dashboard', '/dashboard/analytics'],
    'enquiries': ['/dashboard/enquiries'],
    'admissions': ['/dashboard/admissions'],
    'academics': ['/dashboard/academics'],
    'finances': ['/dashboard/finances'],
    'content': ['/dashboard/content'],
    'insights': ['/dashboard/insights'],
    'staff': ['/dashboard/staff'],
    'tasks': ['/dashboard/tasks'],
    'master': ['/dashboard/master'],
};

const getNavItems = (userRole, userPermissions = []) => {
    const allItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Home', permissionId: 'dashboard' },
        { href: '/dashboard/analytics', icon: TrendingUp, label: 'Dashboard', permissionId: 'dashboard' },
        { href: '/dashboard/enquiries', icon: Users, label: 'Enquiries', permissionId: 'enquiries' },
        { href: '/dashboard/admissions', icon: GraduationCap, label: 'Admissions', permissionId: 'admissions' },
        { href: '/dashboard/academics', icon: BookOpen, label: 'Academics', permissionId: 'academics' },
        { href: '/dashboard/finances', icon: CalendarCheck, label: 'Finances', permissionId: 'finances' },
        { href: '/dashboard/content', icon: FileText, label: 'Content', permissionId: 'content' },
        { href: '/dashboard/insights', icon: AlertCircle, label: 'Insights', permissionId: 'insights' },
        { href: '/dashboard/staff', icon: Users, label: 'Staff', permissionId: 'staff' },
        { href: '/dashboard/tasks', icon: CalendarCheck, label: 'Tasks', permissionId: 'tasks' },
        { href: '/dashboard/master', icon: FolderCog, label: 'Academic Data', permissionId: 'master' },
    ];

    // SUPER_ADMIN sees everything
    if (userRole === 'SUPER_ADMIN') {
        allItems.push({ href: '/dashboard/admin', icon: Shield, label: 'Admin', permissionId: 'admin' });
        return allItems;
    }

    // Filter items based on permissions for ADMIN
    const permissions = userPermissions || [];
    const filteredItems = allItems.filter(item => permissions.includes(item.permissionId));

    return filteredItems;
};

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
            <div className="p-4 pb-3 flex items-center justify-center border-b border-gray-100 shrink-0">
                <img src="/logo.png" alt="EduhubPlus" className="h-14 object-contain" />
            </div>

            {/* Scrollable Navigation Section */}
            <div className="flex-1 overflow-y-auto pb-20">
                <nav className="mt-4 space-y-1 px-2">
                    {getNavItems(user?.role, user?.permissions).map((item) => {
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
