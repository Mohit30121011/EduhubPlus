import React from 'react';
import { User, Calendar, MapPin, Phone, Mail, FileText, Globe, Heart, Shield } from 'lucide-react';

const StepPersonal = ({ formData, handleChange }) => {
    return (
        <div className="space-y-8 animate-fadeIn">
            {/* 1. Personal Information */}
            <section className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <User className="text-blue-600" />
                    Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="input-field" placeholder="First Name" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Middle Name</label>
                        <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} className="input-field" placeholder="Middle Name" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="input-field" placeholder="Last Name" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Regional Name</label>
                        <input type="text" name="regionalName" value={formData.regionalName} onChange={handleChange} className="input-field" placeholder="In native language" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                                className="input-field"
                                style={{ paddingLeft: '3rem' }}
                                placeholder="DD-MM-YYYY"
                                onFocus={(e) => e.target.type = 'date'}
                                onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                            <option value="GENERAL">General</option>
                            <option value="OBC">OBC</option>
                            <option value="SC">SC</option>
                            <option value="ST">ST</option>
                            <option value="EWS">EWS</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Sub-Category</label>
                        <input type="text" name="subCategory" value={formData.subCategory} onChange={handleChange} className="input-field" placeholder="e.g. PwD, Defence" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Aaadhar Number</label>
                        <div className="relative">
                            <Shield className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} className="input-field pl-10" maxLength={12} placeholder="12 Digit UID" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Religion</label>
                        <input type="text" name="religion" value={formData.religion} onChange={handleChange} className="input-field" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Mother Tongue</label>
                        <input type="text" name="motherTongue" value={formData.motherTongue} onChange={handleChange} className="input-field" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Nationality</label>
                        <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} className="input-field" defaultValue="Indian" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Marital Status</label>
                        <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="input-field">
                            <option value="Unmarried">Unmarried</option>
                            <option value="Married">Married</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* 2. Contact & Address */}
            <section className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <MapPin className="text-blue-600" />
                    Contact & Address
                </h3>

                {/* Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Mobile No.</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="input-field pl-10" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Alt Mobile No.</label>
                        <input type="tel" name="alternateMobile" value={formData.alternateMobile} onChange={handleChange} className="input-field" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Email ID</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field pl-10" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Alt Email ID</label>
                        <input type="email" name="alternateEmail" value={formData.alternateEmail} onChange={handleChange} className="input-field" />
                    </div>
                </div>

                {/* Permanent Address */}
                <div className="bg-gray-50 p-4 rounded-xl space-y-4 border border-gray-100">
                    <h4 className="font-semibold text-gray-700">Permanent Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-3 space-y-1">
                            <label className="text-xs font-semibold text-gray-500">House No / Street</label>
                            <input type="text" name="permanentAddress.street" value={formData.permanentAddress?.street || ''} onChange={(e) => handleChange(e, 'permanentAddress', 'street')} className="input-field bg-white" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500">City / District</label>
                            <input type="text" name="permanentAddress.city" value={formData.permanentAddress?.city || ''} onChange={(e) => handleChange(e, 'permanentAddress', 'city')} className="input-field bg-white" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500">State</label>
                            <input type="text" name="permanentAddress.state" value={formData.permanentAddress?.state || ''} onChange={(e) => handleChange(e, 'permanentAddress', 'state')} className="input-field bg-white" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500">PIN Code</label>
                            <input type="text" name="permanentAddress.pincode" value={formData.permanentAddress?.pincode || ''} onChange={(e) => handleChange(e, 'permanentAddress', 'pincode')} className="input-field bg-white" />
                        </div>
                    </div>
                </div>

                {/* Correspondence Address */}
                <div className="bg-gray-50 p-4 rounded-xl space-y-4 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-700">Correspondence Address</h4>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.sameAsPermanent}
                                onChange={(e) => handleChange({ target: { name: 'sameAsPermanent', value: e.target.checked } })}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="text-sm text-gray-600">Same as Permanent</span>
                        </label>
                    </div>

                    {!formData.sameAsPermanent && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
                            <div className="md:col-span-3 space-y-1">
                                <label className="text-xs font-semibold text-gray-500">House No / Street</label>
                                <input type="text" name="correspondenceAddress.street" value={formData.correspondenceAddress?.street || ''} onChange={(e) => handleChange(e, 'correspondenceAddress', 'street')} className="input-field bg-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500">City / District</label>
                                <input type="text" name="correspondenceAddress.city" value={formData.correspondenceAddress?.city || ''} onChange={(e) => handleChange(e, 'correspondenceAddress', 'city')} className="input-field bg-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500">State</label>
                                <input type="text" name="correspondenceAddress.state" value={formData.correspondenceAddress?.state || ''} onChange={(e) => handleChange(e, 'correspondenceAddress', 'state')} className="input-field bg-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500">PIN Code</label>
                                <input type="text" name="correspondenceAddress.pincode" value={formData.correspondenceAddress?.pincode || ''} onChange={(e) => handleChange(e, 'correspondenceAddress', 'pincode')} className="input-field bg-white" />
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <style>{`
                .input-field {
                    width: 100%;
                    padding: 0.625rem 1rem;
                    background-color: #F9FAFB;
                    border: 1px solid #E5E7EB;
                    border-radius: 0.75rem;
                    font-size: 0.875rem;
                    line-height: 1.25rem;
                    transition: all 0.2s;
                    outline: none;
                }
                .input-field:focus {
                    background-color: #FFFFFF;
                    border-color: #3B82F6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
             `}</style>
        </div>
    );
};

export default StepPersonal;
