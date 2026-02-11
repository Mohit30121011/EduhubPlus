const express = require('express');
const router = express.Router();
const {
    createFeeStructure,
    getFeeStructures,
    updateFeeStructure,
    deleteFeeStructure,
    recordPayment,
    getPayments,
    getStudentFees,
    getMyFees,
    getFeeSummary
} = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Fee Structures (Admin)
router.get('/structures', protect, authorize('ADMIN', 'SUPER_ADMIN'), getFeeStructures);
router.post('/structures', protect, authorize('ADMIN', 'SUPER_ADMIN'), createFeeStructure);
router.put('/structures/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateFeeStructure);
router.delete('/structures/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteFeeStructure);

// Payments
router.post('/payments', protect, authorize('ADMIN', 'SUPER_ADMIN'), recordPayment);
router.get('/payments', protect, authorize('ADMIN', 'SUPER_ADMIN'), getPayments);

// Summary
router.get('/summary', protect, authorize('ADMIN', 'SUPER_ADMIN'), getFeeSummary);

// Student fees
router.get('/my', protect, getMyFees);
router.get('/student/:id', protect, getStudentFees);

module.exports = router;
