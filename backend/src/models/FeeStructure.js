const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FeeStructure = sequelize.define('FeeStructure', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    programId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    semesterId: { // Optional specific semester fee or general program fee
        type: DataTypes.UUID
    },
    academicYearId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('TUITION', 'HOSTEL', 'TRANSPORT', 'EXAM', 'LIBRARY', 'OTHER'),
        defaultValue: 'TUITION'
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    dueDate: {
        type: DataTypes.DATEONLY
    }
}, {
    timestamps: true
});

module.exports = FeeStructure;
