const express = require('express');
const router = express.Router();
const {
    markAttendance,
    updateAttendance,
    getAttendanceBySubject,
    getStudentAttendance,
    getMyAttendance,
    getAttendanceReport,
    getAttendanceSummary,
    checkAttendanceExists
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Mark attendance (Faculty, Admin)
router.post('/', protect, authorize('FACULTY', 'ADMIN', 'SUPER_ADMIN'), markAttendance);

// Update attendance within 24h (Faculty)
router.put('/update', protect, authorize('FACULTY', 'ADMIN', 'SUPER_ADMIN'), updateAttendance);

// Check if attendance exists for a subject+date
router.get('/check', protect, checkAttendanceExists);

// Dashboard summary
router.get('/summary', protect, getAttendanceSummary);

// Admin report with filters
router.get('/report', protect, authorize('ADMIN', 'SUPER_ADMIN'), getAttendanceReport);

// Student's own attendance
router.get('/my', protect, getMyAttendance);

// Get attendance by subject
router.get('/subject/:subjectName', protect, getAttendanceBySubject);

// Get attendance for a specific student
router.get('/student/:id', protect, getStudentAttendance);

module.exports = router;
