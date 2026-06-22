import React from 'react';
import { Newspaper, Calendar, ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const noticias = [
  {
    id: 1,
    titulo: 'Gran jornada de adopción en Plaza Colón',
    resumen: 'Este sábado 22 de marzo se realizará una feria de adopción masiva en la Plaza Colón de Arica. Habrá más de 30 animales esperando por un hogar, atención veterinaria gratuita y charlas sobre tenencia responsable.',
    fecha: '18 de marzo, 2025',
    categoria: 'Evento',
    imagen: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop',
    ubicacion: 'Arica',
  },
  {
    id: 2,
    titulo: 'Campaña de esterilización gratuita en Putre',
    resumen: 'En conjunto con la Municipalidad de Putre, Mundo Animalia llevará a cabo una campaña de esterilización gratuita para perros y gatos durante el mes de abril. Los cupos son limitados.',
    fecha: '12 de marzo, 2025',
    categoria: 'Campaña',
    imagen: 'https://images.unsplash.com/photo-1612531386530-97d3f29d5173?w=600&h=400&fit=crop',
    ubicacion: 'Putre',
  },
  {
    id: 3,
    titulo: 'Rescate exitoso: 12 cachorros encuentran hogar',
    resumen: 'Gracias al trabajo de nuestros voluntarios, 12 cachorros que fueron encontrados abandonados en el sector de Azapa ya tienen familias adoptivas. Un logro que nos llena de alegría.',
    fecha: '5 de marzo, 2025',
    categoria: 'Rescate',
    imagen: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop',
    ubicacion: 'Arica',
  },
  {
    id: 4,
    titulo: 'Nuevo convenio con clínica veterinaria regional',
    resumen: 'Mundo Animalia firmó un convenio de colaboración con la Clínica Veterinaria del Norte, que permitirá atención preferencial y descuentos en tratamientos para los animales rescatados por la plataforma.',
    fecha: '28 de febrero, 2025',
    categoria: 'Institucional',
    imagen: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600&h=400&fit=crop',
    ubicacion: 'Arica',
  },
  {
    id: 5,
    titulo: 'Taller de primeros auxilios para mascotas',
    resumen: 'Se realizará un taller abierto a la comunidad sobre primeros auxilios básicos para mascotas. Aprende cómo actuar ante emergencias mientras llegas al veterinario.',
    fecha: '20 de febrero, 2025',
    categoria: 'Evento',
    imagen: 'https://images.unsplash.com/photo-1587764379873-97837921fd44?w=600&h=400&fit=crop',
    ubicacion: 'Arica',
  },
  {
    id: 6,
    titulo: 'Voluntarios de Camarones se suman a la causa',
    resumen: 'Un grupo de 15 vecinos de Camarones se organizó como voluntarios de Mundo Animalia para cubrir las necesidades de animales abandonados en la zona rural de la región.',
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
            className="group grid grid-cols-1 lg:grid-cols-2 gap-8 bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
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
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {noticias[0].ubicacion}, Arica y Parinacota
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
                className="group bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
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
                    <Button variant="ghost" size="sm" className="text-primary text-xs px-2 h-7">
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
    </div>
  );
}
