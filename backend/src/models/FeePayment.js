const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FeePayment = sequelize.define('FeePayment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    feeStructureId: {
        type: DataTypes.UUID
    },
    amountPaid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    paymentDate: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    paymentMethod: {
        type: DataTypes.ENUM('CASH', 'ONLINE', 'CHEQUE', 'DD'),
        defaultValue: 'ONLINE'
    },
    transactionId: { // Gateway ID
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM('SUCCESS', 'PENDING', 'FAILED'),
        defaultValue: 'SUCCESS'
    },
    receiptUrl: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true
});

module.exports = FeePayment;
