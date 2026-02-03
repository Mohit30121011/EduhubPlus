import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ChevronRight, ChevronLeft, Save, Upload } from 'lucide-react';
import axios from 'axios';
import EnrollmentStepper from '../components/EnrollmentStepper'; // Shared stepper
import StepPersonal from '../components/student-steps/StepPersonal';
import StepFamily from '../components/student-steps/StepFamily'; // Reusing for Emergency Contact
import StepFacultyAcademic from '../components/student-steps/StepFacultyAcademic';
import StepFacultyProfessional from '../components/student-steps/StepFacultyProfessional';
import StepDocuments from '../components/student-steps/StepDocuments';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const FACULTY_STEPS = [
    { id: 1, label: 'Personal' },
    { id: 2, label: 'Emergency' },
    { id: 3, label: 'Academic' },
    { id: 4, label: 'Professional' },
    { id: 5, label: 'Docs' }
];

const AddFaculty = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const { token } = useSelector((state) => state.auth);

    // Initial State for Faculty
    const [formData, setFormData] = useState({
        // 1. Personal & 2. Contact & 3. Identity
        firstName: '', middleName: '', lastName: '', regionalName: '', previousName: '',
        dateOfBirth: '', gender: 'MALE', nationality: 'Indian', placeOfBirth: '',
        domicileState: '', category: 'GENERAL', subCategory: '', religion: '',
        aadharNumber: '', passportNumber: '', pan: '', voterId: '',
        motherTongue: '', maritalStatus: 'Unmarried', bloodGroup: '',
        phone: '', alternateMobile: '', email: '', alternateEmail: '',
        permanentAddress: { street: '', city: '', state: '', pincode: '', country: 'India' },
        correspondenceAddress: { street: '', city: '', state: '', pincode: '', country: 'India' },
        sameAsPermanent: false,

        // 10. Emergency Contact (Reusing StepFamily state structure slightly)
        emergencyContact: {},
        // We initialize familyDetails to avoid crashes if StepFamily accesses it, though we only care about emergencyContact
        familyDetails: {},

        // 4. Academic
        academicQualifications: [], // Array of objects

        // 5-8 & 11. Professional Steps
        professionalDetails: {},
        experienceDetails: { previousInstitutions: [] },
        researchDetails: {},
        bankDetails: {},
        institutionalInfo: {},

        // 9 & 12. Docs
        documents: {},
        declaration: false,
        place: '', date: new Date().toISOString().split('T')[0]
    });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    // Deep merge handler
    const handleChange = (e, section, subsection, field) => {
        const { name, value } = e.target;

        if (!section) {
            setFormData(prev => ({ ...prev, [name]: value }));
            return;
        }

        setFormData(prev => {
            if (field) {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [subsection]: {
                            ...prev[section]?.[subsection],
                            [field || name]: value
                        }
                    }
                };
            }
            else if (subsection) {
                // For StepFamily where structure is familyDetails.guardian.name
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [subsection]: value
                    }
                }
            }
            else {
                // Section level update
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [name]: value
                    }
                };
            }
        });
    };

    // File Handler
    const handleFileChange = (e, key) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                documents: {
                    ...prev.documents,
                    [key]: file
                }
            }));
            toast.success(`${key} selected`);
        }
    };

    const validateStep = (step) => {
        const newErrors = {};
        switch (step) {
            case 1: // Personal
                if (!formData.firstName) newErrors.firstName = 'First name is required';
                if (!formData.lastName) newErrors.lastName = 'Last name is required';
                if (!formData.phone) newErrors.phone = 'Mobile number is required';
                if (!formData.email) newErrors.email = 'Email is required';
                if (formData.aadharNumber && formData.aadharNumber.length !== 12) newErrors.aadharNumber = 'Aadhar must be 12 digits';
                break;
            case 2: // Family & Emergency
                if (!formData.emergencyContact?.name) newErrors.emergencyName = 'Emergency contact name is required';
                if (!formData.emergencyContact?.phone) newErrors.emergencyPhone = 'Emergency contact phone is required';
                break;
            case 3: // Academic
                if (!formData.academicQualifications?.length) {
                    toast.error('Please add at least one qualification');
                }
                break;
            case 5: // Docs
                if (!formData.declaration) newErrors.declaration = 'Please accept the declaration';
                break;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 5));
        } else {
            toast.error('Please fill required fields');
        }
    };
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        if (!formData.declaration) {
            toast.error('Please sign declaration');
            return;
        }
        setSaving(true);
        const toastId = toast.loading('Submitting faculty application...');

        try {
            const submissionData = new FormData();

            // Top Level
            const topLevel = ['firstName', 'middleName', 'lastName', 'gender', 'dateOfBirth',
                'nationality', 'maritalStatus', 'bloodGroup', 'email', 'phone', 'alternateMobile', 'personalEmail',
                'previousName', 'placeOfBirth', 'domicileState', 'category', 'subCategory', 'religion', 'motherTongue'
            ];

            topLevel.forEach(k => submissionData.append(k, formData[k] || ''));

            // JSON Groups
            const jsonGroups = {
                contactDetails: {
                    permanentAddress: formData.permanentAddress,
                    correspondenceAddress: formData.correspondenceAddress,
                    alternatePhone: formData.alternateMobile,
                    personalEmail: formData.alternateEmail
                },
                identityDetails: {
                    aadharNumber: formData.aadharNumber,
                    passportNumber: formData.passportNumber,
                    pan: formData.pan,
                    voterId: formData.voterId
                },
                academicQualifications: formData.academicQualifications,
                professionalDetails: formData.professionalDetails,
                experienceDetails: formData.experienceDetails,
                researchDetails: formData.researchDetails,
                bankDetails: formData.bankDetails,
                institutionalInfo: formData.institutionalInfo,
                emergencyContact: formData.emergencyContact,
                declaration: {
                    date: formData.date,
                    place: formData.place
                }
            };

            Object.entries(jsonGroups).forEach(([key, value]) => {
                submissionData.append(key, JSON.stringify(value));
            });

            // Files
            if (formData.documents) {
                Object.entries(formData.documents).forEach(([key, file]) => {
                    if (file instanceof File) submissionData.append(key, file);
                });
            }

            const response = await axios.post('http://localhost:5000/api/faculty', submissionData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            toast.success('Faculty Registered Successfully!', { id: toastId });
            navigate('/dashboard/faculty');

        } catch (error) {
            console.error('Submission Error:', error);
            toast.error(error.response?.data?.message || 'Failed to submit', { id: toastId });
        } finally {
            setSaving(false);
        }
    };

    const FACULTY_DOCS = [
        { key: 'photo', label: 'Passport Photo' },
        { key: 'resume', label: 'Resume / CV' },
        { key: 'appointmentLetter', label: 'Appointment Letter' },
        { key: 'experienceCertificate', label: 'Experience Certificate' },
        { key: 'highestQualificationCertificate', label: 'Highest Qualification Certificate' },
        { key: 'idProof', label: 'ID Proof (Aadhar/Passport)' },
        { key: 'panCard', label: 'PAN Card' }
    ];

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <StepPersonal formData={formData} handleChange={handleChange} errors={errors} />;
            case 2: return <StepFamily formData={formData} handleChange={handleChange} errors={errors} showParents={false} />;
            case 3: return <StepFacultyAcademic formData={formData} handleChange={handleChange} errors={errors} />;
            case 4: return <StepFacultyProfessional formData={formData} handleChange={handleChange} errors={errors} />;
            case 5: return <StepDocuments formData={formData} handleChange={handleChange} handleFileChange={handleFileChange} errors={errors} docList={FACULTY_DOCS} />;
            default: return null;
        }
    };

    // Refactored Layout matching AddStudent.jsx
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard/faculty')}
                            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Faculty Registration</h1>
                            <p className="text-gray-500 font-medium text-sm mt-1">New Faculty Application • Phase {currentStep} of {FACULTY_STEPS.length}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 ml-14">
                        {/* Placeholder for future Export/Import, keeping Save Draft for visual consistency */}
                        <button className="ml-auto px-6 py-2.5 bg-white text-gray-700 font-bold border border-gray-200 rounded-full hover:bg-gray-50 text-sm shadow-sm transition-all hover:shadow-md flex items-center gap-2" onClick={() => toast.success("Draft saved locally (demo)")}>
                            <Save size={18} />
                            Save Draft
                        </button>
                    </div>
                </div>

                {/* Stepper */}
                <EnrollmentStepper currentStep={currentStep} steps={FACULTY_STEPS} />

                {/* Main Form Area */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-[2.5rem] p-6 md:p-10 min-h-[60vh]">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderStep()}
                    </motion.div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`min-w-[160px] px-6 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all ${currentStep === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md'
                            }`}
                    >
                        <ChevronLeft size={20} strokeWidth={2.5} />
                        Previous
                    </button>

                    {currentStep < 5 ? (
                        <button
                            onClick={nextStep}
                            className="min-w-[160px] px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full hover:shadow-xl hover:shadow-blue-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1"
                        >
                            Next
                            <ChevronRight size={20} strokeWidth={2.5} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="min-w-[180px] px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-full hover:shadow-xl hover:shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1"
                        >
                            {saving ? 'Submitting...' : 'Submit Faculty'}
                            {!saving && <Check size={20} strokeWidth={2.5} />}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AddFaculty;
