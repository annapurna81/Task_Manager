-- ============================================================
-- mysql_setup.sql
-- Run this ONCE in MySQL to set up the database
-- ============================================================
-- HOW TO RUN:
--   Open MySQL command line and run:
--   mysql -u root -p < mysql_setup.sql
-- ============================================================

-- Create the database
CREATE DATABASE IF NOT EXISTS taskmanager_sessions;

-- Use it
USE taskmanager_sessions;

-- Create the session logs table
-- This stores every login and register event
CREATE TABLE IF NOT EXISTS session_logs (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    VARCHAR(100)  NOT NULL COMMENT 'MongoDB ObjectId of the user',
    email      VARCHAR(255)  NOT NULL COMMENT 'User email address',
    action     VARCHAR(50)   NOT NULL COMMENT 'LOGIN or REGISTER',
    ip_address VARCHAR(50)   DEFAULT 'unknown' COMMENT 'IP address of the request',
    created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP COMMENT 'When this event happened'
);

-- Verify
SHOW TABLES;
DESCRIBE session_logs;

-- ============================================================
-- USEFUL QUERIES (for checking data later):
--
-- See all login events:
--   SELECT * FROM session_logs ORDER BY created_at DESC;
--
-- See logins for a specific user:
--   SELECT * FROM session_logs WHERE email = 'user@example.com';
--
-- Count logins per user:
--   SELECT email, COUNT(*) as total_logins
--   FROM session_logs
--   WHERE action = 'LOGIN'
--   GROUP BY email;
-- ============================================================
