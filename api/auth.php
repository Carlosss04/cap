<?php
require_once 'db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($method) {
    case 'POST':
        if ($action === 'register') {
            register();
        } elseif ($action === 'login') {
            login();
        } elseif ($action === 'verify') {
            verifyAdmin();
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
        }
        break;
    case 'GET':
        if ($action === 'verify-status') {
            checkVerificationStatus();
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function register() {
    global $conn;
    
    // Get JSON data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data']);
        return;
    }
    
    // Validate required fields
    $requiredFields = ['name', 'email', 'password', 'role'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Missing required field: {$field}"]);
            return;
        }
    }
    
    // Additional validation for admin role
    if ($data['role'] === 'admin' && (!isset($data['verificationInfo']) || strlen($data['verificationInfo']) < 50)) {
        http_response_code(400);
        echo json_encode(['error' => 'Insufficient verification information for admin role']);
        return;
    }
    
    try {
        // Check if email already exists
        $sql = "SELECT id FROM users WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$data['email']]);
        
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'Email already in use']);
            return;
        }
        
        // Hash password
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        
        // Begin transaction
        $conn->beginTransaction();
        
        // Insert user
        $sql = "INSERT INTO users (name, email, password, role, avatar, phone, barangay, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['email'],
            $hashedPassword,
            $data['role'],
            $data['avatar'] ?? null,
            $data['phone'] ?? null,
            $data['barangay'] ?? null
        ]);
        
        $userId = $conn->lastInsertId();
        
        // For admin registrations, create a verification record
        if ($data['role'] === 'admin' && isset($data['verificationInfo'])) {
            $sql = "INSERT INTO admin_verifications (user_id, verification_info, status, created_at) 
                    VALUES (?, ?, 'pending', NOW())";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$userId, $data['verificationInfo']]);
            
            // Create notification for super admin
            $sql = "INSERT INTO notifications (user_id, title, message, type, related_issue_id, created_at) 
                    VALUES (?, ?, ?, 'info', ?, NOW())";
            
            // Find super admin user ID (assuming ID 1 is super admin)
            $superAdminId = 1;
            
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                $superAdminId,
                'New Admin Verification Request',
                "User {$data['name']} ({$data['email']}) has requested admin access. Please review their verification information.",
                null
            ]);
        }
        
        $conn->commit();
        
        // Return success but don't include password
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => $data['role'] === 'admin' ? 'Registration successful. Your account is pending verification.' : 'Registration successful.',
            'user' => [
                'id' => $userId,
                'name' => $data['name'],
                'email' => $data['email'],
                'role' => $data['role'],
                'verified' => $data['role'] === 'admin' ? false : true
            ]
        ]);
        
    } catch (PDOException $e) {
        if ($conn->inTransaction()) {
            $conn->rollBack();
        }
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function login() {
    global $conn;
    
    // Get JSON data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid login data']);
        return;
    }
    
    try {
        $sql = "SELECT id, name, email, password, role, avatar FROM users WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$data['email']]);
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user || !password_verify($data['password'], $user['password'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid email or password']);
            return;
        }
        
        // Check if admin is verified
        $isVerified = true;
        if ($user['role'] === 'admin') {
            $sql = "SELECT status FROM admin_verifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 1";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$user['id']]);
            $verification = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$verification || $verification['status'] !== 'approved') {
                $isVerified = false;
                
                // If rejected, allow login but with limited access
                if ($verification && $verification['status'] === 'rejected') {
                    http_response_code(403);
                    echo json_encode([
                        'error' => 'Your admin account verification was rejected',
                        'status' => 'rejected'
                    ]);
                    return;
                }
                
                // If pending, show appropriate message
                http_response_code(403);
                echo json_encode([
                    'error' => 'Your admin account is pending verification',
                    'status' => 'pending'
                ]);
                return;
            }
        }
        
        // Remove password from response
        unset($user['password']);
        
        // Add verification status
        $user['verified'] = $isVerified;
        
        // Log login
        $sql = "INSERT INTO user_logins (user_id, login_time, ip_address) VALUES (?, NOW(), ?)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$user['id'], $_SERVER['REMOTE_ADDR']]);
        
        echo json_encode(['success' => true, 'user' => $user]);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function verifyAdmin() {
    global $conn;
    
    // Get JSON data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['userId']) || !isset($data['status']) || !isset($data['notes'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid verification data']);
        return;
    }
    
    // Ensure status is valid
    if (!in_array($data['status'], ['approved', 'rejected'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid status value']);
        return;
    }
    
    try {
        $conn->beginTransaction();
        
        // Update verification status
        $sql = "UPDATE admin_verifications SET status = ?, admin_notes = ?, updated_at = NOW() 
                WHERE user_id = ? AND status = 'pending' ORDER BY created_at DESC LIMIT 1";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$data['status'], $data['notes'], $data['userId']]);
        
        if ($stmt->rowCount() === 0) {
            $conn->rollBack();
            http_response_code(404);
            echo json_encode(['error' => 'No pending verification request found for this user']);
            return;
        }
        
        // Get user details for notification
        $sql = "SELECT name, email FROM users WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$data['userId']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            $conn->rollBack();
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        
        // Create notification for the user
        $sql = "INSERT INTO notifications (user_id, title, message, type, created_at) 
                VALUES (?, ?, ?, ?, NOW())";
        
        $title = $data['status'] === 'approved' ? 'Admin Access Approved' : 'Admin Access Rejected';
        $message = $data['status'] === 'approved' 
            ? 'Your request for admin access has been approved. You now have access to admin features.' 
            : 'Your request for admin access has been rejected. Reason: ' . $data['notes'];
        $type = $data['status'] === 'approved' ? 'success' : 'error';
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([$data['userId'], $title, $message, $type]);
        
        $conn->commit();
        
        echo json_encode([
            'success' => true, 
            'message' => 'Admin verification status updated successfully'
        ]);
        
    } catch (PDOException $e) {
        if ($conn->inTransaction()) {
            $conn->rollBack();
        }
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function checkVerificationStatus() {
    global $conn;
    
    if (!isset($_GET['userId'])) {
        http_response_code(400);
        echo json_encode(['error' => 'User ID is required']);
        return;
    }
    
    $userId = $_GET['userId'];
    
    try {
        // Get user role
        $sql = "SELECT role FROM users WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        
        // If not admin, no verification needed
        if ($user['role'] !== 'admin') {
            echo json_encode(['verified' => true, 'status' => 'not_applicable']);
            return;
        }
        
        // Check verification status
        $sql = "SELECT status, admin_notes, created_at, updated_at FROM admin_verifications 
                WHERE user_id = ? ORDER BY created_at DESC LIMIT 1";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$userId]);
        $verification = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$verification) {
            echo json_encode(['verified' => false, 'status' => 'no_request']);
            return;
        }
        
        $isVerified = $verification['status'] === 'approved';
        
        echo json_encode([
            'verified' => $isVerified,
            'status' => $verification['status'],
            'notes' => $verification['admin_notes'],
            'requestDate' => $verification['created_at'],
            'updatedDate' => $verification['updated_at']
        ]);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
