<?php
// ============================================================
// Mundo Animalia API - Front controller
// Todas las peticiones entran por aquí (vía .htaccess).
// ============================================================

require __DIR__ . '/config.php';
require __DIR__ . '/lib/helpers.php';
require __DIR__ . '/lib/db.php';
require __DIR__ . '/lib/Entity.php';
require __DIR__ . '/lib/auth.php';
require __DIR__ . '/lib/social.php';
require __DIR__ . '/lib/upload.php';

apply_cors();

// --- Determinar la ruta relativa al backend ---
$scriptDir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'])), '/');
$uriPath   = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$route     = $uriPath;
if ($scriptDir !== '' && strpos($uriPath, $scriptDir) === 0) {
    $route = substr($uriPath, strlen($scriptDir));
}
$route = '/' . trim($route, '/');                 // normaliza
$route = preg_replace('#^/index\.php#', '', $route); // por si se llama directo
if ($route === '' ) { $route = '/'; }

$method = $_SERVER['REQUEST_METHOD'];
$query  = $_GET;
$segments = $route === '/' ? [] : explode('/', trim($route, '/'));

// --- Raíz: pequeño health check ---
if (empty($segments)) {
    json_response([
        'name'    => 'Mundo Animalia API',
        'status'  => 'ok',
        'version' => '1.0.0',
    ]);
}

// --- Rutas de autenticación ---
if ($segments[0] === 'auth') {
    $action = $segments[1] ?? '';
    if ($action === 'me' && $method === 'GET')        handle_me();
    if ($action === 'login' && $method === 'POST')    handle_login();
    if ($action === 'logout' && $method === 'POST')   handle_logout();
    if ($action === 'register' && $method === 'POST') handle_register();
    json_response(['error' => 'Ruta de auth no encontrada.'], 404);
}

// --- Subida de archivos ---
if ($segments[0] === 'upload' && $method === 'POST') {
    handle_upload();
}

// --- Notificaciones ---
if ($segments[0] === 'notifications') {
    handle_notifications($segments, $method);
}

// --- Estadísticas / estrellas de usuario ---
if ($segments[0] === 'user-stats' && $method === 'GET') {
    handle_user_stats($query);
}

// --- Comentarios: editar / eliminar (/comments/{id}) ---
if ($segments[0] === 'comments' && isset($segments[1])) {
    handle_comment($segments[1], $method);
}

// --- Entidades CRUD ---
$registry = entity_registry();
$name = $segments[0];

if (isset($registry[$name])) {
    /** @var Entity $entity */
    $entity = $registry[$name];
    $id = $segments[1] ?? null;

    // Sub-recursos sociales de un animal: /animals/{id}/likes | /animals/{id}/comments
    if ($name === 'animals' && $id !== null && isset($segments[2])) {
        $sub = $segments[2];
        if ($sub === 'likes')    handle_likes($id, $method);
        if ($sub === 'comments') handle_comments($id, $method);
        json_response(['error' => 'Sub-recurso no encontrado.'], 404);
    }

    // Permisos: editar/eliminar un animal solo el dueño o un admin.
    if ($name === 'animals' && $id !== null && in_array($method, ['PUT', 'PATCH', 'DELETE'], true)) {
        require_animal_edit_permission($id);
    }

    switch ($method) {
        case 'GET':
            if ($id !== null) {
                $item = $entity->find($id);
                if (!$item) json_response(['error' => 'No encontrado.'], 404);
                if ($name === 'animals') { $item = attach_social_counts([$item])[0]; }
                json_response($item);
            }
            $list = $entity->listAll($query);
            if ($name === 'animals') { $list = attach_social_counts($list); }
            json_response($list);
            break;

        case 'POST':
            $data = read_json_body();
            $created = $entity->create($data);

            // Al crear una solicitud de adopción, notificar al dueño del animal.
            if ($name === 'adoption-requests' && $created) {
                $ownerEmail = animal_owner_email($created['animal_id'] ?? null);
                $solicitante = $created['nombre_solicitante'] ?? 'Alguien';
                if ($ownerEmail && $ownerEmail !== ($created['email_solicitante'] ?? null)) {
                    push_notification(
                        $ownerEmail, 'adopcion',
                        $solicitante . ' quiere adoptar a ' . ($created['animal_nombre'] ?? 'tu animal') . '.',
                        $created['animal_id'] ?? null, $solicitante
                    );
                }
            }

            json_response($created, 201);
            break;

        case 'PUT':
        case 'PATCH':
            if ($id === null) json_response(['error' => 'Falta el id.'], 400);
            $data = read_json_body();
            $updated = $entity->update($id, $data);
            if (!$updated) json_response(['error' => 'No encontrado.'], 404);
            json_response($updated);
            break;

        case 'DELETE':
            if ($id === null) json_response(['error' => 'Falta el id.'], 400);
            json_response($entity->delete($id));
            break;

        default:
            json_response(['error' => 'Método no permitido.'], 405);
    }
}

json_response(['error' => 'Ruta no encontrada: ' . $route], 404);
