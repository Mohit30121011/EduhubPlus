import React, { useState } from 'react';
import { Briefcase, Building, BookOpen, CreditCard, Layout } from 'lucide-react';

const StepFacultyProfessional = ({ formData, handleChange, errors = {} }) => {

    // Helper for Experience Array (Previous Institutions)
    const updateExperienceArray = (newList) => {
        // We update 'previousInstitutions' inside 'experienceDetails'
        // Simulate event structure for handleChange
        handleChange(
            { target: { name: 'previousInstitutions', value: newList } },
            'experienceDetails'
        );
    };

    const addExperience = () => {
        const currentList = formData.experienceDetails?.previousInstitutions || [];
        updateExperienceArray([...currentList, { institution: '', duration: '', role: '' }]);
    };

    const removeExperience = (index) => {
        const currentList = formData.experienceDetails?.previousInstitutions || [];
        updateExperienceArray(currentList.filter((_, i) => i !== index));
    };

    const updateExperienceItem = (index, field, value) => {
        const currentList = formData.experienceDetails?.previousInstitutions || [];
        const updatedList = currentList.map((item, i) => i === index ? { ...item, [field]: value } : item);
        updateExperienceArray(updatedList);
    };

    return (
        <div className="space-y-8 animate-fadeIn">

            {/* 5. Professional Details */}
            <section className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Briefcase className="text-blue-600" />
                    Professional Details
                </h3>
                <div className="bg-white/50 p-5 rounded-2xl border border-white/60 shadow-sm backdrop-blur-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Designation</label>
                        <select
                            name="designation"
                            value={formData.professionalDetails?.designation || ''}
                            onChange={(e) => handleChange(e, 'professionalDetails')}
                            className="input-field"
                        >
                            <option value="">Select</option>
                            <option value="Assistant Professor">Assistant Professor</option>
                            <option value="Associate Professor">Associate Professor</option>
                            <option value="Professor">Professor</option>
                            <option value="Lecturer">Lecturer</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Department</label>
                        <input
                            type="text"
                            name="department"
                            value={formData.professionalDetails?.department || ''}
                            onChange={(e) => handleChange(e, 'professionalDetails')}
                            className="input-field"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Faculty Type</label>
                        <select
                            name="facultyType"
                            value={formData.professionalDetails?.facultyType || ''}
                            onChange={(e) => handleChange(e, 'professionalDetails')}
                            className="input-field"
                        >
                            <option value="Permanent">Permanent</option>
                            <option value="Contract">Contract</option>
                            <option value="Guest">Guest</option>
                            <option value="Visiting">Visiting</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Date of Joining</label>
                        <input
                            type="date"
                            name="joinDate"
                            value={formData.professionalDetails?.joinDate || ''}
                            onChange={(e) => handleChange(e, 'professionalDetails')}
                            className="input-field"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Nature of Appointment</label>
                        <input
                            type="text"
                            name="natureOfAppointment"
                            value={formData.professionalDetails?.natureOfAppointment || ''}
                            onChange={(e) => handleChange(e, 'professionalDetails')}
                            className="input-field"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Employee Code</label>
                        <input
                            type="text"
                            name="employeeCode"
                            value={formData.professionalDetails?.employeeCode || ''}
                            onChange={(e) => handleChange(e, 'professionalDetails')}
                            className="input-field"
                        />
                    </div>
                </div>
            </section>

            {/* 6. Experience Details */}
            <section className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Building className="text-blue-600" />
                    Experience Details
                </h3>
                <div className="bg-white/50 p-5 rounded-2xl border border-white/60 shadow-sm backdrop-blur-sm space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Total Teaching Exp (Years)</label>
                            <input
                                type="number"
                                name="totalTeachingExp"
                                value={formData.experienceDetails?.totalTeachingExp || ''}
                                onChange={(e) => handleChange(e, 'experienceDetails')}
                                className="input-field"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Industry Experience (Years)</label>
                            <input
                                type="number"
                                name="industryExp"
                                value={formData.experienceDetails?.industryExp || ''}
                                onChange={(e) => handleChange(e, 'experienceDetails')}
                                className="input-field"
                            />
                        </div>
                    </div>

                    <h5 className="font-semibold text-gray-700 border-t pt-4">Previous Institutions</h5>
                    {(formData.experienceDetails?.previousInstitutions || []).map((exp, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                                placeholder="Institution Name"
                                value={exp.institution}
                                onChange={(e) => updateExperienceItem(index, 'institution', e.target.value)}
                                className="input-field"
                            />
                            <input
                                placeholder="Duration"
                                value={exp.duration}
                                onChange={(e) => updateExperienceItem(index, 'duration', e.target.value)}
                                className="input-field"
                            />
                            <div className="flex gap-2">
                                <input
                                    placeholder="Role/Designation"
                                    value={exp.role}
                                    onChange={(e) => updateExperienceItem(index, 'role', e.target.value)}
                                    className="input-field flex-1"
                                />
                                <button onClick={() => removeExperience(index)} className="text-red-500 hover:bg-red-50 p-2 rounded">Delete</button>
                            </div>
                        </div>
                    ))}
                    <button onClick={addExperience} className="text-blue-600 text-sm font-semibold hover:underline">+ Add Previous Institution</button>
                </div>
            </section>

            {/* 7. Research & Academic Contributions */}
            <section className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <BookOpen className="text-blue-600" />
                    Research & Academic Contributions
                </h3>
                <div className="bg-white/50 p-5 rounded-2xl border border-white/60 shadow-sm backdrop-blur-sm grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">PhD Status</label>
                        <select name="phdStatus" value={formData.researchDetails?.phdStatus || ''} onChange={(e) => handleChange(e, 'researchDetails')} className="input-field">
                            <option value="">Select</option>
                            <option value="Completed">Completed</option>
                            <option value="Pursuing">Pursuing</option>
                            <option value="Not Applicable">Not Applicable</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Research Area / Interests</label>
                        <textarea
                            name="researchArea"
                            value={formData.researchDetails?.researchArea || ''}
                            onChange={(e) => handleChange(e, 'researchDetails')}
                            className="input-field h-20 pt-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Publications (Journals / Conferences)</label>
                        <textarea
                            name="publications"
                            value={formData.researchDetails?.publications || ''}
                            onChange={(e) => handleChange(e, 'researchDetails')}
                            className="input-field h-24 pt-2"
                            placeholder="List your key publications..."
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Patents / Projects</label>
                        <textarea
                            name="projects"
                            value={formData.researchDetails?.projects || ''}
                            onChange={(e) => handleChange(e, 'researchDetails')}
                            className="input-field h-20 pt-2"
                            placeholder="Ongoing or Completed Projects/Patents..."
                        />
                    </div>
                </div>
            </section>

            {/* 8. Bank & Payroll Details */}
            <section className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <CreditCard className="text-blue-600" />
                    Bank & Payroll Details
                </h3>
                <div className="bg-white/50 p-5 rounded-2xl border border-white/60 shadow-sm backdrop-blur-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Bank Name</label>
                        <input type="text" name="bankName" value={formData.bankDetails?.bankName || ''} onChange={(e) => handleChange(e, 'bankDetails')} className="input-field" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Account Number</label>
                        <input type="text" name="accountNumber" value={formData.bankDetails?.accountNumber || ''} onChange={(e) => handleChange(e, 'bankDetails')} className="input-field" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">IFSC Code</label>
                        <input type="text" name="ifsc" value={formData.bankDetails?.ifsc || ''} onChange={(e) => handleChange(e, 'bankDetails')} className="input-field" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Branch Name</label>
                        <input type="text" name="branch" value={formData.bankDetails?.branch || ''} onChange={(e) => handleChange(e, 'bankDetails')} className="input-field" />
                    </div>
                </div>
            </section>

            {/* 11. Institutional Information */}
            <section className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Layout className="text-blue-600" />
                    Institutional Information
                </h3>
                <div className="bg-white/50 p-5 rounded-2xl border border-white/60 shadow-sm backdrop-blur-sm grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Subjects Handled</label>
                        <input type="text" name="subjects" value={formData.institutionalInfo?.subjects || ''} onChange={(e) => handleChange(e, 'institutionalInfo')} className="input-field" placeholder="Comma separated" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Additional Responsibilities</label>
                        <input type="text" name="responsibilities" value={formData.institutionalInfo?.responsibilities || ''} onChange={(e) => handleChange(e, 'institutionalInfo')} className="input-field" placeholder="NSS, NAAC, etc." />
                    </div>
                </div>
            </section>

        </div>
    );
};

export default StepFacultyProfessional;
