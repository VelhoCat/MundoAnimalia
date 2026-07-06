import React from 'react';
import { Heart, Smile, Shield, Users, Leaf, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  { icon: Heart, title: 'Salvas una vida', description: 'Cada adopción libera espacio para rescatar a otro animal necesitado.' },
  { icon: Smile, title: 'Compañía incondicional', description: 'Los animales adoptados son los más agradecidos y leales compañeros.' },
  { icon: Shield, title: 'Salud garantizada', description: 'Nuestros animales están vacunados, desparasitados y esterilizados.' },
  { icon: Users, title: 'Apoyo continuo', description: 'Te acompañamos en todo el proceso con guía y seguimiento.' },
  { icon: Leaf, title: 'Impacto social', description: 'Contribuyes a reducir el abandono animal en Arica y Parinacota.' },
  { icon: Star, title: 'Amor verdadero', description: 'No hay amor más puro que el de un animal rescatado agradecido.' },
];

export default function BenefitsSection() {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-secondary font-heading font-semibold text-sm uppercase tracking-wider">
            Por qué adoptar
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl mt-2 mb-4">
            Beneficios de adoptar
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group p-6 rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 bg-card"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <b.icon className="w-6 h-6 text-accent-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
