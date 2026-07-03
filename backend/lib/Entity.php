<?php
// ============================================================
// CRUD genérico para entidades, con whitelist de columnas.
// ============================================================

class Entity {
    public $table;
    public $columns;     // columnas escribibles (create/update)
    public $boolFields;  // se castean a booleano al leer / a 0|1 al escribir
    public $jsonFields;  // se codifican/decodifican como JSON

    public function __construct($table, $columns, $boolFields = [], $jsonFields = []) {
        $this->table      = $table;
        $this->columns    = $columns;
        $this->boolFields = $boolFields;
        $this->jsonFields = $jsonFields;
    }

    // Columnas válidas para filtrar (incluye id y created_date)
    private function filterableColumns() {
        return array_merge($this->columns, ['id', 'created_date']);
    }

    // Convierte un valor de entrada al formato de almacenamiento de su columna
    private function toStorage($col, $value) {
        if (in_array($col, $this->boolFields, true)) {
            return $value ? 1 : 0;
        }
        if (in_array($col, $this->jsonFields, true)) {
            return json_encode($value === null ? [] : $value, JSON_UNESCAPED_UNICODE);
        }
        return $value;
    }

    // GET lista, con filtros opcionales, orden y límite
    public function listAll($query) {
        $where  = [];
        $params = [];

        foreach ($query as $key => $value) {
            if (in_array($key, ['sort', 'limit', 'offset'], true)) {
                continue;
            }
            if (!in_array($key, $this->filterableColumns(), true)) {
                continue; // ignora parámetros desconocidos
            }
            if ($value === '' || $value === null) {
                continue;
            }
            if (in_array($key, $this->boolFields, true)) {
                $value = ($value === 'true' || $value === '1' || $value === 1 || $value === true) ? 1 : 0;
            }
            $where[] = "`$key` = ?";
            $params[] = $value;
        }

        $sql = "SELECT * FROM `{$this->table}`";
        if ($where) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }

        // Orden: soporta "campo" y "-campo" (descendente)
        $sort = $query['sort'] ?? null;
        if ($sort) {
            $dir = 'ASC';
            $field = $sort;
            if ($field[0] === '-') {
                $dir = 'DESC';
                $field = substr($field, 1);
            }
            if (in_array($field, $this->filterableColumns(), true)) {
                $sql .= " ORDER BY `$field` $dir";
            }
        }

        // Límite / offset
        if (isset($query['limit']) && is_numeric($query['limit'])) {
            $limit = max(0, (int) $query['limit']);
            $sql .= " LIMIT $limit";
            if (isset($query['offset']) && is_numeric($query['offset'])) {
                $offset = max(0, (int) $query['offset']);
                $sql .= " OFFSET $offset";
            }
        }

        $stmt = db()->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();
        return normalize_rows($rows, $this->boolFields, $this->jsonFields);
    }

    public function find($id) {
        $stmt = db()->prepare("SELECT * FROM `{$this->table}` WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return normalize_row($row ?: null, $this->boolFields, $this->jsonFields);
    }

    public function create($data) {
        $cols = [];
        $placeholders = [];
        $params = [];

        foreach ($this->columns as $col) {
            if (array_key_exists($col, $data)) {
                $cols[] = "`$col`";
                $placeholders[] = '?';
                $params[] = $this->toStorage($col, $data[$col]);
            }
        }

        if (!$cols) {
            json_response(['error' => 'No se enviaron campos válidos.'], 400);
        }

        $sql = "INSERT INTO `{$this->table}` (" . implode(',', $cols) . ') VALUES (' . implode(',', $placeholders) . ')';
        $stmt = db()->prepare($sql);
        $stmt->execute($params);
        $id = db()->lastInsertId();
        return $this->find($id);
    }

    public function update($id, $data) {
        $sets = [];
        $params = [];

        foreach ($this->columns as $col) {
            if (array_key_exists($col, $data)) {
                $sets[] = "`$col` = ?";
                $params[] = $this->toStorage($col, $data[$col]);
            }
        }

        if (!$sets) {
            return $this->find($id); // nada que actualizar
        }

        $params[] = $id;
        $sql = "UPDATE `{$this->table}` SET " . implode(', ', $sets) . ' WHERE id = ?';
        $stmt = db()->prepare($sql);
        $stmt->execute($params);
        return $this->find($id);
    }

    public function delete($id) {
        $stmt = db()->prepare("DELETE FROM `{$this->table}` WHERE id = ?");
        $stmt->execute([$id]);
        return ['success' => true, 'deleted' => (string) $id];
    }
}

// --- Registro de entidades ---
function entity_registry() {
    static $registry = null;
    if ($registry !== null) {
        return $registry;
    }

    $registry = [
        'animals' => new Entity(
            'animals',
            ['nombre','descripcion','especie','raza','edad_estimada','tamano','sexo',
             'estado_salud','vacunas','esterilizado','chip','foto_url','fotos_adicionales',
             'ubicacion','estado_adopcion','etiquetas','destacado','publicado_por'],
            ['vacunas','esterilizado','chip','destacado'],
            ['fotos_adicionales','etiquetas']
        ),
        'adoption-requests' => new Entity(
            'adoption_requests',
            ['animal_id','animal_nombre','nombre_solicitante','email_solicitante','telefono',
             'direccion','tipo_vivienda','tiene_patio','otras_mascotas','experiencia_mascotas',
             'motivo','estado','notas_admin'],
            ['tiene_patio','otras_mascotas'],
            []
        ),
        'users' => new Entity(
            'users',
            ['full_name','email','role'],
            [],
            []
        ),
    ];

    return $registry;
}
