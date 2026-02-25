import React, { useState } from 'react';
import {
    CheckCircle2, Circle, Clock, MoreHorizontal, Plus,
    Calendar, User, AlertCircle, X, Trash2, ChevronRight,
    GripVertical, Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// ─── MOCK DATA ──────────────────────────────────────────────────────
const initialTasks = [
    { id: 1, title: 'Update Fee Structure', desc: 'Revise class 10 fees for next academic year.', status: 'To Do', priority: 'High', date: '2 Mar', assignee: 'Accounts' },
    { id: 2, title: 'Annual Day Planning', desc: 'Finalize guest list and venue details.', status: 'In Progress', priority: 'Medium', date: '5 Mar', assignee: 'Admin' },
    { id: 3, title: 'Faculty Meeting', desc: 'Discuss term-end evaluation metrics.', status: 'Done', priority: 'High', date: '28 Feb', assignee: 'Principal' },
    { id: 4, title: 'Library Stock Audit', desc: 'Verify new book arrivals and update catalog.', status: 'To Do', priority: 'Low', date: '10 Mar', assignee: 'Librarian' },
    { id: 5, title: 'Website Maintenance', desc: 'Update hero banner images and fix mobile nav.', status: 'In Progress', priority: 'Medium', date: '1 Mar', assignee: 'IT Dept' },
    { id: 6, title: 'Student ID Card Printing', desc: 'Print new batch ID cards for 2026 admissions.', status: 'To Do', priority: 'High', date: '8 Mar', assignee: 'Admin' },
    { id: 7, title: 'Lab Equipment Inventory', desc: 'Check CS and Physics lab equipment status.', status: 'In Progress', priority: 'High', date: '3 Mar', assignee: 'Lab Incharge' },
    { id: 8, title: 'Parent-Teacher Meeting', desc: 'Schedule PTM for mid-term evaluation review.', status: 'To Do', priority: 'Medium', date: '12 Mar', assignee: 'Class Coord.' },
    { id: 9, title: 'Hostel Room Allocation', desc: 'Allocate rooms for new semester students.', status: 'Done', priority: 'Medium', date: '25 Feb', assignee: 'Warden' },
    { id: 10, title: 'Placement Drive Prep', desc: 'Coordinate with TCS and Infosys for campus drive.', status: 'In Progress', priority: 'High', date: '10 Mar', assignee: 'TPO' },
    { id: 11, title: 'Exam Hall Setup', desc: 'Arrange seating and CCTV for mid-term exams.', status: 'Done', priority: 'High', date: '24 Feb', assignee: 'Exam Cell' },
    { id: 12, title: 'Sports Day Coordination', desc: 'Book ground and finalize event schedule.', status: 'To Do', priority: 'Low', date: '15 Mar', assignee: 'Sports Dept' },
];

const priorityColors = {
    'High': 'bg-rose-50 text-rose-600 ring-rose-200',
    'Medium': 'bg-amber-50 text-amber-600 ring-amber-200',
    'Low': 'bg-emerald-50 text-emerald-600 ring-emerald-200',
};

const columns = [
    { key: 'To Do', label: 'To Do', icon: Circle, iconColor: 'text-gray-400', bg: 'bg-gray-50/50', border: 'border-gray-100/50', badgeBg: 'bg-gray-200 text-gray-600', headerColor: 'text-gray-700', buttonColor: 'text-gray-400 hover:text-gray-600' },
    { key: 'In Progress', label: 'In Progress', icon: Clock, iconColor: 'text-indigo-500', bg: 'bg-indigo-50/30', border: 'border-indigo-50', badgeBg: 'bg-indigo-100 text-indigo-700', headerColor: 'text-indigo-900', buttonColor: 'text-indigo-400 hover:text-indigo-600' },
    { key: 'Done', label: 'Completed', icon: CheckCircle2, iconColor: 'text-emerald-500', bg: 'bg-emerald-50/30', border: 'border-emerald-50', badgeBg: 'bg-emerald-100 text-emerald-700', headerColor: 'text-emerald-900', buttonColor: 'text-emerald-400 hover:text-emerald-600' },
];

const statusTransitions = {
    'To Do': 'In Progress',
    'In Progress': 'Done',
    'Done': 'To Do',
};

// ─── TASK CARD ──────────────────────────────────────────────────────
const TaskCard = ({ task, onMove, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const nextStatus = statusTransitions[task.status];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group relative"
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ring-1 ${priorityColors[task.priority]}`}>
                    {task.priority}
                </span>
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="text-gray-300 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                        <MoreHorizontal size={16} />
                    </button>

                    <AnimatePresence>
                        {showMenu && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 w-40"
                            >
                                <button
                                    onClick={() => { onMove(task.id, nextStatus); setShowMenu(false); }}
                                    className="w-full px-3 py-2 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <ChevronRight size={14} /> Move to {nextStatus}
                                </button>
                                <button
                                    onClick={() => { onDelete(task.id); setShowMenu(false); }}
                                    className="w-full px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
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

            {/* Quick move button */}
            <button
                onClick={() => onMove(task.id, nextStatus)}
                className="absolute -right-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-blue-500/30 hover:scale-110"
                title={`Move to ${nextStatus}`}
            >
                <ChevronRight size={14} />
            </button>
        </motion.div>
    );
};

// ─── CREATE TASK MODAL ──────────────────────────────────────────────
const CreateTaskModal = ({ show, onClose, onCreate }) => {
    const [form, setForm] = useState({
        title: '', desc: '', priority: 'Medium', assignee: '', date: '', status: 'To Do',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim()) { toast.error('Title is required'); return; }
        onCreate({
            ...form,
            id: Date.now(),
            date: form.date ? new Date(form.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'No date',
            assignee: form.assignee || 'Unassigned',
        });
        setForm({ title: '', desc: '', priority: 'Medium', assignee: '', date: '', status: 'To Do' });
        onClose();
        toast.success('Task created!');
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        onClick={e => e.stopPropagation()}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Plus size={20} className="text-blue-500" /> Create Task
                            </h3>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
                                <X size={18} className="text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Title *</label>
                                <input
                                    type="text" placeholder="e.g., Prepare exam schedule"
                                    value={form.title}
                                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 font-medium"
                                    required autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                                <textarea
                                    placeholder="Add details..."
                                    value={form.desc}
                                    onChange={e => setForm(p => ({ ...p, desc: e.target.value }))}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 font-medium h-20 resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Priority</label>
                                    <select
                                        value={form.priority}
                                        onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        <option value="High">🔴 High</option>
                                        <option value="Medium">🟡 Medium</option>
                                        <option value="Low">🟢 Low</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                                    <select
                                        value={form.status}
                                        onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        <option value="To Do">To Do</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Assignee</label>
                                    <input
                                        type="text" placeholder="e.g., IT Dept"
                                        value={form.assignee}
                                        onChange={e => setForm(p => ({ ...p, assignee: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Due Date</label>
                                    <input
                                        type="date"
                                        value={form.date}
                                        onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end pt-2">
                                <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg shadow-blue-500/20 hover:opacity-90 flex items-center gap-2">
                                    <Plus size={14} /> Create Task
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────
const Tasks = () => {
    const [tasks, setTasks] = useState(initialTasks);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleCreate = (newTask) => {
        setTasks(prev => [...prev, newTask]);
    };

    const handleMove = (taskId, newStatus) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        toast.success(`Moved to ${newStatus}`);
    };

    const handleDelete = (taskId) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        toast.success('Task deleted');
    };

    return (
        <div className="space-y-8 pb-10 h-[calc(100vh-100px)] flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Organize school operations and staff assignments.
                        <span className="ml-2 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            {tasks.length} tasks
                        </span>
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:opacity-90 shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all"
                >
                    <Plus size={18} /> Create Task
                </button>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <div className="flex gap-6 h-full min-w-[1000px] pb-4">
                    {columns.map(col => {
                        const colTasks = tasks.filter(t => t.status === col.key);
                        const Icon = col.icon;
                        return (
                            <div key={col.key} className={`flex-1 flex flex-col ${col.bg} rounded-2xl border ${col.border}`}>
                                <div className="p-4 flex items-center justify-between border-b border-gray-100/50">
                                    <h3 className={`font-bold ${col.headerColor} flex items-center gap-2`}>
                                        <Icon size={16} className={col.iconColor} /> {col.label}
                                        <span className={`${col.badgeBg} px-2 py-0.5 rounded-full text-xs`}>
                                            {colTasks.length}
                                        </span>
                                    </h3>
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className={col.buttonColor}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <div className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                                    <AnimatePresence>
                                        {colTasks.map(task => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                onMove={handleMove}
                                                onDelete={handleDelete}
                                            />
                                        ))}
                                    </AnimatePresence>

                                    {colTasks.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-8 text-gray-300">
                                            <Circle size={32} className="mb-2 opacity-50" />
                                            <p className="text-xs font-medium">No tasks</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Create Task Modal */}
            <CreateTaskModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreate={handleCreate}
            />
        </div>
    );
};

export default Tasks;
