import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const STUDENT_STEPS = [
    { id: 1, label: 'Personal' },
    { id: 2, label: 'Family' },
    { id: 3, label: 'Academic' },
    { id: 4, label: 'Other' },
    { id: 5, label: 'Docs' }
];

const EnrollmentStepper = ({ currentStep, steps = STUDENT_STEPS }) => {
    return (
        <div className="w-full py-6 px-4">
            <div className="relative flex items-center justify-between max-w-3xl mx-auto">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full z-0"></div>

                {/* Progress Line */}
                <motion.div
                    className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 rounded-full z-0"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                ></motion.div>

                {/* Steps */}
                {steps.map((step) => {
                    const status = currentStep > step.id ? 'complete' : currentStep === step.id ? 'active' : 'inactive';

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: status === 'active' ? 1.2 : 1,
                                    backgroundColor: status === 'complete' || status === 'active' ? '#2563EB' : '#FFFFFF',
                                    borderColor: status === 'complete' || status === 'active' ? '#2563EB' : '#E5E7EB',
                                }}
                                className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-colors duration-300 font-bold ${status === 'inactive' ? 'text-gray-400' : 'text-white'
                                    }`}
                            >
                                {status === 'complete' ? <Check size={18} strokeWidth={3} /> : step.id}
                            </motion.div>
                            <span className={`absolute top-12 text-xs font-bold whitespace-nowrap uppercase tracking-wider ${status === 'active' ? 'text-blue-600' : 'text-gray-400'
                                }`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EnrollmentStepper;
