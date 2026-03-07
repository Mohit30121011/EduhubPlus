const { connectPostgres } = require('../config/db');
const {
    User, Role, Department, Program, Semester, Faculty, Student,
    FeeStructure, FeePayment, AdmissionInquiry, Notification,
    Course, Subject, Book, AcademicYear, Attendance,
    Timetable, TimeSlot, Classroom
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

        // 2. Initial Admins
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

        // 4.5 Subjects (per department, Semester 1)
        console.log('Seeding Subjects...');
        const subjectMap = {
            'CSE': [
                { name: 'Data Structures & Algorithms', code: 'CS301', credits: 4, type: 'CORE' },
                { name: 'Web Development', code: 'CS302', credits: 3, type: 'CORE' },
                { name: 'Database Management Systems', code: 'CS303', credits: 4, type: 'CORE' },
                { name: 'Operating Systems', code: 'CS304', credits: 4, type: 'CORE' },
                { name: 'Computer Networks', code: 'CS305', credits: 3, type: 'CORE' },
                { name: 'Software Engineering', code: 'CS306', credits: 3, type: 'ELECTIVE' },
            ],
            'ME': [
                { name: 'Engineering Mechanics', code: 'ME301', credits: 4, type: 'CORE' },
                { name: 'Thermodynamics', code: 'ME302', credits: 4, type: 'CORE' },
                { name: 'Fluid Mechanics', code: 'ME303', credits: 3, type: 'CORE' },
                { name: 'Machine Design', code: 'ME304', credits: 4, type: 'CORE' },
            ],
            'EE': [
                { name: 'Circuit Theory', code: 'EE301', credits: 4, type: 'CORE' },
                { name: 'Electromagnetic Fields', code: 'EE302', credits: 3, type: 'CORE' },
                { name: 'Power Systems', code: 'EE303', credits: 4, type: 'CORE' },
                { name: 'Control Systems', code: 'EE304', credits: 3, type: 'CORE' },
            ],
            'CE': [
                { name: 'Structural Analysis', code: 'CE301', credits: 4, type: 'CORE' },
                { name: 'Geotechnical Engineering', code: 'CE302', credits: 3, type: 'CORE' },
                { name: 'Transportation Engineering', code: 'CE303', credits: 3, type: 'CORE' },
            ],
            'ECE': [
                { name: 'Digital Electronics', code: 'ECE301', credits: 4, type: 'CORE' },
                { name: 'Signal Processing', code: 'ECE302', credits: 4, type: 'CORE' },
                { name: 'VLSI Design', code: 'ECE303', credits: 3, type: 'CORE' },
                { name: 'Communication Systems', code: 'ECE304', credits: 3, type: 'CORE' },
            ]
        };

        const allSubjects = [];
        for (const dept of departments) {
            const deptSubjects = subjectMap[dept.code] || [];
            // Find Sem 1 for this dept's program
            const prog = programs.find(p => p.departmentId === dept.id);
            const sem1 = semesters.find(s => s.programId === prog.id && s.name === 'Semester 1');

            for (const sub of deptSubjects) {
                let [subject] = await Subject.findOrCreate({
                    where: { code: sub.code },
                    defaults: {
                        ...sub,
                        semesterId: sem1?.id || null,
                        courseId: null
                    }
                });
                allSubjects.push({ subject, deptCode: dept.code });
            }
        }
        console.log(`  ✅ Created ${allSubjects.length} subjects`);

        // 4.6 Classrooms
        console.log('Seeding Classrooms...');
        const classroomData = [
            { roomNumber: 'Room 101', capacity: 60, type: 'LECTURE_HALL' },
            { roomNumber: 'Room 201', capacity: 60, type: 'LECTURE_HALL' },
            { roomNumber: 'Room 301', capacity: 40, type: 'SEMINAR_ROOM' },
            { roomNumber: 'Lab 1', capacity: 30, type: 'LAB' },
            { roomNumber: 'Lab 2', capacity: 30, type: 'LAB' },
            { roomNumber: 'Lab 3', capacity: 30, type: 'LAB' },
            { roomNumber: 'Hall A', capacity: 120, type: 'LECTURE_HALL' },
            { roomNumber: 'Hall B', capacity: 100, type: 'LECTURE_HALL' },
        ];
        const classrooms = [];
        for (const cr of classroomData) {
            let [room] = await Classroom.findOrCreate({
                where: { roomNumber: cr.roomNumber },
                defaults: cr
            });
            classrooms.push(room);
        }

        // 5. Faculty / Staff
        console.log('Seeding Faculty...');
        const faculties = [];
        const facultyUsers = [];
        for (let i = 1; i <= 15; i++) {
            const email = `faculty${i}@icms.com`;
            let user = await User.findOne({ where: { email } });
            if (!user) {
                user = await User.create({ email, password: 'password123', role: 'FACULTY', roleId: facultyRole.id, isActive: true });
            }
            facultyUsers.push(user);
            
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
        const studentUsers = [];
        for (let i = 1; i <= 50; i++) {
            const email = `student${i}@icms.com`;
            let user = await User.findOne({ where: { email } });
            if (!user) {
                user = await User.create({ email, password: 'password123', role: 'STUDENT', roleId: studentRole.id, isActive: true });
            }
            studentUsers.push(user);

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
                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                }
            });
            feeStructures.push(fee);
        }

        for (let i = 0; i < students.length; i++) {
            if (i % 2 !== 0) continue;
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

        // 9. Notifications
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

        // Send a welcome notification to each student
        for (let i = 0; i < Math.min(studentUsers.length, 10); i++) {
            await Notification.findOrCreate({
                where: { userId: studentUsers[i].id, title: 'Welcome to Campus Portal' },
                defaults: {
                    userId: studentUsers[i].id,
                    title: 'Welcome to Campus Portal',
                    message: 'Your student account is now active. Explore your dashboard!',
                    type: 'INFO',
                    isRead: false
                }
            });
        }

        // ──────────────────────────────────────────────────────────────
        //  10. ATTENDANCE DATA (30 days of realistic records)
        // ──────────────────────────────────────────────────────────────
        console.log('Seeding Attendance Data...');
        const subjectNames = allSubjects.filter(s => s.deptCode === 'CSE').map(s => s.subject.name);
        // Use first faculty user as the marker
        const markerUserId = facultyUsers[0]?.id || adminUser.id;

        // Generate 30 days of attendance for first 10 students (CSE dept)
        const cseStudents = students.filter(s => s.department === 'Computer Science').slice(0, 10);
        let attendanceCount = 0;
        const today = new Date();

        for (let dayOffset = 1; dayOffset <= 30; dayOffset++) {
            const date = new Date(today);
            date.setDate(date.getDate() - dayOffset);
            const dayOfWeek = date.getDay();
            // Skip weekends
            if (dayOfWeek === 0 || dayOfWeek === 6) continue;

            const dateStr = date.toISOString().split('T')[0];

            // Each day has 3-4 subjects
            const daySubjects = subjectNames.slice(0, Math.min(4, subjectNames.length));

            for (const subjectName of daySubjects) {
                for (const student of cseStudents) {
                    // ~85% present, ~10% absent, ~5% late
                    const rand = Math.random();
                    let status = 'PRESENT';
                    if (rand > 0.95) status = 'LATE';
                    else if (rand > 0.85) status = 'ABSENT';

                    try {
                        await Attendance.findOrCreate({
                            where: {
                                studentId: student.id,
                                date: dateStr,
                                subject: subjectName
                            },
                            defaults: {
                                studentId: student.id,
                                markedBy: markerUserId,
                                date: dateStr,
                                subject: subjectName,
                                status,
                                remarks: status === 'ABSENT' ? 'Absent without notice' : null
                            }
                        });
                        attendanceCount++;
                    } catch (e) {
                        // Skip duplicates silently
                    }
                }
            }
        }
        console.log(`  ✅ Seeded ${attendanceCount} attendance records`);

        // Also seed some attendance for ALL students (at least a few records each)
        console.log('Seeding attendance for remaining students...');
        const otherStudents = students.filter(s => s.department !== 'Computer Science');
        for (const student of otherStudents) {
            const dept = departments.find(d => d.name === student.department);
            const deptSubs = allSubjects.filter(s => s.deptCode === dept?.code).map(s => s.subject.name);
            if (deptSubs.length === 0) continue;

            // 10 days of attendance for each
            for (let dayOffset = 1; dayOffset <= 15; dayOffset++) {
                const date = new Date(today);
                date.setDate(date.getDate() - dayOffset);
                if (date.getDay() === 0 || date.getDay() === 6) continue;
                const dateStr = date.toISOString().split('T')[0];

                for (const subjectName of deptSubs.slice(0, 3)) {
                    const rand = Math.random();
                    let status = 'PRESENT';
                    if (rand > 0.92) status = 'LATE';
                    else if (rand > 0.80) status = 'ABSENT';

                    try {
                        await Attendance.findOrCreate({
                            where: { studentId: student.id, date: dateStr, subject: subjectName },
                            defaults: {
                                studentId: student.id,
                                markedBy: markerUserId,
                                date: dateStr,
                                subject: subjectName,
                                status,
                                remarks: null
                            }
                        });
                    } catch (e) { /* skip */ }
                }
            }
        }
        console.log('  ✅ All student attendance seeded');

        // ──────────────────────────────────────────────────────────────
        //  11. TIMETABLE & TIMESLOTS
        // ──────────────────────────────────────────────────────────────
        console.log('Seeding Timetable & TimeSlots...');
        const cseProgram = programs.find(p => p.code === 'BTECH-CSE');
        const cseSem1 = semesters.find(s => s.programId === cseProgram?.id && s.name === 'Semester 1');

        if (cseSem1) {
            const [timetable] = await Timetable.findOrCreate({
                where: { semesterId: cseSem1.id, section: 'A' },
                defaults: {
                    name: 'B.Tech CSE Sem 1 - Section A',
                    semesterId: cseSem1.id,
                    section: 'A',
                    isActive: true
                }
            });

            const cseSubjects = allSubjects.filter(s => s.deptCode === 'CSE').map(s => s.subject);
            const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
            const timeSlots = [
                { start: '09:00:00', end: '10:00:00' },
                { start: '10:00:00', end: '11:00:00' },
                { start: '11:15:00', end: '12:15:00' },
                { start: '14:00:00', end: '15:00:00' },
                { start: '15:00:00', end: '16:00:00' },
            ];

            let slotCount = 0;
            for (const day of days) {
                // 4 slots per day
                const slotsForDay = timeSlots.slice(0, 4);
                for (let si = 0; si < slotsForDay.length; si++) {
                    const subjectIdx = (days.indexOf(day) * 4 + si) % cseSubjects.length;
                    const facultyIdx = subjectIdx % faculties.length;

                    await TimeSlot.findOrCreate({
                        where: {
                            timetableId: timetable.id,
                            dayOfWeek: day,
                            startTime: slotsForDay[si].start
                        },
                        defaults: {
                            timetableId: timetable.id,
                            dayOfWeek: day,
                            startTime: slotsForDay[si].start,
                            endTime: slotsForDay[si].end,
                            subjectId: cseSubjects[subjectIdx]?.id || null,
                            facultyId: faculties[facultyIdx]?.id || null,
                            classroomId: classrooms[si % classrooms.length]?.id || null
                        }
                    });
                    slotCount++;
                }
            }
            console.log(`  ✅ Created timetable with ${slotCount} time slots`);
        }

        console.log('✅ Seeding Complete!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    }
};

seedDatabase();
