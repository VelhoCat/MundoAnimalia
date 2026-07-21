-- ============================================================
-- Mundo Animalia · INSTALADOR COMPLETO DE BASE DE DATOS
-- Todo en un solo archivo: esquema + datos + funciones sociales +
-- noticias + usuarios administradores.
-- ============================================================
-- Cómo importar (una sola vez):
--   1) Abre phpMyAdmin (http://localhost/phpmyadmin)
--   2) Pestaña "Importar" -> Seleccionar archivo -> este install.sql
--   3) Presiona "Importar/Continuar"
-- No necesitas borrar la base antes: este archivo la deja limpia
-- automáticamente (elimina las tablas y las vuelve a crear).
-- Por consola:  mysql -u root < install.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS mundo_animalia
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE mundo_animalia;

-- Limpieza total previa (sin problemas de llaves foráneas)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS noticias;
DROP TABLE IF EXISTS adoption_requests;
DROP TABLE IF EXISTS animals;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 1) ESQUEMA Y DATOS BASE  (equivale a schema.sql)
-- ============================================================
-- ============================================================
-- Mundo Animalia - Esquema de base de datos MySQL
-- Compatible con MySQL 5.7+ / MariaDB 10.2+ (XAMPP)
-- ============================================================
-- Para importar:
--   1) Abre phpMyAdmin (http://localhost/phpmyadmin)
--   2) Crea o selecciona la base de datos
--   3) Pestaña "Importar" -> selecciona este archivo
-- O por consola:  mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS mundo_animalia
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mundo_animalia;

-- Limpieza (orden inverso por llaves foráneas)
DROP TABLE IF EXISTS adoption_requests;
DROP TABLE IF EXISTS animals;
DROP TABLE IF EXISTS users;

-- ------------------------------------------------------------
-- Usuarios
-- ------------------------------------------------------------
CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(150) NOT NULL,
  email         VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('admin','voluntario','adoptante') NOT NULL DEFAULT 'adoptante',
  baneado       TINYINT(1) NOT NULL DEFAULT 0,
  created_date  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Animales
-- ------------------------------------------------------------
CREATE TABLE animals (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  nombre           VARCHAR(120) NOT NULL,
  descripcion      TEXT,
  especie          VARCHAR(40),
  raza             VARCHAR(80),
  edad_estimada    VARCHAR(40),
  tamano           VARCHAR(40),
  sexo             VARCHAR(20),
  estado_salud     VARCHAR(40),
  vacunas          TINYINT(1) NOT NULL DEFAULT 0,
  esterilizado     TINYINT(1) NOT NULL DEFAULT 0,
  chip             TINYINT(1) NOT NULL DEFAULT 0,
  foto_url         VARCHAR(500),
  fotos_adicionales JSON,
  ubicacion        VARCHAR(60),
  estado_adopcion  VARCHAR(40) NOT NULL DEFAULT 'disponible',
  etiquetas        JSON,
  destacado        TINYINT(1) NOT NULL DEFAULT 0,
  publicado_por    VARCHAR(190),
  created_date     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_especie (especie),
  INDEX idx_estado_adopcion (estado_adopcion),
  INDEX idx_ubicacion (ubicacion),
  INDEX idx_destacado (destacado),
  INDEX idx_publicado_por (publicado_por)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Solicitudes de adopción
-- ------------------------------------------------------------
CREATE TABLE adoption_requests (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  animal_id           INT,
  animal_nombre       VARCHAR(120),
  nombre_solicitante  VARCHAR(150) NOT NULL,
  email_solicitante   VARCHAR(190) NOT NULL,
  telefono            VARCHAR(40),
  direccion           VARCHAR(255),
  tipo_vivienda       VARCHAR(40),
  tiene_patio         TINYINT(1) NOT NULL DEFAULT 0,
  otras_mascotas      TINYINT(1) NOT NULL DEFAULT 0,
  experiencia_mascotas TEXT,
  motivo              TEXT,
  estado              VARCHAR(40) NOT NULL DEFAULT 'pendiente',
  notas_admin         TEXT,
  created_date        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_animal (animal_id),
  INDEX idx_estado (estado),
  CONSTRAINT fk_request_animal FOREIGN KEY (animal_id)
    REFERENCES animals(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Datos iniciales (seed)
-- ============================================================

-- Usuarios.
-- IMPORTANTE: estos hashes corresponden a la contraseña "password123"
-- para TODOS los usuarios de ejemplo. Cámbialas en producción.
-- (hash generado con password_hash('password123', PASSWORD_DEFAULT))
INSERT INTO users (id, full_name, email, password_hash, role, created_date) VALUES
(1, 'Diego Pizarro', 'admin@mundoanimalia.cl', '$2b$10$OgeNpCsj.1ybFyD1F6PMEOxvno/wqM4vojaBrmBYZ3UIp3FXIHdMi', 'admin',      '2025-01-01 00:00:00'),
(2, 'María González', 'maria@mundoanimalia.cl', '$2b$10$OgeNpCsj.1ybFyD1F6PMEOxvno/wqM4vojaBrmBYZ3UIp3FXIHdMi', 'voluntario', '2025-01-15 00:00:00'),
(3, 'Carlos Mendoza', 'carlos.mendoza@gmail.com', '$2b$10$OgeNpCsj.1ybFyD1F6PMEOxvno/wqM4vojaBrmBYZ3UIp3FXIHdMi', 'adoptante',  '2025-02-10 00:00:00'),
(4, 'Ana López', 'ana.lopez@hotmail.com', '$2b$10$OgeNpCsj.1ybFyD1F6PMEOxvno/wqM4vojaBrmBYZ3UIp3FXIHdMi', 'adoptante',  '2025-03-01 00:00:00');

-- Animales
INSERT INTO animals
(id, nombre, descripcion, especie, raza, edad_estimada, tamano, sexo, estado_salud, vacunas, esterilizado, chip, foto_url, fotos_adicionales, ubicacion, estado_adopcion, etiquetas, destacado, created_date) VALUES
(1, 'Luna', 'Luna es una perrita mestiza muy cariñosa y juguetona. Fue rescatada de las calles de Arica cuando era cachorra. Le encanta jugar con pelotas y dar paseos largos. Es muy sociable con otros perros y con niños.', 'perro', 'Mestiza', 'joven', 'mediano', 'hembra', 'excelente', 1, 1, 1, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop', JSON_ARRAY(), 'arica', 'disponible', JSON_ARRAY('cariñosa','juguetona','sociable'), 1, '2025-03-10 10:00:00'),
(2, 'Max', 'Max es un labrador dorado muy tranquilo y obediente. Ideal para familias con niños. Fue entregado por su familia anterior que no podía seguir cuidándolo.', 'perro', 'Labrador', 'adulto', 'grande', 'macho', 'bueno', 1, 1, 0, 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop', JSON_ARRAY(), 'arica', 'disponible', JSON_ARRAY('tranquilo','obediente','familiar'), 1, '2025-03-08 14:00:00'),
(3, 'Michi', 'Michi es un gatito naranja muy curioso e independiente. Le gusta explorar y tomar siestas al sol. Es perfecto para departamentos.', 'gato', 'Mestizo', 'cachorro', 'pequeño', 'macho', 'excelente', 1, 0, 0, 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop', JSON_ARRAY(), 'arica', 'disponible', JSON_ARRAY('curioso','independiente','departamento'), 1, '2025-03-05 09:00:00'),
(4, 'Bella', 'Bella es una gata siamesa muy elegante y cariñosa. Fue rescatada en Putre y busca un hogar donde pueda sentirse segura.', 'gato', 'Siamesa', 'adulto', 'pequeño', 'hembra', 'bueno', 1, 1, 1, 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop', JSON_ARRAY(), 'putre', 'disponible', JSON_ARRAY('elegante','cariñosa','tranquila'), 0, '2025-02-28 16:00:00'),
(5, 'Rocky', 'Rocky es un perro pastor alemán muy leal y protector. Necesita un hogar con patio donde pueda correr y jugar.', 'perro', 'Pastor Alemán', 'adulto', 'grande', 'macho', 'excelente', 1, 1, 1, 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=300&fit=crop', JSON_ARRAY(), 'arica', 'en_proceso', JSON_ARRAY('leal','protector','activo'), 1, '2025-02-20 11:00:00'),
(6, 'Pelusa', 'Pelusa es una gatita persa muy dulce. Le encanta que la acaricien y dormir en lugares cálidos.', 'gato', 'Persa', 'senior', 'pequeño', 'hembra', 'en_tratamiento', 1, 1, 0, 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&h=300&fit=crop', JSON_ARRAY(), 'camarones', 'disponible', JSON_ARRAY('dulce','tranquila','cariñosa'), 0, '2025-02-15 08:00:00'),
(7, 'Toby', 'Toby es un cachorro mestizo muy enérgico y alegre. Fue encontrado abandonado y ahora busca una familia que le dé mucho amor.', 'perro', 'Mestizo', 'cachorro', 'pequeño', 'macho', 'bueno', 0, 0, 0, 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400&h=300&fit=crop', JSON_ARRAY(), 'general_lagos', 'disponible', JSON_ARRAY('enérgico','alegre','cachorro'), 1, '2025-03-12 13:00:00'),
(8, 'Canela', 'Canela es una perrita cocker muy dulce. Ya fue adoptada por una familia amorosa de Arica.', 'perro', 'Cocker Spaniel', 'joven', 'mediano', 'hembra', 'excelente', 1, 1, 1, 'https://images.unsplash.com/photo-1510771613990-82b1f6d02852?w=400&h=300&fit=crop', JSON_ARRAY(), 'arica', 'adoptado', JSON_ARRAY('dulce','familiar'), 0, '2025-01-15 10:00:00');

-- Solicitudes de adopción
INSERT INTO adoption_requests
(id, animal_id, animal_nombre, nombre_solicitante, email_solicitante, telefono, direccion, tipo_vivienda, tiene_patio, otras_mascotas, experiencia_mascotas, motivo, estado, notas_admin, created_date) VALUES
(1, 5, 'Rocky', 'Carlos Mendoza', 'carlos.mendoza@gmail.com', '+56 9 8765 4321', 'Av. Comandante San Martín 1234, Arica', 'casa', 1, 0, 'Tuve un pastor alemán por 10 años. Tengo experiencia con razas grandes.', 'Busco un compañero leal para mi hogar. Tengo amplio patio y mucho tiempo para dedicarle.', 'en_revision', '', '2025-03-15 09:30:00'),
(2, 1, 'Luna', 'Ana López', 'ana.lopez@hotmail.com', '+56 9 1234 5678', 'Calle Bolognesi 567, Arica', 'departamento', 0, 1, 'Tengo un gato. He tenido perros antes.', 'Luna me robó el corazón cuando la vi en el catálogo. Quiero darle un hogar lleno de amor.', 'pendiente', '', '2025-03-14 15:00:00');

-- Reinicia los contadores AUTO_INCREMENT por encima de los datos sembrados
ALTER TABLE users             AUTO_INCREMENT = 100;
ALTER TABLE animals           AUTO_INCREMENT = 100;
ALTER TABLE adoption_requests AUTO_INCREMENT = 100;


-- ============================================================
-- 2) FUNCIONES SOCIALES: me gusta, comentarios, notificaciones  (add_social_features.sql)
-- ============================================================
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


-- ============================================================
-- 3) NOTICIAS  (add_noticias.sql)
-- ============================================================
-- ============================================================
-- Mundo Animalia - Migración: tabla de Noticias
-- Ejecuta este archivo sobre la base `mundo_animalia`.
--   phpMyAdmin -> mundo_animalia -> Importar
--   o consola:  mysql -u root mundo_animalia < add_noticias.sql
-- ============================================================

USE mundo_animalia;

DROP TABLE IF EXISTS noticias;

CREATE TABLE noticias (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  titulo        VARCHAR(200) NOT NULL,
  resumen       VARCHAR(500),
  contenido     TEXT,
  categoria     VARCHAR(60),
  imagen        VARCHAR(500),
  ubicacion     VARCHAR(80),
  publicado_por VARCHAR(190),
  created_date  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_categoria (categoria),
  INDEX idx_publicado_por (publicado_por)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO noticias (id, titulo, resumen, contenido, categoria, imagen, ubicacion, publicado_por, created_date) VALUES
(1,
 'Gran jornada de adopción en Plaza Colón',
 'Este sábado 22 de marzo se realizará una feria de adopción masiva en la Plaza Colón de Arica. Habrá más de 30 animales esperando por un hogar, atención veterinaria gratuita y charlas sobre tenencia responsable.',
 'Este sábado 22 de marzo, desde las 10:00 hasta las 18:00 horas, la Plaza Colón de Arica se llenará de patas y colas en busca de un hogar. Más de 30 perros y gatos rescatados estarán disponibles para adopción responsable, todos vacunados, desparasitados y con revisión veterinaria al día.

Durante la jornada habrá atención veterinaria gratuita para las mascotas de la comunidad, además de charlas sobre tenencia responsable, alimentación y cuidados básicos. Nuestros voluntarios acompañarán a cada familia interesada para asegurar que cada adopción sea una buena decisión, tanto para el animal como para su nuevo hogar.

Invitamos a toda la comunidad a participar. Recuerda: adoptar es un compromiso de amor para toda la vida.',
 'Evento',
 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop',
 'Arica', 'admin@mundoanimalia.cl', '2025-03-18 10:00:00'),
(2,
 'Campaña de esterilización gratuita en Putre',
 'En conjunto con la Municipalidad de Putre, Mundo Animalia llevará a cabo una campaña de esterilización gratuita para perros y gatos durante el mes de abril. Los cupos son limitados.',
 'En conjunto con la Municipalidad de Putre, Mundo Animalia llevará a cabo una campaña de esterilización gratuita para perros y gatos durante todo el mes de abril. La esterilización es la forma más efectiva y humanitaria de controlar la sobrepoblación animal y prevenir el abandono.

Los cupos son limitados y se asignarán por orden de inscripción. Para reservar, los vecinos pueden acercarse a las oficinas municipales o escribirnos a través de nuestras redes sociales. Cada animal recibirá también control veterinario post-operatorio sin costo.

Agradecemos a los profesionales voluntarios que hacen posible esta campaña y hacemos un llamado a la comunidad de Putre a sumarse a esta iniciativa por el bienestar animal.',
 'Campaña',
 'https://images.unsplash.com/photo-1612531386530-97d3f29d5173?w=600&h=400&fit=crop',
 'Putre', 'admin@mundoanimalia.cl', '2025-03-12 10:00:00'),
(3,
 'Rescate exitoso: 12 cachorros encuentran hogar',
 'Gracias al trabajo de nuestros voluntarios, 12 cachorros que fueron encontrados abandonados en el sector de Azapa ya tienen familias adoptivas. Un logro que nos llena de alegría.',
 'Hace tres semanas, un grupo de 12 cachorros fue encontrado abandonado en una caja en el sector de Azapa. Estaban deshidratados y con signos de desnutrición. Gracias a la rápida acción de nuestros voluntarios y al apoyo de una veterinaria colaboradora, todos lograron recuperarse por completo.

Hoy nos llena de alegría contar que los 12 cachorros ya fueron adoptados por familias responsables de la región. Cada uno pasó por un proceso de evaluación y seguimiento para garantizar su bienestar en el nuevo hogar.

Este tipo de logros solo es posible gracias a la red de voluntarios, familias de acogida y donantes que hacen posible nuestra labor. ¡Gracias a todos quienes hicieron esto realidad!',
 'Rescate',
 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop',
 'Arica', 'admin@mundoanimalia.cl', '2025-03-05 10:00:00'),
(4,
 'Nuevo convenio con clínica veterinaria regional',
 'Mundo Animalia firmó un convenio de colaboración con la Clínica Veterinaria del Norte, que permitirá atención preferencial y descuentos en tratamientos para los animales rescatados por la plataforma.',
 'Mundo Animalia firmó un importante convenio de colaboración con la Clínica Veterinaria del Norte. Este acuerdo permitirá atención preferencial y descuentos significativos en tratamientos, cirugías y exámenes para todos los animales rescatados a través de la plataforma.

El convenio también contempla jornadas de capacitación para nuestros voluntarios y acceso a atención de urgencia en horario extendido. Esto representa un gran avance en nuestra capacidad de responder ante casos críticos.

Seguimos construyendo alianzas que fortalecen la red de protección animal en la región de Arica y Parinacota.',
 'Institucional',
 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600&h=400&fit=crop',
 'Arica', 'admin@mundoanimalia.cl', '2025-02-28 10:00:00'),
(5,
 'Taller de primeros auxilios para mascotas',
 'Se realizará un taller abierto a la comunidad sobre primeros auxilios básicos para mascotas. Aprende cómo actuar ante emergencias mientras llegas al veterinario.',
 'Se realizará un taller gratuito y abierto a toda la comunidad sobre primeros auxilios básicos para mascotas. Aprenderás cómo actuar ante emergencias comunes —heridas, atragantamientos, golpes de calor o intoxicaciones— mientras trasladas a tu mascota al veterinario.

El taller será dictado por médicos veterinarios y contará con demostraciones prácticas. Los asistentes recibirán una guía impresa con los pasos esenciales para cada situación de emergencia.

Los cupos son limitados. La inscripción es gratuita a través de nuestras redes sociales. ¡Prepárate para cuidar mejor a quienes más quieres!',
 'Evento',
 'https://images.unsplash.com/photo-1587764379873-97837921fd44?w=600&h=400&fit=crop',
 'Arica', 'admin@mundoanimalia.cl', '2025-02-20 10:00:00'),
(6,
 'Voluntarios de Camarones se suman a la causa',
 'Un grupo de 15 vecinos de Camarones se organizó como voluntarios de Mundo Animalia para cubrir las necesidades de animales abandonados en la zona rural de la región.',
 'Un grupo de 15 vecinos de Camarones se organizó como voluntarios de Mundo Animalia para atender las necesidades de los animales abandonados en la zona rural de la región. Esta nueva red permitirá llegar a lugares donde antes era difícil brindar ayuda.

Los voluntarios recibieron capacitación en rescate, primeros auxilios y manejo responsable de animales. Además, coordinarán con nuestra red central para gestionar adopciones, campañas de esterilización y atención veterinaria.

Este crecimiento comunitario es el corazón de nuestra misión. Si quieres sumarte como voluntario en tu comuna, escríbenos: siempre hay una pata esperando por ayuda.',
 'Comunidad',
 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=400&fit=crop',
 'Camarones', 'admin@mundoanimalia.cl', '2025-02-10 10:00:00');

ALTER TABLE noticias AUTO_INCREMENT = 100;


-- ============================================================
-- 4) USUARIOS ADMINISTRADORES  (seed_admins.sql)
-- ============================================================
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
