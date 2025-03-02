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
            getReportById($_GET['id']);
        } else {
            getAllReports();
        }
        break;
    case 'POST':
        createReport();
        break;
    case 'PUT':
        updateReport();
        break;
    case 'DELETE':
        deleteReport();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getAllReports() {
    global $conn;
    
    try {
        $sql = "SELECT * FROM reports ORDER BY created_at DESC";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        
        $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get images for each report
        foreach ($reports as &$report) {
            $sql = "SELECT image_url FROM report_images WHERE report_id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$report['id']]);
            $images = $stmt->fetchAll(PDO::FETCH_COLUMN);
            $report['images'] = $images;
        }
        
        echo json_encode($reports);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function getReportById($id) {
    global $conn;
    
    try {
        $sql = "SELECT * FROM reports WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        
        $report = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$report) {
            http_response_code(404);
            echo json_encode(['error' => 'Report not found']);
            return;
        }
        
        // Get images for the report
        $sql = "SELECT image_url FROM report_images WHERE report_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        $images = $stmt->fetchAll(PDO::FETCH_COLUMN);
        $report['images'] = $images;
        
        echo json_encode($report);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function createReport() {
    global $conn;
    
    // Get JSON data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data']);
        return;
    }
    
    // Validate required fields
    $requiredFields = ['title', 'description', 'category', 'location', 'status'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Missing required field: {$field}"]);
            return;
        }
    }
    
    try {
        $conn->beginTransaction();
        
        // Insert report
        $sql = "INSERT INTO reports (title, description, category, location, status, priority, reporter_id, assigned_to, contact_name, contact_phone, contact_email, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            $data['title'],
            $data['description'],
            $data['category'],
            $data['location'],
            $data['status'],
            $data['priority'] ?? 'low',
            $data['reporter_id'] ?? null,
            $data['assigned_to'] ?? null,
            $data['contact_name'] ?? null,
            $data['contact_phone'] ?? null,
            $data['contact_email'] ?? null
        ]);
        
        $reportId = $conn->lastInsertId();
        
        // Insert images if provided
        if (isset($data['images']) && is_array($data['images']) && count($data['images']) > 0) {
            $sql = "INSERT INTO report_images (report_id, image_url, created_at) VALUES (?, ?, NOW())";
            $stmt = $conn->prepare($sql);
            
            foreach ($data['images'] as $imageUrl) {
                $stmt->execute([$reportId, $imageUrl]);
            }
        }
        
        $conn->commit();
        
        http_response_code(201);
        echo json_encode(['success' => true, 'id' => $reportId, 'message' => 'Report created successfully']);
    } catch (PDOException $e) {
        $conn->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function updateReport() {
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
        
        // Check if report exists
        $sql = "SELECT id FROM reports WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Report not found']);
            return;
        }
        
        // Build update query dynamically based on provided fields
        $updateFields = [];
        $params = [];
        
        $allowedFields = [
            'title', 'description', 'category', 'location', 'status', 
            'priority', 'reporter_id', 'assigned_to', 'contact_name', 
            'contact_phone', 'contact_email'
        ];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $updateFields[] = "{$field} = ?";
                $params[] = $data[$field];
            }
        }
        
        if (empty($updateFields)) {
            http_response_code(400);
            echo json_encode(['error' => 'No fields to update']);
            return;
        }
        
        // Add updated_at and id
        $updateFields[] = "updated_at = NOW()";
        $params[] = $id;
        
        $sql = "UPDATE reports SET " . implode(", ", $updateFields) . " WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        
        // Handle images if provided
        if (isset($data['images']) && is_array($data['images'])) {
            // Delete existing images
            $sql = "DELETE FROM report_images WHERE report_id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$id]);
            
            // Insert new images
            if (count($data['images']) > 0) {
                $sql = "INSERT INTO report_images (report_id, image_url, created_at) VALUES (?, ?, NOW())";
                $stmt = $conn->prepare($sql);
                
                foreach ($data['images'] as $imageUrl) {
                    $stmt->execute([$id, $imageUrl]);
                }
            }
        }
        
        $conn->commit();
        
        echo json_encode(['success' => true, 'message' => 'Report updated successfully']);
    } catch (PDOException $e) {
        $conn->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function deleteReport() {
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
        
        // Delete images first (foreign key constraint)
        $sql = "DELETE FROM report_images WHERE report_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        
        // Delete report
        $sql = "DELETE FROM reports WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() === 0) {
            $conn->rollBack();
            http_response_code(404);
            echo json_encode(['error' => 'Report not found']);
            return;
        }
        
        $conn->commit();
        
        echo json_encode(['success' => true, 'message' => 'Report deleted successfully']);
    } catch (PDOException $e) {
        $conn->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
