// Mock data for Mundo Animalia - replaces Base44 backend

let nextId = 20;
const generateId = () => String(nextId++);

export const mockAnimals = [
  {
    id: '1',
    nombre: 'Luna',
    descripcion: 'Luna es una perrita mestiza muy cariñosa y juguetona. Fue rescatada de las calles de Arica cuando era cachorra. Le encanta jugar con pelotas y dar paseos largos. Es muy sociable con otros perros y con niños.',
    especie: 'perro',
    raza: 'Mestiza',
    edad_estimada: 'joven',
    tamano: 'mediano',
    sexo: 'hembra',
    estado_salud: 'excelente',
    vacunas: true,
    esterilizado: true,
    chip: true,
    foto_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
    fotos_adicionales: [],
    ubicacion: 'arica',
    estado_adopcion: 'disponible',
    etiquetas: ['cariñosa', 'juguetona', 'sociable'],
    destacado: true,
    created_date: '2025-03-10T10:00:00Z',
  },
  {
    id: '2',
    nombre: 'Max',
    descripcion: 'Max es un labrador dorado muy tranquilo y obediente. Ideal para familias con niños. Fue entregado por su familia anterior que no podía seguir cuidándolo.',
    especie: 'perro',
    raza: 'Labrador',
    edad_estimada: 'adulto',
    tamano: 'grande',
    sexo: 'macho',
    estado_salud: 'bueno',
    vacunas: true,
    esterilizado: true,
    chip: false,
    foto_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
    fotos_adicionales: [],
    ubicacion: 'arica',
    estado_adopcion: 'disponible',
    etiquetas: ['tranquilo', 'obediente', 'familiar'],
    destacado: true,
    created_date: '2025-03-08T14:00:00Z',
  },
  {
    id: '3',
    nombre: 'Michi',
    descripcion: 'Michi es un gatito naranja muy curioso y independiente. Le gusta explorar y tomar siestas al sol. Es perfecto para departamentos.',
    especie: 'gato',
    raza: 'Mestizo',
    edad_estimada: 'cachorro',
    tamano: 'pequeño',
    sexo: 'macho',
    estado_salud: 'excelente',
    vacunas: true,
    esterilizado: false,
    chip: false,
    foto_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
    fotos_adicionales: [],
    ubicacion: 'arica',
    estado_adopcion: 'disponible',
    etiquetas: ['curioso', 'independiente', 'departamento'],
    destacado: true,
    created_date: '2025-03-05T09:00:00Z',
  },
  {
    id: '4',
    nombre: 'Bella',
    descripcion: 'Bella es una gata siamesa muy elegante y cariñosa. Fue rescatada en Putre y busca un hogar donde pueda sentirse segura.',
    especie: 'gato',
    raza: 'Siamesa',
    edad_estimada: 'adulto',
    tamano: 'pequeño',
    sexo: 'hembra',
    estado_salud: 'bueno',
    vacunas: true,
    esterilizado: true,
    chip: true,
    foto_url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop',
    fotos_adicionales: [],
    ubicacion: 'putre',
    estado_adopcion: 'disponible',
    etiquetas: ['elegante', 'cariñosa', 'tranquila'],
    destacado: false,
    created_date: '2025-02-28T16:00:00Z',
  },
  {
    id: '5',
    nombre: 'Rocky',
    descripcion: 'Rocky es un perro pastor alemán muy leal y protector. Necesita un hogar con patio donde pueda correr y jugar.',
    especie: 'perro',
    raza: 'Pastor Alemán',
    edad_estimada: 'adulto',
    tamano: 'grande',
    sexo: 'macho',
    estado_salud: 'excelente',
    vacunas: true,
    esterilizado: true,
    chip: true,
    foto_url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=300&fit=crop',
    fotos_adicionales: [],
    ubicacion: 'arica',
    estado_adopcion: 'en_proceso',
    etiquetas: ['leal', 'protector', 'activo'],
    destacado: true,
    created_date: '2025-02-20T11:00:00Z',
  },
  {
    id: '6',
    nombre: 'Pelusa',
    descripcion: 'Pelusa es una gatita persa muy dulce. Le encanta que la acaricien y dormir en lugares cálidos.',
    especie: 'gato',
    raza: 'Persa',
    edad_estimada: 'senior',
    tamano: 'pequeño',
    sexo: 'hembra',
    estado_salud: 'en_tratamiento',
    vacunas: true,
    esterilizado: true,
    chip: false,
    foto_url: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&h=300&fit=crop',
    fotos_adicionales: [],
    ubicacion: 'camarones',
    estado_adopcion: 'disponible',
    etiquetas: ['dulce', 'tranquila', 'cariñosa'],
    destacado: false,
    created_date: '2025-02-15T08:00:00Z',
  },
  {
    id: '7',
    nombre: 'Toby',
    descripcion: 'Toby es un cachorro mestizo muy enérgico y alegre. Fue encontrado abandonado y ahora busca una familia que le dé mucho amor.',
    especie: 'perro',
    raza: 'Mestizo',
    edad_estimada: 'cachorro',
    tamano: 'pequeño',
    sexo: 'macho',
    estado_salud: 'bueno',
    vacunas: false,
    esterilizado: false,
    chip: false,
    foto_url: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400&h=300&fit=crop',
    fotos_adicionales: [],
    ubicacion: 'general_lagos',
    estado_adopcion: 'disponible',
    etiquetas: ['enérgico', 'alegre', 'cachorro'],
    destacado: true,
    created_date: '2025-03-12T13:00:00Z',
  },
  {
    id: '8',
    nombre: 'Canela',
    descripcion: 'Canela es una perrita cocker muy dulce. Ya fue adoptada por una familia amorosa de Arica.',
    especie: 'perro',
    raza: 'Cocker Spaniel',
    edad_estimada: 'joven',
    tamano: 'mediano',
    sexo: 'hembra',
    estado_salud: 'excelente',
    vacunas: true,
    esterilizado: true,
    chip: true,
    foto_url: 'https://images.unsplash.com/photo-1510771613990-82b1f6d02852?w=400&h=300&fit=crop',
    fotos_adicionales: [],
    ubicacion: 'arica',
    estado_adopcion: 'adoptado',
    etiquetas: ['dulce', 'familiar'],
    destacado: false,
    created_date: '2025-01-15T10:00:00Z',
  },
];

export const mockAdoptionRequests = [
  {
    id: '1',
    animal_id: '5',
    animal_nombre: 'Rocky',
    nombre_solicitante: 'Carlos Mendoza',
    email_solicitante: 'carlos.mendoza@gmail.com',
    telefono: '+56 9 8765 4321',
    direccion: 'Av. Comandante San Martín 1234, Arica',
    tipo_vivienda: 'casa',
    tiene_patio: true,
    otras_mascotas: false,
    experiencia_mascotas: 'Tuve un pastor alemán por 10 años. Tengo experiencia con razas grandes.',
    motivo: 'Busco un compañero leal para mi hogar. Tengo amplio patio y mucho tiempo para dedicarle.',
    estado: 'en_revision',
    notas_admin: '',
    created_date: '2025-03-15T09:30:00Z',
  },
  {
    id: '2',
    animal_id: '1',
    animal_nombre: 'Luna',
    nombre_solicitante: 'Ana López',
    email_solicitante: 'ana.lopez@hotmail.com',
    telefono: '+56 9 1234 5678',
    direccion: 'Calle Bolognesi 567, Arica',
    tipo_vivienda: 'departamento',
    tiene_patio: false,
    otras_mascotas: true,
    experiencia_mascotas: 'Tengo un gato. He tenido perros antes.',
    motivo: 'Luna me robó el corazón cuando la vi en el catálogo. Quiero darle un hogar lleno de amor.',
    estado: 'pendiente',
    notas_admin: '',
    created_date: '2025-03-14T15:00:00Z',
  },
];

export const mockUsers = [
  {
    id: '1',
    full_name: 'Diego Pizarro',
    email: 'admin@mundoanimalia.cl',
    role: 'admin',
    created_date: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    full_name: 'María González',
    email: 'maria@mundoanimalia.cl',
    role: 'voluntario',
    created_date: '2025-01-15T00:00:00Z',
  },
  {
    id: '3',
    full_name: 'Carlos Mendoza',
    email: 'carlos.mendoza@gmail.com',
    role: 'adoptante',
    created_date: '2025-02-10T00:00:00Z',
  },
  {
    id: '4',
    full_name: 'Ana López',
    email: 'ana.lopez@hotmail.com',
    role: 'adoptante',
    created_date: '2025-03-01T00:00:00Z',
  },
];

// In-memory store
const store = {
  Animal: [...mockAnimals],
  AdoptionRequest: [...mockAdoptionRequests],
  User: [...mockUsers],
};

// Generic CRUD operations for mock entities
function createEntityApi(entityName) {
  return {
    list: (sortField) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          let items = [...store[entityName]];
          if (sortField === '-created_date') {
            items.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
          }
          resolve(items);
        }, 300);
      });
    },
    filter: (criteria, sortField, limit) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          let items = store[entityName].filter(item => {
            return Object.entries(criteria).every(([key, value]) => {
              if (value === undefined || value === null || value === '') return true;
              return String(item[key]) === String(value);
            });
          });
          if (sortField === '-created_date') {
            items.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
          }
          if (limit) items = items.slice(0, limit);
          resolve(items);
        }, 300);
      });
    },
    create: (data) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const item = { ...data, id: generateId(), created_date: new Date().toISOString() };
          store[entityName].push(item);
          resolve(item);
        }, 300);
      });
    },
    update: (id, data) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = store[entityName].findIndex(item => item.id === String(id));
          if (index !== -1) {
            store[entityName][index] = { ...store[entityName][index], ...data };
            resolve(store[entityName][index]);
          }
          resolve(null);
        }, 300);
      });
    },
    delete: (id) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          store[entityName] = store[entityName].filter(item => item.id !== String(id));
          resolve(true);
        }, 300);
      });
    },
  };
}

// Mock Base44 client
export const base44 = {
  entities: {
    Animal: createEntityApi('Animal'),
    AdoptionRequest: createEntityApi('AdoptionRequest'),
    User: createEntityApi('User'),
  },
  auth: {
    isAuthenticated: () => Promise.resolve(true),
    me: () => Promise.resolve(store.User[0]), // Returns admin user by default
    logout: (redirectUrl) => {
      if (redirectUrl) window.location.href = redirectUrl;
    },
    redirectToLogin: (returnUrl) => {
      console.log('Mock: redirectToLogin called with', returnUrl);
    },
  },
  integrations: {
    Core: {
      UploadFile: ({ file }) => {
        return new Promise((resolve) => {
          const url = URL.createObjectURL(file);
          setTimeout(() => resolve({ file_url: url }), 500);
        });
      },
    },
  },
};
