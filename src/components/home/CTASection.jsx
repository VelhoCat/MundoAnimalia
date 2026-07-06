import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-primary p-10 sm:p-16 text-center"
        >
          {/* Decorative elements */}
          <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/10" />
          <div className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-white/5" />
          <div className="absolute top-1/2 right-[15%] w-8 h-8 rounded-lg bg-white/10 rotate-12" />

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
              <PawPrint className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-primary-foreground mb-4">
              ¿Listo para cambiar una vida?
            </h2>
            <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8 leading-relaxed">
              Miles de animales esperan por un hogar lleno de amor. 
              Tu próximo mejor amigo podría estar aquí.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/catalogo">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8 h-12 font-heading font-semibold">
                  Adoptar ahora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
