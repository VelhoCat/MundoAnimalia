// Guía de cuidados personalizada por especie, raza, edad, tamaño y estado de la mascota.
// Se usa al momento de adoptar para mostrar recomendaciones concretas del animal elegido.

// Cuidados base según la especie
const speciesGuide = {
  perro: {
    alimentacion: [
      'Ofrécele alimento balanceado para perro de buena calidad, acorde a su edad y tamaño.',
      'Divide la comida en 2 raciones diarias y mantén horarios fijos.',
      'Ten siempre agua fresca y limpia a su disposición.',
      'Evita darle chocolate, cebolla, uvas, huesos cocidos y comida muy condimentada.',
    ],
    higiene: [
      'Báñalo cada 4-6 semanas o cuando esté sucio, usando shampoo para perros.',
      'Revísale y límpiale orejas, ojos y dientes con regularidad.',
      'Córtale las uñas cuando estén largas para que camine cómodo.',
    ],
    salud: [
      'Llévalo al veterinario para un chequeo general al menos una vez al año.',
      'Mantén al día su desparasitación interna y el control de pulgas y garrapatas.',
    ],
    ejercicio: [
      'Sácalo a pasear todos los días para que gaste energía y socialice.',
      'Dedícale ratos de juego y refuerza órdenes básicas con premios.',
      'Dale un espacio propio, cómodo y protegido para descansar.',
    ],
  },
  gato: {
    alimentacion: [
      'Ofrécele alimento balanceado para gato acorde a su edad.',
      'Combina alimento seco con húmedo para ayudar a mantenerlo hidratado.',
      'Ten siempre agua fresca; a muchos gatos les gustan las fuentes de agua.',
      'Evita darle leche de vaca, chocolate, cebolla y atún en exceso.',
    ],
    higiene: [
      'Mantén su caja de arena limpia y en un lugar tranquilo.',
      'Cepíllalo para reducir las bolas de pelo y controlar la muda.',
      'Revísale oídos, ojos y dientes con regularidad.',
    ],
    salud: [
      'Llévalo al veterinario para un chequeo al menos una vez al año.',
      'Mantén al día su desparasitación y control de pulgas.',
    ],
    ejercicio: [
      'Dale rascadores, juguetes y lugares altos para trepar y observar.',
      'Dedícale ratos de juego diario para mantenerlo activo y estimulado.',
      'Protege ventanas y balcones para evitar caídas.',
    ],
  },
};

// Cuidados específicos por raza (clave en minúsculas)
const breedGuide = {
  labrador: {
    alimentacion: ['Los labradores tienden a la obesidad: controla las porciones y modera los premios.'],
    higiene: ['Su pelaje corto suelta bastante pelo: cepíllalo 1-2 veces por semana.'],
    salud: ['Vigila sus caderas y articulaciones (predisposición a displasia) manteniéndolo en su peso ideal.'],
    ejercicio: ['Necesita bastante ejercicio diario; disfruta nadar y los juegos de buscar la pelota.'],
  },
  'pastor alemán': {
    higiene: ['Tiene doble manto y muda mucho: cepíllalo 3-4 veces por semana.'],
    salud: ['Cuida sus caderas y codos (predisposición a displasia) y su digestión con alimento de calidad.'],
    ejercicio: [
      'Es muy activo e inteligente: dale ejercicio y estimulación mental a diario.',
      'Refuerza su socialización y entrenamiento desde temprano.',
    ],
  },
  'cocker spaniel': {
    higiene: [
      'Sus orejas largas se infectan con facilidad: revísalas y límpialas con frecuencia.',
      'Su pelaje requiere cepillado frecuente y peluquería cada cierto tiempo.',
    ],
    salud: ['Revisa sus ojos y oídos con regularidad y controla su peso.'],
    ejercicio: ['Es muy apegado: evita dejarlo solo por mucho tiempo para prevenir la ansiedad por separación.'],
  },
  siamesa: {
    salud: ['Vigila su salud dental y respiratoria con chequeos regulares.'],
    ejercicio: ['Es muy sociable y comunicativa: dale compañía y juguetes interactivos.'],
  },
  siames: {
    salud: ['Vigila su salud dental y respiratoria con chequeos regulares.'],
    ejercicio: ['Es muy sociable y comunicativo: dale compañía y juguetes interactivos.'],
  },
  persa: {
    higiene: [
      'Su pelaje largo necesita cepillado diario para evitar nudos.',
      'Límpiale los ojos a diario, ya que suele lagrimear por su cara plana.',
    ],
    salud: ['Vigila su respiración y su salud renal, y ofrécele bastante agua.'],
    ejercicio: ['Prefiere ambientes tranquilos y sin sobresaltos.'],
  },
  mestizo: {
    salud: ['Los mestizos suelen ser sanos y resistentes; aun así, mantén sus controles al día.'],
  },
  mestiza: {
    salud: ['Las mestizas suelen ser sanas y resistentes; aun así, mantén sus controles al día.'],
  },
};

// Cuidados según la etapa de vida
const ageGuide = {
  cachorro: [
    'Completa su plan de vacunación y desparasitación con el veterinario.',
    'Aliméntalo con comida especial para cachorros, varias veces al día.',
    'Es la mejor etapa para socializarlo y enseñarle buenos hábitos.',
  ],
  joven: [
    'Canaliza su energía con juego y ejercicio para evitar conductas destructivas.',
    'Consulta el mejor momento para esterilizarlo si aún no lo está.',
  ],
  adulto: [
    'Mantén una rutina estable de alimentación, ejercicio y controles anuales.',
  ],
  senior: [
    'Aumenta la frecuencia de chequeos veterinarios (idealmente cada 6 meses).',
    'Cámbialo a una dieta senior y cuida sus articulaciones con lugares blandos para descansar.',
    'Vigila cambios en su apetito, peso o comportamiento.',
  ],
};

// Cuidados según el tamaño (perros)
const sizeGuideDog = {
  pequeño: {
    salud: ['Cuida su dentadura, ya que los perros pequeños acumulan sarro con facilidad, y protégelo del frío.'],
  },
  grande: {
    alimentacion: ['Ofrécele alimento formulado para razas grandes.'],
    ejercicio: ['Cuida sus articulaciones evitando el ejercicio de alto impacto mientras crece.'],
  },
};

const dedupe = (arr) => [...new Set(arr.filter(Boolean))];

/**
 * Devuelve una guía de cuidados personalizada para un animal concreto.
 * @param {object} animal - Entidad Animal (especie, raza, edad_estimada, tamano, etc.)
 * @returns {{ sections: Array<{ iconKey: string, title: string, tips: string[] }> }}
 */
export function getCareGuide(animal) {
  if (!animal) return { sections: [] };

  const especie = (animal.especie || '').toLowerCase();
  const base = speciesGuide[especie] || speciesGuide.perro;
  const breed = breedGuide[(animal.raza || '').trim().toLowerCase()] || {};
  const size = especie === 'perro' ? (sizeGuideDog[animal.tamano] || {}) : {};
  const age = ageGuide[animal.edad_estimada] || [];

  const merge = (cat) => dedupe([...(base[cat] || []), ...(breed[cat] || []), ...(size[cat] || [])]);

  // Salud + avisos según el estado real de la mascota
  const salud = merge('salud');
  if (!animal.vacunas) {
    salud.push('Aún tiene vacunas pendientes: agéndalas apenas lo adoptes.');
  }
  if (!animal.esterilizado) {
    salud.push('Todavía no está esterilizado/a: coordina la esterilización con tu veterinario.');
  }
  if (animal.estado_salud === 'en_tratamiento') {
    salud.push('Actualmente está en tratamiento: continúa las indicaciones del veterinario hasta el alta.');
  }
  if (animal.estado_salud === 'requiere_atencion') {
    salud.push('Requiere atención veterinaria: prioriza una consulta apenas lo adoptes.');
  }

  const sections = [
    { iconKey: 'food', title: 'Alimentación', tips: merge('alimentacion') },
    { iconKey: 'hygiene', title: 'Higiene y pelaje', tips: merge('higiene') },
    { iconKey: 'health', title: 'Salud y prevención', tips: dedupe(salud) },
    { iconKey: 'home', title: 'Ejercicio y hogar', tips: merge('ejercicio') },
    { iconKey: 'age', title: 'Según su edad', tips: dedupe(age) },
  ];

  return { sections: sections.filter((s) => s.tips.length > 0) };
}
