-- ============================================================
-- Mundo Animalia · Funciones sociales
-- Tablas: me gusta (likes), comentarios y notificaciones
-- ============================================================
-- Importar en phpMyAdmin (pestaña Importar) DESPUÉS de schema.sql.
-- Es seguro reejecutarlo: usa CREATE TABLE IF NOT EXISTS.
-- ============================================================

USE mundo_animalia;

-- ------------------------------------------------------------
-- Me gusta (un usuario puede dar un solo me gusta por animal)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS likes (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  animal_id    INT NOT NULL,
  user_email   VARCHAR(190) NOT NULL,
  created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_like (animal_id, user_email),
  INDEX idx_like_animal (animal_id),
  CONSTRAINT fk_like_animal FOREIGN KEY (animal_id)
    REFERENCES animals(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Comentarios en las publicaciones
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS comments (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  animal_id     INT NOT NULL,
  user_email    VARCHAR(190) NOT NULL,
  autor_nombre  VARCHAR(150) NOT NULL,
  texto         TEXT NOT NULL,
  created_date  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_comment_animal (animal_id),
  CONSTRAINT fk_comment_animal FOREIGN KEY (animal_id)
    REFERENCES animals(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Notificaciones (una fila por destinatario)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_email   VARCHAR(190) NOT NULL,   -- destinatario
  tipo         VARCHAR(40)  NOT NULL DEFAULT 'general',
  mensaje      VARCHAR(500) NOT NULL,
  animal_id    INT NULL,
  de_nombre    VARCHAR(150) NULL,
  leida        TINYINT(1) NOT NULL DEFAULT 0,
  created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notif_user (user_email),
  INDEX idx_notif_leida (leida)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
