const { connectPostgres } = require('../config/db');
const {
    User, Role, Department, Program, Semester, Faculty, Student,
    FeeStructure, FeePayment, AdmissionInquiry, Notification,
    Course, Subject, Book, AcademicYear
} = require('../models');

const seedDatabase = async () => {
    try {
        await connectPostgres();
        console.log('🌱 Starting comprehensive database seeding...');

        // 1. Roles
        console.log('Seeding Roles...');
        const roleNames = ['SUPER_ADMIN', 'ADMIN', 'FACULTY', 'STUDENT', 'LIBRARIAN', 'ACCOUNTANT'];
        const roles = [];
        for (const name of roleNames) {
            let [role] = await Role.findOrCreate({ where: { name } });
            roles.push(role);
        }
        const superAdminRole = roles.find(r => r.name === 'SUPER_ADMIN');
        const adminRole = roles.find(r => r.name === 'ADMIN');
        const facultyRole = roles.find(r => r.name === 'FACULTY');
        const studentRole = roles.find(r => r.name === 'STUDENT');

        // 2. Initial Admins (Check existence first to not overwrite provided admin)
        console.log('Checking Super Admin...');
        const adminEmail = 'admin@icms.com';
        let adminUser = await User.findOne({ where: { email: adminEmail } });
        if (!adminUser) {
            adminUser = await User.create({ email: adminEmail, password: 'password123', role: 'SUPER_ADMIN', roleId: superAdminRole.id, isActive: true });
        }

        // 3. Departments
        console.log('Seeding Departments...');
        const deptData = [
            { name: 'Computer Science', code: 'CSE' },
            { name: 'Mechanical Engineering', code: 'ME' },
            { name: 'Electrical Engineering', code: 'EE' },
            { name: 'Civil Engineering', code: 'CE' },
            { name: 'Electronics & Comm', code: 'ECE' }
        ];
        const departments = [];
        for (const pd of deptData) {
            let [dept] = await Department.findOrCreate({ where: { code: pd.code }, defaults: pd });
            departments.push(dept);
        }

        // 3.5 Academic Year
        console.log('Seeding Academic Year...');
        const [academicYear] = await AcademicYear.findOrCreate({
            where: { name: '2025-2026' },
            defaults: {
                name: '2025-2026',
                startDate: new Date('2025-07-01'),
                endDate: new Date('2026-06-30'),
                isActive: true
            }
        });

        // 4. Programs & Semesters
        console.log('Seeding Programs & Semesters...');
        const programs = [];
        const semesters = [];
        for (const dept of departments) {
            let [prog] = await Program.findOrCreate({
                where: { code: `BTECH-${dept.code}` },
                defaults: { name: `B.Tech ${dept.name}`, departmentId: dept.id, duration: 4, totalSemesters: 8 }
            });
            programs.push(prog);

            for (let i = 1; i <= 8; i++) {
                let [sem] = await Semester.findOrCreate({
                    where: { programId: prog.id, name: `Semester ${i}` },
                    defaults: { 
                        name: `Semester ${i}`, 
                        academicYearId: academicYear.id,
                        isActive: i === 1 
                    }
                });
                semesters.push(sem);
            }
        }

        // 5. Faculty / Staff
        console.log('Seeding Faculty...');
        const faculties = [];
        for (let i = 1; i <= 15; i++) {
            const email = `faculty${i}@icms.com`;
            let user = await User.findOne({ where: { email } });
            if (!user) {
                user = await User.create({ email, password: 'password123', role: 'FACULTY', roleId: facultyRole.id, isActive: true });
            }
            
            let [faculty] = await Faculty.findOrCreate({
                where: { userId: user.id },
                defaults: {
                    employeeId: `EMP2024${String(i).padStart(3, '0')}`,
                    firstName: `Dr. Ramesh_${i}`,
                    lastName: `Sharma`,
                    department: departments[i % departments.length].name,
                    designation: i % 3 === 0 ? 'Professor' : 'Assistant Professor',
                    email: email,
                    phone: `98765432${String(i).padStart(2, '0')}`,
                    joinDate: new Date(),
                    isActive: true
                }
            });
            faculties.push(faculty);
        }

        // 6. Students
        console.log('Seeding Students...');
        const students = [];
        for (let i = 1; i <= 50; i++) {
            const email = `student${i}@icms.com`;
            let user = await User.findOne({ where: { email } });
            if (!user) {
                user = await User.create({ email, password: 'password123', role: 'STUDENT', roleId: studentRole.id, isActive: true });
            }

            const dept = departments[i % departments.length];
            const prog = programs.find(p => p.departmentId === dept.id);
            
            let [student] = await Student.findOrCreate({
                where: { userId: user.id },
                defaults: {
                    enrollmentNo: `EN2024${String(i).padStart(4, '0')}`,
                    firstName: `Aarav_${i}`,
                    lastName: `Patel`,
                    email: email,
                    department: dept.name,
                    course: prog.name,
                    currentSemester: 1,
                    applicationStatus: i % 5 === 0 ? 'PENDING' : 'APPROVED'
                }
            });
            students.push(student);
        }

        // 7. Finance (Fee Structures & Payments)
        console.log('Seeding Finance Data...');
        const feeStructures = [];
        for (const prog of programs) {
            let [fee] = await FeeStructure.findOrCreate({
                where: { programId: prog.id, category: 'TUITION' },
                defaults: {
                    programId: prog.id,
                    academicYearId: academicYear.id,
                    category: 'TUITION',
                    amount: 85000,
                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
                }
            });
            feeStructures.push(fee);
        }

        for (let i = 0; i < students.length; i++) {
            if (i % 2 !== 0) continue; // Only half the students have payments for realism
            const student = students[i];
            const structure = feeStructures[i % feeStructures.length];
            await FeePayment.findOrCreate({
                where: { studentId: student.id, feeStructureId: structure.id },
                defaults: {
                    amountPaid: 85000,
                    paymentMethod: 'ONLINE',
                    transactionId: `TXN${Date.now()}${i}`,
                    status: 'SUCCESS'
                }
            });
        }

        // 8. Admissions (Inquiries)
        console.log('Seeding Admission Inquiries...');
        for(let i=1; i<=10; i++) {
             await AdmissionInquiry.findOrCreate({
                 where: { email: `prospect${i}@test.com` },
                 defaults: {
                     firstName: `Prospective`,
                     lastName: `Student_${i}`,
                     phone: `99887766${String(i).padStart(2, '0')}`,
                     email: `prospect${i}@test.com`,
                     programOfInterest: programs[i % programs.length].name,
                     status: i % 2 === 0 ? 'NEW' : 'CONTACTED'
                 }
             });
        }

        // 9. Notifications / Tasks
        console.log('Seeding Notifications...');
        await Notification.findOrCreate({
            where: { userId: adminUser.id, title: 'Welcome to EduhubPlus' },
            defaults: {
                userId: adminUser.id,
                title: 'Welcome to EduhubPlus',
                message: 'System successfully seeded with dummy data.',
                type: 'SUCCESS',
                isRead: false
            }
        });

        console.log('✅ Seeding Complete!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    }
};

seedDatabase();
