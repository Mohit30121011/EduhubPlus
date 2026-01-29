const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Faculty = sequelize.define('Faculty', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    employeeId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    designation: {
        type: DataTypes.STRING,
        defaultValue: 'Assistant Professor'
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false
    },
    specialization: {
        type: DataTypes.STRING
    },
    joinDate: {
        type: DataTypes.DATEONLY
    },
    phone: {
        type: DataTypes.STRING
    },
    photoUrl: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true
});

// Associations
User.hasOne(Faculty, { foreignKey: 'userId', onDelete: 'CASCADE' });
Faculty.belongsTo(User, { foreignKey: 'userId' });

module.exports = Faculty;
