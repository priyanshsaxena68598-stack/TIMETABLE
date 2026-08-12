-- 02_seed.sql: Initial Test Data

-- 1. Insert Departments
INSERT INTO departments (name, code) VALUES
('Computer Science & Engineering', 'CSE'),
('Mechanical Engineering', 'ME');

-- 2. Insert Test Users
INSERT INTO users (full_name, email, password_hash, role, department_id) VALUES
('Admin User', 'admin@institute.edu', 'hashed_pass_123', 'admin', 1),
('Dr. Ramesh Kumar', 'ramesh@institute.edu', 'hashed_pass_123', 'faculty', 1),
('Dr. Priya Sharma', 'priya@institute.edu', 'hashed_pass_123', 'faculty', 1);

-- 3. Insert Faculty Profiles
INSERT INTO faculty (user_id, department_id, max_classes_per_day, max_classes_per_week) VALUES
(2, 1, 4, 18),
(3, 1, 4, 18);

-- 4. Insert Rooms
INSERT INTO rooms (room_number, building, capacity, type, has_projector) VALUES
('C-101', 'Academic Block A', 60, 'classroom', TRUE),
('C-102', 'Academic Block A', 60, 'classroom', TRUE),
('LAB-201', 'Tech Center', 30, 'lab', TRUE);

-- 5. Insert Student Batches
INSERT INTO batches (name, department_id, semester, student_count, shift_number) VALUES
('B.Tech CSE AI/ML - Year 2 - Sec A', 1, 3, 55, 1),
('B.Tech CSE AI/ML - Year 2 - Sec B', 1, 3, 50, 1);

-- 6. Insert Subjects
INSERT INTO subjects (code, name, department_id, weekly_theory_hours, weekly_lab_hours, requires_lab) VALUES
('CS201', 'Data Structures & Algorithms', 1, 3, 2, TRUE),
('CS202', 'Database Management Systems', 1, 3, 2, TRUE),
('MA201', 'Discrete Mathematics', 1, 4, 0, FALSE);

-- 7. Insert Time Slots
INSERT INTO time_slots (day, start_time, end_time, slot_number) VALUES
('monday', '09:00:00', '10:00:00', 1),
('monday', '10:00:00', '11:00:00', 2),
('monday', '11:15:00', '12:15:00', 3),
('monday', '12:15:00', '13:15:00', 4),
('tuesday', '09:00:00', '10:00:00', 1),
('tuesday', '10:00:00', '11:00:00', 2);