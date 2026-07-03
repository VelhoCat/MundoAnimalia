-- ============================================================
-- Migración: agregar columna "publicado_por" a la tabla animals
-- ============================================================
-- Ejecuta esto SOLO si ya tenías la base de datos creada de antes
-- (no hace falta si importaste el schema.sql actualizado desde cero).
--
-- En phpMyAdmin: base mundo_animalia -> pestaña Importar -> este archivo.
-- Guarda el correo/usuario de quien publicó cada animal.
-- ============================================================

USE mundo_animalia;

-- Agrega la columna solo si no existe (evita error al reejecutar)
SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'mundo_animalia'
    AND TABLE_NAME = 'animals'
    AND COLUMN_NAME = 'publicado_por'
);

SET @sql := IF(@col_exists = 0,
  'ALTER TABLE animals ADD COLUMN publicado_por VARCHAR(190) NULL AFTER destacado,
     ADD INDEX idx_publicado_por (publicado_por)',
  'SELECT "La columna publicado_por ya existe" AS mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
