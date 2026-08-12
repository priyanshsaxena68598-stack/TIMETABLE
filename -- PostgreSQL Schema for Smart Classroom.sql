-- PostgreSQL Schema for Smart Classroom & Timetable Scheduler

-- Enums for Statuses and Roles
CREATE TYPE user_role AS ENUM ('admin', 'hod', 'approver', 'faculty', 'student');
CREATE TYPE room_type AS ENUM ('classroom', 'lab', 'auditorium', 'seminar_hall');
CREATE TYPE schedule_status AS ENUM ('draft', 'under_review', 'approved', 'rejected');
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');

---

-- 1. USERS & ROLES
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. DEPARTMENTS
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE
);

ALTER TABLE users ADD CONSTRAINT fk_user_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;

-- 3. CLASSROOMS & LABS
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL UNIQUE,
    building VARCHAR(50),
    capacity INT NOT NULL CHECK (capacity > 0),
    type room_type NOT NULL DEFAULT 'classroom',
    has_projector BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE
);

-- 4. FACULTY DETAILS
CREATE TABLE faculty (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    department_id INT NOT NULL REFERENCES departments(id),
    max_classes_per_day INT DEFAULT 4,
    max_classes_per_week INT DEFAULT 20,
    avg_monthly_leaves INT DEFAULT 2
);

-- 5. STUDENT BATCHES
CREATE TABLE batches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- e.g., "B.Tech CSE AI/ML - Year 2 - Sec A"
    department_id INT NOT NULL REFERENCES departments(id),
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    student_count INT NOT NULL CHECK (student_count > 0),
    shift_number INT DEFAULT 1 -- Support for multi-shift (1 = Morning, 2 = Evening)
);

-- 6. SUBJECTS / COURSES
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    department_id INT NOT NULL REFERENCES departments(id),
    weekly_theory_hours INT DEFAULT 3,
    weekly_lab_hours INT DEFAULT 0,
    requires_lab BOOLEAN DEFAULT FALSE,
    is_elective BOOLEAN DEFAULT FALSE
);

-- 7. FACULTY-SUBJECT MAPPING (Which faculty can teach which subjects)
CREATE TABLE faculty_subject_qualifications (
    faculty_id INT REFERENCES faculty(id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
    PRIMARY KEY (faculty_id, subject_id)
);

-- 8. TIME SLOTS
CREATE TABLE time_slots (
    id SERIAL PRIMARY KEY,
    day day_of_week NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_number INT NOT NULL, -- e.g., Slot 1 (09:00 - 10:00)
    shift_number INT DEFAULT 1,
    CONSTRAINT check_times CHECK (start_time < end_time)
);

-- 9. FIXED / SPECIAL SLOTS (Hard Constraints)
CREATE TABLE fixed_special_slots (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL, -- e.g., "Departmental Assembly", "Sports Hour"
    batch_id INT REFERENCES batches(id) ON DELETE CASCADE,
    room_id INT REFERENCES rooms(id) ON DELETE SET NULL,
    time_slot_id INT NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE
);

-- 10. GENERATED TIMETABLES (Metadata)
CREATE TABLE timetables (
    id SERIAL PRIMARY KEY,
    academic_year VARCHAR(10) NOT NULL, -- e.g., "2026-2027"
    semester INT NOT NULL,
    status schedule_status DEFAULT 'draft',
    created_by INT REFERENCES users(id),
    approved_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. TIMETABLE ENTRIES (The Schedule Output Grid)
CREATE TABLE timetable_entries (
    id SERIAL PRIMARY KEY,
    timetable_id INT NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
    time_slot_id INT NOT NULL REFERENCES time_slots(id),
    room_id INT NOT NULL REFERENCES rooms(id),
    batch_id INT NOT NULL REFERENCES batches(id),
    subject_id INT NOT NULL REFERENCES subjects(id),
    faculty_id INT NOT NULL REFERENCES faculty(id),
    
    -- Prevent duplicate assignments at the exact same slot
    CONSTRAINT unique_room_slot UNIQUE (timetable_id, time_slot_id, room_id),
    CONSTRAINT unique_faculty_slot UNIQUE (timetable_id, time_slot_id, faculty_id),
    CONSTRAINT unique_batch_slot UNIQUE (timetable_id, time_slot_id, batch_id)
);

---

-- INDEXES FOR SPEEDING UP SOLVER LOOKUPS & GENERATION
CREATE INDEX idx_entries_timetable ON timetable_entries(timetable_id);
CREATE INDEX idx_entries_faculty ON timetable_entries(faculty_id);
CREATE INDEX idx_entries_batch ON timetable_entries(batch_id);
CREATE INDEX idx_entries_room ON timetable_entries(room_id);python -m uvicorn main:app --reload