const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payroll = sequelize.define('Payroll', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: { // Faculty or Admin/Staff
        type: DataTypes.UUID,
        allowNull: false
    },
    month: {
        type: DataTypes.STRING, // "January" or "01"
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER, // 2025
        allowNull: false
    },
    basicSalary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    allowances: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    deductions: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    netSalary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('GENERATED', 'PAID', 'HELD'),
        defaultValue: 'GENERATED'
    },
    paymentDate: {
        type: DataTypes.DATEONLY
    }
}, {
    timestamps: true
});

module.exports = Payroll;
