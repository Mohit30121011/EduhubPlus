import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
    ArrowLeft, Edit, Trash2, User, Phone, Mail, MapPin,
    GraduationCap, Building2, Calendar, FileText, Shield,
    Heart, Bus, CreditCard, ClipboardCheck, Users, BookOpen
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Reusable Section Card
const Section = ({ icon: Icon, title, children, gradient = 'from-blue-500 to-indigo-600' }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-sm overflow-hidden"
    >
        <div className={`bg-gradient-to-r ${gradient} px-6 py-4 flex items-center gap-3`}>
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <Icon size={18} className="text-white" />
            </div>
            <h3 className="text-white font-bold text-lg">{title}</h3>
        </div>
        <div className="p-6">{children}</div>
    </motion.div>
);

// Reusable Field Display
const Field = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value || <span className="text-gray-300 italic font-normal">Not provided</span>}</p>
    </div>
);

// Address Display
const AddressBlock = ({ label, address }) => {
    if (!address || typeof address !== 'object') return <Field label={label} value={null} />;
    const parts = [address.street, address.city, address.state, address.pincode, address.country].filter(Boolean);
    return <Field label={label} value={parts.length > 0 ? parts.join(', ') : null} />;
};

const ViewStudent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useSelector((state) => state.auth);
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_URL}/students/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStudent(res.data);
            } catch (error) {
                console.error('Error fetching student:', error);
                toast.error('Failed to load student details');
                navigate('/dashboard/students');
            } finally {
                setLoading(false);
            }
        };
        if (id && token) fetchStudent();
    }, [id, token]);

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL}/students/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Student deleted successfully');
            navigate('/dashboard/students');
        } catch (error) {
            toast.error('Failed to delete student');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-bold">Loading student profile...</p>
                </div>
            </div>
        );
    }

    if (!student) return null;

    const contact = student.contactDetails || {};
    const family = student.familyDetails || {};
    const academic = student.academicHistory || {};
    const admission = student.admissionDetails || {};
    const hostel = student.hostelTransport || {};
    const medical = student.medicalInfo || {};
    const fee = student.feeDetails || {};
    const entrance = student.entranceExam || {};
    const docs = student.documents || {};

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard/students')}
                            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Student Profile</h1>
                            <p className="text-gray-500 font-medium text-sm mt-1">Viewing complete student record</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/dashboard/students/edit/${id}`)}
                            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl hover:shadow-amber-500/30 transition-all text-sm"
                        >
                            <Edit size={16} /> Edit
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => setShowDeleteModal(true)}
                            className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl hover:shadow-red-500/30 transition-all text-sm"
                        >
                            <Trash2 size={16} /> Delete
                        </motion.button>
                    </div>
                </div>

                {/* Hero Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-sm p-8"
                >
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {docs.photo?.url ? (
                            <img src={docs.photo.url} alt={student.firstName} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
                        ) : (
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-black text-3xl shadow-lg border-4 border-white">
                                {student.firstName?.[0]}{student.lastName?.[0]}
                            </div>
                        )}
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl font-black text-gray-900">
                                {student.firstName} {student.middleName} {student.lastName}
                            </h2>
                            <p className="text-gray-500 font-medium mt-1">{student.email}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-3 justify-center sm:justify-start">
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-extrabold">{student.enrollmentNo}</span>
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-extrabold">{student.department || 'No Dept'}</span>
                                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-extrabold">Sem {student.currentSemester || 1}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${student.applicationStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' :
                                    student.applicationStatus === 'REJECTED' ? 'bg-red-100 text-red-600' :
                                        'bg-amber-100 text-amber-600'
                                    }`}>
                                    {student.applicationStatus || 'PENDING'}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Sections Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Personal Info */}
                    <Section icon={User} title="Personal Information" gradient="from-blue-500 to-indigo-600">
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="First Name" value={student.firstName} />
                            <Field label="Middle Name" value={student.middleName} />
                            <Field label="Last Name" value={student.lastName} />
                            <Field label="Regional Name" value={student.regionalName} />
                            <Field label="Date of Birth" value={student.dateOfBirth} />
                            <Field label="Gender" value={student.gender} />
                            <Field label="Nationality" value={student.nationality} />
                            <Field label="Place of Birth" value={student.placeOfBirth} />
                            <Field label="Domicile State" value={student.domicileState} />
                            <Field label="Category" value={student.category} />
                            <Field label="Sub-Category" value={student.subCategory} />
                            <Field label="Religion" value={student.religion} />
                            <Field label="Mother Tongue" value={student.motherTongue} />
                            <Field label="Marital Status" value={student.maritalStatus} />
                            <Field label="Aadhar Number" value={student.aadharNumber} />
                            <Field label="Passport Number" value={student.passportNumber} />
                            <Field label="ABC ID" value={student.abcId} />
                            <Field label="Phone" value={student.phone} />
                        </div>
                    </Section>

                    {/* Contact Details */}
                    <Section icon={MapPin} title="Contact Details" gradient="from-emerald-500 to-teal-600">
                        <div className="space-y-4">
                            <AddressBlock label="Permanent Address" address={contact.permanentAddress} />
                            <AddressBlock label="Correspondence Address" address={contact.correspondenceAddress} />
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Alternate Mobile" value={contact.alternateMobile} />
                                <Field label="Alternate Email" value={contact.alternateEmail} />
                                <Field label="Emergency Contact" value={contact.emergencyContact?.name} />
                                <Field label="Emergency Phone" value={contact.emergencyContact?.phone} />
                            </div>
                        </div>
                    </Section>

                    {/* Family Details */}
                    <Section icon={Users} title="Family Details" gradient="from-pink-500 to-rose-600">
                        <div className="space-y-4">
                            {['father', 'mother', 'guardian', 'localGuardian'].map(rel => {
                                const person = family[rel];
                                if (!person || Object.keys(person).length === 0) return null;
                                return (
                                    <div key={rel} className="p-3 bg-gray-50 rounded-xl">
                                        <p className="text-xs font-extrabold text-gray-400 uppercase mb-2">{rel}</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Field label="Name" value={person.name} />
                                            <Field label="Contact" value={person.contact} />
                                            <Field label="Occupation" value={person.occupation} />
                                            <Field label="Income" value={person.income} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Section>

                    {/* Academic History */}
                    <Section icon={BookOpen} title="Academic History" gradient="from-violet-500 to-purple-600">
                        <div className="space-y-4">
                            {['classX', 'classXII', 'graduation'].map(level => {
                                const data = academic[level];
                                if (!data || Object.keys(data).length === 0) return null;
                                return (
                                    <div key={level} className="p-3 bg-gray-50 rounded-xl">
                                        <p className="text-xs font-extrabold text-gray-400 uppercase mb-2">{level.replace('class', 'Class ')}</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Field label="Board/University" value={data.board || data.university} />
                                            <Field label="School/College" value={data.school || data.college} />
                                            <Field label="Year of Passing" value={data.yearOfPassing} />
                                            <Field label="Percentage/CGPA" value={data.percentage || data.cgpa} />
                                            <Field label="Subjects" value={data.subjects} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Section>

                    {/* Admission Details */}
                    <Section icon={GraduationCap} title="Admission Details" gradient="from-cyan-500 to-blue-600">
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Department" value={student.department} />
                            <Field label="Course" value={student.course} />
                            <Field label="Current Semester" value={student.currentSemester} />
                            <Field label="Program Level" value={admission.programLevel} />
                            <Field label="Admission Type" value={admission.admissionType} />
                            <Field label="Mode of Study" value={admission.modeOfStudy} />
                            <Field label="Academic Session" value={admission.academicSession} />
                            <Field label="Choice Preference" value={admission.choicePreference} />
                        </div>
                    </Section>

                    {/* Entrance Exam */}
                    {entrance && Object.keys(entrance).length > 0 && (
                        <Section icon={ClipboardCheck} title="Entrance Exam" gradient="from-orange-500 to-amber-600">
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Exam Name" value={entrance.examName} />
                                <Field label="Roll Number" value={entrance.rollNumber} />
                                <Field label="Score/Rank" value={entrance.score || entrance.rank} />
                                <Field label="Year" value={entrance.year} />
                            </div>
                        </Section>
                    )}

                    {/* Hostel & Transport */}
                    <Section icon={Bus} title="Hostel & Transport" gradient="from-teal-500 to-cyan-600">
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Hostel Required" value={hostel.hostelRequired ? 'Yes' : 'No'} />
                            <Field label="Transport Required" value={hostel.transportRequired ? 'Yes' : 'No'} />
                            <Field label="Room Preference" value={hostel.roomPreference} />
                            <Field label="Route" value={hostel.route} />
                        </div>
                    </Section>

                    {/* Medical Info */}
                    <Section icon={Heart} title="Medical Information" gradient="from-red-500 to-rose-600">
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Blood Group" value={medical.bloodGroup} />
                            <Field label="Disability" value={medical.disability || 'None'} />
                            <Field label="Medical Conditions" value={medical.medicalConditions} />
                            <Field label="Allergies" value={medical.allergies} />
                        </div>
                    </Section>

                    {/* Fee Details */}
                    {fee && Object.keys(fee).length > 0 && (
                        <Section icon={CreditCard} title="Fee Details" gradient="from-green-500 to-emerald-600">
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Application Fee" value={fee.applicationFee} />
                                <Field label="Payment Mode" value={fee.paymentMode} />
                                <Field label="Transaction ID" value={fee.transactionId} />
                            </div>
                        </Section>
                    )}

                    {/* Documents */}
                    <Section icon={FileText} title="Documents" gradient="from-slate-600 to-gray-800">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {Object.entries(docs).map(([key, doc]) => (
                                <div key={key} className="p-3 bg-gray-50 rounded-xl text-center">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                    {doc?.url ? (
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs font-bold hover:underline">
                                            View File ↗
                                        </a>
                                    ) : (
                                        <span className="text-gray-300 text-xs italic">Not uploaded</span>
                                    )}
                                </div>
                            ))}
                            {Object.keys(docs).length === 0 && (
                                <p className="text-gray-400 text-sm col-span-full text-center py-4">No documents uploaded</p>
                            )}
                        </div>
                    </Section>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowDeleteModal(false)} className="absolute inset-0 bg-red-900/20 backdrop-blur-md" />
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full relative z-10 shadow-2xl text-center border border-red-50 overflow-hidden">
                        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-50"></div>
                        <div className="relative w-24 h-24 mx-auto mb-6">
                            <div className="w-full h-full bg-red-50 rounded-full flex items-center justify-center border-4 border-red-100 relative z-10">
                                <Trash2 size={40} className="text-red-500" strokeWidth={2.5} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Delete Student?</h3>
                        <p className="text-gray-500 font-medium mb-8">Are you sure you want to delete <span className="font-bold text-gray-900">{student.firstName} {student.lastName}</span>? This action cannot be undone.</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setShowDeleteModal(false)} className="py-4 bg-gray-50 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-colors">Cancel</button>
                            <button onClick={handleDelete} className="py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-red-500/30 transition-all">Delete</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ViewStudent;
