-- MyBonzo Analytics Database Schema
-- Created: 2025-10-11
-- Purpose: Core analytics and tracking for MyBonzo platform

-- Users and Sessions
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    username TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    subscription_tier TEXT DEFAULT 'free',
    preferences TEXT -- JSON
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    session_token TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    ip_address TEXT,
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    session_id TEXT,
    event_type TEXT NOT NULL,
    event_data TEXT, -- JSON
    page_url TEXT,
    referrer TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    user_agent TEXT
);

-- AI Function Usage
CREATE TABLE IF NOT EXISTS ai_function_usage (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    function_name TEXT NOT NULL,
    function_type TEXT NOT NULL, -- 'marketing-content', 'customer-automation', etc.
    input_data TEXT, -- JSON
    output_data TEXT, -- JSON
    execution_time_ms INTEGER,
    tokens_used INTEGER,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Performance Metrics
CREATE TABLE IF NOT EXISTS performance_metrics (
    id TEXT PRIMARY KEY,
    endpoint TEXT NOT NULL,
    method TEXT DEFAULT 'GET',
    response_time_ms INTEGER,
    status_code INTEGER,
    user_id TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    region TEXT,
    cache_hit BOOLEAN DEFAULT false
);

-- API Usage Statistics
CREATE TABLE IF NOT EXISTS api_usage (
    id TEXT PRIMARY KEY,
    api_key TEXT,
    endpoint TEXT NOT NULL,
    method TEXT,
    requests_count INTEGER DEFAULT 1,
    bytes_transferred INTEGER,
    date_hour DATETIME, -- Rounded to hour for aggregation
    user_id TEXT,
    rate_limited BOOLEAN DEFAULT false
);

-- Error Logs
CREATE TABLE IF NOT EXISTS error_logs (
    id TEXT PRIMARY KEY,
    error_type TEXT NOT NULL,
    error_message TEXT,
    stack_trace TEXT,
    user_id TEXT,
    session_id TEXT,
    page_url TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    severity TEXT DEFAULT 'error', -- 'info', 'warn', 'error', 'critical'
    resolved BOOLEAN DEFAULT false
);

-- Feature Flags
CREATE TABLE IF NOT EXISTS feature_flags (
    id TEXT PRIMARY KEY,
    flag_name TEXT UNIQUE NOT NULL,
    is_enabled BOOLEAN DEFAULT false,
    user_percentage INTEGER DEFAULT 0, -- 0-100
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);

CREATE INDEX IF NOT EXISTS idx_ai_function_usage_user_id ON ai_function_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_function_usage_timestamp ON ai_function_usage(timestamp);
CREATE INDEX IF NOT EXISTS idx_ai_function_usage_function_name ON ai_function_usage(function_name);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_endpoint ON performance_metrics(endpoint);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp);

CREATE INDEX IF NOT EXISTS idx_api_usage_date_hour ON api_usage(date_hour);
CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint ON api_usage(endpoint);

CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON error_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);