import React from 'react';
import { FileText, CheckCircle, Upload } from 'lucide-react';

const StepDocuments = ({ formData, handleChange, handleFileChange }) => {

    const renderFileUpload = (key, label) => (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700">{label}</label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 hover:bg-gray-50 transition-colors text-center cursor-pointer">
                <input
                    type="file"
                    onChange={(e) => handleFileChange(e, key)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.jpg,.jpeg,.png"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="text-gray-400" size={24} />
                    <span className="text-xs text-gray-500 font-medium">
                        {formData.documents?.[key] ? formData.documents[key].name : "Click to upload"}
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* 10. Documents Upload */}
            <section className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="text-blue-600" />
                    Documents Upload
                </h3>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-gray-800 mb-4">Certificates & Proofs</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {renderFileUpload('photo', 'Passport Photo')}
                        {renderFileUpload('studentSignature', 'Student Signature')}
                        {renderFileUpload('parentSignature', 'Parent Signature')}
                        {renderFileUpload('idProof', 'ID Proof (Aadhar/Passport)')}

                        {renderFileUpload('classXMarksheet', 'Class X Marksheet')}
                        {renderFileUpload('classXIIMarksheet', 'Class XII Marksheet')}
                        {renderFileUpload('graduationMarksheet', 'Graduation Marksheet')}
                        {renderFileUpload('transferCertificate', 'Transfer Certificate')}

                        {renderFileUpload('migrationCertificate', 'Migration Certificate')}
                        {renderFileUpload('characterCertificate', 'Character Certificate')}
                        {renderFileUpload('casteCertificate', 'Caste Certificate')}
                        {renderFileUpload('incomeCertificate', 'Income Certificate')}

                        {renderFileUpload('domicileCertificate', 'Domicile Certificate')}
                        {renderFileUpload('disabilityCertificate', 'Disability Certificate')}
                    </div>
                </div>
            </section>

            {/* 12. Declaration */}
            <section className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <CheckCircle className="text-green-600" />
                    Declaration & Undertaking
                </h3>
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <div className="flex items-start gap-4">
                        <input
                            type="checkbox"
                            checked={formData.declaration || false}
                            onChange={(e) => handleChange({ target: { checked: e.target.checked } }, 'declaration', null)}
                            className="w-5 h-5 text-blue-600 rounded mt-1"
                        />
                        <div className="space-y-2">
                            <p className="font-semibold text-gray-800">
                                I hereby declare that the information provided above is true and correct to the best of my knowledge.
                            </p>
                            <p className="text-sm text-gray-600">
                                I understand that any discrepancy found in the information will lead to cancellation of admission.
                            </p>
                        </div>
                    </div>

                    {formData.declaration && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 animate-fadeIn">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500">Place</label>
                                <input
                                    type="text"
                                    value={formData.place || ''}
                                    onChange={(e) => handleChange(e, 'place')}
                                    className="input-field bg-white"
                                    placeholder="Place of submission"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500">Date</label>
                                <input
                                    type="date"
                                    value={formData.date || new Date().toISOString().split('T')[0]}
                                    onChange={(e) => handleChange(e, 'date')}
                                    className="input-field bg-white"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default StepDocuments;
