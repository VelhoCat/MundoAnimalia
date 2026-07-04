import React from 'react';
import { Star } from 'lucide-react';

// Muestra un nivel de estrellas (0 a 5).
// Props:
//   stars   -> número de estrellas llenas (0-5)
//   count   -> (opcional) cantidad de animales, se muestra entre paréntesis
//   label   -> (opcional) texto descriptivo
//   size    -> tamaño del icono en px (por defecto 16)
export default function UserStars({ stars = 0, count = null, label = null, size = 16 }) {
  const filled = Math.max(0, Math.min(5, Math.round(stars)));
  return (
    <div className="flex items-center gap-1.5" title={label || undefined}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            style={{ width: size, height: size }}
            className={
              i < filled
                ? 'fill-amber-400 text-amber-400'
                : 'text-muted-foreground/30'
            }
          />
        ))}
      </div>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
      {count !== null && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
