<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
header('Access-Control-Allow-Origin: *');

// Database configuration
$host = 'localhost';
$dbname = 'community_issues';
$username = 'root';
$password = '';

// Function to send SSE message
function sendSSE($id, $data) {
    echo "id: $id" . PHP_EOL;
    echo "data: $data" . PHP_EOL;
    echo PHP_EOL;
    ob_flush();
    flush();
}

// Keep track of last notification ID
$lastId = 0;

// Check for new notifications every 3 seconds
while (true) {
    try {
        // Connect to database
        $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Get new notifications
        $stmt = $conn->prepare("SELECT * FROM notifications WHERE id > ? ORDER BY id DESC LIMIT 10");
        $stmt->execute([$lastId]);
        $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Send new notifications
        foreach ($notifications as $notification) {
            if ($notification['id'] > $lastId) {
                $lastId = $notification['id'];
                sendSSE($notification['id'], json_encode($notification));
            }
        }
        
        // Close connection
        $conn = null;
    } catch (PDOException $e) {
        // Log error but continue
        error_log('SSE Error: ' . $e->getMessage());
    }
    
    // Prevent CPU hogging
    sleep(3);
}
?>