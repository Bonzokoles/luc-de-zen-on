-- VibeSDK Database Schema
-- Created: 2025-10-11
-- Purpose: VibeSDK integration and template management

-- VibeSDK Templates
CREATE TABLE IF NOT EXISTS vibesdk_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    template_data TEXT, -- JSON
    version TEXT DEFAULT '1.0.0',
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0
);

-- VibeSDK Projects
CREATE TABLE IF NOT EXISTS vibesdk_projects (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    project_name TEXT NOT NULL,
    template_id TEXT,
    project_config TEXT, -- JSON
    status TEXT DEFAULT 'draft', -- 'draft', 'active', 'completed', 'archived'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES vibesdk_templates(id)
);

-- VibeSDK Assets
CREATE TABLE IF NOT EXISTS vibesdk_assets (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    asset_name TEXT NOT NULL,
    asset_type TEXT, -- 'image', 'video', 'audio', 'document'
    file_path TEXT,
    file_size INTEGER,
    mime_type TEXT,
    metadata TEXT, -- JSON
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES vibesdk_projects(id)
);

-- VibeSDK Analytics
CREATE TABLE IF NOT EXISTS vibesdk_analytics (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    event_type TEXT NOT NULL,
    event_data TEXT, -- JSON
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES vibesdk_projects(id)
);

-- VibeSDK Configurations
CREATE TABLE IF NOT EXISTS vibesdk_configs (
    id TEXT PRIMARY KEY,
    config_key TEXT UNIQUE NOT NULL,
    config_value TEXT, -- JSON or plain text
    description TEXT,
    is_global BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default configurations
INSERT OR IGNORE INTO vibesdk_configs (id, config_key, config_value, description, is_global) VALUES 
('cfg_001', 'default_template_category', 'general', 'Default category for new templates', true),
('cfg_002', 'max_project_assets', '100', 'Maximum number of assets per project', true),
('cfg_003', 'supported_file_types', '["jpg","png","gif","mp4","mp3","pdf","doc"]', 'Supported file types for uploads', true),
('cfg_004', 'storage_quota_mb', '1000', 'Storage quota per user in MB', true);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_vibesdk_templates_category ON vibesdk_templates(category);
CREATE INDEX IF NOT EXISTS idx_vibesdk_templates_created_by ON vibesdk_templates(created_by);

CREATE INDEX IF NOT EXISTS idx_vibesdk_projects_user_id ON vibesdk_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_vibesdk_projects_status ON vibesdk_projects(status);
CREATE INDEX IF NOT EXISTS idx_vibesdk_projects_template_id ON vibesdk_projects(template_id);

CREATE INDEX IF NOT EXISTS idx_vibesdk_assets_project_id ON vibesdk_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_vibesdk_assets_asset_type ON vibesdk_assets(asset_type);

CREATE INDEX IF NOT EXISTS idx_vibesdk_analytics_project_id ON vibesdk_analytics(project_id);
CREATE INDEX IF NOT EXISTS idx_vibesdk_analytics_timestamp ON vibesdk_analytics(timestamp);