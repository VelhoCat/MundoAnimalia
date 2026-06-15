import React from 'react';
import { Utensils, Droplets, HeartPulse, Home, Shield, Scissors, Syringe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const categories = [
  {
    icon: Utensils,
    title: 'Alimentación',
    color: 'bg-primary/10 text-primary',
    tips: [
      'Proporciona alimento de buena calidad acorde a la edad y tamaño de tu mascota.',
      'Establece horarios fijos para las comidas (2-3 veces al día para adultos).',
      'Evita darles alimentos humanos como chocolate, cebolla, uvas o huesos cocidos.',
      'Mantén siempre agua fresca y limpia disponible.',
      'Consulta con un veterinario sobre la dieta ideal para tu mascota.',
    ],
  },
  {
    icon: Droplets,
    title: 'Higiene',
    color: 'bg-secondary/10 text-secondary',
    tips: [
      'Baña a tu mascota regularmente según su especie y tipo de pelaje.',
      'Cepilla su pelo frecuentemente para evitar nudos y parásitos.',
      'Mantén limpios sus oídos, ojos y dientes.',
      'Corta las uñas periódicamente para evitar molestias.',
      'Lava y desinfecta sus platos de comida y agua diariamente.',
    ],
  },
  {
    icon: HeartPulse,
    title: 'Salud',
    color: 'bg-primary/10 text-primary',
    tips: [
      'Lleva a tu mascota al veterinario al menos una vez al año.',
      'Mantén al día su cartilla de vacunación.',
      'Desparasita internamente cada 3-4 meses.',
      'Presta atención a cambios de comportamiento: pueden ser señales de enfermedad.',
      'Protege contra pulgas y garrapatas con productos adecuados.',
    ],
  },
  {
    icon: Home,
    title: 'Espacio Adecuado',
    color: 'bg-secondary/10 text-secondary',
    tips: [
      'Proporciona un espacio propio, cómodo y seguro para descansar.',
      'Asegura que tu hogar sea seguro: elimina plantas tóxicas y objetos peligrosos.',
      'Los perros necesitan paseos diarios para ejercitarse y socializar.',
      'Los gatos necesitan rascadores, juguetes y espacios elevados.',
      'Protege ventanas y balcones para evitar caídas.',
    ],
  },
  {
    icon: Shield,
    title: 'Tenencia Responsable',
    color: 'bg-primary/10 text-primary',
    tips: [
      'Identifica a tu mascota con microchip y placa con datos de contacto.',
      'No abandones a tu mascota bajo ninguna circunstancia.',
      'Cumple con las normativas locales de tenencia responsable.',
      'Educa a todos los miembros de la familia sobre el cuidado animal.',
      'Planifica antes de adoptar: una mascota es un compromiso de vida.',
    ],
  },
  {
    icon: Scissors,
    title: 'Esterilización',
    color: 'bg-secondary/10 text-secondary',
    tips: [
      'La esterilización previene enfermedades graves como tumores y infecciones.',
      'Reduce el abandono animal al evitar camadas no deseadas.',
      'Los animales esterilizados suelen ser más tranquilos y sociables.',
      'Es un procedimiento seguro realizado bajo anestesia general.',
      'Consulta con tu veterinario sobre el momento ideal para esterilizar.',
    ],
  },
  {
    icon: Syringe,
    title: 'Vacunación',
    color: 'bg-primary/10 text-primary',
    tips: [
      'Los cachorros necesitan su primera vacunación entre las 6-8 semanas.',
      'La vacuna antirrábica es obligatoria por ley en Chile.',
      'Mantén un calendario de vacunación actualizado.',
      'Las vacunas protegen contra enfermedades mortales como parvovirus y distemper.',
      'Los gatos necesitan vacunas contra rinotraqueítis, calicivirus y panleucopenia.',
    ],
  },
];

export default function CareInfo() {
  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <section className="py-16 px-4 sm:px-6 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary font-heading font-semibold text-sm uppercase tracking-wider">
              Guía de cuidados
            </span>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl mt-2 mb-4">
              Cuidado Animal
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Información esencial para brindarle a tu mascota una vida feliz, 
              saludable y llena de amor.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <AccordionItem value={cat.title} className="border rounded-2xl px-6 overflow-hidden bg-card">
                  <AccordionTrigger className="hover:no-underline py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl ${cat.color} flex items-center justify-center`}>
                        <cat.icon className="w-5 h-5" />
                      </div>
                      <span className="font-heading font-semibold text-lg">{cat.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <ul className="space-y-3 ml-15">
                      {cat.tips.map((tip, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
