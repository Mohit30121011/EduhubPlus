# ICMS Context Design / I/P - O/P Specifications

Use this reference to create your updated **Context Diagram**. This maps the newly implemented Backend Structure to Visual Inputs and Outputs.

---

## 1. Administrator & System Configuration (Top Left)
**Goal:** Control Access, Structure, and Integrity.

### Inputs (Actions/Configuration)
*   **Setup RBAC:** Create `Roles`, Define `Permissions` (JSON), Assign Roles to Users.
*   **Configure Academic Structure:** Add `Departments`, Create `Programs` (B.Tech/MBA), Set `Credits`.
*   **Manage Academic Calendar:** Create `Academic Year` (2025-26), Define `Semesters` (Start/End Dates).
*   **System Integrity:** Configure SSL, Schedule Automated Backups (`node-cron`).

### Outputs (Views/Reports)
*   **System Health Status:** Backup Logs, Server Status.
*   **User Role Matrix:** View which users have what permissions.
*   **Academic Structure View:** Hierarchy Tree (Dept -> Program -> Semester -> Subject).

---

## 2. Academic & Library Operations (Top Right)
**Goal:** Streamline Learning, Resources, and Assessment.

### Inputs (Faculty/Librarian Actions)
*   **Timetable Management:** Create `Timetable`, Assign `TimeSlots` (Faculty + Subj + Room).
*   **Classroom Setup:** Add `Classrooms`, Tag Resources (Projector/AC), Set Capacity.
*   **LMS Content:** Upload `LMSMaterial` (Notes/Videos), Create `Quizzes`, Add `Questions`.
*   **Library Management:** Add `Books` (ISBN/Barcode), Issue/Return Books (`LibraryTransaction`).

### Outputs (Reports/Data)
*   **Master Timetable:** Class-wise and Faculty-wise weekly schedules.
*   **LMS Analytics:** Quiz Scores (`QuizResult`), Student Engagement, Content Usage.
*   **Library Defaulters:** List of overdue books and calculated Fines.
*   **Resource Utilization:** Classroom occupancy stats.

---

## 3. Finance & Resource Management (Bottom Left)
**Goal:** Manage Money, Assets, and Logistics.

### Inputs (Admin/Accountant Actions)
*   **Fee Operations:** Define `FeeStructure` (Tuition/Hostel), Collect Offline `FeePayments`.
*   **Payroll Processing:** Generate `Payroll` for Faculty/Staff (Basic + Allowances - Deductions).
*   **Asset Tracking:** Register `Assets` (IT/Furniture), Update Status (Maintenance/Disposed).
*   **Transport Logistics:** Add `Vehicles`, Define `TransportRoutes`, Assign Drivers.

### Outputs (Financial Reports)
*   **Fee Reconciliation:** Paid vs Pending Fees, Daily Collection Reports.
*   **Payroll Statements:** Monthly Salary Slips, Expense Reports.
*   **Asset Inventory:** List of all physical assets and their current location/value.
*   **Transport & Logistics:** Vehicle Status, Route Manifests.

---

## 4. Student Lifecycle Services (Bottom Right)
**Goal:** Admissions, Experience, and Career.

### Inputs (Student/Applicant Actions)
*   **Admission Process:** Submit `AdmissionInquiry`, Fill Registration Form.
*   **Student Dashboard:** Pay Fees Online, Submit `Quiz` Answers, Download Notes.
*   **Career Services:** Apply for `PlacementDrives`, Update Resume `JobApplication`.
*   **Alumni Network:** Register as `Alumni`, Update Current Company/Designation.
*   **Notifications:** Read System/Faculty `Notifications`.

### Outputs (Student Views)
*   **Digital Profile:** Academic History, Attendance, Fee Receipts.
*   **Exam Results:** Marks Sheets, Quiz Performance.
*   **Placement Status:** Shortlisted/Selected status for Job Applications.
*   **Admission Status:** Inquiry tracking and Enrollment confirmation.
