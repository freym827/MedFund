use chtueijpe3wq0j8w;

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    google_id VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    user_about VARCHAR(4000),
    user_photo VARCHAR(60000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)  ENGINE=INNODB;