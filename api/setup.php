<?php
header('Content-Type: application/json');

// Database configuration
$host = 'localhost';
$dbname = 'community_issues';
$username = 'root';
$password = '';

try {
    // Create connection to MySQL server
    $conn = new PDO("mysql:host=$host", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if it doesn't exist
    $conn->exec("CREATE DATABASE IF NOT EXISTS $dbname");
    echo json_encode(['message' => "Database '$dbname' created or already exists"]);
    
    // Connect to the database
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create reports table
    $conn->exec("CREATE TABLE IF NOT EXISTS reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        location VARCHAR(255) NOT NULL,
        status ENUM('pending', 'in-progress', 'resolved', 'rejected') DEFAULT 'pending',
        priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
        reporter_id INT,
        assigned_to INT,
        images TEXT,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL
    )");
    echo json_encode(['message' => "Table 'reports' created or already exists"]);
    
    // Create notifications table
    $conn->exec("CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('info', 'success', 'warning', 'error', 'update') DEFAULT 'info',
        is_read BOOLEAN DEFAULT FALSE,
        user_id INT,
        sender_id INT,
        related_issue_id INT,
        created_at DATETIME NOT NULL
    )");
    echo json_encode(['message' => "Table 'notifications' created or already exists"]);
    
    // Create comments table
    $conn->exec("CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        report_id INT NOT NULL,
        user_id INT NOT NULL,
        text TEXT NOT NULL,
        created_at DATETIME NOT NULL
    )");
    echo json_encode(['message' => "Table 'comments' created or already exists"]);
    
    // Create users table
    $conn->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('resident', 'admin', 'staff') DEFAULT 'resident',
        avatar VARCHAR(255),
        created_at DATETIME NOT NULL
    )");
    echo json_encode(['message' => "Table 'users' created or already exists"]);
    
    // Insert sample data
    // Sample users
    $conn->exec("INSERT INTO users (name, email, password, role, created_at) VALUES 
        ('Admin User', 'admin@example.com', '" . password_hash('password', PASSWORD_DEFAULT) . "', 'admin', NOW()),
        ('Juan Dela Cruz', 'juan@example.com', '" . password_hash('password', PASSWORD_DEFAULT) . "', 'resident', NOW()),
        ('Maria Santos', 'maria@example.com', '" . password_hash('password', PASSWORD_DEFAULT) . "', 'resident', NOW()),
        ('Engineer Reyes', 'reyes@lgu.gov.ph', '" . password_hash('password', PASSWORD_DEFAULT) . "', 'staff', NOW())
    ");
    
    // Sample reports
    $conn->exec("INSERT INTO reports (title, description, category, location, status, priority, reporter_id, images, created_at, updated_at) VALUES 
        ('Pothole on Main Street', 'Large pothole causing traffic and potential vehicle damage near the intersection.', 'Road Damage', 'Main St, near Central Park', 'pending', 'high', 2, '[]', NOW(), NOW()),
        ('Clogged Storm Drain', 'Storm drain is completely blocked causing flooding during rain.', 'Drainage', 'Oak Avenue, beside Community Center', 'in-progress', 'critical', 3, '[]', NOW(), NOW()),
        ('Street Light Not Working', 'Street light has been out for over a week creating safety concerns at night.', 'Electricity', 'Pine Street, corner of 5th Avenue', 'resolved', 'medium', 2, '[]', NOW(), NOW())
    ");
    
    // Sample notifications
    $conn->exec("INSERT INTO notifications (title, message, type, is_read, user_id, related_issue_id, created_at) VALUES 
        ('Issue Status Updated', 'The pothole report on Main Street has been marked as \'In Progress\'.', 'update', false, 2, 1, NOW()),
        ('Issue Resolved', 'The street light repair on Oak Avenue has been completed.', 'success', false, 3, 2, NOW()),
        ('New Comment', 'Juan Dela Cruz commented on your drainage issue report.', 'info', true, 3, 2, NOW())
    ");
    
    echo json_encode(['success' => true, 'message' => 'Database setup completed successfully']);
    
} catch(PDOException $e) {
    echo json_encode(['error' => 'Database setup failed: ' . $e->getMessage()]);
}
?>