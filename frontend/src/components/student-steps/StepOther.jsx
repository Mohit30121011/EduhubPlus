import React from 'react';
import { Home, Bus, Activity, CreditCard } from 'lucide-react';

const StepOther = ({ formData, handleChange }) => {
    return (
        <div className="space-y-8 animate-fadeIn">
            {/* 8. Hostel & Transport */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Home className="text-blue-600" />
                        Hostel Facility
                    </h3>
                    <div className="bg-white/50 p-5 rounded-2xl border border-white/60 shadow-sm backdrop-blur-sm h-full">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="font-semibold text-gray-700">Hostel Required?</label>
                                <input
                                    type="checkbox"
                                    checked={formData.hostelTransport?.hostelRequired || false}
                                    onChange={(e) => handleChange({ target: { checked: e.target.checked } }, 'hostelTransport', 'hostelRequired')}
                                    className="w-5 h-5 text-blue-600 rounded"
                                />
                            </div>
                            {formData.hostelTransport?.hostelRequired && (
                                <div className="space-y-3 animate-fadeIn">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">Type</label>
                                        <select
                                            value={formData.hostelTransport?.hostelType || ''}
                                            onChange={(e) => handleChange(e, 'hostelTransport', 'hostelType')}
                                            className="input-field"
                                        >
                                            <option value="">Select Type</option>
                                            <option value="Boys">Boys Hostel</option>
                                            <option value="Girls">Girls Hostel</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">Mess Required?</label>
                                        <select
                                            value={formData.hostelTransport?.messRequired || 'No'}
                                            onChange={(e) => handleChange(e, 'hostelTransport', 'messRequired')}
                                            className="input-field"
                                        >
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Bus className="text-blue-600" />
                        Transport Facility
                    </h3>
                    <div className="bg-white/50 p-5 rounded-2xl border border-white/60 shadow-sm backdrop-blur-sm h-full">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="font-semibold text-gray-700">Transport Required?</label>
                                <input
                                    type="checkbox"
                                    checked={formData.hostelTransport?.transportRequired || false}
                                    onChange={(e) => handleChange({ target: { checked: e.target.checked } }, 'hostelTransport', 'transportRequired')}
                                    className="w-5 h-5 text-blue-600 rounded"
                                />
                            </div>
                            {formData.hostelTransport?.transportRequired && (
                                <div className="space-y-3 animate-fadeIn">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">Route / Pickup Point</label>
                                        <input
                                            type="text"
                                            value={formData.hostelTransport?.pickupLocation || ''}
                                            onChange={(e) => handleChange(e, 'hostelTransport', 'pickupLocation')}
                                            className="input-field"
                                            placeholder="Enter location"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* 9. Medical Info */}
            <section className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Activity className="text-blue-600" />
                    Medical Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Blood Group</label>
                        <select value={formData.medicalInfo?.bloodGroup || ''} onChange={(e) => handleChange(e, 'medicalInfo', 'bloodGroup')} className="input-field">
                            <option value="">Select</option>
                            <option value="A+">A+</option> <option value="A-">A-</option>
                            <option value="B+">B+</option> <option value="B-">B-</option>
                            <option value="O+">O+</option> <option value="O-">O-</option>
                            <option value="AB+">AB+</option> <option value="AB-">AB-</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Disability?</label>
                        <select value={formData.medicalInfo?.disability || 'No'} onChange={(e) => handleChange(e, 'medicalInfo', 'disability')} className="input-field">
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Allergies (if any)</label>
                        <input type="text" value={formData.medicalInfo?.allergies || ''} onChange={(e) => handleChange(e, 'medicalInfo', 'allergies')} className="input-field" />
                    </div>
                </div>
            </section>

            {/* 11. Fee Details */}
            <section className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <CreditCard className="text-blue-600" />
                    Fee & Payment Details
                </h3>
                <div className="bg-white/50 p-5 rounded-2xl border border-white/60 shadow-sm backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Amount Paid</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                                <input type="number" value={formData.feeDetails?.amount || ''} onChange={(e) => handleChange(e, 'feeDetails', 'amount')} className="input-field pl-8" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Payment Mode</label>
                            <select value={formData.feeDetails?.paymentMode || 'Cash'} onChange={(e) => handleChange(e, 'feeDetails', 'paymentMode')} className="input-field">
                                <option value="Cash">Cash</option>
                                <option value="UPI">UPI</option>
                                <option value="NetBanking">Net Banking</option>
                                <option value="Card">Card</option>
                                <option value="Cheque">Cheque</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Transaction ID / Ref No.</label>
                            <input type="text" value={formData.feeDetails?.transactionId || ''} onChange={(e) => handleChange(e, 'feeDetails', 'transactionId')} className="input-field" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default StepOther;
