import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CalendarCheck, Menu } from 'lucide-react';

const BottomNav = ({ onMenuClick }) => {
    const navItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Home', end: true },
        { href: '/dashboard/academics', icon: BookOpen, label: 'Academics' },
        { href: '/dashboard/tasks', icon: CalendarCheck, label: 'Tasks' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 z-50 lg:hidden pb-safe">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        end={item.end}
                        className={({ isActive }) => `
                            flex flex-col items-center justify-center w-full h-full space-y-1
                            text-xs font-medium transition-colors duration-200
                            ${isActive ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon
                                    size={24}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={isActive ? 'transform scale-110 transition-transform' : ''}
                                />
                                <span>{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}

                {/* Menu Button to Open Drawer */}
                <button
                    onClick={onMenuClick}
                    className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400 hover:text-gray-600 active:text-primary-600"
                >
                    <Menu size={24} />
                    <span className="text-xs font-medium">Menu</span>
                </button>
            </div>
        </div>
    );
};

export default BottomNav;
