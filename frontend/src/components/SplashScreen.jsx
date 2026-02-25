import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

const SplashScreen = ({ onComplete }) => {
    const [phase, setPhase] = useState('logo'); // 'logo' → 'exit'

    useEffect(() => {
        // Phase timing: logo animates in (0-1.2s), holds (1.2-2.2s), exits (2.2-2.8s)
        const timer = setTimeout(() => {
            setPhase('exit');
            setTimeout(onComplete, 600); // exit animation duration
        }, 2200);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {phase !== 'done' && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    animate={phase === 'exit' ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    style={{
                        background: 'linear-gradient(135deg, #0a1628 0%, #0d2137 30%, #0f2d4a 60%, #0a1628 100%)',
                    }}
                >
                    {/* Ambient background orbs */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            className="absolute w-[500px] h-[500px] rounded-full"
                            style={{
                                background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
                                top: '-10%',
                                right: '-10%',
                            }}
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div
                            className="absolute w-[400px] h-[400px] rounded-full"
                            style={{
                                background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
                                bottom: '-10%',
                                left: '-10%',
                            }}
                            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </div>

                    {/* Center content */}
                    <div className="relative flex flex-col items-center">
                        {/* Logo with scale + blur entrance */}
                        <motion.div
                            initial={{ scale: 0.6, opacity: 0, filter: 'blur(20px)' }}
                            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="relative"
                        >
                            {/* Glow behind logo */}
                            <motion.div
                                className="absolute inset-0 -m-8 rounded-full"
                                style={{
                                    background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
                                }}
                                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            <img
                                src={logo}
                                alt="EduhubPlus"
                                className="w-64 sm:w-72 md:w-80 relative z-10 drop-shadow-2xl"
                            />
                        </motion.div>

                        {/* Tagline */}
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
                            className="text-white/40 text-xs sm:text-sm font-medium tracking-[0.3em] uppercase mt-6"
                        >
                            Intelligent Campus Management
                        </motion.p>

                        {/* Loading indicator — slim animated bar */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.4 }}
                            className="mt-8 w-32 h-[2px] bg-white/10 rounded-full overflow-hidden"
                        >
                            <motion.div
                                className="h-full rounded-full"
                                style={{
                                    background: 'linear-gradient(90deg, transparent, #3b82f6, #6366f1, transparent)',
                                }}
                                initial={{ x: '-100%' }}
                                animate={{ x: '200%' }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;
