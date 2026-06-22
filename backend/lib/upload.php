<?php
// ============================================================
// Subida de archivos (imágenes de animales)
// POST /upload  (multipart/form-data, campo "file")
// Respuesta: { "file_url": "http://.../uploads/xxxx.jpg" }
// ============================================================

function handle_upload() {
    if (empty($_FILES['file'])) {
        json_response(['error' => 'No se recibió ningún archivo (campo "file").'], 400);
    }

    $file = $_FILES['file'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        json_response(['error' => 'Error al subir el archivo (código ' . $file['error'] . ').'], 400);
    }
    if ($file['size'] > UPLOAD_MAX_BYTES) {
        json_response(['error' => 'El archivo supera el tamaño máximo permitido.'], 413);
    }

    // Validar tipo real por contenido
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    $allowed = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
        'image/gif'  => 'gif',
    ];
    if (!isset($allowed[$mime])) {
        json_response(['error' => 'Tipo de archivo no permitido. Solo imágenes JPG, PNG, WEBP o GIF.'], 415);
    }

    if (!is_dir(UPLOAD_DIR)) {
        @mkdir(UPLOAD_DIR, 0775, true);
    }

    $ext = $allowed[$mime];
    $name = bin2hex(random_bytes(16)) . '.' . $ext;
    $dest = UPLOAD_DIR . '/' . $name;

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        json_response(['error' => 'No se pudo guardar el archivo en el servidor.'], 500);
    }

    // Construir URL pública absoluta.
    // Calcula la base a partir de la ubicación real del backend, así
    // funciona sin importar en qué carpeta de htdocs se haya colocado.
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $baseDir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'])), '/');
    $url = $scheme . '://' . $host . $baseDir . '/uploads/' . $name;

    json_response(['file_url' => $url], 201);
}
