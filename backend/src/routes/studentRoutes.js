const express = require('express');
const router = express.Router();
const { getStudents, createStudent, getStudentById } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadStudentDocs } = require('../config/cloudinary');

router.route('/')
    .get(protect, authorize('ADMIN', 'FACULTY', 'SUPER_ADMIN'), getStudents)
    .post(protect, authorize('ADMIN', 'SUPER_ADMIN'), uploadStudentDocs.fields([
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
    ]), createStudent);

router.route('/:id')
    .get(protect, getStudentById);

module.exports = router;
