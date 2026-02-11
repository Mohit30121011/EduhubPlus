const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const { Subject, Department, Course } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

// @desc    Mark attendance (Bulk) — prevents duplicates via unique index
// @route   POST /api/attendance
// @access  Private/Faculty, Admin
const markAttendance = async (req, res) => {
    try {
        const { subject, date, records } = req.body;

        if (!subject || !date || !records || !Array.isArray(records) || records.length === 0) {
            return res.status(400).json({ message: 'Subject, date, and records are required' });
        }

        // Check for existing records on this date+subject to prevent duplicates
        const existingCount = await Attendance.count({
            where: { date, subject }
        });

        if (existingCount > 0) {
            return res.status(409).json({
                message: 'Attendance already marked for this subject on this date. Use edit to update.',
                existingCount
            });
        }

        const attendanceData = records.map(record => ({
            studentId: record.studentId,
            markedBy: req.user.id,
            subject,
            date,
            status: record.status || 'PRESENT',
            remarks: record.remarks || null
        }));

        const result = await Attendance.bulkCreate(attendanceData);

        res.status(201).json({
            message: 'Attendance marked successfully',
            count: result.length,
            date,
            subject
        });
    } catch (error) {
        console.error('Mark Attendance Error:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Duplicate attendance record detected' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update attendance (within 24h window)
// @route   PUT /api/attendance/update
// @access  Private/Faculty
const updateAttendance = async (req, res) => {
    try {
        const { subject, date, records } = req.body;

        if (!subject || !date || !records) {
            return res.status(400).json({ message: 'Subject, date, and records are required' });
        }

        // Check 24h edit window
        const attendanceDate = new Date(date);
        const now = new Date();
        const hoursDiff = (now - attendanceDate) / (1000 * 60 * 60);

        if (hoursDiff > 24) {
            return res.status(403).json({
                message: 'Edit window expired. Attendance can only be edited within 24 hours.'
            });
        }

        let updatedCount = 0;
        for (const record of records) {
            const [count] = await Attendance.update(
                { status: record.status, remarks: record.remarks, markedBy: req.user.id },
                { where: { studentId: record.studentId, date, subject } }
            );
            updatedCount += count;
        }

        res.json({ message: 'Attendance updated', updatedCount });
    } catch (error) {
        console.error('Update Attendance Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get attendance for a specific subject + date
// @route   GET /api/attendance/subject/:subjectName?date=YYYY-MM-DD
// @access  Private/Faculty, Admin
const getAttendanceBySubject = async (req, res) => {
    try {
        const { subjectName } = req.params;
        const { date, from, to } = req.query;

        const where = { subject: subjectName };
        if (date) {
            where.date = date;
        } else if (from && to) {
            where.date = { [Op.between]: [from, to] };
        }

        const records = await Attendance.findAll({
            where,
            include: [{ model: Student, attributes: ['id', 'firstName', 'lastName', 'enrollmentNo', 'department'] }],
            order: [['date', 'DESC'], ['createdAt', 'ASC']]
        });

        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get attendance stats for a student (all subjects)
// @route   GET /api/attendance/student/:id
// @access  Private
const getStudentAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const records = await Attendance.findAll({
            where: { studentId: id },
            attributes: ['subject', 'status', 'date', 'remarks'],
            order: [['date', 'DESC']]
        });

        // Calculate per-subject stats
        const subjectStats = {};
        records.forEach(r => {
            if (!subjectStats[r.subject]) {
                subjectStats[r.subject] = { total: 0, present: 0, absent: 0, late: 0, excused: 0 };
            }
            subjectStats[r.subject].total++;
            subjectStats[r.subject][r.status.toLowerCase()]++;
        });

        // Add percentage
        Object.keys(subjectStats).forEach(sub => {
            const s = subjectStats[sub];
            s.percentage = s.total > 0 ? Math.round(((s.present + s.late) / s.total) * 100) : 0;
        });

        res.json({ records, subjectStats });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get own attendance (for logged-in student)
// @route   GET /api/attendance/my
// @access  Private/Student
const getMyAttendance = async (req, res) => {
    try {
        // Find the student record linked to this user
        const student = await Student.findOne({ where: { userId: req.user.id } });
        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        const records = await Attendance.findAll({
            where: { studentId: student.id },
            attributes: ['subject', 'status', 'date', 'remarks'],
            order: [['date', 'DESC']]
        });

        const subjectStats = {};
        records.forEach(r => {
            if (!subjectStats[r.subject]) {
                subjectStats[r.subject] = { total: 0, present: 0, absent: 0, late: 0, excused: 0 };
            }
            subjectStats[r.subject].total++;
            subjectStats[r.subject][r.status.toLowerCase()]++;
        });

        Object.keys(subjectStats).forEach(sub => {
            const s = subjectStats[sub];
            s.percentage = s.total > 0 ? Math.round(((s.present + s.late) / s.total) * 100) : 0;
        });

        const totalClasses = records.length;
        const totalPresent = records.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length;
        const overallPercentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

        res.json({ records, subjectStats, overallPercentage, totalClasses, totalPresent });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Attendance report (admin) with filters
// @route   GET /api/attendance/report?from=&to=&department=&subject=
// @access  Private/Admin
const getAttendanceReport = async (req, res) => {
    try {
        const { from, to, department, subject } = req.query;
        const where = {};

        if (from && to) {
            where.date = { [Op.between]: [from, to] };
        }
        if (subject) {
            where.subject = subject;
        }

        const studentWhere = {};
        if (department) {
            studentWhere.department = department;
        }

        const records = await Attendance.findAll({
            where,
            include: [{
                model: Student,
                attributes: ['id', 'firstName', 'lastName', 'enrollmentNo', 'department', 'course'],
                where: Object.keys(studentWhere).length > 0 ? studentWhere : undefined
            }],
            order: [['date', 'DESC']]
        });

        // Summary stats
        const total = records.length;
        const present = records.filter(r => r.status === 'PRESENT').length;
        const absent = records.filter(r => r.status === 'ABSENT').length;
        const late = records.filter(r => r.status === 'LATE').length;

        res.json({
            records,
            summary: { total, present, absent, late, percentage: total > 0 ? Math.round((present / total) * 100) : 0 }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Dashboard summary
// @route   GET /api/attendance/summary
// @access  Private
const getAttendanceSummary = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const todayTotal = await Attendance.count({ where: { date: today } });
        const todayPresent = await Attendance.count({ where: { date: today, status: 'PRESENT' } });
        const todayAbsent = await Attendance.count({ where: { date: today, status: 'ABSENT' } });

        // Last 30 days trend
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const monthlyRecords = await Attendance.findAll({
            where: { date: { [Op.gte]: thirtyDaysAgo.toISOString().split('T')[0] } },
            attributes: ['date', 'status']
        });

        // Group by date
        const dailyStats = {};
        monthlyRecords.forEach(r => {
            const d = r.date;
            if (!dailyStats[d]) dailyStats[d] = { total: 0, present: 0 };
            dailyStats[d].total++;
            if (r.status === 'PRESENT' || r.status === 'LATE') dailyStats[d].present++;
        });

        const trend = Object.entries(dailyStats).map(([date, stats]) => ({
            date,
            percentage: Math.round((stats.present / stats.total) * 100)
        })).sort((a, b) => a.date.localeCompare(b.date));

        res.json({
            today: { total: todayTotal, present: todayPresent, absent: todayAbsent },
            trend
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check if attendance exists for a subject/date
// @route   GET /api/attendance/check?subject=&date=
// @access  Private
const checkAttendanceExists = async (req, res) => {
    try {
        const { subject, date } = req.query;
        const count = await Attendance.count({ where: { subject, date } });
        res.json({ exists: count > 0, count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    markAttendance,
    updateAttendance,
    getAttendanceBySubject,
    getStudentAttendance,
    getMyAttendance,
    getAttendanceReport,
    getAttendanceSummary,
    checkAttendanceExists
};
