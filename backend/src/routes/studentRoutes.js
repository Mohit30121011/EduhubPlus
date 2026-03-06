const express = require('express');
const router = express.Router();
const {
    getStudents, createStudent, getStudentById, updateStudent, deleteStudent,
    getMyDashboard, getMyProfile, updateMyProfile, getMySubjects, getMyTimetable
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadStudentDocs } = require('../config/cloudinary');

// ──────────────────────────────────────────────────────────────
//  STUDENT SELF-SERVICE (/me/*) — MUST be before /:id
// ──────────────────────────────────────────────────────────────
router.get('/me/dashboard', protect, getMyDashboard);
router.get('/me/profile', protect, getMyProfile);
router.put('/me/profile', protect, updateMyProfile);
router.get('/me/subjects', protect, getMySubjects);
router.get('/me/timetable', protect, getMyTimetable);

// ──────────────────────────────────────────────────────────────
//  ADMIN CRUD
// ──────────────────────────────────────────────────────────────
const docFields = [
    { name: 'photo', maxCount: 1 },
    { name: 'studentSignature', maxCount: 1 },
    { name: 'parentSignature', maxCount: 1 },
    { name: 'idProof', maxCount: 1 },
    { name: 'classXMarksheet', maxCount: 1 },
    { name: 'classXIIMarksheet', maxCount: 1 },
    { name: 'graduationMarksheet', maxCount: 1 },
    { name: 'transferCertificate', maxCount: 1 },
    { name: 'migrationCertificate', maxCount: 1 },
    { name: 'characterCertificate', maxCount: 1 },
    { name: 'casteCertificate', maxCount: 1 },
    { name: 'incomeCertificate', maxCount: 1 },
    { name: 'domicileCertificate', maxCount: 1 },
    { name: 'disabilityCertificate', maxCount: 1 }
];

router.route('/')
    .get(protect, authorize('ADMIN', 'FACULTY', 'SUPER_ADMIN'), getStudents)
    .post(protect, authorize('ADMIN', 'SUPER_ADMIN'), uploadStudentDocs.fields(docFields), createStudent);

router.route('/:id')
    .get(protect, getStudentById)
    .put(protect, authorize('ADMIN', 'SUPER_ADMIN'), uploadStudentDocs.fields(docFields), updateStudent)
    .delete(protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteStudent);

module.exports = router;
