-- ====================================================================
-- GRIEVORA: Initial Development Seed Data
-- BCrypt password for all sample accounts: 'Password@123'
-- Hash: $2a$10$w6D9zDkL4jLhM8w7vN54cO/q08aFfBupSreS7m9oN3K1H.m8I0l8u
-- ====================================================================

-- 1. Departments
INSERT IGNORE INTO departments (id, name, code, description, contact_email, head_of_department) VALUES
(1, 'Electrical & Power Systems', 'ELE-DEPT', 'Maintenance of classroom wiring, projectors, AC units, elevators, and backup generators.', 'electrical@grievora.edu', 'Er. Suresh K.'),
(2, 'Plumbing & Water Supply', 'PLUMB-DEPT', 'Restroom fittings, drinking water filters, overhead tanks, and campus drainage.', 'plumbing@grievora.edu', 'Mr. Ramesh Patil'),
(3, 'IT & Campus Network Services', 'IT-DEPT', 'Campus Wi-Fi hotspots, computer lab LAN, institutional portal, and smart board connectivity.', 'itsupport@grievora.edu', 'Dr. Arvind Sharma'),
(4, 'Civil & Infrastructure Maintenance', 'CIVIL-DEPT', 'Desk repairs, blackboard/whiteboard fixtures, window panes, door locks, and structural repairs.', 'infra@grievora.edu', 'Er. Meenakshi Sundaram'),
(5, 'Sanitation & Housekeeping', 'SAN-DEPT', 'Classroom cleanliness, campus waste segregation, washroom hygiene, and pest control.', 'sanitation@grievora.edu', 'Mrs. Sunita Devi'),
(6, 'Campus Safety & Vigilance', 'SEC-DEPT', 'CCTV monitoring, hostel security guards, campus lighting, and fire extinguisher inspection.', 'security@grievora.edu', 'Col. R. S. Rathore');

-- 2. Users (Admin, Faculty, Student, Staff)
-- Passwords are all: Password@123
INSERT IGNORE INTO users (id, full_name, institutional_id, email, password_hash, role, department_id, phone_number, active) VALUES
(1, 'Rajesh Verma (Chief Warden / Admin)', 'ADM-001', 'admin@grievora.edu', '$2a$10$w6D9zDkL4jLhM8w7vN54cO/q08aFfBupSreS7m9oN3K1H.m8I0l8u', 'ADMIN', 4, '+91 98765 43210', TRUE),
(2, 'Dr. Rajiv Menon', 'FAC-204', 'rajiv.menon@grievora.edu', '$2a$10$w6D9zDkL4jLhM8w7vN54cO/q08aFfBupSreS7m9oN3K1H.m8I0l8u', 'FACULTY', 3, '+91 98765 43211', TRUE),
(3, 'Rakshana', '310625205222', 'rakshana@grievora.edu', '$2a$10$w6D9zDkL4jLhM8w7vN54cO/q08aFfBupSreS7m9oN3K1H.m8I0l8u', 'STUDENT', 3, '+91 98765 43212', TRUE),
(4, 'Kavita Nair (Staff Engineer)', 'STF-102', 'kavita.nair@grievora.edu', '$2a$10$w6D9zDkL4jLhM8w7vN54cO/q08aFfBupSreS7m9oN3K1H.m8I0l8u', 'ADMIN', 1, '+91 98765 43213', TRUE),
(5, 'Rohan Deshmukh', 'STU-2023-45', 'rohan.deshmukh@grievora.edu', '$2a$10$w6D9zDkL4jLhM8w7vN54cO/q08aFfBupSreS7m9oN3K1H.m8I0l8u', 'STUDENT', 1, '+91 98765 43214', TRUE);

-- 3. Initial Sample Complaints
INSERT IGNORE INTO complaints (id, complaint_reference, title, description, category, location, building, floor_or_room, priority, urgency_reason, status, submitted_by, assigned_to, assigned_department_id, submitted_at, updated_at) VALUES
(1, 'GRV-2026-0001', 'Smart Classroom 402 Ceiling Projector Flickering', 'The overhead HDMI projector keeps dropping signal every 3 minutes during lectures, disrupting continuous slides and interactive demonstrations.', 'Classroom Equipment', 'Academic Block A', 'Block A', 'Room 402, 4th Floor', 'HIGH', NULL, 'IN_PROGRESS', 2, 4, 1, '2026-10-10 09:30:00', '2026-10-12 11:15:00'),
(2, 'GRV-2026-0002', 'Main Library 2nd Floor High-Speed Wi-Fi Disconnecting', 'Access point AP-LIB-2B is continuously rebooting, causing 80+ students studying in the digital reference zone to lose internet connectivity.', 'Internet and Wi-Fi', 'Central Library', 'Library Complex', '2nd Floor Reading Hall', 'URGENT', 'Midterm examination submissions are due tonight and 80+ students are unable to upload research drafts.', 'UNDER_REVIEW', 3, NULL, 3, '2026-10-13 14:20:00', '2026-10-13 15:00:00'),
(3, 'GRV-2026-0003', 'Hostel Block C 3rd Floor Water Leakage', 'Water is leaking continuously from the washroom pipe joint near Room 314, causing pooling in the corridor and slipping hazard.', 'Plumbing and Water Supply', 'Hostel Zone', 'Hostel Block C', 'Corridor outside Room 314', 'URGENT', 'Water seepage risk and student slipping hazard in night hours.', 'ASSIGNED', 3, 1, 2, '2026-10-11 18:00:00', '2026-10-12 09:00:00'),
(4, 'GRV-2026-0004', 'Broken Lab Stools in Advanced Chemistry Lab 2', 'Four wooden stools have loosened leg joints and wobbly seats, risking chemical spillage if a student falls while handling reagents.', 'Laboratory Equipment', 'Science & Innovation Center', 'Block D', 'Chemistry Lab 2, Ground Floor', 'MEDIUM', NULL, 'RESOLVED', 2, 1, 4, '2026-10-08 10:00:00', '2026-10-10 16:30:00');

-- 4. Status History
INSERT IGNORE INTO complaint_status_history (id, complaint_id, previous_status, new_status, changed_by, public_message, changed_at) VALUES
(1, 1, NULL, 'SUBMITTED', 2, 'Complaint logged into Grievora system.', '2026-10-10 09:30:00'),
(2, 1, 'SUBMITTED', 'UNDER_REVIEW', 1, 'Ticket verified by Chief Warden Office.', '2026-10-10 11:00:00'),
(3, 1, 'UNDER_REVIEW', 'ASSIGNED', 1, 'Assigned to Electrical Dept (Staff: Kavita Nair).', '2026-10-11 10:00:00'),
(4, 1, 'ASSIGNED', 'IN_PROGRESS', 4, 'Replacement HDMI switcher ordered from vendor; technician on-site.', '2026-10-12 11:15:00'),
(5, 2, NULL, 'SUBMITTED', 3, 'Complaint logged into Grievora system with Urgent tag.', '2026-10-13 14:20:00'),
(6, 2, 'SUBMITTED', 'UNDER_REVIEW', 1, 'Escalated to IT Network Services due to midterm deadline impact.', '2026-10-13 15:00:00'),
(7, 4, NULL, 'SUBMITTED', 2, 'Complaint logged.', '2026-10-08 10:00:00'),
(8, 4, 'SUBMITTED', 'IN_PROGRESS', 1, 'Carpentry and infrastructure team dispatched with replacement ergonomic stools.', '2026-10-09 10:00:00'),
(9, 4, 'IN_PROGRESS', 'RESOLVED', 1, 'All 4 damaged stools replaced with heavy-duty laboratory chairs. Verified with Lab In-Charge.', '2026-10-10 16:30:00');

-- 5. Notifications
INSERT IGNORE INTO notifications (id, recipient_id, complaint_id, title, message, is_read, created_at) VALUES
(1, 2, 1, 'Status Update: Projector Flickering', 'Your complaint GRV-2026-0001 is now IN_PROGRESS with Electrical Dept.', FALSE, '2026-10-12 11:15:00'),
(2, 3, 2, 'Urgent Complaint Under Review', 'Ticket GRV-2026-0002 has been flagged for rapid IT network evaluation.', FALSE, '2026-10-13 15:00:00'),
(3, 1, 2, 'New Urgent Complaint Submitted', 'Student Rakshana submitted an Urgent ticket for Central Library Wi-Fi.', FALSE, '2026-10-13 14:20:00');
