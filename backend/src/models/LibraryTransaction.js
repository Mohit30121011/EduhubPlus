const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const LibraryTransaction = sequelize.define('LibraryTransaction', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    bookId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    studentId: { // Can be nullable if faculty borrows? For now assumed Student.
        type: DataTypes.UUID,
        allowNull: false
    },
    issueDate: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    returnDate: {
        type: DataTypes.DATEONLY
    },
    fineAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    status: {
        type: DataTypes.ENUM('ISSUED', 'RETURNED', 'OVERDUE'),
        defaultValue: 'ISSUED'
    }
}, {
    timestamps: true
});

module.exports = LibraryTransaction;
