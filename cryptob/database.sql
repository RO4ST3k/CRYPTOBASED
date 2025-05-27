-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS cryptob;
USE cryptob;

-- Create crypto_holdings table
CREATE TABLE IF NOT EXISTS crypto_holdings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    crypto_id VARCHAR(10) NOT NULL,
    amount DECIMAL(20,8) NOT NULL DEFAULT 0,
    current_price DECIMAL(20,2) NOT NULL,
    price_change DECIMAL(5,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_crypto (user_id, crypto_id)
);

-- Create price_history table
CREATE TABLE IF NOT EXISTS price_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    crypto_id VARCHAR(10) NOT NULL,
    price DECIMAL(20,2) NOT NULL,
    timestamp DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    crypto_id VARCHAR(10) NOT NULL,
    amount DECIMAL(20,8) NOT NULL,
    price DECIMAL(20,2) NOT NULL,
    type ENUM('buy', 'sell') NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 