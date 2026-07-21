// ============================================================
// Cliente real de la API (PHP + MySQL).
// Replica EXACTAMENTE la interfaz del mock `base44`, para que
// las páginas no necesiten cambios.
// ============================================================

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost/Mundo-Animalia-Prototipo/backend').replace(/\/$/, '');

// Mapea el nombre de entidad (frontend) al recurso de la API
const RESOURCE = {
  Animal: 'animals',
  AdoptionRequest: 'adoption-requests',
  User: 'users',
  Noticia: 'noticias',
};

// Wrapper fetch con manejo de errores y cookies de sesión
async function request(path, { method = 'GET', body, isForm = false } = {}) {
  const opts = {
    method,
    credentials: 'include', // envía/recibe la cookie de sesión
    headers: {},
  };

  if (body !== undefined) {
    if (isForm) {
      opts.body = body; // FormData: el navegador pone el Content-Type
    } else {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
  }

  const res = await fetch(`${API_URL}${path}`, opts);

  // 204 sin contenido
  if (res.status === 204) return null;

  let data = null;
  const text = await res.text();
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }

  if (!res.ok) {
    const message = (data && data.error) ? data.error : `Error ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// Construye query string a partir de criterios + orden + límite
function buildQuery(criteria = {}, sortField, limit) {
  const params = new URLSearchParams();
  Object.entries(criteria || {}).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    params.append(k, v);
  });
  if (sortField) params.append('sort', sortField);
  if (limit) params.append('limit', String(limit));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

// Crea el API CRUD para una entidad, con la misma firma que el mock
function createEntityApi(entityName) {
  const resource = RESOURCE[entityName];
  return {
    list: (sortField) => request(`/${resource}${buildQuery({}, sortField)}`),
    filter: (criteria, sortField, limit) =>
      request(`/${resource}${buildQuery(criteria, sortField, limit)}`),
    create: (data) => request(`/${resource}`, { method: 'POST', body: data }),
    update: (id, data) => request(`/${resource}/${id}`, { method: 'PUT', body: data }),
    delete: (id) => request(`/${resource}/${id}`, { method: 'DELETE' }),
  };
}

export const base44 = {
  entities: {
    Animal: createEntityApi('Animal'),
    AdoptionRequest: createEntityApi('AdoptionRequest'),
    User: createEntityApi('User'),
    Noticia: createEntityApi('Noticia'),
  },
  auth: {
    isAuthenticated: async () => {
      try {
        await request('/auth/me');
        return true;
      } catch {
        return false;
      }
    },
    me: () => request('/auth/me'), // lanza error si no hay sesión (como espera el frontend)
    login: (email, password) =>
      request('/auth/login', { method: 'POST', body: { email, password } }),
    register: (payload) =>
      request('/auth/register', { method: 'POST', body: payload }),
    // Editar el perfil propio: { full_name?, password_actual?, password_nueva? }
    updateProfile: (payload) =>
      request('/auth/profile', { method: 'PUT', body: payload }),
    logout: async (redirectUrl) => {
      try { await request('/auth/logout', { method: 'POST' }); } catch { /* ignora */ }
      if (redirectUrl) window.location.href = redirectUrl;
    },
    redirectToLogin: (returnUrl) => {
      // Redirige a la página de login del frontend conservando el destino
      const target = returnUrl ? `?redirect=${encodeURIComponent(returnUrl)}` : '';
      window.location.href = `/login${target}`;
    },
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        const form = new FormData();
        form.append('file', file);
        return request('/upload', { method: 'POST', body: form, isForm: true });
      },
    },
  },
  // --- Funciones sociales (me gusta, comentarios, notificaciones, estrellas) ---
  social: {
    likes: {
      get: (animalId) => request(`/animals/${animalId}/likes`),
      toggle: (animalId) => request(`/animals/${animalId}/likes`, { method: 'POST' }),
    },
    comments: {
      list: (animalId) => request(`/animals/${animalId}/comments`),
      create: (animalId, texto) =>
        request(`/animals/${animalId}/comments`, { method: 'POST', body: { texto } }),
      update: (commentId, texto) =>
        request(`/comments/${commentId}`, { method: 'PUT', body: { texto } }),
      delete: (commentId) => request(`/comments/${commentId}`, { method: 'DELETE' }),
    },
    notifications: {
      list: () => request('/notifications'),
      markAllRead: () => request('/notifications/read', { method: 'POST' }),
      markRead: (id) => request(`/notifications/${id}/read`, { method: 'POST' }),
      delete: (id) => request(`/notifications/${id}`, { method: 'DELETE' }),
      clearAll: () => request('/notifications', { method: 'DELETE' }),
    },
    userStats: (email) =>
      request(`/user-stats${email ? `?email=${encodeURIComponent(email)}` : ''}`),
  },
};

export default base44;
