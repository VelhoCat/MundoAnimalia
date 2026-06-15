import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1920&h=1080&fit=crop"
          alt="Animales felices"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30" />
      </div>

      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-32 right-[15%] hidden lg:block"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/20 backdrop-blur-sm flex items-center justify-center">
          <PawPrint className="w-8 h-8 text-primary-foreground" />
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-40 right-[25%] hidden lg:block"
      >
        <div className="w-12 h-12 rounded-full bg-secondary/20 backdrop-blur-sm flex items-center justify-center">
          <Heart className="w-6 h-6 text-secondary" />
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm text-primary-foreground text-sm mb-6">
            <PawPrint className="w-4 h-4" />
            Adopción responsable en Arica y Parinacota
          </div>

          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
            Dale un hogar a quien más lo{' '}
            <span className="text-secondary">necesita</span>
          </h1>

          <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
            Conectamos corazones con patitas que buscan una familia. 
            Encuentra a tu compañero ideal y transforma una vida con amor.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/catalogo">
              <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-full text-base px-8 h-12 font-heading font-semibold">
                Ver Animales
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/acerca">
              <Button size="lg" variant="outline" className="rounded-full text-base px-8 h-12 font-heading font-semibold border-white/30 text-white hover:bg-white/10 hover:text-white">
                Conocer más
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-12">
            {[
              { value: '150+', label: 'Animales rescatados' },
              { value: '80+', label: 'Adopciones exitosas' },
              { value: '50+', label: 'Voluntarios activos' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
              >
                <p className="font-heading font-bold text-2xl sm:text-3xl text-white">{stat.value}</p>
                <p className="text-xs sm:text-sm text-white/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
