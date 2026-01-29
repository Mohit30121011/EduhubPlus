const express = require('express');
const router = express.Router();
const { markAttendance, getStudentAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('FACULTY', 'ADMIN'), markAttendance);
router.get('/student/:id', protect, getStudentAttendance);

module.exports = router;
