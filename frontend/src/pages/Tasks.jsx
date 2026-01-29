import React, { useState } from 'react';
import {
    CheckCircle2, Circle, Clock, MoreHorizontal, Plus,
    Calendar, User, AlertCircle
} from 'lucide-react';

const initialTasks = [
    { id: 1, title: 'Update Fee Structure', desc: 'Revise class 10 fees for next academic year.', status: 'To Do', priority: 'High', date: '2 Feb', assignee: 'Accounts' },
    { id: 2, title: 'Annual Day Planning', desc: 'Finalize guest list and venue details.', status: 'In Progress', priority: 'Medium', date: '5 Feb', assignee: 'Admin' },
    { id: 3, title: 'Faculty Meeting', desc: 'Discuss term-end evaluation metrics.', status: 'Done', priority: 'High', date: '28 Jan', assignee: 'Principal' },
    { id: 4, title: 'Library Stock Audit', desc: 'Verify new book arrivals.', status: 'To Do', priority: 'Low', date: '10 Feb', assignee: 'Librarian' },
    { id: 5, title: 'Website Maintenance', desc: 'Update hero banner images.', status: 'In Progress', priority: 'Medium', date: '30 Jan', assignee: 'IT Dept' },
];

const priorityColors = {
    'High': 'bg-rose-50 text-rose-600',
    'Medium': 'bg-amber-50 text-amber-600',
    'Low': 'bg-emerald-50 text-emerald-600',
};

const TaskCard = ({ task }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group">
        <div className="flex justify-between items-start mb-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${priorityColors[task.priority]}`}>
                {task.priority}
            </span>
            <button className="text-gray-300 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal size={16} />
            </button>
        </div>
        <h4 className="font-bold text-gray-800 text-sm mb-1">{task.title}</h4>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{task.desc}</p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Calendar size={12} /> {task.date}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                <User size={12} /> {task.assignee}
            </div>
        </div>
    </div>
);

const Tasks = () => {
    return (
        <div className="space-y-8 pb-10 h-[calc(100vh-100px)] flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 header-accent">Task Manager</h1>
                    <p className="text-gray-500 text-sm mt-1">Organize school operations and staff assignments.</p>
                </div>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 shadow-lg shadow-primary-500/20 flex items-center gap-2">
                    <Plus size={18} /> Create Task
                </button>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <div className="flex gap-6 h-full min-w-[1000px] pb-4">
                    {/* Column: To Do */}
                    <div className="flex-1 flex flex-col bg-gray-50/50 rounded-2xl border border-gray-100/50">
                        <div className="p-4 flex items-center justify-between border-b border-gray-100">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                <Circle size={16} className="text-gray-400" /> To Do
                                <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">2</span>
                            </h3>
                            <button className="text-gray-400 hover:text-gray-600"><Plus size={16} /></button>
                        </div>
                        <div className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                            {initialTasks.filter(t => t.status === 'To Do').map(task => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    </div>

                    {/* Column: In Progress */}
                    <div className="flex-1 flex flex-col bg-indigo-50/30 rounded-2xl border border-indigo-50">
                        <div className="p-4 flex items-center justify-between border-b border-indigo-100/50">
                            <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                                <Clock size={16} className="text-indigo-500" /> In Progress
                                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">2</span>
                            </h3>
                            <button className="text-indigo-400 hover:text-indigo-600"><Plus size={16} /></button>
                        </div>
                        <div className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                            {initialTasks.filter(t => t.status === 'In Progress').map(task => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    </div>

                    {/* Column: Done */}
                    <div className="flex-1 flex flex-col bg-emerald-50/30 rounded-2xl border border-emerald-50">
                        <div className="p-4 flex items-center justify-between border-b border-emerald-100/50">
                            <h3 className="font-bold text-emerald-900 flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-emerald-500" /> Completed
                                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs">1</span>
                            </h3>
                            <button className="text-emerald-400 hover:text-emerald-600"><Plus size={16} /></button>
                        </div>
                        <div className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                            {initialTasks.filter(t => t.status === 'Done').map(task => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tasks;
