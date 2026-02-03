import React from 'react';
import { Users, Phone, MapPin, DollarSign, Briefcase } from 'lucide-react';

const StepFamily = ({ formData, handleChange, errors = {}, showParents = true }) => {

    const renderParentForm = (role, title) => {
        const isFather = role === 'father';
        return (
            <div className="bg-white/50 p-5 rounded-2xl border border-white/60 shadow-sm backdrop-blur-sm">
                <h4 className="font-bold text-gray-800 mb-4 capitalize">{title} Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Name {isFather && <span className="text-red-500">*</span>}</label>
                        <input
                            type="text"
                            value={formData.familyDetails?.[role]?.name || ''}
                            onChange={(e) => handleChange(e, 'familyDetails', role, 'name')}
                            className={`input-field ${isFather && errors.fatherName ? 'border-red-400' : ''}`}
                            placeholder={`Enter ${title} name`}
                        />
                        {isFather && errors.fatherName && <p className="text-xs text-red-500 mt-1">{errors.fatherName}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Occupation</label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={formData.familyDetails?.[role]?.occupation || ''}
                                onChange={(e) => handleChange(e, 'familyDetails', role, 'occupation')}
                                className="input-field pl-10"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Annual Income</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={formData.familyDetails?.[role]?.annualIncome || ''}
                                onChange={(e) => handleChange(e, 'familyDetails', role, 'annualIncome')}
                                className="input-field pl-10"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Contact Number {isFather && <span className="text-red-500">*</span>}</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                type="tel"
                                value={formData.familyDetails?.[role]?.contact || ''}
                                onChange={(e) => handleChange(e, 'familyDetails', role, 'contact')}
                                className={`input-field pl-10 ${isFather && errors.fatherMobile ? 'border-red-400' : ''}`}
                            />
                        </div>
                        {isFather && errors.fatherMobile && <p className="text-xs text-red-500 mt-1">{errors.fatherMobile}</p>}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* 3. Parent / Guardian */}
            {/* 3. Parent / Guardian */}
            {showParents && (
                <section className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Users className="text-blue-600" />
                        Parent / Guardian Information
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {renderParentForm('father', "Father's")}
                        {renderParentForm('mother', "Mother's")}
                    </div>

                    {/* Guardian (Optional) */}
                    <div className="bg-blue-50/30 p-5 rounded-2xl border border-blue-100/50 mt-4 backdrop-blur-sm">
                        <h4 className="font-bold text-gray-800 mb-4">Guardian Details (If applicable)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">Guardian Name</label>
                                <input
                                    type="text"
                                    value={formData.familyDetails?.guardian?.name || ''}
                                    onChange={(e) => handleChange(e, 'familyDetails', 'guardian', 'name')}
                                    className="input-field"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">Relationship</label>
                                <input
                                    type="text"
                                    value={formData.familyDetails?.guardian?.relationship || ''}
                                    onChange={(e) => handleChange(e, 'familyDetails', 'guardian', 'relationship')}
                                    className="input-field"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">Address</label>
                                <input
                                    type="text"
                                    value={formData.familyDetails?.guardian?.address || ''}
                                    onChange={(e) => handleChange(e, 'familyDetails', 'guardian', 'address')}
                                    className="input-field"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">Contact</label>
                                <input
                                    type="tel"
                                    value={formData.familyDetails?.guardian?.contact || ''}
                                    onChange={(e) => handleChange(e, 'familyDetails', 'guardian', 'contact')}
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* 4. Emergency & Local Guardian */}
            <section className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <MapPin className="text-red-500" />
                    Emergency & Local Guardian
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Emergency Contact */}
                    <div className="bg-red-50/50 p-5 rounded-2xl border border-red-50">
                        <h4 className="font-bold text-gray-800 mb-4 text-red-700">Emergency Contact</h4>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500">Person Name</label>
                                <input
                                    type="text"
                                    value={formData.emergencyContact?.name || ''}
                                    onChange={(e) => handleChange(e, 'emergencyContact', 'name')}
                                    className="input-field bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500">Relationship</label>
                                <input
                                    type="text"
                                    value={formData.emergencyContact?.relationship || ''}
                                    onChange={(e) => handleChange(e, 'emergencyContact', 'relationship')}
                                    className="input-field bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500">Contact Number</label>
                                <input
                                    type="tel"
                                    value={formData.emergencyContact?.phone || ''}
                                    onChange={(e) => handleChange(e, 'emergencyContact', 'phone')}
                                    className="input-field bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500">Address</label>
                                <input
                                    type="text"
                                    value={formData.emergencyContact?.address || ''}
                                    onChange={(e) => handleChange(e, 'emergencyContact', 'address')}
                                    className="input-field bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Local Guardian */}
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <h4 className="font-bold text-gray-800 mb-4">Local Guardian (For Outstation)</h4>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500">Name</label>
                                <input
                                    type="text"
                                    value={formData.familyDetails?.localGuardian?.name || ''}
                                    onChange={(e) => handleChange(e, 'familyDetails', 'localGuardian', 'name')}
                                    className="input-field bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500">Address</label>
                                <input
                                    type="text"
                                    value={formData.familyDetails?.localGuardian?.address || ''}
                                    onChange={(e) => handleChange(e, 'familyDetails', 'localGuardian', 'address')}
                                    className="input-field bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500">Contact Number</label>
                                <input
                                    type="tel"
                                    value={formData.familyDetails?.localGuardian?.contact || ''}
                                    onChange={(e) => handleChange(e, 'familyDetails', 'localGuardian', 'contact')}
                                    className="input-field bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default StepFamily;
