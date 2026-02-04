const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const LMSMaterial = sequelize.define('LMSMaterial', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    subjectId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('NOTE', 'VIDEO', 'ASSIGNMENT', 'SYLLABUS'),
        defaultValue: 'NOTE'
    },
    fileUrl: {
        type: DataTypes.STRING, // Cloudinary URL
        allowNull: false
    },
    uploadedBy: {
        type: DataTypes.UUID // Faculty ID
    }
}, {
    timestamps: true
});

module.exports = LMSMaterial;
