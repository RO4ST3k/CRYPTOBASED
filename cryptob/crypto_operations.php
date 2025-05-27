<?php
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
        
        foreach ($cryptoData['cryptocurrencies'] as $crypto) {
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
            'cryptocurrencies' => [],
            'priceHistory' => [],
            'transactions' => []
        ];
        
        // Load cryptocurrency holdings
        $stmt = $pdo->prepare("SELECT * FROM crypto_holdings WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $userId]);
        $holdings = $stmt->fetchAll();
        
        foreach ($holdings as $holding) {
            $data['cryptocurrencies'][$holding['crypto_id']] = [
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
?> 