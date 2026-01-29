const express = require('express');
const router = express.Router();
const { getStudents, createStudent, getStudentById } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, authorize('ADMIN', 'FACULTY', 'SUPER_ADMIN'), getStudents)
    .post(protect, authorize('ADMIN', 'SUPER_ADMIN'), createStudent);

router.route('/:id')
    .get(protect, getStudentById);

module.exports = router;
