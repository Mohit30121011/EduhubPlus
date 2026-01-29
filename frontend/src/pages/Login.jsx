import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, reset } from '../redux/features/authSlice';
import { User, Lock, ChevronRight, Zap, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    // Simplified Role State
    const [activeTab, setActiveTab] = useState('STUDENT');
    const [showPassword, setShowPassword] = useState(false);

    const { email, password } = formData;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isLoading, isError, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
        return () => {
            dispatch(reset());
        };
    }, [user, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const userData = { email, password };
        dispatch(loginUser(userData));
    };

    const tabs = [
        { id: 'STUDENT', label: 'Student' },
        { id: 'STAFF', label: 'Faculty / Admin' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50">
            {/* Dynamic Educational Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>

            {/* Animated Blobs - Blue/Educational Feel */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob animation-delay-2000"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-6 relative z-10"
            >
                {/* Logo & Headline */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/20 mb-6">
                        <Zap size={32} fill="currentColor" className="text-yellow-400" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                        <span className="bolt-underline">Welcome Back</span>
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Access your intelligent campus dashboard.
                    </p>
                </div>

                {/* Glass Card */}
                <div className="bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-8">

                    {/* iOS Style Pill Toggle - Blue Accent */}
                    <div className="flex p-1 bg-blue-50/80 rounded-full mb-8 relative isolate">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative flex-1 py-3 text-sm font-bold transition-colors duration-200 z-10 ${activeTab === tab.id ? 'text-blue-900' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activePill"
                                        className="absolute inset-0 bg-white shadow-sm rounded-full"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6" noValidate>
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    {/* Icon Accent Blue */}
                                    <User className="h-6 w-6 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300" strokeWidth={2} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    className="block w-full pl-12 pr-4 py-4 bg-white border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500/30 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none transition-all font-semibold shadow-sm text-lg"
                                    placeholder={activeTab === 'STUDENT' ? "Student Email ID" : "Staff Email ID"}
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-6 w-6 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300" strokeWidth={2} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    className="block w-full pl-12 pr-12 py-4 bg-white border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500/30 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none transition-all font-semibold shadow-sm text-lg"
                                    placeholder="Password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={24} strokeWidth={2} /> : <Eye size={24} strokeWidth={2} />}
                                </button>
                            </div>
                        </div>

                        {isError && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="px-4 py-3 bg-red-50 text-red-600 text-sm font-semibold rounded-2xl flex items-center gap-2 border border-red-100"
                            >
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></span>
                                {message}
                            </motion.div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group w-full flex items-center justify-center gap-2 py-4 px-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 shadow-xl shadow-gray-900/20 transform transition-all active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        Sign In
                                        <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-white transition-colors" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Links Section */}
                        <div className="flex items-center justify-center text-sm font-bold mt-6 px-2">
                            <Link to="/forgot-password" className="text-gray-500 hover:text-blue-600 transition-colors">
                                Forgot Password?
                            </Link>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
