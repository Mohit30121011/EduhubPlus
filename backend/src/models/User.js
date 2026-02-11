const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM(
            'SUPER_ADMIN',
            'ADMIN',
            'FACULTY',
            'STUDENT',
            'LIBRARIAN',
            'ACCOUNTANT'
        ),
        defaultValue: 'STUDENT',
        allowNull: false
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pincode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    aadhaarNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    joiningDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    permissions: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    resetOtp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetOtpExpiry: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

// Instance method to compare password
User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
