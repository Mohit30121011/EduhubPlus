const { sequelize } = require('../config/db');
const User = require('./User');
const Student = require('./Student');
const Faculty = require('./Faculty');
const Attendance = require('./Attendance');
const SchoolProfile = require('./SchoolProfile');
const Department = require('./Department');
const Course = require('./Course');
const Subject = require('./Subject');

// Associations
Department.hasMany(Course);
Course.belongsTo(Department);

Course.hasMany(Subject);
Subject.belongsTo(Course);

Department.hasMany(Faculty);
Faculty.belongsTo(Department);

module.exports = {
    sequelize,
    User,
    Student,
    Faculty,
    Attendance,
    SchoolProfile,
    Department,
    Course,
    Subject
};
