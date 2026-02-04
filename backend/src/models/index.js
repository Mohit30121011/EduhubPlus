const { sequelize } = require('../config/db');
const Role = require('./Role');
const User = require('./User');
const Student = require('./Student');
const Faculty = require('./Faculty');
const Attendance = require('./Attendance');
const SchoolProfile = require('./SchoolProfile');
const Department = require('./Department');
const Course = require('./Course');
const Subject = require('./Subject');

// Module 1: Academic Structure
const Program = require('./Program');
const AcademicYear = require('./AcademicYear');
const Semester = require('./Semester');

// Module 2: Operations & Library & LMS
const Classroom = require('./Classroom');
const Timetable = require('./Timetable');
const TimeSlot = require('./TimeSlot');
const Book = require('./Book');
const LibraryTransaction = require('./LibraryTransaction');
const LMSMaterial = require('./LMSMaterial');
const Quiz = require('./Quiz');
const Question = require('./Question');
const QuizResult = require('./QuizResult');

// Module 3: Student Experience (Lifecycle)
const Notification = require('./Notification');
const PlacementDrive = require('./PlacementDrive');
const JobApplication = require('./JobApplication');
const Alumni = require('./Alumni');
const AdmissionInquiry = require('./AdmissionInquiry');

// Module 4: Finance & Resources
const FeeStructure = require('./FeeStructure');
const FeePayment = require('./FeePayment');
const Payroll = require('./Payroll');
const Asset = require('./Asset');
const Vehicle = require('./Vehicle');
const TransportRoute = require('./TransportRoute');

// Associations

Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

// --- Department & Program ---
Department.hasMany(Course);
Course.belongsTo(Department);

Department.hasMany(Program);
Program.belongsTo(Department);

Department.hasMany(Faculty);
Faculty.belongsTo(Department);

// --- Program & Semester ---
Program.hasMany(Semester);
Semester.belongsTo(Program);

AcademicYear.hasMany(Semester);
Semester.belongsTo(AcademicYear);

// --- Semester & Subject ---
Semester.hasMany(Subject);
Subject.belongsTo(Semester);

// --- Course & Subject (Legacy/Alternative) ---
Course.hasMany(Subject);
Subject.belongsTo(Course);

// --- Timetable ---
Semester.hasMany(Timetable);
Timetable.belongsTo(Semester);

Timetable.hasMany(TimeSlot);
TimeSlot.belongsTo(Timetable);

TimeSlot.belongsTo(Subject);
TimeSlot.belongsTo(Faculty);
TimeSlot.belongsTo(Classroom);

// --- Library ---
Book.hasMany(LibraryTransaction);
LibraryTransaction.belongsTo(Book);

Student.hasMany(LibraryTransaction);
LibraryTransaction.belongsTo(Student);

// --- LMS ---
Subject.hasMany(LMSMaterial);
LMSMaterial.belongsTo(Subject);

Faculty.hasMany(LMSMaterial, { foreignKey: 'uploadedBy' });
LMSMaterial.belongsTo(Faculty, { foreignKey: 'uploadedBy' });

Subject.hasMany(Quiz);
Quiz.belongsTo(Subject);

Faculty.hasMany(Quiz, { foreignKey: 'createdBy' });
Quiz.belongsTo(Faculty, { foreignKey: 'createdBy' });

Quiz.hasMany(Question);
Question.belongsTo(Quiz);

Quiz.hasMany(QuizResult);
QuizResult.belongsTo(Quiz);

Student.hasMany(QuizResult);
QuizResult.belongsTo(Student);

// --- Module 3: Notifications & Placement ---
User.hasMany(Notification);
Notification.belongsTo(User);

PlacementDrive.hasMany(JobApplication, { foreignKey: 'driveId' });
JobApplication.belongsTo(PlacementDrive, { foreignKey: 'driveId' });

Student.hasMany(JobApplication);
JobApplication.belongsTo(Student);

Student.hasOne(Alumni);
Alumni.belongsTo(Student);

// --- Module 4: Finance ---
Program.hasMany(FeeStructure);
FeeStructure.belongsTo(Program);

AcademicYear.hasMany(FeeStructure);
FeeStructure.belongsTo(AcademicYear);

Student.hasMany(FeePayment);
FeePayment.belongsTo(Student);

FeeStructure.hasMany(FeePayment);
FeePayment.belongsTo(FeeStructure);

User.hasMany(Payroll, { foreignKey: 'userId' }); // Faculty or Admin
Payroll.belongsTo(User, { foreignKey: 'userId' });

// --- Module 4: Transport ---
Vehicle.hasMany(TransportRoute);
TransportRoute.belongsTo(Vehicle);


module.exports = {
    sequelize,
    Role,
    User,
    Student,
    Faculty,
    Attendance,
    SchoolProfile,
    Department,
    Course,
    Subject,
    Program,
    AcademicYear,
    Semester,
    Classroom,
    Timetable,
    TimeSlot,
    Book,
    LibraryTransaction,
    LMSMaterial,
    Quiz,
    Question,
    QuizResult,
    Notification,
    PlacementDrive,
    JobApplication,
    Alumni,
    AdmissionInquiry,
    FeeStructure,
    FeePayment,
    Payroll,
    Asset,
    Vehicle,
    TransportRoute
};
