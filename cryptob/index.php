<?php
session_start();
require_once 'db_connection.php';

// Function to save cryptocurrency data
function saveCryptoData($userId, $cryptoData) {
    global $pdo;
    
    try {
        // Begin transaction
        $pdo->beginTransaction();
        
        // Save cryptocurrency amounts
        $stmt = $pdo->prepare("INSERT INTO crypto_holdings (user_id, crypto_id, amount, current_price, price_change) 
                              VALUES (:user_id, :crypto_id, :amount, :current_price, :price_change)
                              ON DUPLICATE KEY UPDATE 
                              amount = :amount,
                              current_price = :current_price,
                              price_change = :price_change");
        
        foreach ($cryptoData['holdings'] as $crypto) {
            $stmt->execute([
                'user_id' => $userId,
                'crypto_id' => $crypto['id'],
                'amount' => $crypto['amount'],
                'current_price' => $crypto['currentPrice'],
                'price_change' => $crypto['change']
            ]);
        }
        
        // Save price history
        $stmt = $pdo->prepare("INSERT INTO price_history (user_id, crypto_id, price, timestamp) 
                              VALUES (:user_id, :crypto_id, :price, :timestamp)");
        
        foreach ($cryptoData['priceHistory'] as $cryptoId => $history) {
            foreach ($history as $point) {
                $stmt->execute([
                    'user_id' => $userId,
                    'crypto_id' => $cryptoId,
                    'price' => $point['price'],
                    'timestamp' => $point['time']
                ]);
            }
        }
        
        // Save transactions
        $stmt = $pdo->prepare("INSERT INTO transactions (user_id, crypto_id, amount, price, type, date) 
                              VALUES (:user_id, :crypto_id, :amount, :price, :type, :date)");
        
        foreach ($cryptoData['transactions'] as $tx) {
            $stmt->execute([
                'user_id' => $userId,
                'crypto_id' => strtolower($tx['currency']),
                'amount' => $tx['amount'],
                'price' => $tx['price'],
                'type' => $tx['type'],
                'date' => $tx['date']
            ]);
        }
        
        // Commit transaction
        $pdo->commit();
        return true;
    } catch (Exception $e) {
        // Rollback transaction on error
        $pdo->rollBack();
        return false;
    }
}

// Function to load cryptocurrency data
function loadCryptoData($userId) {
    global $pdo;
    
    try {
        $data = [
            'holdings' => [],
            'priceHistory' => [],
            'transactions' => []
        ];
        
        // Load cryptocurrency holdings
        $stmt = $pdo->prepare("SELECT * FROM crypto_holdings WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $userId]);
        $holdings = $stmt->fetchAll();
        
        foreach ($holdings as $holding) {
            $data['holdings'][$holding['crypto_id']] = [
                'id' => $holding['crypto_id'],
                'amount' => $holding['amount'],
                'currentPrice' => $holding['current_price'],
                'change' => $holding['price_change']
            ];
        }
        
        // Load price history
        $stmt = $pdo->prepare("SELECT * FROM price_history WHERE user_id = :user_id ORDER BY timestamp DESC LIMIT 10");
        $stmt->execute(['user_id' => $userId]);
        $history = $stmt->fetchAll();
        
        foreach ($history as $point) {
            if (!isset($data['priceHistory'][$point['crypto_id']])) {
                $data['priceHistory'][$point['crypto_id']] = [];
            }
            $data['priceHistory'][$point['crypto_id']][] = [
                'time' => $point['timestamp'],
                'price' => $point['price']
            ];
        }
        
        // Load transactions
        $stmt = $pdo->prepare("SELECT * FROM transactions WHERE user_id = :user_id ORDER BY date DESC LIMIT 10");
        $stmt->execute(['user_id' => $userId]);
        $transactions = $stmt->fetchAll();
        
        foreach ($transactions as $tx) {
            $data['transactions'][] = [
                'id' => $tx['id'],
                'currency' => ucfirst($tx['crypto_id']),
                'amount' => $tx['amount'],
                'price' => $tx['price'],
                'type' => $tx['type'],
                'date' => $tx['date']
            ];
        }
        
        return $data;
    } catch (Exception $e) {
        return false;
    }
}

// Function to initialize cryptocurrency data for new user
function initializeCryptoData($userId) {
    global $pdo;
    
    try {
        $initialData = [
            'btc' => ['price' => 50000, 'amount' => 0],
            'eth' => ['price' => 3000, 'amount' => 0],
            'ltc' => ['price' => 150, 'amount' => 0]
        ];
        
        $stmt = $pdo->prepare("INSERT INTO crypto_holdings (user_id, crypto_id, amount, current_price, price_change) 
                              VALUES (:user_id, :crypto_id, :amount, :price, 0)");
        
        foreach ($initialData as $cryptoId => $data) {
            $stmt->execute([
                'user_id' => $userId,
                'crypto_id' => $cryptoId,
                'amount' => $data['amount'],
                'price' => $data['price']
            ]);
        }
        
        return true;
    } catch (Exception $e) {
        return false;
    }
}

// Handle API requests
if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
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
    exit;
}

// Check if user is logged in for regular page access
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cryptocurrency Dashboard</title>
    <link rel="stylesheet" href="css/styles.css">
    <!-- Include Chart.js for charts -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- Include a library for animations -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
</head>
<body>
    <div class="app">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="logo-container">
                <div class="logo-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 12V6m0 0L9 9m3-3l3 3" />
                        <circle cx="12" cy="18" r="3" />
                        <path d="M6 10.5a6 6 0 1 1 12 0" />
                    </svg>
                </div>
                <span class="logo-text glow-text-primary">Crypto</span>
            </div>
            
            <!-- SIDEBAR -->
            <nav class="sidebar-nav">
                <ul>
                    <li>
                        <a href="#" class="nav-link active">
                            <span class="sidebar-icon active-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                            </span>
                            <span class="nav-text">Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="nav-link">
                            <span class="sidebar-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-wallet"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                            </span>
                            <span class="nav-text" id="wallet">Wallet</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="nav-link">
                            <span class="sidebar-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            </span>
                            <span class="nav-text" id="message">Messages</span>
                            <span class="notification-badge"></span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="nav-link">
                            <span class="sidebar-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-trending-up"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                            </span>
                            <span class="nav-text" id="trade">Trade</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="nav-link">
                            <span class="sidebar-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                            </span>
                            <span class="nav-text" id="account-setting">Account Setting</span>
                        </a>
                    </li>
                </ul>
            </nav>
            
            <button id="collapse-sidebar" class="collapse-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevrons-left"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>
            </button>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Header -->
            <header class="header">
                <h1 class="page-title">Dashboard</h1>
                
                <div class="header-actions">
                    <button class="icon-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </button>
                    
                    <button class="icon-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                    </button>
                    
                    <div class="notification-counter">
                        <div class="counter-badge">15</div>
                    </div>
                    
                    <div class="user-profile">
                        <div class="avatar">MI</div>
                        <div class="user-info">
                            <span class="username glow-text-primary">Mimi</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                    </div>
                </div>
            </header>
            







            <div class="dashboard-content">
                <!-- Wallets ni diri -->
                <section class="wallets-section">
                    <h2 class="section-title">WALLETS</h2>
                    <div class="wallet-cards" id="wallet-cards">
                        <!-- Wallet cards will be populated with JS -->
                    </div>
                </section>
              
                





                <!-- Main Chart Section -->
                <section class="chart-section">
                    <div class="chart-legend">
                        <div class="legend-item">
                            <div class="color-dot purple"></div>
                            <span>MNX</span>
                        </div>
                        <div class="legend-item">
                            <div class="color-dot blue"></div>
                            <span>CLQ</span>
                        </div>
                        <div class="legend-item">
                            <div class="color-dot green"></div>
                            <span>SHX</span>
                        </div>
                    </div>
                    
                    <div class="chart-container">
                        <canvas id="main-chart"></canvas>
                    </div>
                </section>
                
                <!-- Trend and History Section -->
                <div class="trend-history-container">
                    <!-- Trend Section -->
                    <section class="card trend-section">
                        <div class="card-header">
                            <h3 class="card-title">TREND</h3>
                        </div>
                        <div class="card-content">
                            <div class="trends-grid" id="trends-grid">
                                <!-- Trend items will be populated with JS -->
                            </div>
                        </div>
                    </section>
                    
                    <!-- Transaction History Section -->
                    <section class="card history-section">
                        <div class="card-header">
                            <h3 class="card-title">HISTORY</h3>
                            <a href="#" class="see-all">See All</a>
                        </div>
                        <div class="card-content">
                            <div class="transaction-list" id="transaction-list">
                                <!-- Transaction items will be populated with JS -->
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    </div>

    <script src="js/script.js"></script>
</body>
</html>

