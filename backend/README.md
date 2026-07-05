# Mundo Animalia — Backend (PHP + MySQL)

API REST en **PHP puro** (sin frameworks) con **MySQL/MariaDB**, pensada para correr en **XAMPP**.
Reemplaza el cliente mock del frontend manteniendo exactamente la misma interfaz, así que las
páginas de React no necesitan cambios.

---

## 1. Requisitos

- [XAMPP](https://www.apachefriends.org/) (incluye Apache, PHP 7.4+ y MariaDB).
- Node.js (para el frontend).

---

## 2. Instalar el backend en XAMPP

1. Inicia **Apache** y **MySQL** desde el panel de XAMPP.
2. Copia la carpeta `backend/` de este proyecto dentro de `htdocs` de XAMPP de modo que quede en:

   ```
   C:\xampp\htdocs\Mundo-Animalia-Prototipo\backend\
   ```

   > La forma más simple es copiar todo el proyecto `Mundo-Animalia-Prototipo` dentro de `htdocs`.
   > Si lo dejas en otra ruta, ajusta `VITE_API_URL` en el `.env` del frontend (ver paso 4).

3. Verifica que Apache tenga activado `mod_rewrite` (en XAMPP viene activado por defecto).

---

## 3. Crear la base de datos

Todo se importa con **un solo archivo**: `backend/database/install.sql`.

1. Abre **phpMyAdmin**: http://localhost/phpmyadmin
2. Ve a la pestaña **Importar**.
3. Selecciona el archivo `backend/database/install.sql` y pulsa **Continuar**.

Ese único archivo crea la base `mundo_animalia` con **todo**: tablas base y datos de
ejemplo, funciones sociales (me gusta, comentarios, notificaciones), noticias y las
cuentas de administrador.

> No necesitas borrar la base vieja antes: `install.sql` la deja limpia
> automáticamente (elimina las tablas y las vuelve a crear).

> Alternativa por consola:
> ```
> C:\xampp\mysql\bin\mysql -u root < backend\database\install.sql
> ```

> Los archivos sueltos (`schema.sql`, `seed_admins.sql`, `add_social_features.sql`,
> `add_noticias.sql`) se conservan como historial de migraciones; para una instalación
> nueva basta con `install.sql`.

### Credenciales de prueba (sembradas)

Todos los usuarios de ejemplo tienen la contraseña **`password123`**:

| Email                       | Rol         |
|-----------------------------|-------------|
| admin@mundoanimalia.cl      | admin       |
| maria@mundoanimalia.cl      | voluntario  |
| carlos.mendoza@gmail.com    | adoptante   |
| ana.lopez@hotmail.com       | adoptante   |

> Cambia estas contraseñas antes de cualquier despliegue real.

---

## 4. Configurar y correr el frontend

1. En la raíz del proyecto ya existe un archivo `.env`. Revisa que `VITE_API_URL` apunte a tu backend:

   ```
   VITE_API_URL=http://localhost/Mundo-Animalia-Prototipo/backend
   VITE_USE_MOCK=false
   ```

   - `VITE_USE_MOCK=true` vuelve a los datos mock en memoria (sin backend), útil para probar la UI.

2. Instala dependencias y arranca:

   ```
   npm install
   npm run dev
   ```

3. Abre http://localhost:5173

---

## 5. Probar la API directamente

- Health check: http://localhost/Mundo-Animalia-Prototipo/backend/
- Listar animales: http://localhost/Mundo-Animalia-Prototipo/backend/animals
- Filtrar: http://localhost/Mundo-Animalia-Prototipo/backend/animals?especie=perro&estado_adopcion=disponible&sort=-created_date&limit=5
- Un animal: http://localhost/Mundo-Animalia-Prototipo/backend/animals/1

---

## 6. Endpoints

Base: `…/backend`

| Método | Ruta                         | Descripción                                  |
|--------|------------------------------|----------------------------------------------|
| GET    | `/animals`                   | Lista (admite filtros, `sort`, `limit`)      |
| GET    | `/animals/{id}`              | Un animal                                    |
| POST   | `/animals`                   | Crear                                         |
| PUT    | `/animals/{id}`              | Actualizar                                    |
| DELETE | `/animals/{id}`              | Eliminar                                      |
| GET/POST/PUT/DELETE | `/adoption-requests[/{id}]` | Solicitudes de adopción          |
| GET/POST/PUT/DELETE | `/users[/{id}]`     | Usuarios                                      |
| GET/POST/PUT/DELETE | `/noticias[/{id}]`  | Noticias (crear/editar/eliminar: solo admin) |
| POST   | `/auth/login`                | `{ email, password }` → inicia sesión        |
| POST   | `/auth/register`             | `{ full_name, email, password, role? }`      |
| GET    | `/auth/me`                   | Usuario de la sesión actual (401 si no hay)  |
| POST   | `/auth/logout`               | Cierra sesión                                 |
| POST   | `/upload`                    | Sube una imagen (`multipart`, campo `file`)  |

**Filtros**: cualquier columna como parámetro de query (ej. `?especie=gato&ubicacion=arica`).
**Orden**: `?sort=campo` o `?sort=-campo` (descendente).
**Límite**: `?limit=10` (opcional `?offset=0`).

---

## 7. Estructura

```
backend/
├── index.php            # Front controller (router)
├── config.php           # Credenciales de BD, CORS, uploads
├── .htaccess            # Reescritura de rutas a index.php
├── database/
│   ├── install.sql            # Instalador completo (todo en uno) ← usar este
│   ├── schema.sql             # Esquema + datos de ejemplo (base)
│   ├── seed_admins.sql        # Cuentas de administrador
│   ├── add_social_features.sql# Tablas de me gusta, comentarios y notificaciones
│   └── add_noticias.sql       # Tabla de noticias
├── lib/
│   ├── db.php           # Conexión PDO
│   ├── helpers.php      # CORS, respuestas JSON, normalización
│   ├── Entity.php       # CRUD genérico (whitelist de columnas)
│   ├── auth.php         # Login / me / logout / register (sesión PHP)
│   └── upload.php       # Subida de imágenes
└── uploads/             # Archivos subidos (servidos estáticamente)
```

---

## 8. Notas de seguridad

- Las contraseñas se guardan con `password_hash()` (bcrypt) y se verifican con `password_verify()`.
- Todas las consultas usan **sentencias preparadas** (PDO) → protegidas contra inyección SQL.
- El CRUD usa **whitelist de columnas**: solo se aceptan campos conocidos.
- El campo `password_hash` nunca se devuelve en las respuestas.
- En `uploads/` está deshabilitada la ejecución de PHP.
- Para producción: usa HTTPS, cambia las contraseñas de ejemplo, define un usuario MySQL
  dedicado (no `root`) y ajusta `samesite`/`secure` de la cookie de sesión en `lib/auth.php`.
