<?php
// ============================================================
// Funciones sociales: me gusta, comentarios, notificaciones,
// estrellas de usuario. Usan la sesión (current_user) para
// identificar y autorizar.
// ============================================================

// Devuelve el usuario actual o corta con 401.
function require_user() {
    $user = current_user();
    if (!$user) {
        json_response(['error' => 'Debes iniciar sesión.'], 401);
    }
    return $user;
}

// --- Estrellas ---------------------------------------------------------------
// 1 estrella desde 1 animal, 2 desde 3, 3 desde 5, 4 desde 10, 5 desde 20.
function stars_for_count($n) {
    $n = (int) $n;
    if ($n >= 20) return 5;
    if ($n >= 10) return 4;
    if ($n >= 5)  return 3;
    if ($n >= 3)  return 2;
    if ($n >= 1)  return 1;
    return 0;
}

// Crea una notificación (uso interno).
function push_notification($toEmail, $tipo, $mensaje, $animalId = null, $deNombre = null) {
    if (!$toEmail) return;
    $stmt = db()->prepare(
        'INSERT INTO notifications (user_email, tipo, mensaje, animal_id, de_nombre)
         VALUES (?,?,?,?,?)'
    );
    $stmt->execute([$toEmail, $tipo, $mensaje, $animalId, $deNombre]);
}

// Devuelve el email de quien publicó un animal (o null).
function animal_owner_email($animalId) {
    $stmt = db()->prepare('SELECT publicado_por FROM animals WHERE id = ?');
    $stmt->execute([$animalId]);
    $row = $stmt->fetch();
    return $row && !empty($row['publicado_por']) ? $row['publicado_por'] : null;
}

// Autoriza editar/eliminar un animal: admin, o el dueño (publicado_por).
function require_animal_edit_permission($animalId) {
    $user = require_user();
    if ($user['role'] === 'admin') return $user;
    $owner = animal_owner_email($animalId);
    if ($owner && $owner === $user['email']) return $user;
    json_response(['error' => 'No tienes permiso para modificar esta publicación.'], 403);
}

// --- Contadores para el catálogo --------------------------------------------
// Adjunta likes_count, comments_count y liked (para el usuario actual) a una
// lista de animales ya normalizados.
function attach_social_counts($animals) {
    if (empty($animals)) return $animals;

    $likeCounts = [];
    $commentCounts = [];
    $liked = [];

    // Si las tablas sociales aún no se importaron, no rompemos el catálogo:
    // devolvemos contadores en 0.
    try {
        foreach (db()->query('SELECT animal_id, COUNT(*) c FROM likes GROUP BY animal_id') as $r) {
            $likeCounts[(string) $r['animal_id']] = (int) $r['c'];
        }
        foreach (db()->query('SELECT animal_id, COUNT(*) c FROM comments GROUP BY animal_id') as $r) {
            $commentCounts[(string) $r['animal_id']] = (int) $r['c'];
        }
        $user = current_user();
        if ($user) {
            $stmt = db()->prepare('SELECT animal_id FROM likes WHERE user_email = ?');
            $stmt->execute([$user['email']]);
            foreach ($stmt->fetchAll() as $r) {
                $liked[(string) $r['animal_id']] = true;
            }
        }
    } catch (Throwable $e) {
        // Tablas sociales ausentes: continúa con contadores en 0.
    }

    foreach ($animals as &$a) {
        $id = (string) $a['id'];
        $a['likes_count']    = $likeCounts[$id] ?? 0;
        $a['comments_count'] = $commentCounts[$id] ?? 0;
        $a['liked']          = isset($liked[$id]);
    }
    unset($a);
    return $animals;
}

// --- Me gusta ----------------------------------------------------------------
// GET  /animals/{id}/likes  -> { count, liked }
// POST /animals/{id}/likes  -> alterna el me gusta (login requerido)
function handle_likes($animalId, $method) {
    if ($method === 'POST') {
        $user = require_user();

        // ¿Ya existe?
        $stmt = db()->prepare('SELECT id FROM likes WHERE animal_id = ? AND user_email = ?');
        $stmt->execute([$animalId, $user['email']]);
        $existing = $stmt->fetch();

        if ($existing) {
            $del = db()->prepare('DELETE FROM likes WHERE id = ?');
            $del->execute([$existing['id']]);
            $liked = false;
        } else {
            $ins = db()->prepare('INSERT INTO likes (animal_id, user_email) VALUES (?,?)');
            $ins->execute([$animalId, $user['email']]);
            $liked = true;
        }
    } else {
        $liked = false;
        $user = current_user();
        if ($user) {
            $stmt = db()->prepare('SELECT id FROM likes WHERE animal_id = ? AND user_email = ?');
            $stmt->execute([$animalId, $user['email']]);
            $liked = (bool) $stmt->fetch();
        }
    }

    $stmt = db()->prepare('SELECT COUNT(*) c FROM likes WHERE animal_id = ?');
    $stmt->execute([$animalId]);
    $count = (int) $stmt->fetch()['c'];

    json_response(['count' => $count, 'liked' => $liked]);
}

// --- Comentarios -------------------------------------------------------------
// GET  /animals/{id}/comments  -> lista
// POST /animals/{id}/comments  -> crear (login) { texto }
function handle_comments($animalId, $method) {
    if ($method === 'POST') {
        $user = require_user();
        $body = read_json_body();
        $texto = trim($body['texto'] ?? '');
        if ($texto === '') {
            json_response(['error' => 'El comentario no puede estar vacío.'], 400);
        }
        $stmt = db()->prepare(
            'INSERT INTO comments (animal_id, user_email, autor_nombre, texto) VALUES (?,?,?,?)'
        );
        $stmt->execute([$animalId, $user['email'], $user['full_name'], $texto]);
        $id = db()->lastInsertId();

        // Notificar al dueño de la publicación (si no es uno mismo).
        $owner = animal_owner_email($animalId);
        if ($owner && $owner !== $user['email']) {
            push_notification($owner, 'comentario',
                $user['full_name'] . ' comentó en tu publicación.', $animalId, $user['full_name']);
        }

        $stmt = db()->prepare('SELECT * FROM comments WHERE id = ?');
        $stmt->execute([$id]);
        json_response(normalize_row($stmt->fetch()), 201);
    }

    // GET: lista de comentarios (más recientes primero)
    $stmt = db()->prepare('SELECT * FROM comments WHERE animal_id = ? ORDER BY created_date DESC');
    $stmt->execute([$animalId]);
    json_response(normalize_rows($stmt->fetchAll()));
}

// PUT/DELETE /comments/{id}
// Editar: solo el autor. Eliminar: autor o admin.
function handle_comment($commentId, $method) {
    $user = require_user();
    $stmt = db()->prepare('SELECT * FROM comments WHERE id = ?');
    $stmt->execute([$commentId]);
    $comment = $stmt->fetch();
    if (!$comment) {
        json_response(['error' => 'Comentario no encontrado.'], 404);
    }

    $isOwner = ($comment['user_email'] === $user['email']);
    $isAdmin = ($user['role'] === 'admin');

    if ($method === 'PUT' || $method === 'PATCH') {
        if (!$isOwner) {
            json_response(['error' => 'Solo puedes editar tus propios comentarios.'], 403);
        }
        $body = read_json_body();
        $texto = trim($body['texto'] ?? '');
        if ($texto === '') {
            json_response(['error' => 'El comentario no puede estar vacío.'], 400);
        }
        $upd = db()->prepare('UPDATE comments SET texto = ? WHERE id = ?');
        $upd->execute([$texto, $commentId]);
        $stmt = db()->prepare('SELECT * FROM comments WHERE id = ?');
        $stmt->execute([$commentId]);
        json_response(normalize_row($stmt->fetch()));
    }

    if ($method === 'DELETE') {
        if (!$isOwner && !$isAdmin) {
            json_response(['error' => 'No tienes permiso para eliminar este comentario.'], 403);
        }
        $del = db()->prepare('DELETE FROM comments WHERE id = ?');
        $del->execute([$commentId]);
        json_response(['success' => true, 'deleted' => (string) $commentId]);
    }

    json_response(['error' => 'Método no permitido.'], 405);
}

// --- Notificaciones ----------------------------------------------------------
// GET  /notifications           -> { items, unread }
// POST /notifications/read      -> marca todas como leídas
// POST /notifications/{id}/read -> marca una como leída
function handle_notifications($segments, $method) {
    $user = require_user();

    // Marcar como leídas
    if ($method === 'POST') {
        $id = $segments[1] ?? null;
        if ($id === 'read' || $id === null) {
            $upd = db()->prepare('UPDATE notifications SET leida = 1 WHERE user_email = ?');
            $upd->execute([$user['email']]);
        } else {
            $action = $segments[2] ?? '';
            if ($action === 'read') {
                $upd = db()->prepare('UPDATE notifications SET leida = 1 WHERE id = ? AND user_email = ?');
                $upd->execute([$id, $user['email']]);
            }
        }
        json_response(['success' => true]);
    }

    // GET: listar
    $stmt = db()->prepare(
        'SELECT * FROM notifications WHERE user_email = ? ORDER BY created_date DESC LIMIT 50'
    );
    $stmt->execute([$user['email']]);
    $items = normalize_rows($stmt->fetchAll(), ['leida']);

    $stmt = db()->prepare('SELECT COUNT(*) c FROM notifications WHERE user_email = ? AND leida = 0');
    $stmt->execute([$user['email']]);
    $unread = (int) $stmt->fetch()['c'];

    json_response(['items' => $items, 'unread' => $unread]);
}

// --- Estrellas / estadísticas del usuario ------------------------------------
// GET /user-stats?email=...  (por defecto, el usuario actual)
// Devuelve conteos y estrellas para "dados en adopción" y "adoptados".
function handle_user_stats($query) {
    $email = isset($query['email']) && $query['email'] !== '' ? $query['email'] : null;
    if (!$email) {
        $user = current_user();
        if (!$user) {
            json_response(['error' => 'Falta el email.'], 400);
        }
        $email = $user['email'];
    }

    // Animales publicados por el usuario que ya fueron adoptados.
    $stmt = db()->prepare(
        "SELECT COUNT(*) c FROM animals WHERE publicado_por = ? AND estado_adopcion = 'adoptado'"
    );
    $stmt->execute([$email]);
    $given = (int) $stmt->fetch()['c'];

    // Solicitudes de adopción del usuario que fueron aprobadas/completadas.
    $stmt = db()->prepare(
        "SELECT COUNT(*) c FROM adoption_requests
         WHERE email_solicitante = ?
           AND estado IN ('aprobada','aprobado','aceptada','aceptado','completada','completado','adoptado')"
    );
    $stmt->execute([$email]);
    $adopted = (int) $stmt->fetch()['c'];

    json_response([
        'email'         => $email,
        'given_count'   => $given,
        'adopted_count' => $adopted,
        'given_stars'   => stars_for_count($given),
        'adopted_stars' => stars_for_count($adopted),
    ]);
}
