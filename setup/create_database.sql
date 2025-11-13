-- Create Database
CREATE DATABASE IF NOT EXISTS artikel_db;
USE artikel_db;

-- Create Articles Table
CREATE TABLE IF NOT EXISTS articles (
    articleID INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    penulis VARCHAR(100) NOT NULL,
    lead TEXT NOT NULL,
    content LONGTEXT NOT NULL,
    waktu TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Index for better query performance
CREATE INDEX idx_waktu ON articles(waktu);
CREATE INDEX idx_penulis ON articles(penulis);
