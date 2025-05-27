<?php
session_start();
require_once '../crypto_operations.php';

header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

$userId = $_SESSION['user_id'];

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Load cryptocurrency data
        $data = loadCryptoData($userId);
        if ($data === false) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to load data']);
            exit;
        }
        echo json_encode($data);
        break;
        
    case 'POST':
        // Save cryptocurrency data
        $input = json_decode(file_get_contents('php://input'), true);
        if ($input === null) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid input']);
            exit;
        }
        
        if (saveCryptoData($userId, $input)) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save data']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?> 