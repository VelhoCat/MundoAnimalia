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
