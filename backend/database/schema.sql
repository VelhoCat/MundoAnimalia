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
-- Primero las tablas que dependen de animals (likes/comments de las
-- funciones sociales), para que el DROP de animals no falle por FK (#1451).
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS notifications;
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
