<?php
// ============================================================
// Configuración de Mundo Animalia API
// Edita estos valores según tu entorno (XAMPP por defecto).
// ============================================================

// --- Base de datos ---
define('DB_HOST', '127.0.0.1');
define('DB_PORT', '3306');
define('DB_NAME', 'mundo_animalia');
define('DB_USER', 'root');     // usuario por defecto de XAMPP
define('DB_PASS', '');         // XAMPP no tiene contraseña por defecto
define('DB_CHARSET', 'utf8mb4');

// --- CORS ---
// Orígenes permitidos del frontend (Vite). Agrega los que uses.
$GLOBALS['ALLOWED_ORIGINS'] = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173', // vite preview
    'http://localhost:3000',
];

// --- Uploads ---
// Carpeta física donde se guardan los archivos subidos.
define('UPLOAD_DIR', __DIR__ . '/uploads');
// URL pública base desde donde se sirven (ajusta si cambias la ruta).
define('UPLOAD_PUBLIC_BASE', '/MundoAnimalia-funciones-sociales/backend/uploads');

// Tamaño máximo de subida (bytes). 5 MB.
define('UPLOAD_MAX_BYTES', 5 * 1024 * 1024);

// Zona horaria
date_default_timezone_set('America/Santiago');
