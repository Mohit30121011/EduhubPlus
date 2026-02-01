import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, FileSpreadsheet, AlertTriangle, Trash2, CheckCircle, Download } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ImportModal = ({ isOpen, onClose, category, token, onSuccess }) => {
    const [step, setStep] = useState(1); // 1: Upload, 2: Preview
    const [previewData, setPreviewData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleDownloadTemplate = async () => {
        try {
            const response = await axios.get(`${API_URL}/import/template/${category}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${category}_template.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Template downloaded!');
        } catch (error) {
            toast.error('Failed to download template');
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const response = await axios.post(`${API_URL}/import/parse/${category}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setPreviewData(response.data.data);
            setColumns(response.data.columns);
            setStep(2);
            toast.success(`${response.data.data.length} rows parsed!`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to parse file');
        } finally {
            setUploading(false);
        }
    };

    const handleCellChange = (rowIndex, column, value) => {
        const updated = [...previewData];
        updated[rowIndex][column] = value;
        setPreviewData(updated);
    };

    const handleDeleteRow = (index) => {
        setPreviewData(previewData.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (previewData.length === 0) {
            toast.error('No data to save');
            return;
        }

        setSaving(true);
        try {
            const response = await axios.post(`${API_URL}/import/bulk/${category}`,
                { data: previewData },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(response.data.message);
            onSuccess();
            onClose();
            resetModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to import data');
        } finally {
            setSaving(false);
        }
    };

    const resetModal = () => {
        setStep(1);
        setPreviewData([]);
        setColumns([]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="bg-white p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="text-xl font-black text-gray-900">
                            Import {category.charAt(0).toUpperCase() + category.slice(1)}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Bulk upload using Excel template</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {step === 1 ? (
                        <div className="space-y-8">
                            {/* Step 1: Template */}
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Download size={20} className="text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 mb-1">1. Download Template</h4>
                                    <p className="text-sm text-gray-500 mb-4">First, download the pre-formatted Excel template for {category}.</p>
                                    <button
                                        onClick={handleDownloadTemplate}
                                        className="px-4 py-2 bg-white border-2 border-blue-100 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors text-sm"
                                    >
                                        Download Template
                                    </button>
                                </div>
                            </div>

                            {/* Step 2: Upload */}
                            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-start gap-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Upload size={20} className="text-emerald-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 mb-1">2. Upload Filled File</h4>
                                    <p className="text-sm text-gray-500 mb-4">Upload your filled Excel file here.</p>

                                    {uploading ? (
                                        <div className="flex items-center gap-3 text-emerald-600 font-medium">
                                            <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                                            Parsing file...
                                        </div>
                                    ) : (
                                        <label className="inline-block cursor-pointer">
                                            <input
                                                type="file"
                                                accept=".xlsx, .xls"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                            />
                                            <div className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2">
                                                <FileSpreadsheet size={18} />
                                                Select Excel File
                                            </div>
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                    <CheckCircle size={18} className="text-emerald-500" />
                                    Preview Data ({previewData.length} records)
                                </h4>
                                <button
                                    onClick={() => { setStep(1); setPreviewData([]); }}
                                    className="text-sm font-bold text-gray-500 hover:text-gray-700"
                                >
                                    Re-upload
                                </button>
                            </div>

                            <div className="border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500">
                                        <tr>
                                            {columns.map(col => (
                                                <th key={col} className="px-4 py-3 whitespace-nowrap">{col}</th>
                                            ))}
                                            <th className="px-4 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {previewData.map((row, idx) => (
                                            <tr key={idx} className="bg-white hover:bg-gray-50">
                                                {columns.map(col => (
                                                    <td key={col} className="px-4 py-2 max-w-xs truncate" title={row[col]}>
                                                        {row[col]}
                                                    </td>
                                                ))}
                                                <td className="px-4 py-2 text-right">
                                                    <button
                                                        onClick={() => handleDeleteRow(idx)}
                                                        className="text-red-400 hover:text-red-600"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    {step === 2 && (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Importing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={18} />
                                    Confirm Import
                                </>
                            )}
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ImportModal;
