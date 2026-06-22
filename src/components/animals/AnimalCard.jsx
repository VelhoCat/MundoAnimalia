import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { MapPin, Heart, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const edadLabels = { cachorro: 'Cachorro', joven: 'Joven', adulto: 'Adulto', senior: 'Senior' };
const tamanoLabels = { pequeño: 'Pequeño', mediano: 'Mediano', grande: 'Grande' };
const ubicacionLabels = { arica: 'Arica', putre: 'Putre', camarones: 'Camarones', general_lagos: 'General Lagos' };
const especieEmoji = { perro: '🐕', gato: '🐈', otro: '🐾' };

export default function AnimalCard({ animal, index = 0 }) {
  const defaultPhoto = animal.especie === 'gato' 
    ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop'
    : 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={`/animal/${animal.id}`}>
        <div className="group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={animal.foto_url || defaultPhoto}
              alt={animal.nombre}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            
            {/* Status badge */}
            <div className="absolute top-3 left-3">
              <Badge className={`text-xs font-medium ${
                animal.estado_adopcion === 'disponible' 
                  ? 'bg-primary text-primary-foreground' 
                  : animal.estado_adopcion === 'en_proceso'
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {animal.estado_adopcion === 'disponible' ? 'Disponible' 
                  : animal.estado_adopcion === 'en_proceso' ? 'En proceso'
                  : 'Adoptado'}
              </Badge>
            </div>

            {/* Species emoji */}
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center text-sm">
              {especieEmoji[animal.especie] || '🐾'}
            </div>

            {/* Name overlay */}
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="font-heading font-bold text-xl text-white drop-shadow-md">
                {animal.nombre}
              </h3>
            </div>
          </div>

          {/* Details */}
          <div className="p-4 space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {animal.raza && (
                <Badge variant="secondary" className="text-xs font-normal">
                  {animal.raza}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs font-normal">
                <Clock className="w-3 h-3 mr-1" />
                {edadLabels[animal.edad_estimada] || animal.edad_estimada}
              </Badge>
              <Badge variant="outline" className="text-xs font-normal">
                {tamanoLabels[animal.tamano] || animal.tamano}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {ubicacionLabels[animal.ubicacion] || animal.ubicacion}
              </div>
              <div className="flex items-center gap-1.5">
                {animal.vacunas && <span className="text-xs" title="Vacunas al día">💉</span>}
                {animal.esterilizado && <span className="text-xs" title="Esterilizado/a">✂️</span>}
                {animal.chip && <span className="text-xs" title="Con microchip">📡</span>}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
