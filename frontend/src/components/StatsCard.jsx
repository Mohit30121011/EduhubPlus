import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color }) => {
    // Extract base color name for dynamic shadows (simple mapping)
    // Assuming color format "bg-gradient-to-br from-X-500..."
    const shadowColor = color.includes('primary') ? 'shadow-sky-200' :
        color.includes('secondary') ? 'shadow-slate-200' :
            color.includes('emerald') ? 'shadow-emerald-200' :
                color.includes('red') ? 'shadow-red-200' :
                    (color.includes('violet') || color.includes('purple')) ? 'shadow-purple-200' : 'shadow-gray-200';

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className={`glass-card p-6 rounded-2xl relative overflow-hidden transition-all duration-300 border-t-4 border-white ${shadowColor} hover:shadow-xl`}
        >
            {/* Background Decoration */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 ${color}`}></div>
            <div className={`absolute -right-2 top-2 w-12 h-12 rounded-full opacity-10 ${color}`}></div>

            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
                </div>

                <div className={`p-4 rounded-xl ${color} shadow-lg text-white transform rotate-3 transition-transform group-hover:rotate-6`}>
                    <Icon size={28} />
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                {trend && (
                    <div className="flex items-center text-sm font-semibold">
                        <span className={`flex items-center ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'} bg-white/80 px-2 py-1 rounded-lg backdrop-blur-sm shadow-sm`}>
                            {trend === 'up' ? '▲' : '▼'} {trendValue}
                        </span>
                        <span className="text-gray-400 ml-2 text-xs">vs last month</span>
                    </div>
                )}

                {/* Visual Line Decorator */}
                <div className="flex gap-1 h-1">
                    <div className={`w-8 rounded-full opacity-80 ${color}`}></div>
                    <div className={`w-2 rounded-full opacity-40 ${color}`}></div>
                </div>
            </div>
        </motion.div>
    );
};

export default StatsCard;
