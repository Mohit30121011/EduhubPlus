import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ExportDropdown from '../components/ExportDropdown';
import { Shield, Users, Plus, X, Search, SlidersHorizontal, Columns3, Phone, Briefcase, ChevronDown, Check, Building, Layout, BookOpen } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Mock / Sample Faculty (120 generated) ──────────────────────────
const FAC_TITLES = ['Dr.', 'Prof.', 'Dr.', 'Prof.', 'Dr.'];
const FAC_FIRST = ['Rajesh', 'Sunita', 'Anil', 'Meena', 'Suresh', 'Kavitha', 'Deepak', 'Lakshmi', 'Ramesh', 'Geeta', 'Sanjay', 'Anita', 'Prakash', 'Neelam', 'Vijay', 'Seema', 'Ashok', 'Rekha', 'Manoj', 'Savita', 'Sunil', 'Vandana', 'Ravi', 'Usha', 'Hemant', 'Jyoti', 'Dinesh', 'Bharti', 'Girish', 'Sushma'];
const FAC_LAST = ['Kumar', 'Mehta', 'Deshmukh', 'Iyer', 'Patil', 'Rao', 'Tiwari', 'Narayan', 'Chauhan', 'Mishra', 'Saxena', 'Bansal', 'Agarwal', 'Chopra', 'Malhotra', 'Kapoor', 'Bhat', 'Dubey', 'Pandey', 'Soni', 'Shah', 'Jain', 'Verma', 'Nair', 'Sharma'];
const FAC_DEPTS = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Mathematics', 'Physics', 'Chemistry'];
const FAC_DESIG = ['Professor', 'Associate Professor', 'Assistant Professor', 'HOD', 'Lecturer'];

const MOCK_FACULTY = Array.from({ length: 120 }, (_, i) => {
    const title = FAC_TITLES[i % FAC_TITLES.length];
    const fn = FAC_FIRST[i % FAC_FIRST.length];
    const ln = FAC_LAST[(i * 3 + 2) % FAC_LAST.length];
    return {
        id: `mock-f${i + 1}`,
        firstName: `${title} ${fn}`,
        lastName: ln,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i + 1}@campus.edu`,
        employeeId: `FAC${String(i + 1).padStart(4, '0')}`,
        designation: FAC_DESIG[i % FAC_DESIG.length],
        department: FAC_DEPTS[i % FAC_DEPTS.length],
        phone: `98${String(76543210 + i).padStart(8, '0')}`,
        User: { isActive: i % 8 !== 0 },
        isMock: true
    };
});

const FacultyList = () => {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [faculty, setFaculty] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Search and Filter
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showColumnDropdown, setShowColumnDropdown] = useState(false);
    const [filterDept, setFilterDept] = useState('');

    // Column visibility
    const [visibleColumns, setVisibleColumns] = useState({
        photo: true,
        name: true,
        email: true,
        phone: true,
        designation: true,
        department: true,
        status: true
    });

    // Fetch Faculty
    const fetchFaculty = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${API_URL}/faculty`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const realData = (res.data || []).map(f => ({ ...f, isMock: false }));
            // Merge: real data first, then mock items not already present
            const realIds = new Set(realData.map(f => f.employeeId));
            const mockToAdd = MOCK_FACULTY.filter(m => !realIds.has(m.employeeId));
            setFaculty([...realData, ...mockToAdd]);
        } catch (error) {
            console.error(error);
            setFaculty(MOCK_FACULTY);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFaculty();
    }, []);

    // Get unique departments for filter
    const departments = [...new Set(faculty.map(f => f.department).filter(Boolean))];

    const getFilteredData = () => {
        return faculty.filter(f => {
            const fullName = `${f.firstName} ${f.lastName}`;
            const matchesSearch = !searchQuery ||
                fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.employeeId?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesDept = !filterDept || f.department === filterDept;

            return matchesSearch && matchesDept;
        });
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            await axios.delete(`${API_URL}/faculty/${itemToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Faculty member removed');
            fetchFaculty();
            setShowDeleteModal(false);
            setItemToDelete(null);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete faculty');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <PageHeader
                    title="Faculty Directory"
                    subtitle="Manage teaching staff, departments, and academic profiles"
                />

                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-sm p-6 sm:p-8">
                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <h2 className="text-xl font-black text-gray-900">Faculty Members ({getFilteredData().length})</h2>
                        <div className="flex items-center gap-2 justify-end">
                            {showSearchInput && (
                                <input
                                    type="text"
                                    placeholder="Search name, email, code..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                    className="w-36 sm:w-48 px-4 py-2.5 bg-gray-100 rounded-full text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
                                />
                            )}
                            <motion.button
                                onClick={() => { setShowSearchInput(!showSearchInput); if (showSearchInput) setSearchQuery(''); }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${showSearchInput ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                            >
                                {showSearchInput ? <X size={18} /> : <Search size={18} />}
                            </motion.button>

                            {/* Filter */}
                            <div className="relative">
                                <motion.button
                                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${filterDept ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    <SlidersHorizontal size={18} />
                                </motion.button>
                                <AnimatePresence>
                                    {showFilterDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-12 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 min-w-[200px]"
                                        >
                                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Filter by Department</p>
                                            <button onClick={() => { setFilterDept(''); setShowFilterDropdown(false); }} className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${!filterDept ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}>All Departments</button>
                                            {departments.map(dept => (
                                                <button key={dept} onClick={() => { setFilterDept(dept); setShowFilterDropdown(false); }} className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${filterDept === dept ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}>{dept}</button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Columns */}
                            <div className="relative">
                                <motion.button
                                    onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"
                                >
                                    <Columns3 size={18} />
                                </motion.button>
                                <AnimatePresence>
                                    {showColumnDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-12 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 min-w-[160px]"
                                        >
                                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Columns</p>
                                            {Object.keys(visibleColumns).map(col => (
                                                <label key={col} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-xl cursor-pointer">
                                                    <input type="checkbox" checked={visibleColumns[col]} onChange={() => setVisibleColumns({ ...visibleColumns, [col]: !visibleColumns[col] })} className="w-4 h-4 rounded" />
                                                    <span className="text-sm font-medium capitalize">{col}</span>
                                                </label>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Export Button */}
                            <ExportDropdown
                                data={getFilteredData().map(f => ({
                                    Name: `${f.firstName} ${f.lastName}`,
                                    Email: f.email,
                                    EmployeeID: f.employeeId,
                                    Designation: f.designation,
                                    Department: f.department,
                                    Phone: f.phone
                                }))}
                                filename="faculty_list"
                                title="Faculty List"
                                columns={[
                                    { key: 'Name', header: 'Name' },
                                    { key: 'Email', header: 'Email' },
                                    { key: 'EmployeeID', header: 'Employee ID' },
                                    { key: 'Designation', header: 'Designation' },
                                    { key: 'Department', header: 'Department' },
                                    { key: 'Phone', header: 'Phone' }
                                ]}
                                circular={true}
                            />

                            {/* Add Button */}
                            <motion.button
                                onClick={() => navigate('add')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg"
                                title="Add Faculty"
                            >
                                <Plus size={20} />
                            </motion.button>
                        </div>
                    </div>

                    {/* Table */}
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : getFilteredData().length === 0 ? (
                        <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-400 font-bold mb-2">No faculty members found</p>
                            <button onClick={() => navigate('add')} className="text-blue-600 text-sm font-bold hover:underline">Add your first faculty member</button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100 whitespace-nowrap">
                                        {visibleColumns.photo && <th className="px-4 py-4">Photo</th>}
                                        {visibleColumns.name && <th className="px-4 py-4">Name</th>}
                                        {visibleColumns.designation && <th className="px-4 py-4">Designation</th>}
                                        {visibleColumns.department && <th className="px-4 py-4">Department</th>}
                                        {visibleColumns.email && <th className="px-4 py-4">Email</th>}
                                        {visibleColumns.phone && <th className="px-4 py-4">Phone</th>}
                                        {visibleColumns.status && <th className="px-4 py-4">Status</th>}
                                        <th className="px-4 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {getFilteredData().map((f, index) => (
                                        <motion.tr
                                            key={f.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-blue-50/50 transition-colors whitespace-nowrap"
                                        >
                                            {visibleColumns.photo && (
                                                <td className="px-4 py-4">
                                                    {f.photoUrl ? (
                                                        <img src={f.photoUrl} alt={f.firstName} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                            {f.firstName?.charAt(0)}{f.lastName?.charAt(0)}
                                                        </div>
                                                    )}
                                                </td>
                                            )}
                                            {visibleColumns.name && (
                                                <td className="px-4 py-4">
                                                    <div>
                                                        <span className="font-bold text-gray-700 block">
                                                            {f.firstName} {f.lastName}
                                                            {f.isMock && <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-600 text-[9px] font-black rounded-md uppercase">Sample</span>}
                                                        </span>
                                                        <span className="text-xs text-gray-400">{f.employeeId}</span>
                                                    </div>
                                                </td>
                                            )}
                                            {visibleColumns.designation && (
                                                <td className="px-4 py-4">
                                                    <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold">
                                                        {f.designation || '-'}
                                                    </span>
                                                </td>
                                            )}
                                            {visibleColumns.department && (
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-1 text-gray-600 font-medium text-sm">
                                                        <Building size={14} className="text-gray-400" />
                                                        {f.department || '-'}
                                                    </div>
                                                </td>
                                            )}
                                            {visibleColumns.email && <td className="px-4 py-4 text-gray-500 font-medium">{f.email}</td>}
                                            {visibleColumns.phone && <td className="px-4 py-4 text-gray-500 font-medium">{f.phone || '-'}</td>}

                                            {visibleColumns.status && (
                                                <td className="px-4 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${f.User?.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                        {f.User?.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                            )}
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => navigate(`edit/${f.id}`)} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">Edit</button>
                                                    {!f.isMock && (
                                                        <button onClick={() => { setItemToDelete(f); setShowDeleteModal(true); }} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">Delete</button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FacultyList;
