const express = require('express');
const router = express.Router();
const { getFaculty, createFaculty, getFacultyById } = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadFacultyDocs } = require('../config/cloudinary');

router.route('/')
    .get(protect, authorize('ADMIN', 'SUPER_ADMIN'), getFaculty)
    .post(protect, authorize('ADMIN', 'SUPER_ADMIN'), uploadFacultyDocs.fields([
        { name: 'photo', maxCount: 1 },
        { name: 'signature', maxCount: 1 },
        { name: 'resume', maxCount: 1 },
        { name: 'appointmentLetter', maxCount: 1 },
        { name: 'idProof', maxCount: 1 },
        { name: 'experienceCertificates', maxCount: 1 }, // Assuming merged PDF
        { name: 'academicCertificates', maxCount: 1 } // Assuming merged PDF
    ]), createFaculty);

router.route('/:id')
    .get(protect, getFacultyById);

module.exports = router;
