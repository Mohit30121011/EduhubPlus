const { Course, Subject, Department } = require('../models');

// @desc    Get All Academic Data (Courses, Subjects, Departments)
// @route   GET /api/master/all
// @access  Private
const getAllMasterData = async (req, res) => {
    try {
        const courses = await Course.findAll({ include: [Department] });
        const subjects = await Subject.findAll({ include: [Course] });
        const departments = await Department.findAll();

        res.json({ courses, subjects, departments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching master data' });
    }
};

// @desc    Create Course
// @route   POST /api/master/course
const createCourse = async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Create Subject
// @route   POST /api/master/subject
const createSubject = async (req, res) => {
    try {
        const subject = await Subject.create(req.body);
        res.status(201).json(subject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Create Department
// @route   POST /api/master/department
const createDepartment = async (req, res) => {
    try {
        const department = await Department.create(req.body);
        res.status(201).json(department);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update Course
// @route   PUT /api/master/course/:id
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            await course.update(req.body);
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update Subject
// @route   PUT /api/master/subject/:id
const updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findByPk(req.params.id);
        if (subject) {
            await subject.update(req.body);
            res.json(subject);
        } else {
            res.status(404).json({ message: 'Subject not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update Department
// @route   PUT /api/master/department/:id
const updateDepartment = async (req, res) => {
    try {
        const department = await Department.findByPk(req.params.id);
        if (department) {
            await department.update(req.body);
            res.json(department);
        } else {
            res.status(404).json({ message: 'Department not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete Course
// @route   DELETE /api/master/course/:id
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            // Check for linked subjects
            const subjectCount = await Subject.count({ where: { CourseId: req.params.id } }); // Assuming strict naming, checking index.js will confirm foreign key.
            if (subjectCount > 0) {
                return res.status(400).json({ message: 'Cannot delete Course. It has linked Subjects.' });
            }

            await course.destroy();
            res.json({ message: 'Course removed', id: req.params.id });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error deleting course' });
    }
};

module.exports = {
    getAllMasterData,
    createCourse,
    createSubject,
    createDepartment,
    updateCourse,
    updateSubject,
    updateDepartment,
    deleteCourse
};
