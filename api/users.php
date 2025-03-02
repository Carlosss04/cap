<?php
require_once 'db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getUserById($_GET['id']);
        } else {
            getAllUsers();
        }
        break;
    case 'POST':
        registerUser();
        break;
    case 'PUT':
        updateUser();
        break;
    case 'DELETE':
        deleteUser();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getAllUsers() {
    global $conn;
    
    try {
        $sql = "SELECT id, name, email, role, avatar, phone, barangay, created_at FROM users";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($users);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function getUserById($id) {
    global $conn;
    
    try {
        $sql = "SELECT id, name, email, role, avatar, phone, barangay, created_at FROM users WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        
        echo json_encode($user);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function registerUser() {
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
    
    // Check if email already exists
    try {
        $sql = "SELECT id FROM users WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$data['email']]);
        
        if ($stmt->fetch()) {
            http_response_code(409); // Conflict
            echo json_encode(['error' => 'Email already in use']);
            return;
        }
        
        // Hash password
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        
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
        }
        
        http_response_code(201);
        echo json_encode([
            'success' => true, 
            'id' => $userId, 
            'message' => 'User registered successfully',
            'user' => [
                'id' => $userId,
                'name' => $data['name'],
                'email' => $data['email'],
                'role' => $data['role'],
                'avatar' => $data['avatar'] ?? null
            ]
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function loginUser() {
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
        if ($user['role'] === 'admin') {
            $sql = "SELECT status FROM admin_verifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 1";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$user['id']]);
            $verification = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$verification || $verification['status'] !== 'approved') {
                http_response_code(403);
                echo json_encode(['error' => 'Admin account pending verification']);
                return;
            }
        }
        
        // Remove password from response
        unset($user['password']);
        
        echo json_encode(['success' => true, 'user' => $user]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function updateUser() {
    global $conn;
    
    // Get JSON data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data or missing ID']);
        return;
    }
    
    $id = $data['id'];
    
    try {
        // Check if user exists
        $sql = "SELECT id FROM users WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        
        // Build update query dynamically based on provided fields
        $updateFields = [];
        $params = [];
        
        $allowedFields = ['name', 'email', 'phone', 'barangay', 'avatar'];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $updateFields[] = "{$field} = ?";
                $params[] = $data[$field];
            }
        }
        
        // Handle password update separately (with hashing)
        if (isset($data['password']) && !empty($data['password'])) {
            $updateFields[] = "password = ?";
            $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        
        if (empty($updateFields)) {
            http_response_code(400);
            echo json_encode(['error' => 'No fields to update']);
            return;
        }
        
        // Add updated_at and id
        $updateFields[] = "updated_at = NOW()";
        $params[] = $id;
        
        $sql = "UPDATE users SET " . implode(", ", $updateFields) . " WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        
        echo json_encode(['success' => true, 'message' => 'User updated successfully']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function deleteUser() {
    global $conn;
    
    // Get JSON data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data or missing ID']);
        return;
    }
    
    $id = $data['id'];
    
    try {
        $conn->beginTransaction();
        
        // Delete user's admin verification requests if any
        $sql = "DELETE FROM admin_verifications WHERE user_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        
        // Delete user
        $sql = "DELETE FROM users WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() === 0) {
            $conn->rollBack();
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        
        $conn->commit();
        
        echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
    } catch (PDOException $e) {
        $conn->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
