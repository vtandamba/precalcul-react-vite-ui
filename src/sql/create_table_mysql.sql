-- Sélection de la base de données
-- USE neper;

-- Création de la table links_maillage
CREATE TABLE IF NOT EXISTS links_maillage (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_link BIGINT,
  categ_name VARCHAR(255),
  url VARCHAR(2048) NOT NULL,
  anchor_text VARCHAR(1024) NOT NULL,
  level_number INT,
  parent_link_id BIGINT,
  score INT,
  root_context VARCHAR(255),
  createat DATE
);

-- Création de la table rules
CREATE TABLE IF NOT EXISTS rules (
  id_rule BIGINT AUTO_INCREMENT PRIMARY KEY,
  support_url_pattern VARCHAR(2048),
  support_page_type_pattern VARCHAR(2048),
  nature VARCHAR(255),
  max_links_number INT,
  nb_column INT NOT NULL,
  insertion_method VARCHAR(255) NOT NULL,
  ancestor_categ_id INT NOT NULL,
  root_context VARCHAR(255),
  support_block_name VARCHAR(255),
  support_block_location VARCHAR(2048) NOT NULL,
  priority_score INT,
  start_level INT,
  auth_depth INT,
  score_min INT,
  createat DATE
);

-- Création de la table log
CREATE TABLE IF NOT EXISTS log (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  action VARCHAR(255) NOT NULL,
  description TEXT,
  version_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table sys_option
CREATE TABLE IF NOT EXISTS sys_option (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  data_json JSON NOT NULL,
  createat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
