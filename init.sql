
-- 0. INICIALIZAÇÃO DO SCHEMA
CREATE DATABASE IF NOT EXISTS sdkcti;
USE sdkcti;

-- 1. CONFIGURAÇÕES E SISTEMA
CREATE TABLE IF NOT EXISTS system_settings (
    setting_key VARCHAR(50) PRIMARY KEY,
    setting_value TEXT
);

CREATE TABLE IF NOT EXISTS monitored_auth_sites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL,
    username VARCHAR(100),
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. GESTÃO DE ESCOPO E ATIVOS
CREATE TABLE IF NOT EXISTS assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('Domain', 'IP', 'Keyword', 'EmailDomain') NOT NULL,
    value VARCHAR(255) NOT NULL,
    status ENUM('Verifying', 'Protected', 'Exposed') DEFAULT 'Verifying',
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. THREAT INTELLIGENCE (Atores, IOCs, Vítimas)
CREATE TABLE IF NOT EXISTS threat_actors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    origin VARCHAR(100),
    motivation VARCHAR(100),
    severity ENUM('CRITICAL', 'HIGH', 'MEDIUM', 'LOW') DEFAULT 'MEDIUM',
    last_active DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS iocs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value VARCHAR(255) NOT NULL,
    type ENUM('IP', 'DOMAIN', 'HASH', 'URL', 'EMAIL') NOT NULL,
    confidence INT DEFAULT 80,
    status ENUM('Active', 'Revoked', 'Inactive') DEFAULT 'Active',
    tags TEXT, -- JSON ou string separada por vírgula
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

CREATE TABLE IF NOT EXISTS vulnerabilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cve_id VARCHAR(50) UNIQUE NOT NULL,
    vendor VARCHAR(100),
    product VARCHAR(100),
    score DECIMAL(3,1),
    is_cisa_kev BOOLEAN DEFAULT FALSE,
    description TEXT,
    required_action TEXT,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ransomware_victims (
    id INT AUTO_INCREMENT PRIMARY KEY,
    victim_name VARCHAR(255) NOT NULL,
    group_name VARCHAR(100),
    sector VARCHAR(100),
    country VARCHAR(100),
    date_published DATE,
    summary TEXT,
    ransom_amount VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. RELACIONAMENTOS (STIX GRAPH)
CREATE TABLE IF NOT EXISTS stix_relationships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source_id VARCHAR(50), -- ID referenciando outras tabelas
    source_type VARCHAR(50),
    target_id VARCHAR(50),
    target_type VARCHAR(50),
    relationship_type VARCHAR(50), -- 'uses', 'targets', 'exploits'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. MONITORAMENTO (Leads de Senha e Darkweb)
CREATE TABLE IF NOT EXISTS leaked_credentials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    target_url VARCHAR(255),
    username VARCHAR(100),
    password VARCHAR(255),
    leak_source VARCHAR(100), -- ex: Redline, Vidar
    complexity ENUM('High', 'Medium', 'Low'),
    status ENUM('Critical', 'Pending', 'Validated', 'Mitigated') DEFAULT 'Pending',
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS darkweb_intelligence (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source_name VARCHAR(100), -- ex: XSS.is, Telegram
    source_type ENUM('Forum', 'Chat'),
    author VARCHAR(100),
    content TEXT,
    url VARCHAR(255),
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. INVESTIGAÇÃO (Playbooks)
CREATE TABLE IF NOT EXISTS playbooks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    severity ENUM('CRITICAL', 'HIGH', 'MEDIUM', 'LOW'),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS playbook_steps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    playbook_id INT,
    step_order INT,
    title VARCHAR(255),
    description TEXT,
    FOREIGN KEY (playbook_id) REFERENCES playbooks(id) ON DELETE CASCADE
);

-- 7. GOVERNANÇA (Auditoria)
CREATE TABLE IF NOT EXISTS supplier_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text TEXT NOT NULL,
    category VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS supplier_assessments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(255) NOT NULL,
    score INT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DADOS INICIAIS
INSERT IGNORE INTO system_settings (setting_key, setting_value) VALUES 
('user_name', 'Analista Sênior'),
('user_role', 'Threat Hunter'),
('system_name', 'ThreatOne'),
('accent_color', '#3b82f6');

INSERT INTO supplier_questions (text, category) VALUES 
('O fornecedor garante a notificação de incidentes em até 24h?', 'Governança'),
('O acesso administrativo utiliza ferramentas de PAM?', 'Controle de Acesso'),
('O fornecedor possui monitoramento SOC 24x7?', 'Maturidade');

INSERT INTO playbooks (title, category, severity, description) VALUES 
('Ransomware Response', 'Incidentes', 'CRITICAL', 'Protocolo de contenção imediata.');
