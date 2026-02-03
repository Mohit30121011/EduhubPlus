const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const Department = require('../models/Department');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

// Multer setup for file upload
const upload = multer({ storage: multer.memoryStorage() });

// Template definitions
const templates = {
    department: {
        columns: ['name', 'code'],
        sample: [{ name: 'Computer Science', code: 'CS' }, { name: 'Electronics', code: 'EC' }]
    },
    course: {
        columns: ['name', 'code', 'departmentCode', 'fees'],
        sample: [{ name: 'B.Tech CSE', code: 'BTCS', departmentCode: 'CS', fees: 50000 }]
    },
    subject: {
        columns: ['name', 'code', 'courseCode'],
        sample: [{ name: 'Data Structures', code: 'CS201', courseCode: 'BTCS' }]
    },
    admin: {
        columns: ['name', 'email', 'phone', 'role', 'password'],
        sample: [{ name: 'John Doe', email: 'john@example.com', phone: '9876543210', role: 'ADMIN', password: 'password123' }]
    },
    students: {
        columns: [
            // Core
            'enrollmentNo', 'firstName', 'middleName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender', 'departmentCode', 'courseCode',
            // Personal
            'regionalName', 'previousName', 'nationality', 'placeOfBirth', 'domicileState', 'category', 'subCategory', 'aadharNumber', 'passportNumber', 'religion', 'motherTongue', 'maritalStatus', 'abcId',
            // Contact - Permanent
            'permanentStreet', 'permanentCity', 'permanentState', 'permanentPincode', 'permanentCountry',
            // Contact - Correspondence
            'correspondenceStreet', 'correspondenceCity', 'correspondenceState', 'correspondencePincode', 'correspondenceCountry',
            // Contact - Other
            'alternateMobile', 'alternateEmail',
            // Family - Father
            'fatherName', 'fatherOccupation', 'fatherMobile', 'fatherEmail', 'fatherIncome',
            // Family - Mother
            'motherName', 'motherOccupation', 'motherMobile', 'motherEmail', 'motherIncome',
            // Family - Guardian
            'guardianName', 'guardianRelation', 'guardianMobile',
            // Academic
            'classX_percentage', 'classX_board', 'classX_year',
            'classXII_percentage', 'classXII_board', 'classXII_year',
            // Admission
            'programLevel', 'admissionType', 'modeOfStudy', 'academicSession'
        ],
        sample: [{
            enrollmentNo: 'ENR001', firstName: 'John', middleName: '', lastName: 'Smith', email: 'john@example.com', phone: '9876543210', dateOfBirth: '2000-01-15', gender: 'MALE', departmentCode: 'CS', courseCode: 'BTCS',
            regionalName: 'John', nationality: 'Indian', category: 'GENERAL', aadharNumber: '123456789012',
            permanentStreet: '123 Main St', permanentCity: 'Mumbai', permanentState: 'Maharashtra', permanentPincode: '400001', permanentCountry: 'India',
            fatherName: 'Robert Smith', fatherMobile: '9876543211',
            classX_percentage: '85', classX_board: 'CBSE', classX_year: '2016',
            programLevel: 'UG', admissionType: 'Regular', modeOfStudy: 'Full-time', academicSession: '2024-25'
        }]
    },
    faculty: {
        columns: [
            'employeeId', 'firstName', 'lastName', 'email', 'phone', 'gender', 'designation', 'department',
            'dateOfBirth', 'nationality', 'maritalStatus',
            'street', 'city', 'state', 'pincode', 'country',
            'totalTeachingExp'
        ],
        sample: [{
            employeeId: 'FAC001', firstName: 'Alice', lastName: 'Professor', email: 'alice@college.edu', phone: '9876543210',
            gender: 'FEMALE', designation: 'Assistant Professor', department: 'Computer Science',
            dateOfBirth: '1985-06-15', nationality: 'Indian', maritalStatus: 'Married',
            street: '456 Faculty Lane', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', country: 'India',
            totalTeachingExp: '5'
        }]
    }
};

// @desc    Download sample template
// @route   GET /api/import/template/:category
// @access  Private
router.get('/template/:category', protect, async (req, res) => {
    const { category } = req.params;
    const template = templates[category];

    if (!template) {
        return res.status(400).json({ message: 'Invalid category' });
    }

    try {
        // Create workbook with sample data
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(template.sample);
        XLSX.utils.book_append_sheet(wb, ws, category);

        // Add Reference sheet for Course template with department codes
        if (category === 'course') {
            const departments = await Department.findAll({ attributes: ['code', 'name'] });
            if (departments.length > 0) {
                const refData = departments.map(d => ({
                    Code: d.code,
                    Name: d.name,
                    Note: 'Copy code to departmentCode column'
                }));
                const refSheet = XLSX.utils.json_to_sheet(refData);
                XLSX.utils.book_append_sheet(wb, refSheet, 'Available Departments');
            }
        }

        // Add Reference sheet for Subject template with course codes
        if (category === 'subject') {
            const courses = await Course.findAll({ attributes: ['code', 'name'] });
            if (courses.length > 0) {
                const refData = courses.map(c => ({
                    Code: c.code,
                    Name: c.name,
                    Note: 'Copy code to courseCode column'
                }));
                const refSheet = XLSX.utils.json_to_sheet(refData);
                XLSX.utils.book_append_sheet(wb, refSheet, 'Available Courses');
            }
        }

        // Generate buffer
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Disposition', `attachment; filename=${category}_template.xlsx`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (error) {
        console.error('Template generation error:', error);
        res.status(500).json({ message: 'Error generating template' });
    }
});

// @desc    Parse uploaded Excel and return data
// @route   POST /api/import/parse/:category
// @access  Private
router.post('/parse/:category', protect, upload.single('file'), (req, res) => {
    const { category } = req.params;
    const template = templates[category];

    if (!template) {
        return res.status(400).json({ message: 'Invalid category' });
    }

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        // Validate columns
        if (data.length === 0) {
            return res.status(400).json({ message: 'Excel file is empty' });
        }

        res.status(200).json({
            message: 'File parsed successfully',
            data: data,
            columns: template.columns
        });
    } catch (error) {
        console.error('Excel parse error:', error);
        res.status(500).json({ message: 'Error parsing Excel file' });
    }
});

// @desc    Bulk create records
// @route   POST /api/import/bulk/:category
// @access  Private
router.post('/bulk/:category', protect, async (req, res) => {
    const { category } = req.params;
    const { data } = req.body;

    if (!data || !Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ message: 'No data provided' });
    }

    try {
        let result;
        let processedData;

        switch (category) {
            case 'department':
                result = await Department.bulkCreate(data, { ignoreDuplicates: true });
                break;
            case 'course':
                // Resolve departmentCode to departmentId
                const departments = await Department.findAll();
                const deptCodeMap = {};
                departments.forEach(d => { deptCodeMap[d.code] = d.id; });

                processedData = data.map(row => ({
                    name: row.name,
                    code: row.code,
                    DepartmentId: deptCodeMap[row.departmentCode] || null,
                    fees: row.fees || 0
                })).filter(row => row.DepartmentId !== null);

                if (processedData.length === 0) {
                    return res.status(400).json({ message: 'No valid department codes found. Please create departments first.' });
                }
                result = await Course.bulkCreate(processedData, { ignoreDuplicates: true });
                break;
            case 'subject':
                // Resolve courseCode to courseId
                const courses = await Course.findAll();
                const courseCodeMap = {};
                courses.forEach(c => { courseCodeMap[c.code] = c.id; });

                processedData = data.map(row => ({
                    name: row.name,
                    code: row.code,
                    CourseId: courseCodeMap[row.courseCode] || null
                })).filter(row => row.CourseId !== null);

                if (processedData.length === 0) {
                    return res.status(400).json({ message: 'No valid course codes found. Please create courses first.' });
                }
                result = await Subject.bulkCreate(processedData, { ignoreDuplicates: true });
                break;
            case 'admin':
                processedData = data.map(row => ({
                    name: row.name,
                    email: row.email,
                    phone: row.phone,
                    role: row.role || 'ADMIN',
                    password: row.password || 'Admin@123', // Default password if missing
                    isActive: true,
                    permissions: ["dashboard", "enquiries", "admissions", "academics", "finances", "content", "insights", "staff", "tasks", "master"] // Default all permissions for imported admins
                }));
                // User hooks will handle password hashing
                result = await User.bulkCreate(processedData, { ignoreDuplicates: true, validate: true, individualHooks: true });
                break;
            case 'students':
                const studentDepts = await Department.findAll();
                const studentCourses = await Course.findAll();
                const sDeptMap = {}; studentDepts.forEach(d => sDeptMap[d.code] = d.name);
                const sCourseMap = {}; studentCourses.forEach(c => sCourseMap[c.code] = c.name);

                processedData = [];
                for (const row of data) {
                    // 1. Create User
                    const userPayload = {
                        name: `${row.firstName} ${row.lastName}`,
                        email: row.email,
                        phone: row.phone,
                        role: 'STUDENT',
                        password: 'Student@123', // Default
                        isActive: true
                    };
                    const user = await User.create(userPayload).catch(err => console.log('User create fail (duplicate?):', err.message));

                    // 2. Prepare Nested JSONs
                    if (user) {
                        // Contact
                        const contactDetails = {
                            permanentAddress: {
                                street: row.permanentStreet, city: row.permanentCity, state: row.permanentState, pincode: row.permanentPincode, country: row.permanentCountry
                            },
                            correspondenceAddress: {
                                street: row.correspondenceStreet, city: row.correspondenceCity, state: row.correspondenceState, pincode: row.correspondencePincode, country: row.correspondenceCountry
                            },
                            alternateMobile: row.alternateMobile,
                            alternateEmail: row.alternateEmail
                        };

                        // Family
                        const familyDetails = {
                            father: { name: row.fatherName, occupation: row.fatherOccupation, mobile: row.fatherMobile, email: row.fatherEmail, income: row.fatherIncome },
                            mother: { name: row.motherName, occupation: row.motherOccupation, mobile: row.motherMobile, email: row.motherEmail, income: row.motherIncome },
                            guardian: { name: row.guardianName, relation: row.guardianRelation, mobile: row.guardianMobile }
                        };

                        // Academic
                        const academicHistory = {
                            classX: { percentage: row.classX_percentage, board: row.classX_board, year: row.classX_year },
                            classXII: { percentage: row.classXII_percentage, board: row.classXII_board, year: row.classXII_year }
                        };

                        // Admission
                        const admissionDetails = {
                            programLevel: row.programLevel,
                            admissionType: row.admissionType,
                            modeOfStudy: row.modeOfStudy,
                            academicSession: row.academicSession
                        };

                        processedData.push({
                            userId: user.id,
                            enrollmentNo: row.enrollmentNo,
                            firstName: row.firstName, middleName: row.middleName, lastName: row.lastName,
                            email: row.email, phone: row.phone, dateOfBirth: row.dateOfBirth, gender: row.gender,

                            // Mapped Fields
                            department: sDeptMap[row.departmentCode] || row.departmentCode,
                            course: sCourseMap[row.courseCode] || row.courseCode,

                            // Additional Info
                            regionalName: row.regionalName, previousName: row.previousName, nationality: row.nationality,
                            placeOfBirth: row.placeOfBirth, domicileState: row.domicileState, category: row.category,
                            subCategory: row.subCategory, aadharNumber: row.aadharNumber, passportNumber: row.passportNumber,
                            religion: row.religion, motherTongue: row.motherTongue, maritalStatus: row.maritalStatus, abcId: row.abcId,

                            // JSON Fields
                            contactDetails,
                            familyDetails,
                            academicHistory,
                            admissionDetails
                        });
                    }
                }

                if (processedData.length > 0) {
                    result = await Student.bulkCreate(processedData, { ignoreDuplicates: true });
                } else {
                    result = [];
                }
                break;

            case 'faculty':
                processedData = [];
                for (const row of data) {
                    const userPayload = {
                        name: `${row.firstName} ${row.lastName}`,
                        email: row.email,
                        phone: row.phone,
                        role: 'FACULTY',
                        password: 'Faculty@123',
                        isActive: true
                    };
                    const user = await User.create(userPayload).catch(err => console.log('User create fail (duplicate?):', err.message));

                    if (user) {
                        processedData.push({
                            userId: user.id,
                            employeeId: row.employeeId,
                            firstName: row.firstName, lastName: row.lastName,
                            email: row.email, phone: row.phone, gender: row.gender,
                            designation: row.designation, department: row.department,
                            dateOfBirth: row.dateOfBirth, nationality: row.nationality, maritalStatus: row.maritalStatus,
                            contactDetails: {
                                permanentAddress: {
                                    street: row.street, city: row.city, state: row.state, pincode: row.pincode, country: row.country
                                },
                                correspondenceAddress: {
                                    street: row.street, city: row.city, state: row.state, pincode: row.pincode, country: row.country
                                }
                            },
                            experienceDetails: { totalTeachingExp: row.totalTeachingExp }
                        });
                    }
                }
                if (processedData.length > 0) {
                    result = await Faculty.bulkCreate(processedData, { ignoreDuplicates: true });
                } else { result = []; }
                break;

            default:
                return res.status(400).json({ message: 'Invalid category' });
        }

        res.status(201).json({
            message: `${result.length} ${category}(s) imported successfully`,
            count: result.length
        });
    } catch (error) {
        console.error('Bulk import error:', error);
        res.status(500).json({ message: 'Error importing data', error: error.message });
    }
});

module.exports = router;
