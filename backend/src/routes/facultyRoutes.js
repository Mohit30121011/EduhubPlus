const express = require('express');
const router = express.Router();
const { getFaculty, createFaculty, getFacultyById, updateFaculty, deleteFaculty } = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadFacultyDocs } = require('../config/cloudinary');

router.route('/')
    .get(protect, authorize('ADMIN', 'SUPER_ADMIN'), getFaculty)
    .post(protect, authorize('ADMIN', 'SUPER_ADMIN'), uploadFacultyDocs.fields([
        { name: 'photo', maxCount: 1 },
        { name: 'resume', maxCount: 1 },
        { name: 'appointmentLetter', maxCount: 1 },
        { name: 'experienceCertificate', maxCount: 5 },
        { name: 'highestQualificationCertificate', maxCount: 5 },
        { name: 'idProof', maxCount: 1 },
        { name: 'panCard', maxCount: 1 },
        { name: 'signature', maxCount: 1 }
    ]), createFaculty);

router.route('/:id')
    .get(protect, getFacultyById)
    .put(protect, authorize('ADMIN', 'SUPER_ADMIN'), uploadFacultyDocs.fields([
        { name: 'photo', maxCount: 1 },
        { name: 'resume', maxCount: 1 },
        { name: 'appointmentLetter', maxCount: 1 },
        { name: 'experienceCertificate', maxCount: 5 },
        { name: 'highestQualificationCertificate', maxCount: 5 },
        { name: 'idProof', maxCount: 1 },
        { name: 'panCard', maxCount: 1 },
        { name: 'signature', maxCount: 1 }
    ]), updateFaculty)
    .delete(protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteFaculty);

module.exports = router;
