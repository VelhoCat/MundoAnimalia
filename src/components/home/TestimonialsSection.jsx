import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const testimonials = [
  {
    name: 'María González',
    role: 'Adoptó a Luna',
    text: 'Luna llegó a nuestras vidas y nos cambió para siempre. Mundo Animalia hizo todo el proceso muy fácil y nos acompañaron en cada paso.',
    initials: 'MG',
  },
  {
    name: 'Pedro Rojas',
    role: 'Adoptó a Max',
    text: 'Max es el mejor amigo de mis hijos. Gracias a esta plataforma pudimos darle un hogar a un perrito que lo necesitaba muchísimo.',
    initials: 'PR',
  },
  {
    name: 'Carolina Muñoz',
    role: 'Voluntaria activa',
    text: 'Ser voluntaria en Mundo Animalia es increíble. Ver cómo cada animal encuentra su familia es la mayor satisfacción que existe.',
    initials: 'CM',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-primary font-heading font-semibold text-sm uppercase tracking-wider">
            Testimonios
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl mt-2 mb-4">
            Historias que inspiran
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm"
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array(5).fill(0).map((_, j) => (
                    <Star key={j} className="w-3 h-3 fill-secondary text-secondary" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
