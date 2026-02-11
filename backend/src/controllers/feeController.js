const { FeeStructure, FeePayment, Student, Program, AcademicYear, Semester } = require('../models');
const { Op, fn, col } = require('sequelize');

// @desc    Create fee structure
// @route   POST /api/fees/structures
// @access  Private/Admin
const createFeeStructure = async (req, res) => {
    try {
        const { programId, semesterId, academicYearId, category, amount, dueDate } = req.body;

        if (!programId || !academicYearId || !amount) {
            return res.status(400).json({ message: 'Program, academic year, and amount are required' });
        }

        const structure = await FeeStructure.create({
            programId, semesterId, academicYearId, category, amount, dueDate
        });

        res.status(201).json(structure);
    } catch (error) {
        console.error('Create FeeStructure Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all fee structures
// @route   GET /api/fees/structures
// @access  Private/Admin
const getFeeStructures = async (req, res) => {
    try {
        const structures = await FeeStructure.findAll({
            include: [
                { model: Program, attributes: ['id', 'name'] },
                { model: AcademicYear, attributes: ['id', 'name'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(structures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update fee structure
// @route   PUT /api/fees/structures/:id
// @access  Private/Admin
const updateFeeStructure = async (req, res) => {
    try {
        const structure = await FeeStructure.findByPk(req.params.id);
        if (!structure) {
            return res.status(404).json({ message: 'Fee structure not found' });
        }
        await structure.update(req.body);
        res.json(structure);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete fee structure
// @route   DELETE /api/fees/structures/:id
// @access  Private/Admin
const deleteFeeStructure = async (req, res) => {
    try {
        const structure = await FeeStructure.findByPk(req.params.id);
        if (!structure) {
            return res.status(404).json({ message: 'Fee structure not found' });
        }

        // Check if payments exist
        const paymentCount = await FeePayment.count({ where: { feeStructureId: req.params.id } });
        if (paymentCount > 0) {
            return res.status(400).json({ message: 'Cannot delete. Payments exist for this fee structure.' });
        }

        await structure.destroy();
        res.json({ message: 'Fee structure deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Record a fee payment
// @route   POST /api/fees/payments
// @access  Private/Admin
const recordPayment = async (req, res) => {
    try {
        const { studentId, feeStructureId, amountPaid, paymentMethod, transactionId } = req.body;

        if (!studentId || !amountPaid) {
            return res.status(400).json({ message: 'Student and amount are required' });
        }

        const payment = await FeePayment.create({
            studentId,
            feeStructureId,
            amountPaid,
            paymentMethod: paymentMethod || 'ONLINE',
            transactionId,
            status: 'SUCCESS',
            paymentDate: new Date()
        });

        res.status(201).json(payment);
    } catch (error) {
        console.error('Record Payment Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all payments (admin report)
// @route   GET /api/fees/payments?from=&to=&status=
// @access  Private/Admin
const getPayments = async (req, res) => {
    try {
        const { from, to, status } = req.query;
        const where = {};

        if (from && to) {
            where.paymentDate = { [Op.between]: [from, to] };
        }
        if (status) {
            where.status = status;
        }

        const payments = await FeePayment.findAll({
            where,
            include: [
                { model: Student, attributes: ['id', 'firstName', 'lastName', 'enrollmentNo', 'department'] },
                { model: FeeStructure, attributes: ['id', 'category', 'amount'] }
            ],
            order: [['paymentDate', 'DESC']]
        });

        // Summary
        const totalCollected = payments
            .filter(p => p.status === 'SUCCESS')
            .reduce((sum, p) => sum + parseFloat(p.amountPaid), 0);

        const totalPending = payments
            .filter(p => p.status === 'PENDING')
            .reduce((sum, p) => sum + parseFloat(p.amountPaid), 0);

        res.json({
            payments,
            summary: {
                totalCollected,
                totalPending,
                totalTransactions: payments.length
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get fee status for a student
// @route   GET /api/fees/student/:id
// @access  Private/Admin, Faculty
const getStudentFees = async (req, res) => {
    try {
        const payments = await FeePayment.findAll({
            where: { studentId: req.params.id },
            include: [{ model: FeeStructure, attributes: ['id', 'category', 'amount', 'dueDate'] }],
            order: [['paymentDate', 'DESC']]
        });

        const totalPaid = payments
            .filter(p => p.status === 'SUCCESS')
            .reduce((sum, p) => sum + parseFloat(p.amountPaid), 0);

        res.json({ payments, totalPaid });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Student views own fees
// @route   GET /api/fees/my
// @access  Private/Student
const getMyFees = async (req, res) => {
    try {
        const student = await Student.findOne({ where: { userId: req.user.id } });
        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        const payments = await FeePayment.findAll({
            where: { studentId: student.id },
            include: [{ model: FeeStructure, attributes: ['id', 'category', 'amount', 'dueDate'] }],
            order: [['paymentDate', 'DESC']]
        });

        const totalPaid = payments
            .filter(p => p.status === 'SUCCESS')
            .reduce((sum, p) => sum + parseFloat(p.amountPaid), 0);

        // Get structures to calculate pending
        const structures = await FeeStructure.findAll();
        const totalDue = structures.reduce((sum, s) => sum + parseFloat(s.amount), 0);

        res.json({
            payments,
            totalPaid,
            totalDue,
            balance: totalDue - totalPaid
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fee summary for dashboard
// @route   GET /api/fees/summary
// @access  Private/Admin
const getFeeSummary = async (req, res) => {
    try {
        const allPayments = await FeePayment.findAll();

        const totalCollected = allPayments
            .filter(p => p.status === 'SUCCESS')
            .reduce((sum, p) => sum + parseFloat(p.amountPaid), 0);

        const pendingPayments = allPayments
            .filter(p => p.status === 'PENDING')
            .reduce((sum, p) => sum + parseFloat(p.amountPaid), 0);

        const structures = await FeeStructure.findAll();
        const totalExpected = structures.reduce((sum, s) => sum + parseFloat(s.amount), 0);

        // Monthly trend (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const recentPayments = allPayments.filter(p =>
            p.status === 'SUCCESS' && new Date(p.paymentDate) >= sixMonthsAgo
        );

        const monthlyData = {};
        recentPayments.forEach(p => {
            const month = new Date(p.paymentDate).toLocaleString('en', { month: 'short' });
            monthlyData[month] = (monthlyData[month] || 0) + parseFloat(p.amountPaid);
        });

        res.json({
            totalCollected,
            pendingPayments,
            totalExpected,
            monthlyTrend: Object.entries(monthlyData).map(([month, amount]) => ({ month, amount }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createFeeStructure,
    getFeeStructures,
    updateFeeStructure,
    deleteFeeStructure,
    recordPayment,
    getPayments,
    getStudentFees,
    getMyFees,
    getFeeSummary
};
