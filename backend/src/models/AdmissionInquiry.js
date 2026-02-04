const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AdmissionInquiry = sequelize.define('AdmissionInquiry', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    programOfInterest: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM('NEW', 'CONTACTED', 'CONVERTED', 'CLOSED'),
        defaultValue: 'NEW'
    },
    remarks: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true
});

module.exports = AdmissionInquiry;
