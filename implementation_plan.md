# Implementation Plan - Intelligent Campus Management System (ICMS)

## Goal Description
To design and architect a professional, scalable Intelligent Campus Management System (ICMS) that automates academic and administrative operations. The system will use a 3-tier architecture with React.js (Frontend), Express.js (Business Logic), and PostgreSQL (Data Layer). **The frontend will be designed as a Mobile-First Web Application (PWA) to simulate a native mobile experience.**

## User Review Required
> [!IMPORTANT]
> **Existing UI Integration**: You mentioned having a UI layout in a GitHub repo. Please provide the link so we can assess how to integrate it into the `frontend` structure.

> [!NOTE]
> **Tech Stack Clarification**: The prompt mentioned "Backend: Next.js" but the folder structure and "Business Logic Layer" specified `Express.js`. I have opted for **React (Vite) + Express.js** to strictly follow the "3-Tier Architecture" and "Folder Structure" requirements provided. Next.js is typically full-stack or frontend-focused.

## Architecture Design

### High-Level Overview
- **Frontend**: React.js SPA (Single Page Application) using Vite.
    - **Strategy**: **Mobile-First Design** (Responsive, Bottom Navigation for mobile, Touch-friendly).
    - **State**: Redux Toolkit for complex global state (Auth, UI Data).
    - **UI**: **Vibrant Mobile-First "Super App" Design** (Inspired by Consumer Apps).
        - **Theme**: High-contrast, vibrant colors (Electric Blue, Bright Orange) + Glassmorphism.
        - **Layout**: 
            - **Header**: User Greeting + Global Search Bar.
            - **Hero Section**: Carousel Banners (Notices, Exam Dates).
            - **Grid Navigation**: 2x2 Cards for core modules (Attendance, Results, Library).
            - **Horizontal Feeds**: "Today's Schedule", "Pending Tasks".
        - **Navigation**: Bottom Navigation Bar.
    - **Login Revamp**:
        - **Style**: Vibrant Gradient Background + Glassmorphism.
        - **Features**: Social Login Style Buttons, Floating Labels, Smooth Animations.
- **Backend**: Node.js with Express.js.
    - **Auth**: JWT (JSON Web Tokens) with Bcrypt for hashing.
    - **Docs**: Swagger/OpenAPI.
- **Database**: PostgreSQL (Relational Data + JSONB for unstructured data).
    - **PostgreSQL**: Users, Students, Courses, Fees, Exams, Logs, Notifications.
- **DevOps**: Local Node.js + Local Database (PostgreSQL/MongoDB).

### Folder Structure
```text
project-root/
├── .gitignore
├── README.md
├── docker-compose.yml
├── frontend/                 # Presentation Layer
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/       # Reusable UI components (Sidebar, StatsCard, GlassCard)
│       ├── pages/            # Route components (Dashboard, Login)
│       ├── services/         # API calls (Axios instances)
│       ├── redux/            # State management (slices, store)
│       ├── hooks/            # Custom React hooks
│       ├── utils/            # Helpers
│       └── App.js
└── backend/                  # Business Logic Layer
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── config/           # DB connections, Env vars
        ├── controllers/      # Request handlers
        ├── models/           # Sequelize/Mongoose models
        ├── routes/           # API definitions
        ├── middleware/       # Auth, Validation, Error handling
        ├── services/         # Business logic separate from controllers
        ├── utils/            # Helper functions
        └── server.js         # Entry point
```

## Database Schema Design

### PostgreSQL (Relational)
*Primary store for structured academic data.*

**1. users**
- `id` (PK, UUID)
- `email` (Unique)
- `password_hash`
- `role` (Enum: SUPER_ADMIN, ADMIN, FACULTY, STUDENT, LIBRARIAN, ACCOUNTANT)
- `is_active` (Boolean)
- `created_at`, `updated_at`

**2. students**
- `id` (PK, UUID)
- `user_id` (FK -> users.id)
- `enrollment_no` (Unique)
- `first_name`, `last_name`
- `dob`, `gender`
- `contact_email`, `phone`
- `department_id` (FK)
- `current_semester`
- `photo_url`

**3. faculty**
- `id` (PK, UUID)
- `user_id` (FK -> users.id)
- `employee_id` (Unique)
- `designation`
- `department_id` (FK)
- `specialization`

**4. courses** (Programs like "B.Tech CSV")
- `id` (PK)
- `code`, `name`
- `duration_years`

**5. subjects**
- `id` (PK)
- `code`, `name`
- `credits`
- `semester`
- `course_id` (FK)

**6. faculty_allocations**
- `id`
- `faculty_id` (FK)
- `subject_id` (FK)
- `academic_year`
- `semester`

**7. attendance**
- `id`
- `student_id` (FK)
- `subject_id` (FK)
- `date`
- `status` (PRESENT, ABSENT, LATE)
- `marked_by` (FK -> faculty.id)

**8. fees_payments**
- `id`
- `student_id` (FK)
- `amount_paid`
- `transaction_id`
- `payment_date`
- `status`
- `type` (Tuition, Library, Exam)

### PostgreSQL (Unstructured/Logs)
*Using JSONB or separate tables instead of MongoDB.*

**1. notifications**
- `id`
- `recipient_user_id`
- `message`
- `read_status`
- `type`
- `created_at`

**2. system_logs**
- `id`
- `user_id`
- `action`
- `timestamp`
- `metadata` (JSONB)

## API Endpoints (Preview)

- **Auth**: `POST /api/auth/login`, `POST /api/auth/refresh`
- **Students**:
    - `GET /api/students` (Filter/Paginate)
    - `POST /api/students` (Create)
    - `GET /api/students/:id`
    - `PUT /api/students/:id`
- **Attendance**:
    - `POST /api/attendance` (Bulk mark)
    - `GET /api/attendance/report?student_id=X`
- **Dashboards**:
    - `GET /api/dashboard/stats` (Role-dependent)

## Setup & Deployment Strategy
1. **Local Development**:
   - `npm install` in both folders.
   - Run databases via `docker-compose up db`.
   - Run backend `npm run dev`.
   - Run frontend `npm run dev`.
2. **Production**:
   - Deploy as a standard Node.js application (PM2/Nginx).
   - Static build for Frontend served via Nginx/Apache.

## Verification Plan

### Automated Tests
- **Backend Unit Tests**: Jest for Controllers/Services.
- **Integration Tests**: Supertest for API endpoints (Auth flow, CRUD).

### Manual Verification
- **Role Verification**: Log in as each role and ensure dashboard access is restricted correctly.
- **Workflow**:
    1. Admin creates a Student and Faculty.
    2. Admin allocates Subject to Faculty.
    3. Faculty marks Attendance.
    4. Student views Attendance.
