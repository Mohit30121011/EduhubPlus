const express = require('express');
const router = express.Router();
const { getAllMasterData, createCourse, createSubject, createDepartment, deleteCourse, updateCourse, updateSubject, updateDepartment } = require('../controllers/masterController');
const { protect } = require('../middleware/authMiddleware');

router.get('/all', protect, getAllMasterData);
router.post('/course', protect, createCourse);
router.post('/subject', protect, createSubject);
router.post('/department', protect, createDepartment);
router.put('/course/:id', protect, updateCourse);
router.put('/subject/:id', protect, updateSubject);
router.put('/department/:id', protect, updateDepartment);
router.delete('/course/:id', protect, deleteCourse);

module.exports = router;
