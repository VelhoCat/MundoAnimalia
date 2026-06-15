import React from 'react';
import { PawPrint, Heart, Target, MapPin, Users, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <PawPrint className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl mb-6">
              Acerca de <span className="text-primary">Mundo Animalia</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Somos una plataforma dedicada a conectar animales rescatados con familias amorosas 
              en la región de Arica y Parinacota, Chile.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop"
                alt="Perros felices"
                className="rounded-2xl shadow-lg w-full"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-primary font-heading font-semibold text-sm uppercase tracking-wider">Nuestra misión</span>
              <h2 className="font-heading font-bold text-3xl mt-2 mb-4">
                Cada animal merece un hogar
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Mundo Animalia nació con el propósito de reducir el abandono animal y promover 
                la adopción responsable en la región de Arica y Parinacota. Creemos que cada 
                ser vivo merece respeto, cariño y un lugar seguro donde vivir.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Trabajamos en conjunto con voluntarios, rescatistas y la comunidad para 
                dar una segunda oportunidad a los animales que han sido abandonados o 
                se encuentran en situación de calle.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-secondary font-heading font-semibold text-sm uppercase tracking-wider">Nuestros valores</span>
            <h2 className="font-heading font-bold text-3xl mt-2">Lo que nos mueve</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Heart, title: 'Amor animal', desc: 'Cada acción nace del amor y respeto hacia todos los seres vivos.' },
              { icon: Target, title: 'Adopción responsable', desc: 'Promovemos adopciones conscientes donde el bienestar del animal es prioridad.' },
              { icon: MapPin, title: 'Compromiso local', desc: 'Trabajamos por la comunidad de Arica y Parinacota con dedicación.' },
              { icon: Users, title: 'Comunidad activa', desc: 'Fomentamos la participación de voluntarios y ciudadanos comprometidos.' },
              { icon: Leaf, title: 'Sostenibilidad', desc: 'Creemos en el trabajo continuo y la educación para un cambio duradero.' },
              { icon: PawPrint, title: 'Rescate integral', desc: 'No solo rescatamos, sino que cuidamos, rehabilitamos y buscamos hogares.' },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 bg-card rounded-2xl border border-border/50"
              >
                <v.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-heading font-semibold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Region context */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-primary font-heading font-semibold text-sm uppercase tracking-wider">Arica y Parinacota</span>
          <h2 className="font-heading font-bold text-3xl mt-2 mb-6">Nuestra región, nuestro hogar</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            La región de Arica y Parinacota, ubicada en el extremo norte de Chile, enfrenta 
            importantes desafíos en materia de bienestar animal. Muchos animales viven en 
            situación de calle, sin acceso a alimentación adecuada ni atención veterinaria.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Mundo Animalia trabaja día a día para cambiar esta realidad, conectando a estos 
            animales con personas que pueden brindarles el amor y cuidado que merecen. 
            Desde Arica hasta General Lagos, cada rincón de nuestra región tiene un animal 
            que espera por ti.
          </p>
        </div>
      </section>
    </div>
  );
}
