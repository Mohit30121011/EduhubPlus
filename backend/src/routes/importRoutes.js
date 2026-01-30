const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const Department = require('../models/Department');
const Course = require('../models/Course');
const Subject = require('../models/Subject');

// Multer setup for file upload
const upload = multer({ storage: multer.memoryStorage() });

// Template definitions
const templates = {
    department: {
        columns: ['name', 'code'],
        sample: [{ name: 'Computer Science', code: 'CS' }, { name: 'Electronics', code: 'EC' }]
    },
    course: {
        columns: ['name', 'code', 'departmentCode'],
        sample: [{ name: 'B.Tech CSE', code: 'BTCS', departmentCode: 'CS' }]
    },
    subject: {
        columns: ['name', 'code', 'courseCode'],
        sample: [{ name: 'Data Structures', code: 'CS201', courseCode: 'BTCS' }]
    }
};

// @desc    Download sample template
// @route   GET /api/import/template/:category
// @access  Private
router.get('/template/:category', protect, (req, res) => {
    const { category } = req.params;
    const template = templates[category];

    if (!template) {
        return res.status(400).json({ message: 'Invalid category' });
    }

    // Create workbook with sample data
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(template.sample);
    XLSX.utils.book_append_sheet(wb, ws, category);

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', `attachment; filename=${category}_template.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
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
                    departmentId: deptCodeMap[row.departmentCode] || null
                })).filter(row => row.departmentId !== null);

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
                    courseId: courseCodeMap[row.courseCode] || null
                })).filter(row => row.courseId !== null);

                if (processedData.length === 0) {
                    return res.status(400).json({ message: 'No valid course codes found. Please create courses first.' });
                }
                result = await Subject.bulkCreate(processedData, { ignoreDuplicates: true });
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
