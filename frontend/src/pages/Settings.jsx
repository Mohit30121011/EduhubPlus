import React, { useState, useEffect } from 'react';
import {
    School, Settings, Shield, Bell, Database,
    Save, Upload, Mail, Globe, Palette, User, Calendar
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getSchoolProfile, updateSchoolProfile } from '../redux/features/settingsSlice';
import { updateProfile } from '../redux/features/authSlice';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SettingsPage = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState(() => localStorage.getItem('settingsTab') || 'campus');
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Academic Year Preference
    const currentYear = new Date().getFullYear();
    const defaultYear = currentYear >= 7 ? `${currentYear}-${currentYear + 1}` : `${currentYear - 1}-${currentYear}`;
    const [selectedAcademicYear, setSelectedAcademicYear] = useState(
        () => localStorage.getItem('selectedAcademicYear') || defaultYear
    );
    const academicYears = Array.from({ length: 21 }, (_, i) => {
        const y = 2020 + i;
        return `${y}-${y + 1}`;
    });

    // Redux State
    const { schoolProfile, isLoading: isSchoolLoading } = useSelector((state) => state.settings);
    const { user, token, isLoading: isAuthLoading } = useSelector((state) => state.auth);

    // Local Forms State
    const [schoolForm, setSchoolForm] = useState({
        schoolName: '',
        tagline: '',
        email: '',
        website: '',
        address: ''
    });

    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });

    useEffect(() => {
        dispatch(getSchoolProfile());
    }, [dispatch]);

    useEffect(() => {
        if (schoolProfile) {
            setSchoolForm({
                schoolName: schoolProfile.schoolName || '',
                tagline: schoolProfile.tagline || '',
                email: schoolProfile.email || '',
                website: schoolProfile.website || '',
                address: schoolProfile.address || ''
            });
        }
    }, [schoolProfile]);

    useEffect(() => {
        if (user) {
            setProfileForm({
                name: user.name || '',
                email: user.email || '',
                role: user.role || '',
                password: ''
            });
        }
    }, [user]);

    const handleSchoolChange = (e) => {
        setSchoolForm({ ...schoolForm, [e.target.name]: e.target.value });
    };

    const handleProfileChange = (e) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    };

    // Logo Upload Handler
    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('logo', file);

        setUploadingLogo(true);
        try {
            const response = await axios.post(`${API_URL}/upload/logo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success('Logo uploaded successfully!');
            dispatch(getSchoolProfile()); // Refresh to get new logo
        } catch (error) {
            console.error('Logo upload error:', error);
            toast.error('Failed to upload logo');
        } finally {
            setUploadingLogo(false);
        }
    };

    // Avatar Upload Handler
    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        setUploadingAvatar(true);
        try {
            const response = await axios.post(`${API_URL}/upload/avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success('Avatar uploaded successfully!');
            // Update user in localStorage
            const updatedUser = { ...user, avatar: response.data.avatar };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.location.reload(); // Refresh to show new avatar
        } catch (error) {
            console.error('Avatar upload error:', error);
            toast.error('Failed to upload avatar');
        } finally {
            setUploadingAvatar(false);
        }
    };

    // Remove Avatar Handler
    const handleRemoveAvatar = async () => {
        if (!user?.avatar) return;

        if (!confirm('Are you sure you want to remove your avatar?')) return;

        try {
            await axios.delete(`${API_URL}/upload/avatar`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Avatar removed!');
            const updatedUser = { ...user, avatar: null };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.location.reload();
        } catch (error) {
            console.error('Remove avatar error:', error);
            toast.error('Failed to remove avatar');
        }
    };

    const handleSave = async () => {
        if (activeTab === 'campus') {
            await dispatch(updateSchoolProfile(schoolForm));
            toast.success('Campus Info Updated!');
            dispatch(getSchoolProfile());
        } else if (activeTab === 'profile') {
            const dataToSend = { ...profileForm };
            if (!dataToSend.password) delete dataToSend.password;

            await dispatch(updateProfile(dataToSend));
            toast.success('Profile Updated!');
        } else {
            toast('Coming Soon!', { icon: '🚧' });
        }
    };

    const tabs = [
        { id: 'campus', label: 'Campus Info', icon: School },
        { id: 'profile', label: 'Profile Info', icon: User },
        { id: 'preferences', label: 'Preferences', icon: Calendar },
        { id: 'roles', label: 'Roles & Permissions', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'backup', label: 'Data & Backup', icon: Database },
    ];

    return (
        <div className="max-w-5xl mx-auto pb-10 relative isolate">
            {/* Theme Background Elements */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-50 fixed pointer-events-none"></div>
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-100/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob -z-10 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob animation-delay-2000 -z-10 pointer-events-none"></div>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 header-accent tracking-normal">
                    <span className="bolt-underline">Master Settings</span>
                </h1>
                <p className="text-gray-500 font-medium mt-2">Configure global application settings and preferences.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 shrink-0">
                    <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] shadow-sm overflow-hidden p-2">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        localStorage.setItem('settingsTab', tab.id);
                                    }}
                                    className={`w-full text-left px-5 py-3.5 flex items-center gap-3 text-sm font-bold rounded-2xl transition-all ${activeTab === tab.id
                                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                        }`}
                                >
                                    <Icon size={18} strokeWidth={2.5} /> {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white/80 backdrop-blur-xl border border-white/60 p-8 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] min-h-[500px]">
                    {activeTab === 'campus' && (
                        <div className="space-y-8">
                            <h2 className="text-xl font-black text-gray-900 border-b border-gray-100/50 pb-4">Campus Information</h2>

                            <div className="flex items-center gap-8">
                                <input
                                    type="file"
                                    id="logo-upload"
                                    hidden
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                />
                                <div
                                    onClick={() => document.getElementById('logo-upload').click()}
                                    className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-inner flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-200 hover:text-blue-500 transition-all group overflow-hidden"
                                >
                                    {schoolProfile?.logoUrl ? (
                                        <img src={schoolProfile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                                    ) : uploadingLogo ? (
                                        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                <Upload size={20} className="text-blue-600" />
                                            </div>
                                            <span className="text-[10px] uppercase font-bold tracking-wider">Upload Logo</span>
                                        </>
                                    )}
                                </div>
                                <div className="flex-1 space-y-5">
                                    <div className="relative group">
                                        <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">School Name</label>
                                        <input
                                            type="text"
                                            name="schoolName"
                                            value={schoolForm.schoolName}
                                            onChange={handleSchoolChange}
                                            className="w-full p-4 bg-gray-50/50 border border-transparent ring-1 ring-gray-100 rounded-2xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Tagline</label>
                                        <input
                                            type="text"
                                            name="tagline"
                                            value={schoolForm.tagline}
                                            onChange={handleSchoolChange}
                                            className="w-full p-4 bg-gray-50/50 border border-transparent ring-1 ring-gray-100 rounded-2xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-2"><Mail size={14} /> Official Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={schoolForm.email}
                                        onChange={handleSchoolChange}
                                        className="w-full p-4 bg-gray-50/50 border border-transparent ring-1 ring-gray-100 rounded-2xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-2"><Globe size={14} /> Website</label>
                                    <input
                                        type="text"
                                        name="website"
                                        value={schoolForm.website}
                                        onChange={handleSchoolChange}
                                        className="w-full p-4 bg-gray-50/50 border border-transparent ring-1 ring-gray-100 rounded-2xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Address</label>
                                <textarea
                                    name="address"
                                    value={schoolForm.address}
                                    onChange={handleSchoolChange}
                                    className="w-full p-4 bg-gray-50/50 border border-transparent ring-1 ring-gray-100 rounded-2xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none transition-all h-32 resize-none"
                                ></textarea>
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="space-y-8">
                            <h2 className="text-xl font-black text-gray-900 border-b border-gray-100/50 pb-4">My Profile Info</h2>

                            <div className="flex items-center gap-8">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-white shadow-lg flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        user?.name ? user.name[0] : (user?.email ? user.email[0].toUpperCase() : 'U')
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900">{user?.name || 'User'}</h3>
                                    <p className="text-gray-500 font-medium">{user?.role || 'User'}</p>
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        hidden
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                    />
                                    <button
                                        onClick={() => document.getElementById('avatar-upload').click()}
                                        disabled={uploadingAvatar}
                                        className="mt-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                                    >
                                        {uploadingAvatar ? 'Uploading...' : 'Change Avatar'}
                                    </button>
                                    {user?.avatar && (
                                        <button
                                            onClick={handleRemoveAvatar}
                                            className="mt-2 ml-2 text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative group">
                                    <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profileForm.name}
                                        onChange={handleProfileChange}
                                        className="w-full p-4 bg-gray-50/50 border border-transparent ring-1 ring-gray-100 rounded-2xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none transition-all"
                                    />
                                </div>
                                <div className="relative group">
                                    <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Role</label>
                                    <input
                                        type="text"
                                        disabled
                                        value={profileForm.role}
                                        className="w-full p-4 bg-gray-100/50 border border-transparent rounded-2xl font-bold text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <div className="relative group md:col-span-2">
                                    <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileForm.email}
                                        onChange={handleProfileChange}
                                        className="w-full p-4 bg-gray-50/50 border border-transparent ring-1 ring-gray-100 rounded-2xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100/50">
                                <h4 className="text-sm font-black text-gray-900 mb-4">Security</h4>
                                <div className="relative group mb-4">
                                    <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">New Password (Optional)</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={profileForm.password}
                                        onChange={handleProfileChange}
                                        placeholder="Leave blank to keep current password"
                                        className="w-full p-4 bg-gray-50/50 border border-transparent ring-1 ring-gray-100 rounded-2xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder Tabs */}
                    {(activeTab !== 'campus' && activeTab !== 'profile' && activeTab !== 'preferences') && (
                        <div className="text-center py-32 text-gray-300">
                            {/* ... existing placeholders ... */}
                            <p className="font-bold text-lg text-gray-400">Configuration module coming soon</p>
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                        <div className="space-y-8">
                            <h2 className="text-xl font-black text-gray-900 border-b border-gray-100/50 pb-4">Preferences</h2>

                            <div className="space-y-6">
                                <div className="relative group">
                                    <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-2">
                                        <Calendar size={14} /> Academic Year
                                    </label>
                                    <p className="text-xs text-gray-400 ml-1 mb-3">Select the academic year to view data for across Insights, Finances, and other pages.</p>
                                    <select
                                        value={selectedAcademicYear}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setSelectedAcademicYear(val);
                                            localStorage.setItem('selectedAcademicYear', val);
                                            window.dispatchEvent(new Event('academicYearChanged'));
                                            toast.success(`Academic year set to ${val}`);
                                        }}
                                        className="w-full md:w-80 p-4 bg-gray-50/50 border border-transparent ring-1 ring-gray-100 rounded-2xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        {academicYears.map(yr => (
                                            <option key={yr} value={yr}>{yr}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5">
                                    <p className="text-sm font-bold text-blue-700 flex items-center gap-2">
                                        <Calendar size={16} /> Currently Active: <span className="text-blue-900">{selectedAcademicYear}</span>
                                    </p>
                                    <p className="text-xs text-blue-500 mt-1">All pages will show data for this academic year. Mock/sample data always shows regardless of year.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isSchoolLoading || isAuthLoading}
                            className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-gray-900/20 hover:bg-gray-800 hover:-translate-y-1 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={18} />
                            {isSchoolLoading || isAuthLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

import ErrorBoundary from '../components/ErrorBoundary';

// ... existing code ...

export default function WrappedSettingsPage() {
    return (
        <ErrorBoundary>
            <SettingsPage />
        </ErrorBoundary>
    );
};
