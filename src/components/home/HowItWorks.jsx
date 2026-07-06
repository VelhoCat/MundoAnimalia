import React from 'react';
import { Search, Heart, Home, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: Search,
    title: 'Explora',
    description: 'Navega por nuestro catálogo de animales rescatados y encuentra a tu compañero ideal.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Heart,
    title: 'Conecta',
    description: 'Conoce su historia, personalidad y necesidades. Cada animal es único y especial.',
    color: 'bg-secondary/10 text-secondary',
  },
  {
    icon: CheckCircle,
    title: 'Solicita',
    description: 'Completa el formulario de adopción. Nuestro equipo revisará tu solicitud rápidamente.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Home,
    title: 'Adopta',
    description: '¡Bienvenido a la familia! Dale a tu nuevo amigo el hogar que merece.',
    color: 'bg-secondary/10 text-secondary',
  },
];

export default function HowItWorks() {
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
            Proceso simple
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl mt-2 mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Adoptar es fácil y seguro. Sigue estos simples pasos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center group"
            >
              <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                <step.icon className="w-7 h-7" />
              </div>
              <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center mx-auto">
                {i + 1}
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
