-- Create database
CREATE DATABASE IF NOT EXISTS community_issues;
USE community_issues;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('resident', 'admin', 'staff') NOT NULL DEFAULT 'resident',
    avatar VARCHAR(255),
    phone VARCHAR(20),
    barangay VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admin verification table
CREATE TABLE IF NOT EXISTS admin_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    verification_info TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    status ENUM('pending', 'in-progress', 'resolved', 'rejected') NOT NULL DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'low',
    reporter_id INT,
    assigned_to INT,
    contact_name VARCHAR(100),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- Report images table
CREATE TABLE IF NOT EXISTS report_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT NOT NULL,
    user_id INT,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Activity log table
CREATE TABLE IF NOT EXISTS activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT NOT NULL,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error', 'update') NOT NULL DEFAULT 'info',
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    related_issue_id INT,
    sender_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_issue_id) REFERENCES reports(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert sample users
INSERT INTO users (name, email, password, role, avatar, phone, barangay) VALUES
('Juan Dela Cruz', 'juan@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'resident', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan', '09123456789', 'Barangay A'),
('Admin User', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', '09987654321', 'Barangay B'),
('Staff Member', 'staff@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Staff', '09456789123', 'Barangay C');

-- Insert sample reports
INSERT INTO reports (title, description, category, location, status, priority, reporter_id, assigned_to, contact_name, contact_phone, contact_email) VALUES
('Pothole on Main Street', 'Large pothole causing traffic and potential vehicle damage near the intersection.', 'Road Damage', 'Main St, near Central Park', 'pending', 'high', 1, NULL, 'Juan Dela Cruz', '09123456789', 'juan@example.com'),
('Clogged Storm Drain', 'Storm drain is completely blocked causing flooding during rain.', 'Drainage', 'Oak Avenue, beside Community Center', 'in-progress', 'critical', 1, 3, 'Juan Dela Cruz', '09123456789', 'juan@example.com'),
('Street Light Not Working', 'Street light has been out for over a week creating safety concerns at night.', 'Electricity', 'Pine Street, corner of 5th Avenue', 'resolved', 'medium', 1, 3, 'Juan Dela Cruz', '09123456789', 'juan@example.com'),
('Water Main Leak', 'Water leaking from main pipe causing low water pressure in the neighborhood.', 'Water Supply', 'Maple Drive, near Elementary School', 'pending', 'high', 1, NULL, 'Juan Dela Cruz', '09123456789', 'juan@example.com'),
('Overflowing Garbage Bin', 'Public garbage bin hasn\'t been collected for days and is overflowing.', 'Waste Management', 'Cedar Boulevard, Public Park', 'rejected', 'low', 1, 3, 'Juan Dela Cruz', '09123456789', 'juan@example.com');

-- Insert sample report images
INSERT INTO report_images (report_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1584463699057-a0c95a5a4e68?q=80&w=500&auto=format&fit=crop'),
(2, 'https://images.unsplash.com/photo-1594749794743-2c1199a4a7e1?q=80&w=500&auto=format&fit=crop'),
(3, 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=500&auto=format&fit=crop'),
(4, 'https://images.unsplash.com/photo-1584463699057-a0c95a5a4e68?q=80&w=500&auto=format&fit=crop'),
(5, 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?q=80&w=500&auto=format&fit=crop');

-- Insert sample comments
INSERT INTO comments (report_id, user_id, text) VALUES
(1, 1, 'This pothole damaged my car tire yesterday.'),
(1, 3, 'We will schedule repairs for next week.'),
(2, 3, 'Our team will be there tomorrow to clear the drain.'),
(2, 1, 'Thank you for the quick response!'),
(3, 3, 'The street light has been fixed.'),
(3, 1, 'Confirmed, it\'s working now. Thank you!');

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, is_read, related_issue_id, sender_id) VALUES
(1, 'Status Update', 'Your report #2 has been updated to "In Progress"', 'info', 0, 2, 3),
(1, 'New Comment', 'Staff Member commented on your report', 'info', 0, 1, 3),
(1, 'Report Resolved', 'Your report #3 has been marked as resolved', 'success', 0, 3, 3),
(3, 'New Report Assigned', 'You have been assigned to report #2', 'info', 1, 2, 2),
(2, 'New Report', 'A new report has been submitted', 'info', 0, 1, NULL);

-- Insert sample activity logs
INSERT INTO activity_log (report_id, user_id, action, details) VALUES
(1, 1, 'created', 'Report created'),
(2, 1, 'created', 'Report created'),
(2, 2, 'assigned', 'Assigned to Staff Member'),
(2, 3, 'status_changed', 'Status changed from "Pending" to "In Progress"'),
(3, 1, 'created', 'Report created'),
(3, 3, 'status_changed', 'Status changed from "In Progress" to "Resolved"');
