import React, { useMemo } from 'react';
import { BookOpen, Award, GraduationCap, ClipboardList } from 'lucide-react';

const StepAcademic = ({ formData, handleChange, departments = [], courses = [] }) => {

    // Filter courses based on selected department
    const filteredCourses = useMemo(() => {
        if (!formData.department) return courses;
        return courses.filter(c => c.DepartmentId === formData.department || c.Department?.id === formData.department);
    }, [formData.department, courses]);

    const renderAcademicRow = (level, title) => (
        <div className="bg-white/50 p-5 rounded-2xl border border-white/60 shadow-sm backdrop-blur-sm">
            <h4 className="font-bold text-gray-800 mb-4">{title} Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Board / University</label>
                    <input
                        type="text"
                        value={formData.academicHistory?.[level]?.board || ''}
                        onChange={(e) => handleChange(e, 'academicHistory', level, 'board')}
                        className="input-field"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">School / College</label>
                    <input
                        type="text"
                        value={formData.academicHistory?.[level]?.school || ''}
                        onChange={(e) => handleChange(e, 'academicHistory', level, 'school')}
                        className="input-field"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Year of Passing</label>
                    <input
                        type="text"
                        value={formData.academicHistory?.[level]?.passingYear || ''}
                        onChange={(e) => handleChange(e, 'academicHistory', level, 'passingYear')}
                        className="input-field"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Percentage / CGPA</label>
                    <input
                        type="text"
                        value={formData.academicHistory?.[level]?.percentage || ''}
                        onChange={(e) => handleChange(e, 'academicHistory', level, 'percentage')}
                        className="input-field"
                    />
                </div>
                {level !== 'classX' && (
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">{level === 'graduation' ? 'Specialization' : 'Stream'}</label>
                        <input
                            type="text"
                            value={formData.academicHistory?.[level]?.stream || ''}
                            onChange={(e) => handleChange(e, 'academicHistory', level, 'stream')}
                            className="input-field"
                        />
                    </div>
                )}
                <div className="md:col-span-2 space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Subjects</label>
                    <input
                        type="text"
                        value={formData.academicHistory?.[level]?.subjects || ''}
                        onChange={(e) => handleChange(e, 'academicHistory', level, 'subjects')}
                        className="input-field"
                        placeholder="Comma separated subjects"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* 5. Academic Information */}
            <section className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <BookOpen className="text-blue-600" />
                    Academic Information
                </h3>
                <div className="space-y-6">
                    {renderAcademicRow('classX', 'Class X')}
                    {renderAcademicRow('classXII', 'Class XII / Diploma')}
                    {renderAcademicRow('graduation', 'Graduation (For PG)')}
                </div>
            </section>

            {/* 6. Course & Admission Details */}
            <section className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <GraduationCap className="text-blue-600" />
                    Course & Admission Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Program Level</label>
                        <select
                            value={formData.admissionDetails?.programLevel || 'UG'}
                            onChange={(e) => handleChange(e, 'admissionDetails', 'programLevel')}
                            className="input-field"
                        >
                            <option value="UG">Undergraduate (UG)</option>
                            <option value="PG">Postgraduate (PG)</option>
                            <option value="PhD">PhD</option>
                        </select>
                    </div>

                    {/* Department Dropdown */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Department</label>
                        <select
                            name="department"
                            value={formData.department || ''}
                            onChange={(e) => {
                                handleChange(e);
                                // Reset course when department changes
                                handleChange({ target: { name: 'course', value: '' } });
                            }}
                            required
                            className="input-field"
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Course Dropdown (filtered by department) */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Course Applied For</label>
                        <select
                            name="course"
                            value={formData.course || ''}
                            onChange={handleChange}
                            required
                            className="input-field"
                            disabled={!formData.department}
                        >
                            <option value="">{formData.department ? 'Select Course' : 'Select Department First'}</option>
                            {filteredCourses.map(course => (
                                <option key={course.id} value={course.id}>{course.name} ({course.code})</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Admission Type</label>
                        <select
                            value={formData.admissionDetails?.admissionType || 'Regular'}
                            onChange={(e) => handleChange(e, 'admissionDetails', 'admissionType')}
                            className="input-field"
                        >
                            <option value="Regular">Regular</option>
                            <option value="Management">Management</option>
                            <option value="Entrance">Entrance Based</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Academic Session</label>
                        <input
                            type="text"
                            value={formData.admissionDetails?.academicSession || ''}
                            onChange={(e) => handleChange(e, 'admissionDetails', 'academicSession')}
                            className="input-field"
                            placeholder="e.g. 2024-2025"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Mode of Study</label>
                        <select
                            value={formData.admissionDetails?.modeOfStudy || 'Full-time'}
                            onChange={(e) => handleChange(e, 'admissionDetails', 'modeOfStudy')}
                            className="input-field"
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Distance">Distance</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* 7. Entrance Exam */}
            <section className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <ClipboardList className="text-blue-600" />
                    Entrance Exam Details (If Applicable)
                </h3>
                <div className="bg-white/50 p-5 rounded-2xl border border-white/60 shadow-sm backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Exam Name</label>
                            <input type="text" value={formData.entranceExam?.examName || ''} onChange={(e) => handleChange(e, 'entranceExam', 'examName')} className="input-field" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Rank</label>
                            <input type="text" value={formData.entranceExam?.rank || ''} onChange={(e) => handleChange(e, 'entranceExam', 'rank')} className="input-field" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Score / Percentile</label>
                            <input type="text" value={formData.entranceExam?.score || ''} onChange={(e) => handleChange(e, 'entranceExam', 'score')} className="input-field" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Qualified?</label>
                            <select value={formData.entranceExam?.qualified || 'No'} onChange={(e) => handleChange(e, 'entranceExam', 'qualified')} className="input-field">
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default StepAcademic;
