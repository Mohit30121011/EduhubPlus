import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ChevronRight, KeyRound, ShieldCheck, Lock, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password, 4=success
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
            toast.success('OTP sent! Check server console for the OTP.');
            // In development mode, the API returns the OTP
            if (res.data.otp) {
                toast(`Your OTP: ${res.data.otp}`, { icon: '🔑', duration: 15000 });
            }
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error('Passwords do not match');
        }
        if (newPassword.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }
        setLoading(true);
        try {
            await axios.post(`${API_URL}/auth/reset-password`, { email, otp, newPassword });
            toast.success('Password reset successful!');
            setStep(4);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    const stepContent = {
        1: {
            icon: KeyRound,
            title: 'Forgot Password?',
            subtitle: "No worries, we'll send you a reset OTP."
        },
        2: {
            icon: ShieldCheck,
            title: 'Enter OTP',
            subtitle: `Enter the 6-digit code sent for ${email}`
        },
        3: {
            icon: Lock,
            title: 'New Password',
            subtitle: 'Create a strong new password'
        },
        4: {
            icon: ShieldCheck,
            title: 'Password Reset!',
            subtitle: 'Your password has been successfully reset.'
        }
    };

    const current = stepContent[step];
    const Icon = current.icon;

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background matching login */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-6 relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        key={step}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-6 shadow-lg shadow-blue-500/30"
                    >
                        <Icon size={32} />
                    </motion.div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{current.title}</h1>
                    <p className="text-gray-500 font-medium">{current.subtitle}</p>
                </div>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-sm p-8">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Email */}
                        {step === 1 && (
                            <motion.form
                                key="email"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleRequestOtp}
                                className="space-y-6"
                            >
                                <div className="relative group">
                                    <Mail className="absolute top-4 left-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-gray-900 placeholder-gray-400 outline-none transition-all font-medium"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-600/20 disabled:opacity-50"
                                >
                                    {loading ? 'Sending...' : 'Send OTP'}
                                </button>
                            </motion.form>
                        )}

                        {/* Step 2: OTP */}
                        {step === 2 && (
                            <motion.form
                                key="otp"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={(e) => { e.preventDefault(); if (otp.length === 6) setStep(3); else toast.error('Enter 6-digit OTP'); }}
                                className="space-y-6"
                            >
                                <div className="relative group">
                                    <ShieldCheck className="absolute top-4 left-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="Enter 6-digit OTP"
                                        maxLength={6}
                                        className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-gray-900 placeholder-gray-400 outline-none transition-all font-medium text-center text-2xl tracking-[0.5em]"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-600/20"
                                >
                                    Verify OTP
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRequestOtp}
                                    className="w-full text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                    {loading ? 'Resending...' : 'Resend OTP'}
                                </button>
                            </motion.form>
                        )}

                        {/* Step 3: New Password */}
                        {step === 3 && (
                            <motion.form
                                key="password"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleVerifyAndReset}
                                className="space-y-4"
                            >
                                <div className="relative group">
                                    <Lock className="absolute top-4 left-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="New Password"
                                        className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-gray-900 placeholder-gray-400 outline-none transition-all font-medium"
                                        required
                                        minLength={6}
                                        autoFocus
                                    />
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute top-4 left-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm Password"
                                        className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-gray-900 placeholder-gray-400 outline-none transition-all font-medium"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                                    <p className="text-xs text-red-500 font-bold px-2">Passwords do not match</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-600/20 disabled:opacity-50 mt-2"
                                >
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </motion.form>
                        )}

                        {/* Step 4: Success */}
                        {step === 4 && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6"
                            >
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShieldCheck size={32} />
                                </div>
                                <p className="text-gray-500 mb-6 font-medium">You can now log in with your new password.</p>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-600/20"
                                >
                                    Go to Login
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Back to login */}
                    {step !== 4 && (
                        <div className="text-center mt-8">
                            <Link to="/login" className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
                                <ArrowLeft size={16} />
                                Back to Login
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
