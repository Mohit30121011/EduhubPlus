import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, GraduationCap } from 'lucide-react';

const StepFacultyAcademic = ({ formData, handleChange, errors = {} }) => {

    // Helper to add a new qualification row
    const addQualification = () => {
        const currentList = formData.academicQualifications || [];
        const newItem = { qualification: '', degree: '', subject: '', university: '', year: '', percentage: '' };
        handleChange({
            target: {
                name: 'academicQualifications',
                value: [...currentList, newItem]
            }
        });
    };

    // Helper to remove a row
    const removeQualification = (index) => {
        const currentList = formData.academicQualifications || [];
        const newList = currentList.filter((_, i) => i !== index);
        handleChange({
            target: {
                name: 'academicQualifications',
                value: newList
            }
        });
    };

    // Helper to update a row
    const updateQualification = (index, field, value) => {
        const currentList = formData.academicQualifications || [];
        const updatedList = currentList.map((item, i) => {
            if (i === index) {
                return { ...item, [field]: value };
            }
            return item;
        });
        handleChange({
            target: {
                name: 'academicQualifications',
                value: updatedList
            }
        });
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <section className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <GraduationCap className="text-blue-600" />
                    Academic Qualifications
                </h3>

                <div className="space-y-4">
                    {(formData.academicQualifications || []).map((qual, index) => (
                        <div key={index} className="bg-white/50 p-5 rounded-2xl border border-white/60 shadow-sm backdrop-blur-sm relative">
                            <button
                                onClick={() => removeQualification(index)}
                                className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                            <h4 className="font-bold text-gray-800 mb-4">Qualification {index + 1}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">Highest Qualification</label>
                                    <select
                                        value={qual.qualification}
                                        onChange={(e) => updateQualification(index, 'qualification', e.target.value)}
                                        className="input-field"
                                    >
                                        <option value="">Select</option>
                                        <option value="PhD">PhD</option>
                                        <option value="NET">NET</option>
                                        <option value="SET">SET</option>
                                        <option value="MSc">MSc</option>
                                        <option value="MA">MA</option>
                                        <option value="MTech">MTech</option>
                                        <option value="MBA">MBA</option>
                                        <option value="BTech">BTech</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">Degree Name</label>
                                    <input
                                        type="text"
                                        value={qual.degree}
                                        onChange={(e) => updateQualification(index, 'degree', e.target.value)}
                                        className="input-field"
                                        placeholder="e.g. Computer Science"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">Subject/Specialization</label>
                                    <input
                                        type="text"
                                        value={qual.subject}
                                        onChange={(e) => updateQualification(index, 'subject', e.target.value)}
                                        className="input-field"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">University/Inst.</label>
                                    <input
                                        type="text"
                                        value={qual.university}
                                        onChange={(e) => updateQualification(index, 'university', e.target.value)}
                                        className="input-field"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">Year of Passing</label>
                                    <input
                                        type="text"
                                        value={qual.year}
                                        onChange={(e) => updateQualification(index, 'year', e.target.value)}
                                        className="input-field"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">Percentage / CGPA</label>
                                    <input
                                        type="text"
                                        value={qual.percentage}
                                        onChange={(e) => updateQualification(index, 'percentage', e.target.value)}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addQualification}
                        className="w-full py-3 border-2 border-dashed border-blue-300 rounded-xl text-blue-600 font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={20} />
                        Add Qualification
                    </button>
                </div>
            </section>
        </div>
    );
};

export default StepFacultyAcademic;
