import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import axios from 'axios';
import EnrollmentStepper from '../components/EnrollmentStepper';
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
                            [name]: value
                        }
                    }
                };
            }
            else if (subsection) {
                // For StepFamily where structure is familyDetails.guardian.name (guardian is subsection)
                // But StepFamily implementation calls handleChange(e, 'familyDetails', 'guardian', 'name') -> 3 levels
                // StepFacultyProfessional calls handleChange(e, 'professionalDetails') -> 1 level (section is passed, name is field)

                // If subsection is passed as a string (key), update that key in section object
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [subsection]: value
                    }
                }
            }
            else {
                // Section level update: formData[section][name] = value
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
            case 3: // Academic
                if (!formData.academicQualifications?.length) {
                    toast.error('Please add at least one qualification');
                    // return false; // Strict validation
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
                    personalEmail: formData.alternateEmail // Mapping
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

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <StepPersonal formData={formData} handleChange={handleChange} errors={errors} />;
            case 2: return <StepFamily formData={formData} handleChange={(e, sec, subsec, fld) => handleChange(e, sec, subsec, fld)} errors={errors} />;
            case 3: return <StepFacultyAcademic formData={formData} handleChange={handleChange} errors={errors} />;
            case 4: return <StepFacultyProfessional formData={formData} handleChange={handleChange} errors={errors} />;
            case 5: return <StepDocuments formData={formData} handleChange={handleChange} handleFileChange={handleFileChange} errors={errors} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-30 shadow-sm/50 backdrop-blur-xl bg-white/80">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Add New Faculty
                        </h1>
                    </div>
                </div>
                <EnrollmentStepper currentStep={currentStep} steps={FACULTY_STEPS} />
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderStep()}
                </motion.div>
            </main>

            {/* Footer Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`min-w-[140px] px-6 py-3 rounded-full font-semibold border-2 transition-all flex items-center justify-center gap-2 ${currentStep === 1
                            ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        <ChevronLeft size={20} />
                        Previous
                    </button>

                    {currentStep === 5 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="min-w-[160px] px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-full hover:shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1"
                        >
                            {saving ? 'Saving...' : 'Submit Faculty'}
                            <Save size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={nextStep}
                            className="min-w-[160px] px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full hover:shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1"
                        >
                            Next
                            <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddFaculty;
