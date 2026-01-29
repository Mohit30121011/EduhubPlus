const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SchoolProfile = sequelize.define('SchoolProfile', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    schoolName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'EduHub International School'
    },
    tagline: {
        type: DataTypes.STRING,
        defaultValue: 'Excellence in Education'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    website: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.TEXT
    },
    logoUrl: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true
});

module.exports = SchoolProfile;
