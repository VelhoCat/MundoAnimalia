<?php
// ============================================================
// Autenticación basada en sesión PHP
// ============================================================

function start_session() {
    if (session_status() === PHP_SESSION_NONE) {
        // Cookie de sesión válida en localhost (dev). En producción con HTTPS
        // pon 'secure' => true y considera 'samesite' => 'None'.
        session_set_cookie_params([
            'lifetime' => 0,
            'path'     => '/',
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
        session_start();
    }
}

// Devuelve el usuario actual (array normalizado) o null
function current_user() {
    start_session();
    if (empty($_SESSION['user_id'])) {
        return null;
    }
    $stmt = db()->prepare('SELECT * FROM users WHERE id = ?');
    $stmt->execute([$_SESSION['user_id']]);
    $row = $stmt->fetch();
    return normalize_row($row ?: null);
}

// POST /auth/login  { email, password }
function handle_login() {
    start_session();
    $body = read_json_body();
    $email = trim($body['email'] ?? '');
    $password = $body['password'] ?? '';

    if ($email === '' || $password === '') {
        json_response(['error' => 'Email y contraseña son obligatorios.'], 400);
    }

    $stmt = db()->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $row = $stmt->fetch();

    if (!$row || !password_verify($password, $row['password_hash'])) {
        json_response(['error' => 'Credenciales inválidas.'], 401);
    }

    // Regenerar id de sesión para prevenir fijación de sesión
    session_regenerate_id(true);
    $_SESSION['user_id'] = (int) $row['id'];

    json_response(normalize_row($row));
}

// GET /auth/me
function handle_me() {
    $user = current_user();
    if (!$user) {
        json_response(['error' => 'No autenticado.'], 401);
    }
    json_response($user);
}

// POST /auth/logout
function handle_logout() {
    start_session();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
    json_response(['success' => true]);
}

// POST /auth/register  { full_name, email, password }
function handle_register() {
    start_session();
    $body = read_json_body();
    $name = trim($body['full_name'] ?? '');
    $email = trim($body['email'] ?? '');
    $password = $body['password'] ?? '';

    // Seguridad: el registro público SIEMPRE crea cuentas "adoptante".
    // El rol no se acepta desde el cliente para que nadie se auto-asigne admin.
    $role = 'adoptante';
    if ($name === '' || $email === '' || strlen($password) < 6) {
        json_response(['error' => 'Nombre, email y contraseña (mín. 6 caracteres) son obligatorios.'], 400);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_response(['error' => 'Email inválido.'], 400);
    }

    // ¿Ya existe?
    $stmt = db()->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        json_response(['error' => 'Ya existe una cuenta con ese email.'], 409);
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = db()->prepare('INSERT INTO users (full_name, email, password_hash, role) VALUES (?,?,?,?)');
    $stmt->execute([$name, $email, $hash, $role]);
    $id = db()->lastInsertId();

    session_regenerate_id(true);
    $_SESSION['user_id'] = (int) $id;

    $stmt = db()->prepare('SELECT * FROM users WHERE id = ?');
    $stmt->execute([$id]);
    json_response(normalize_row($stmt->fetch()), 201);
}
