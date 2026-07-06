import React, { useState } from 'react';
import { Newspaper, Calendar, ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const noticias = [
  {
    id: 1,
    titulo: 'Gran jornada de adopción en Plaza Colón',
    resumen: 'Este sábado 22 de marzo se realizará una feria de adopción masiva en la Plaza Colón de Arica. Habrá más de 30 animales esperando por un hogar, atención veterinaria gratuita y charlas sobre tenencia responsable.',
    contenido: 'Este sábado 22 de marzo, desde las 10:00 hasta las 18:00 horas, la Plaza Colón de Arica se llenará de patas y colas en busca de un hogar. Más de 30 perros y gatos rescatados estarán disponibles para adopción responsable, todos vacunados, desparasitados y con revisión veterinaria al día.\n\nDurante la jornada habrá atención veterinaria gratuita para las mascotas de la comunidad, además de charlas sobre tenencia responsable, alimentación y cuidados básicos. Nuestros voluntarios acompañarán a cada familia interesada para asegurar que cada adopción sea una buena decisión, tanto para el animal como para su nuevo hogar.\n\nInvitamos a toda la comunidad a participar. Recuerda: adoptar es un compromiso de amor para toda la vida.',
    fecha: '18 de marzo, 2025',
    categoria: 'Evento',
    imagen: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop',
    ubicacion: 'Arica',
  },
  {
    id: 2,
    titulo: 'Campaña de esterilización gratuita en Putre',
    resumen: 'En conjunto con la Municipalidad de Putre, Mundo Animalia llevará a cabo una campaña de esterilización gratuita para perros y gatos durante el mes de abril. Los cupos son limitados.',
    contenido: 'En conjunto con la Municipalidad de Putre, Mundo Animalia llevará a cabo una campaña de esterilización gratuita para perros y gatos durante todo el mes de abril. La esterilización es la forma más efectiva y humanitaria de controlar la sobrepoblación animal y prevenir el abandono.\n\nLos cupos son limitados y se asignarán por orden de inscripción. Para reservar, los vecinos pueden acercarse a las oficinas municipales o escribirnos a través de nuestras redes sociales. Cada animal recibirá también control veterinario post-operatorio sin costo.\n\nAgradecemos a los profesionales voluntarios que hacen posible esta campaña y hacemos un llamado a la comunidad de Putre a sumarse a esta iniciativa por el bienestar animal.',
    fecha: '12 de marzo, 2025',
    categoria: 'Campaña',
    imagen: 'https://images.unsplash.com/photo-1612531386530-97d3f29d5173?w=600&h=400&fit=crop',
    ubicacion: 'Putre',
  },
  {
    id: 3,
    titulo: 'Rescate exitoso: 12 cachorros encuentran hogar',
    resumen: 'Gracias al trabajo de nuestros voluntarios, 12 cachorros que fueron encontrados abandonados en el sector de Azapa ya tienen familias adoptivas. Un logro que nos llena de alegría.',
    contenido: 'Hace tres semanas, un grupo de 12 cachorros fue encontrado abandonado en una caja en el sector de Azapa. Estaban deshidratados y con signos de desnutrición. Gracias a la rápida acción de nuestros voluntarios y al apoyo de una veterinaria colaboradora, todos lograron recuperarse por completo.\n\nHoy nos llena de alegría contar que los 12 cachorros ya fueron adoptados por familias responsables de la región. Cada uno pasó por un proceso de evaluación y seguimiento para garantizar su bienestar en el nuevo hogar.\n\nEste tipo de logros solo es posible gracias a la red de voluntarios, familias de acogida y donantes que hacen posible nuestra labor. ¡Gracias a todos quienes hicieron esto realidad!',
    fecha: '5 de marzo, 2025',
    categoria: 'Rescate',
    imagen: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop',
    ubicacion: 'Arica',
  },
  {
    id: 4,
    titulo: 'Nuevo convenio con clínica veterinaria regional',
    resumen: 'Mundo Animalia firmó un convenio de colaboración con la Clínica Veterinaria del Norte, que permitirá atención preferencial y descuentos en tratamientos para los animales rescatados por la plataforma.',
    contenido: 'Mundo Animalia firmó un importante convenio de colaboración con la Clínica Veterinaria del Norte. Este acuerdo permitirá atención preferencial y descuentos significativos en tratamientos, cirugías y exámenes para todos los animales rescatados a través de la plataforma.\n\nEl convenio también contempla jornadas de capacitación para nuestros voluntarios y acceso a atención de urgencia en horario extendido. Esto representa un gran avance en nuestra capacidad de responder ante casos críticos.\n\nSeguimos construyendo alianzas que fortalecen la red de protección animal en la región de Arica y Parinacota.',
    fecha: '28 de febrero, 2025',
    categoria: 'Institucional',
    imagen: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600&h=400&fit=crop',
    ubicacion: 'Arica',
  },
  {
    id: 5,
    titulo: 'Taller de primeros auxilios para mascotas',
    resumen: 'Se realizará un taller abierto a la comunidad sobre primeros auxilios básicos para mascotas. Aprende cómo actuar ante emergencias mientras llegas al veterinario.',
    contenido: 'Se realizará un taller gratuito y abierto a toda la comunidad sobre primeros auxilios básicos para mascotas. Aprenderás cómo actuar ante emergencias comunes —heridas, atragantamientos, golpes de calor o intoxicaciones— mientras trasladas a tu mascota al veterinario.\n\nEl taller será dictado por médicos veterinarios y contará con demostraciones prácticas. Los asistentes recibirán una guía impresa con los pasos esenciales para cada situación de emergencia.\n\nLos cupos son limitados. La inscripción es gratuita a través de nuestras redes sociales. ¡Prepárate para cuidar mejor a quienes más quieres!',
    fecha: '20 de febrero, 2025',
    categoria: 'Evento',
    imagen: 'https://images.unsplash.com/photo-1587764379873-97837921fd44?w=600&h=400&fit=crop',
    ubicacion: 'Arica',
  },
  {
    id: 6,
    titulo: 'Voluntarios de Camarones se suman a la causa',
    resumen: 'Un grupo de 15 vecinos de Camarones se organizó como voluntarios de Mundo Animalia para cubrir las necesidades de animales abandonados en la zona rural de la región.',
    contenido: 'Un grupo de 15 vecinos de Camarones se organizó como voluntarios de Mundo Animalia para atender las necesidades de los animales abandonados en la zona rural de la región. Esta nueva red permitirá llegar a lugares donde antes era difícil brindar ayuda.\n\nLos voluntarios recibieron capacitación en rescate, primeros auxilios y manejo responsable de animales. Además, coordinarán con nuestra red central para gestionar adopciones, campañas de esterilización y atención veterinaria.\n\nEste crecimiento comunitario es el corazón de nuestra misión. Si quieres sumarte como voluntario en tu comuna, escríbenos: siempre hay una pata esperando por ayuda.',
    fecha: '10 de febrero, 2025',
    categoria: 'Comunidad',
    imagen: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=400&fit=crop',
    ubicacion: 'Camarones',
  },
];

const categoriaColors = {
  Evento: 'bg-primary/10 text-primary',
  Campaña: 'bg-secondary/10 text-secondary',
  Rescate: 'bg-primary text-primary-foreground',
  Institucional: 'bg-muted text-muted-foreground',
  Comunidad: 'bg-secondary text-secondary-foreground',
};

export default function Noticias() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <section className="py-16 px-4 sm:px-6 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary font-heading font-semibold text-sm uppercase tracking-wider">
              Mantente informado
            </span>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl mt-2 mb-4">
              Noticias
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Entérate de nuestras últimas actividades, campañas, rescates y eventos
              en la región de Arica y Parinacota.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Noticia destacada */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => setSelected(noticias[0])}
            className="group grid grid-cols-1 lg:grid-cols-2 gap-8 bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
              <img
                src={noticias[0].imagen}
                alt={noticias[0].titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 lg:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={categoriaColors[noticias[0].categoria]}>
                  {noticias[0].categoria}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {noticias[0].fecha}
                </span>
              </div>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-4">
                {noticias[0].titulo}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {noticias[0].resumen}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {noticias[0].ubicacion}, Arica y Parinacota
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary"
                  onClick={(e) => { e.stopPropagation(); setSelected(noticias[0]); }}
                >
                  Leer más
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grid de noticias */}
      <section className="py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {noticias.slice(1).map((noticia, i) => (
              <motion.div
                key={noticia.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelected(noticia)}
                className="group bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={noticia.imagen}
                    alt={noticia.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={`text-xs ${categoriaColors[noticia.categoria]}`}>
                      {noticia.categoria}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {noticia.fecha}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2">
                    {noticia.titulo}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                    {noticia.resumen}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {noticia.ubicacion}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary text-xs px-2 h-7"
                      onClick={(e) => { e.stopPropagation(); setSelected(noticia); }}
                    >
                      Leer más
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de noticia completa */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          {selected && (
            <>
              <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
                <img
                  src={selected.imagen}
                  alt={selected.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <Badge className={categoriaColors[selected.categoria]}>
                    {selected.categoria}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {selected.fecha}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {selected.ubicacion}, Arica y Parinacota
                  </span>
                </div>
                <DialogHeader>
                  <DialogTitle className="font-heading text-2xl text-left leading-tight mb-3">
                    {selected.titulo}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  {selected.contenido.split('\n\n').map((parrafo, idx) => (
                    <p key={idx}>{parrafo}</p>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
