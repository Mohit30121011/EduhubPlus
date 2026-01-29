const express = require('express');
const router = express.Router();
const { getFaculty, createFaculty } = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getFaculty)
    .post(protect, authorize('SUPER_ADMIN', 'ADMIN'), createFaculty);

module.exports = router;
