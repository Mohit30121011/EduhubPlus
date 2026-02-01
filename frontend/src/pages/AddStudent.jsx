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

const AddStudent = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);

    // Huge initial state for all 13 sections
    const [formData, setFormData] = useState({
        // Step 1: Personal
        firstName: '', lastName: '', regionalName: '', previousName: '',
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard/students')}
                        className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Student Enrollment</h1>
                        <p className="text-gray-500 text-sm mt-1">New Admission Application • Phase {currentStep} of 5</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white text-gray-700 font-bold border border-gray-200 rounded-xl hover:bg-gray-50 text-sm">
                        Save Draft
                    </button>
                </div>
            </div>

            {/* Stepper */}
            <EnrollmentStepper currentStep={currentStep} />

            {/* Main Form Area */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-3xl p-6 md:p-8 min-h-[60vh]">
                {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200/50">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${currentStep === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                >
                    <ChevronLeft size={20} />
                    Previous
                </button>

                {currentStep < 5 ? (
                    <button
                        onClick={nextStep}
                        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all transform hover:scale-105"
                    >
                        Next Step
                        <ChevronRight size={20} />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all transform hover:scale-105"
                    >
                        {saving ? 'Submitting...' : 'Submit Application'}
                        {!saving && <Check size={20} />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AddStudent;
