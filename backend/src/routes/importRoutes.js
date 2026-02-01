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
        columns: ['enrollmentNo', 'firstName', 'middleName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender', 'departmentCode', 'courseCode'],
        sample: [{ enrollmentNo: 'ENR001', firstName: 'John', middleName: '', lastName: 'Smith', email: 'student@example.com', phone: '9876543210', dateOfBirth: '2000-01-01', gender: 'MALE', departmentCode: 'CS', courseCode: 'BTCS' }]
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
                const sDeptMap = {}; studentDepts.forEach(d => sDeptMap[d.code] = d.name); // Storing name as model stores string currently
                const sCourseMap = {}; studentCourses.forEach(c => sCourseMap[c.code] = c.name);

                // For Student model, we need to create a User first? Or is it standalone?
                // Model says: userId matches User. But currently we just want to load data. 
                // Wait, Student.js says: userId: { allowNull: false }. 
                // This implies we MUST create a User record for every student first or concurrently.
                // For simplicity in this bulk import, we will auto-generate Users with default password.

                processedData = [];
                for (const row of data) {
                    const userPayload = {
                        name: `${row.firstName} ${row.lastName}`,
                        email: row.email,
                        phone: row.phone,
                        role: 'STUDENT',
                        password: 'Student@123',
                        isActive: true
                    };
                    // Create User
                    const user = await User.create(userPayload).catch(err => console.log('User create fail (duplicate?):', err.message));
                    if (user) {
                        processedData.push({
                            userId: user.id,
                            enrollmentNo: row.enrollmentNo,
                            firstName: row.firstName,
                            middleName: row.middleName,
                            lastName: row.lastName,
                            email: row.email,
                            phone: row.phone,
                            dateOfBirth: row.dateOfBirth,
                            gender: row.gender,
                            department: sDeptMap[row.departmentCode] || row.departmentCode,
                            course: sCourseMap[row.courseCode] || row.courseCode
                        });
                    }
                }

                if (processedData.length > 0) {
                    result = await Student.bulkCreate(processedData, { ignoreDuplicates: true });
                } else {
                    result = [];
                }
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
