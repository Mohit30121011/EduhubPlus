const Student = require('../models/Student');
const User = require('../models/User');
const { sequelize } = require('../config/db');
const { Attendance, FeePayment, FeeStructure, Notification, Subject, Semester, Timetable, TimeSlot, Faculty, Classroom } = require('../models');
const { Op } = require('sequelize');

// ──────────────────────────────────────────────────────────────
//  ADMIN / FACULTY CRUD  (existing)
// ──────────────────────────────────────────────────────────────

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin/Faculty
const getStudents = async (req, res) => {
    try {
        const students = await Student.findAll({
            include: {
                model: User,
                attributes: ['email', 'isActive']
            },
            order: [['createdAt', 'DESC']]
        });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private/Admin
const createStudent = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        // 1. Process Files
        const documents = {};
        if (req.files) {
            Object.keys(req.files).forEach(key => {
                const file = req.files[key][0];
                documents[key] = {
                    name: file.originalname,
                    url: file.path, // Cloudinary URL
                    publicId: file.filename
                };
            });
        }

        // 2. Parse Body Data (FormData sends everything as strings)
        const parseJSON = (field) => {
            try {
                return typeof field === 'string' ? JSON.parse(field) : field;
            } catch (e) {
                return field;
            }
        };

        const {
            email, enrollmentNo, firstName, lastName, password,
            contactDetails, familyDetails, academicHistory,
            admissionDetails, hostelTransport, medicalInfo,
            feeDetails, entranceExam, ...otherData
        } = req.body;

        const studentData = {
            ...otherData,
            email, enrollmentNo, firstName, lastName,
            contactDetails: parseJSON(contactDetails),
            familyDetails: parseJSON(familyDetails),
            academicHistory: parseJSON(academicHistory),
            admissionDetails: parseJSON(admissionDetails),
            hostelTransport: parseJSON(hostelTransport),
            medicalInfo: parseJSON(medicalInfo),
            feeDetails: parseJSON(feeDetails),
            entranceExam: parseJSON(entranceExam),
            documents // Attach uploaded docs
        };

        // 3. Create User
        // Default password to enrollmentNo if not provided
        const userPassword = password || enrollmentNo;

        const user = await User.create({
            email,
            password: userPassword,
            role: 'STUDENT'
        }, { transaction: t });

        // 4. Create Student Profile
        const student = await Student.create({
            ...studentData,
            userId: user.id
        }, { transaction: t });

        await t.commit();

        res.status(201).json(student);
    } catch (error) {
        await t.rollback();
        console.error('Error creating student:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get student profile by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id, {
            include: { model: User, attributes: ['email', 'role'] }
        });

        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) {
            await t.rollback();
            return res.status(404).json({ message: 'Student not found' });
        }

        // 1. Process Files (Append to existing or replace)
        let documents = student.documents || {};
        if (req.files) {
            Object.keys(req.files).forEach(key => {
                const file = req.files[key][0];
                documents[key] = {
                    name: file.originalname,
                    url: file.path,
                    publicId: file.filename
                };
            });
        }

        // 2. Parse Body Data
        const parseJSON = (field) => {
            try { return typeof field === 'string' ? JSON.parse(field) : field; } catch (e) { return field; }
        };

        const {
            email, enrollmentNo, firstName, lastName,
            contactDetails, familyDetails, academicHistory,
            admissionDetails, hostelTransport, medicalInfo,
            feeDetails, entranceExam, ...otherData
        } = req.body;

        const studentData = {
            ...otherData,
            email, enrollmentNo, firstName, lastName,
            contactDetails: parseJSON(contactDetails),
            familyDetails: parseJSON(familyDetails),
            academicHistory: parseJSON(academicHistory),
            admissionDetails: parseJSON(admissionDetails),
            hostelTransport: parseJSON(hostelTransport),
            medicalInfo: parseJSON(medicalInfo),
            feeDetails: parseJSON(feeDetails),
            entranceExam: parseJSON(entranceExam),
            documents
        };

        // 3. Update Student
        await student.update(studentData, { transaction: t });

        // 4. Update User (Email & Password)
        const userUpdates = {};
        if (email) userUpdates.email = email;
        if (req.body.password && req.body.password.trim() !== '') {
            userUpdates.password = req.body.password;
        }

        if (Object.keys(userUpdates).length > 0) {
            await User.update(userUpdates, { where: { id: student.userId }, individualHooks: true, transaction: t });
        }

        await t.commit();
        res.json(student);
    } catch (error) {
        await t.rollback();
        console.error('Update Error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const student = await Student.findByPk(req.params.id);

        if (student) {
            // Delete associated User (Cascade should delete Student)
            await User.destroy({ where: { id: student.userId }, transaction: t });

            await t.commit();
            res.json({ message: 'Student removed' });
        } else {
            await t.rollback();
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: error.message });
    }
};

// ──────────────────────────────────────────────────────────────
//  STUDENT SELF-SERVICE  (new /me/* endpoints)
// ──────────────────────────────────────────────────────────────

// @desc    Get aggregated dashboard data for logged-in student
// @route   GET /api/students/me/dashboard
// @access  Private (STUDENT)
const getMyDashboard = async (req, res) => {
    try {
        const student = await Student.findOne({
            where: { userId: req.user.id },
            include: { model: User, attributes: ['email', 'role', 'name'] }
        });

        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        // ── Attendance stats ────────────────────────────────────
        const attendanceRecords = await Attendance.findAll({
            where: { studentId: student.id },
            attributes: ['status']
        });

        const totalClasses = attendanceRecords.length;
        const totalPresent = attendanceRecords.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length;
        const attendancePercentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

        // ── Fee stats ───────────────────────────────────────────
        const payments = await FeePayment.findAll({
            where: { studentId: student.id }
        });

        const totalPaid = payments
            .filter(p => p.status === 'SUCCESS')
            .reduce((sum, p) => sum + parseFloat(p.amountPaid || 0), 0);

        const structures = await FeeStructure.findAll();
        const totalDue = structures.reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);
        const feeBalance = totalDue - totalPaid;

        // ── Notifications unread count ───────────────────────────
        const unreadNotifications = await Notification.count({
            where: { userId: req.user.id, isRead: false }
        });

        // ── Subjects from attendance data ────────────────────────
        const subjectSet = new Set();
        const attendanceFull = await Attendance.findAll({
            where: { studentId: student.id },
            attributes: ['subject']
        });
        attendanceFull.forEach(r => subjectSet.add(r.subject));

        // ── Build response ──────────────────────────────────────
        res.json({
            student: {
                id: student.id,
                firstName: student.firstName,
                lastName: student.lastName,
                enrollmentNo: student.enrollmentNo,
                department: student.department,
                course: student.course,
                currentSemester: student.currentSemester,
                email: student.email || student.User?.email,
                phone: student.phone,
                photo: student.documents?.photo?.url || null,
            },
            stats: {
                attendancePercentage,
                totalClasses,
                totalPresent,
                totalPaid,
                totalDue,
                feeBalance,
                unreadNotifications,
                subjectCount: subjectSet.size,
                cgpa: null, // Not computed from DB yet
            }
        });
    } catch (error) {
        console.error('getMyDashboard Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get own full profile
// @route   GET /api/students/me/profile
// @access  Private (STUDENT)
const getMyProfile = async (req, res) => {
    try {
        const student = await Student.findOne({
            where: { userId: req.user.id },
            include: { model: User, attributes: ['email', 'role', 'name', 'avatar', 'isActive'] }
        });

        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Student updates own profile (limited fields)
// @route   PUT /api/students/me/profile
// @access  Private (STUDENT)
const updateMyProfile = async (req, res) => {
    try {
        const student = await Student.findOne({ where: { userId: req.user.id } });

        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        // Only allow certain fields to be updated by the student
        const allowedFields = [
            'phone', 'contactDetails', 'medicalInfo',
            'hostelTransport', 'regionalName'
        ];

        const updates = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                // Parse JSON strings if needed
                if (typeof req.body[field] === 'string' && ['contactDetails', 'medicalInfo', 'hostelTransport'].includes(field)) {
                    try { updates[field] = JSON.parse(req.body[field]); } catch { updates[field] = req.body[field]; }
                } else {
                    updates[field] = req.body[field];
                }
            }
        });

        await student.update(updates);

        // If password update is requested
        if (req.body.password && req.body.password.trim() !== '') {
            await User.update(
                { password: req.body.password },
                { where: { id: req.user.id }, individualHooks: true }
            );
        }

        // If name update
        if (req.body.name && req.body.name.trim() !== '') {
            await User.update(
                { name: req.body.name },
                { where: { id: req.user.id } }
            );
        }

        res.json({ message: 'Profile updated successfully', student });
    } catch (error) {
        console.error('updateMyProfile Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get subjects for logged-in student
// @route   GET /api/students/me/subjects
// @access  Private (STUDENT)
const getMySubjects = async (req, res) => {
    try {
        const student = await Student.findOne({ where: { userId: req.user.id } });

        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        // Strategy 1: Try to get subjects from Semester → Subject association
        let subjects = [];
        try {
            const semesters = await Semester.findAll({
                where: { isActive: true },
                include: [{ model: Subject }]
            });
            subjects = semesters.flatMap(sem => sem.Subjects || []);
        } catch (e) {
            // Association may not exist, fallback
        }

        // Strategy 2: If no formal subjects, derive from attendance records
        if (subjects.length === 0) {
            const attendanceRecords = await Attendance.findAll({
                where: { studentId: student.id },
                attributes: ['subject'],
                group: ['subject']
            });

            subjects = attendanceRecords.map((r, i) => ({
                id: `derived-${i}`,
                name: r.subject,
                code: r.subject.replace(/\s+/g, '').substring(0, 6).toUpperCase(),
                credits: 3,
                type: 'CORE'
            }));
        }

        // Strategy 3: If still empty, return all subjects from DB
        if (subjects.length === 0) {
            subjects = await Subject.findAll({
                order: [['name', 'ASC']]
            });
        }

        res.json({ subjects, semester: student.currentSemester });
    } catch (error) {
        console.error('getMySubjects Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get timetable for logged-in student
// @route   GET /api/students/me/timetable
// @access  Private (STUDENT)
const getMyTimetable = async (req, res) => {
    try {
        const student = await Student.findOne({ where: { userId: req.user.id } });

        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        // Find active timetable(s)
        const timetables = await Timetable.findAll({
            where: { isActive: true },
            include: [{
                model: TimeSlot,
                include: [
                    { model: Subject, attributes: ['id', 'name', 'code'] },
                    { model: Faculty, attributes: ['id', 'firstName', 'lastName'] },
                    { model: Classroom, attributes: ['id', 'roomNumber', 'type'] }
                ]
            }],
            order: [[TimeSlot, 'dayOfWeek', 'ASC'], [TimeSlot, 'startTime', 'ASC']]
        });

        // Flatten slots from all timetables
        const slots = timetables.flatMap(tt =>
            (tt.TimeSlots || []).map(slot => ({
                id: slot.id,
                day: slot.dayOfWeek,
                startTime: slot.startTime,
                endTime: slot.endTime,
                subject: slot.Subject ? { name: slot.Subject.name, code: slot.Subject.code } : null,
                faculty: slot.Faculty ? { name: `${slot.Faculty.firstName} ${slot.Faculty.lastName}` } : null,
                classroom: slot.Classroom ? { room: slot.Classroom.roomNumber, type: slot.Classroom.type } : null,
                timetableName: tt.name
            }))
        );

        // Group by day
        const byDay = {};
        const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        dayOrder.forEach(d => { byDay[d] = []; });

        slots.forEach(s => {
            if (byDay[s.day]) {
                byDay[s.day].push(s);
            }
        });

        res.json({ timetable: byDay, totalSlots: slots.length });
    } catch (error) {
        console.error('getMyTimetable Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStudents,
    createStudent,
    getStudentById,
    updateStudent,
    deleteStudent,
    // Student self-service
    getMyDashboard,
    getMyProfile,
    updateMyProfile,
    getMySubjects,
    getMyTimetable
};
