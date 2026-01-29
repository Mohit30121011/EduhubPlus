const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const { Op } = require('sequelize');

// @desc    Mark attendance (Bulk supported)
// @route   POST /api/attendance
// @access  Private/Faculty
const markAttendance = async (req, res) => {
    try {
        const { subject, date, records } = req.body;
        // records = [{ studentId, status, remarks }]

        if (!records || !Array.isArray(records)) {
            return res.status(400).json({ message: 'Invalid records format' });
        }

        const attendanceData = records.map(record => ({
            studentId: record.studentId,
            markedBy: req.user.id,
            subject,
            date,
            status: record.status || 'PRESENT',
            remarks: record.remarks
        }));

        // Upsert (Insert or Update)
        const result = await Attendance.bulkCreate(attendanceData, {
            updateOnDuplicate: ['status', 'remarks', 'markedBy', 'updatedAt']
        });

        res.status(201).json({ message: 'Attendance marked successfully', count: result.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get attendance stats for a student
// @route   GET /api/attendance/student/:id
// @access  Private
const getStudentAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const stats = await Attendance.findAll({
            where: { studentId: id },
            attributes: ['subject', 'status', 'date'],
            order: [['date', 'DESC']]
        });
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { markAttendance, getStudentAttendance };
