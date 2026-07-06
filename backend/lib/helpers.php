<?php
// ============================================================
// Utilidades compartidas: CORS, respuestas JSON, input, etc.
// ============================================================

function apply_cors() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = $GLOBALS['ALLOWED_ORIGINS'] ?? [];

    if ($origin && in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Credentials: true');
    }
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

    // Responder preflight inmediatamente
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function json_response($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// Lee el cuerpo JSON de la petición como array asociativo.
function read_json_body() {
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) {
        return [];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_response(['error' => 'Cuerpo JSON inválido.'], 400);
    }
    return $data;
}

// Normaliza una fila de la BD a la forma que espera el frontend.
// - id como string
// - tinyint(1) como booleano para los campos indicados
// - columnas JSON decodificadas a array
// - created_date en formato ISO 8601
function normalize_row($row, $boolFields = [], $jsonFields = []) {
    if ($row === null || $row === false) {
        return null;
    }
    if (isset($row['id'])) {
        $row['id'] = (string) $row['id'];
    }
    if (isset($row['animal_id']) && $row['animal_id'] !== null) {
        $row['animal_id'] = (string) $row['animal_id'];
    }
    foreach ($boolFields as $f) {
        if (array_key_exists($f, $row)) {
            $row[$f] = (bool) ((int) $row[$f]);
        }
    }
    foreach ($jsonFields as $f) {
        if (array_key_exists($f, $row)) {
            $decoded = is_string($row[$f]) ? json_decode($row[$f], true) : $row[$f];
            $row[$f] = is_array($decoded) ? $decoded : [];
        }
    }
    if (isset($row['created_date']) && $row['created_date']) {
        $ts = strtotime($row['created_date']);
        if ($ts !== false) {
            $row['created_date'] = gmdate('Y-m-d\TH:i:s\Z', $ts);
        }
    }
    // Nunca exponer el hash de contraseña
    unset($row['password_hash']);
    return $row;
}

function normalize_rows($rows, $boolFields = [], $jsonFields = []) {
    return array_map(function ($r) use ($boolFields, $jsonFields) {
        return normalize_row($r, $boolFields, $jsonFields);
    }, $rows);
}
