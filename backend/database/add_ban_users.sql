-- ============================================================
-- Migración: agregar columna "baneado" a la tabla users
-- ============================================================
-- Permite a los administradores suspender cuentas para que no
-- puedan publicar animales ni comentar.
-- Seguro de reejecutar: solo agrega la columna si no existe.
-- En phpMyAdmin: base mundo_animalia -> pestaña Importar -> este archivo.
-- ============================================================

USE mundo_animalia;

SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'mundo_animalia'
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'baneado'
);

SET @sql := IF(@col_exists = 0,
  'ALTER TABLE users ADD COLUMN baneado TINYINT(1) NOT NULL DEFAULT 0 AFTER role',
  'SELECT "La columna baneado ya existe" AS mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
