import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ChevronRight, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        // Mock API call
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-6 relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 mb-6">
                        <KeyRound size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                        Forgot Password?
                    </h1>
                    <p className="text-gray-500 font-medium">
                        No worries, we'll send you reset instructions.
                    </p>
                </div>

                <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-sm p-8">
                    {!submitted ? (
                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="relative group">
                                <Mail className="absolute top-4 left-4 h-6 w-6 text-blue-300 group-focus-within:text-blue-600 transition-colors" fill="currentColor" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="block w-full pl-12 pr-4 py-4 bg-white border-none ring-1 ring-blue-100 focus:ring-2 focus:ring-blue-500/30 rounded-2xl text-gray-900 placeholder-blue-300/70 focus:outline-none transition-all font-semibold"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 px-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-xl shadow-blue-600/20 transform transition-all active:scale-[0.98]"
                            >
                                Reset Password
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Check your email</h3>
                            <p className="text-gray-500 mb-6">
                                We sent a password reset link to <br /> <span className="font-bold text-gray-900">{email}</span>
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="text-blue-600 font-bold hover:underline"
                            >
                                Try another email
                            </button>
                        </div>
                    )}

                    <div className="text-center mt-8">
                        <Link to="/login" className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
                            <ChevronRight className="rotate-180" size={16} />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
