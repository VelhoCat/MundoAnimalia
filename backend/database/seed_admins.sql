-- ============================================================
-- Mundo Animalia · Usuarios administradores adicionales
-- ============================================================
-- Importar en phpMyAdmin (pestaña Importar) DESPUÉS de schema.sql,
-- o ejecutar:  mysql -u root mundo_animalia < seed_admins.sql
--
-- Nota: el campo "email" se usa como identificador de inicio de sesión.
-- Aquí se guardan nombres de usuario tal como se solicitaron.
-- Las contraseñas están encriptadas con bcrypt (PASSWORD_DEFAULT de PHP).
--
-- Usuario / contraseña (para iniciar sesión):
--   etian              / so619.
--   BenjaRPGMLG        / caca69.
--   67                 / six seven.
--   InsananoEstreñido  / SOS.
-- ============================================================

USE mundo_animalia;

INSERT INTO users (full_name, email, password_hash, role) VALUES
  ('etian',             'etian',             '$2b$10$8PT.LzsiL8IGz7aEyoG8K.DPmIkEz7xOWfTekqZfJrO5aWRbOu0dC', 'admin'),
  ('BenjaRPGMLG',       'BenjaRPGMLG',       '$2b$10$J60y2yxLrAGaewvTIJR6Ye/TjpXIQQ.Bk48sT3XB8tPmIp29hzAj2', 'admin'),
  ('67',                '67',                '$2b$10$AWcSzhwwmUqD1qpCvmCZs./j4Kk/qh7ZUG1Tu6WJUpysLWVIjfLYi', 'admin'),
  ('InsananoEstreñido', 'InsananoEstreñido', '$2b$10$lo51XspbDKPEh33xGaeYnezLtitpFsGQWjpexqNkjsTQW0TRnmXt.', 'admin')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  role          = VALUES(role),
  full_name     = VALUES(full_name);
