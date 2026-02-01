import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import axios from 'axios';
import EnrollmentStepper from '../components/EnrollmentStepper';
import StepPersonal from '../components/student-steps/StepPersonal';
import StepFamily from '../components/student-steps/StepFamily';
import StepAcademic from '../components/student-steps/StepAcademic';
import StepOther from '../components/student-steps/StepOther';
import StepDocuments from '../components/student-steps/StepDocuments';
import { toast } from 'react-hot-toast';
import ImportModal from '../components/ImportModal';
import ExportDropdown from '../components/ExportDropdown';
import { Upload } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const AddStudent = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const { token } = useSelector((state) => state.auth);
    const [showImportModal, setShowImportModal] = useState(false);

    // Huge initial state for all 13 sections
    const [formData, setFormData] = useState({
        // Step 1: Personal
        firstName: '', middleName: '', lastName: '', regionalName: '', previousName: '',
        dateOfBirth: '', gender: 'MALE', nationality: 'Indian', placeOfBirth: '',
        domicileState: '', category: 'GENERAL', subCategory: '', religion: '',
        aadharNumber: '', passportNumber: '', motherTongue: '', maritalStatus: 'Unmarried', abcId: '',
        phone: '', alternateMobile: '', email: '', alternateEmail: '', enrollmentNo: '',
        permanentAddress: { street: '', city: '', state: '', pincode: '', country: 'India' },
        correspondenceAddress: { street: '', city: '', state: '', pincode: '', country: 'India' },
        sameAsPermanent: false,

        // Step 2: Family
        familyDetails: {
            father: {}, mother: {}, guardian: {}, localGuardian: {}
        },
        emergencyContact: {},

        // Step 3: Academic
        academicHistory: {
            classX: {}, classXII: {}, graduation: {}
        },
        course: '', department: '',
        admissionDetails: {
            programLevel: 'UG', admissionType: 'Regular', modeOfStudy: 'Full-time'
        },
        entranceExam: {},

        // Step 4: Other
        hostelTransport: { hostelRequired: false, transportRequired: false },
        medicalInfo: {},
        feeDetails: {},

        // Step 5: Docs
        documents: {},
        declaration: false,
        place: '', date: new Date().toISOString().split('T')[0]
    });

    const [saving, setSaving] = useState(false);

    // Deep merge handler for nested objects
    const handleChange = (e, section, subsection, field) => {
        const { name, value } = e.target;

        if (!section) {
            setFormData(prev => ({ ...prev, [name]: value }));
            return;
        }

        // Section handling
        setFormData(prev => {
            if (field) {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [subsection]: {
                            ...prev[section]?.[subsection],
                            [field]: value
                        }
                    }
                };
            }

            if (subsection) {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [subsection]: value
                    }
                };
            }

            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    [subsection]: value
                }
            };
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

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        if (!formData.declaration) {
            toast.error('Please sign the declaration first');
            return;
        }

        setSaving(true);
        const toastId = toast.loading('Submitting application...');

        try {
            // Construct Payload matching Backend Schema
            const payload = {
                ...formData,
                // Combine addresses and contacts into contactDetails
                contactDetails: {
                    permanentAddress: formData.permanentAddress,
                    correspondenceAddress: formData.correspondenceAddress,
                    alternateMobile: formData.alternateMobile,
                    alternateEmail: formData.alternateEmail,
                    emergencyContact: formData.emergencyContact
                },
                // Ensure familyDetails is structure correct
                familyDetails: formData.familyDetails,
                // Ensure academicHistory is correct
                academicHistory: formData.academicHistory,
                // Ensure admissionDetails
                admissionDetails: formData.admissionDetails,
                // Ensure other groups
                hostelTransport: formData.hostelTransport,
                medicalInfo: formData.medicalInfo,
                feeDetails: formData.feeDetails,
                entranceExam: formData.entranceExam,

                // Top Level Fields required by Backend
                // Users Model: email, password (default to enrollmentNo)
                // Student Model: enrollmentNo, firstName, lastName, etc.
                enrollmentNo: formData.enrollmentNo || `EN${Date.now()}`, // Fallback generation
                // Note: documents are excluded from JSON payload for now as they are Files
                documents: {} // TODO: Handle File Uploads via FormData
            };

            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/students', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            toast.success('Application Submitted Successfully!', { id: toastId });
            navigate('/dashboard/students');
        } catch (error) {
            console.error('Submission Error:', error);
            toast.error(error.response?.data?.message || 'Failed to submit application', { id: toastId });
        } finally {
            setSaving(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <StepPersonal formData={formData} handleChange={(e, sec, subsec) => handleChange(e, sec, subsec)} />;
            case 2: return <StepFamily formData={formData} handleChange={(e, sec, subsec, fld) => handleChange(e, sec, subsec, fld)} />;
            case 3: return <StepAcademic formData={formData} handleChange={(e, sec, subsec, fld) => handleChange(e, sec, subsec, fld)} />;
            case 4: return <StepOther formData={formData} handleChange={(e, sec, subsec) => handleChange(e, sec, subsec)} />;
            case 5: return <StepDocuments formData={formData} handleChange={handleChange} handleFileChange={handleFileChange} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard/students')}
                            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Student Enrollment</h1>
                            <p className="text-gray-500 font-medium text-sm mt-1">New Admission Application • Phase {currentStep} of 5</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 ml-14">
                        {/* Import Button */}
                        <motion.button
                            onClick={() => setShowImportModal(true)}
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-200 transition-all shadow-sm"
                            title="Import Students"
                        >
                            <Upload size={18} />
                        </motion.button>

                        {/* Export Button */}
                        <ExportDropdown
                            data={[formData]}
                            columns={[
                                { header: 'First Name', key: 'firstName' },
                                { header: 'Last Name', key: 'lastName' },
                                { header: 'Phone', key: 'phone' },
                                { header: 'Email', key: 'email' },
                            ]}
                            filename="Student_Draft"
                            circular={true}
                        />

                        <button className="ml-auto px-6 py-2.5 bg-white text-gray-700 font-bold border border-gray-200 rounded-full hover:bg-gray-50 text-sm shadow-sm transition-all hover:shadow-md flex items-center gap-2">
                            <Save size={18} />
                            Save Draft
                        </button>
                    </div>
                </div>

                {/* Import Modal */}
                <ImportModal
                    isOpen={showImportModal}
                    onClose={() => setShowImportModal(false)}
                    category="students"
                    token={token}
                    onSuccess={() => { toast.success('Data Imported'); setShowImportModal(false); }}
                />

                {/* Stepper */}
                <EnrollmentStepper currentStep={currentStep} />

                {/* Main Form Area */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-[2.5rem] p-6 md:p-10 min-h-[60vh]">
                    {renderStep()}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all ${currentStep === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100 shadow-sm hover:shadow-md'
                            }`}
                    >
                        <ChevronLeft size={20} strokeWidth={2.5} />
                        Previous
                    </button>

                    {currentStep < 5 ? (
                        <button
                            onClick={nextStep}
                            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-blue-500/20 flex items-center gap-3 transition-all transform hover:-translate-y-1"
                        >
                            Next Step
                            <ChevronRight size={20} strokeWidth={2.5} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-emerald-500/20 flex items-center gap-3 transition-all transform hover:-translate-y-1"
                        >
                            {saving ? 'Submitting...' : 'Submit Application'}
                            {!saving && <Check size={20} strokeWidth={2.5} />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddStudent;
