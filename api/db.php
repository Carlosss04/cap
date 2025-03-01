<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Database configuration
$host = 'localhost';
$dbname = 'community_issues';
$username = 'root';
$password = '';

// Create database connection
function getConnection() {
    global $host, $dbname, $username, $password;
    
    try {
        $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch(PDOException $e) {
        echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
        exit();
    }
}

// Get request method and route
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$resource = array_shift($request);
$id = null;

if (count($request) > 0) {
    $id = array_shift($request);
}

// Handle different API endpoints
switch($resource) {
    case 'reports':
        handleReports($method, $id);
        break;
    case 'notifications':
        handleNotifications($method, $id);
        break;
    default:
        echo json_encode(['error' => 'Invalid resource']);
        break;
}

// Handle reports endpoints
function handleReports($method, $id) {
    $conn = getConnection();
    
    switch($method) {
        case 'GET':
            if ($id) {
                // Get specific report
                $stmt = $conn->prepare("SELECT * FROM reports WHERE id = ?");
                $stmt->execute([$id]);
                $report = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($report) {
                    echo json_encode($report);
                } else {
                    echo json_encode(['error' => 'Report not found']);
                }
            } else {
                // Get all reports
                $stmt = $conn->query("SELECT * FROM reports ORDER BY created_at DESC");
                $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($reports);
            }
            break;
            
        case 'POST':
            // Create new report
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data) {
                echo json_encode(['error' => 'Invalid data']);
                break;
            }
            
            try {
                $stmt = $conn->prepare("INSERT INTO reports (title, description, category, location, status, reporter_id, images, created_at, updated_at) 
                                        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");
                                        
                $stmt->execute([
                    $data['title'],
                    $data['description'],
                    $data['category'],
                    $data['location'],
                    'pending', // Default status
                    $data['reporter_id'] ?? 1, // Default reporter ID if not provided
                    json_encode($data['images'] ?? []),
                ]);
                
                $reportId = $conn->lastInsertId();
                
                // Create notification for new report
                createNotification([
                    'title' => 'New Report Submitted',
                    'message' => "A new report '{$data['title']}' has been submitted.",
                    'type' => 'info',
                    'related_issue_id' => $reportId
                ]);
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Report created successfully',
                    'id' => $reportId
                ]);
            } catch(PDOException $e) {
                echo json_encode(['error' => 'Failed to create report: ' . $e->getMessage()]);
            }
            break;
            
        case 'PUT':
            // Update report
            if (!$id) {
                echo json_encode(['error' => 'Report ID is required']);
                break;
            }
            
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data) {
                echo json_encode(['error' => 'Invalid data']);
                break;
            }
            
            try {
                // Get current report data for notification
                $stmtGet = $conn->prepare("SELECT title, status FROM reports WHERE id = ?");
                $stmtGet->execute([$id]);
                $currentReport = $stmtGet->fetch(PDO::FETCH_ASSOC);
                
                // Build update query dynamically based on provided fields
                $fields = [];
                $values = [];
                
                foreach ($data as $key => $value) {
                    if ($key !== 'id') { // Skip the ID field
                        $fields[] = "$key = ?";
                        $values[] = $value;
                    }
                }
                
                $fields[] = "updated_at = NOW()";
                $values[] = $id; // Add ID for WHERE clause
                
                $stmt = $conn->prepare("UPDATE reports SET " . implode(", ", $fields) . " WHERE id = ?");
                $stmt->execute($values);
                
                // Create notification for status change
                if (isset($data['status']) && $data['status'] !== $currentReport['status']) {
                    createNotification([
                        'title' => 'Report Status Updated',
                        'message' => "The report '{$currentReport['title']}' has been updated to '{$data['status']}'.",
                        'type' => 'update',
                        'related_issue_id' => $id
                    ]);
                }
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Report updated successfully'
                ]);
            } catch(PDOException $e) {
                echo json_encode(['error' => 'Failed to update report: ' . $e->getMessage()]);
            }
            break;
            
        case 'DELETE':
            // Delete report
            if (!$id) {
                echo json_encode(['error' => 'Report ID is required']);
                break;
            }
            
            try {
                // Get report title for notification
                $stmtGet = $conn->prepare("SELECT title FROM reports WHERE id = ?");
                $stmtGet->execute([$id]);
                $report = $stmtGet->fetch(PDO::FETCH_ASSOC);
                
                $stmt = $conn->prepare("DELETE FROM reports WHERE id = ?");
                $stmt->execute([$id]);
                
                if ($stmt->rowCount() > 0) {
                    // Create notification for report deletion
                    createNotification([
                        'title' => 'Report Deleted',
                        'message' => "The report '{$report['title']}' has been deleted.",
                        'type' => 'warning',
                        'related_issue_id' => $id
                    ]);
                    
                    echo json_encode([
                        'success' => true,
                        'message' => 'Report deleted successfully'
                    ]);
                } else {
                    echo json_encode(['error' => 'Report not found']);
                }
            } catch(PDOException $e) {
                echo json_encode(['error' => 'Failed to delete report: ' . $e->getMessage()]);
            }
            break;
            
        default:
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
}

// Handle notifications endpoints
function handleNotifications($method, $id) {
    $conn = getConnection();
    
    switch($method) {
        case 'GET':
            if ($id) {
                // Get specific notification
                $stmt = $conn->prepare("SELECT * FROM notifications WHERE id = ?");
                $stmt->execute([$id]);
                $notification = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($notification) {
                    echo json_encode($notification);
                } else {
                    echo json_encode(['error' => 'Notification not found']);
                }
            } else {
                // Get all notifications
                $stmt = $conn->query("SELECT * FROM notifications ORDER BY created_at DESC");
                $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($notifications);
            }
            break;
            
        case 'PUT':
            // Mark notification as read
            if (!$id) {
                echo json_encode(['error' => 'Notification ID is required']);
                break;
            }
            
            $data = json_decode(file_get_contents('php://input'), true);
            
            try {
                $stmt = $conn->prepare("UPDATE notifications SET is_read = ? WHERE id = ?");
                $stmt->execute([$data['is_read'] ?? true, $id]);
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Notification updated successfully'
                ]);
            } catch(PDOException $e) {
                echo json_encode(['error' => 'Failed to update notification: ' . $e->getMessage()]);
            }
            break;
            
        case 'DELETE':
            // Delete notification
            if (!$id) {
                echo json_encode(['error' => 'Notification ID is required']);
                break;
            }
            
            try {
                $stmt = $conn->prepare("DELETE FROM notifications WHERE id = ?");
                $stmt->execute([$id]);
                
                if ($stmt->rowCount() > 0) {
                    echo json_encode([
                        'success' => true,
                        'message' => 'Notification deleted successfully'
                    ]);
                } else {
                    echo json_encode(['error' => 'Notification not found']);
                }
            } catch(PDOException $e) {
                echo json_encode(['error' => 'Failed to delete notification: ' . $e->getMessage()]);
            }
            break;
            
        default:
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
}

// Helper function to create notifications
function createNotification($data) {
    $conn = getConnection();
    
    try {
        $stmt = $conn->prepare("INSERT INTO notifications (title, message, type, is_read, related_issue_id, created_at) 
                                VALUES (?, ?, ?, ?, ?, NOW())");
                                
        $stmt->execute([
            $data['title'],
            $data['message'],
            $data['type'] ?? 'info',
            false, // Default to unread
            $data['related_issue_id'] ?? null,
        ]);
        
        return $conn->lastInsertId();
    } catch(PDOException $e) {
        // Log error but don't stop execution
        error_log('Failed to create notification: ' . $e->getMessage());
        return false;
    }
}
?>