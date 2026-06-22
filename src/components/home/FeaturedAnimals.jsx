import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AnimalCard from '../animals/AnimalCard';
import AnimalCardSkeleton from '../animals/AnimalCardSkeleton';
import { motion } from 'framer-motion';

export default function FeaturedAnimals() {
  const { data: animals, isLoading } = useQuery({
    queryKey: ['featured-animals'],
    queryFn: () => base44.entities.Animal.filter({ estado_adopcion: 'disponible' }, '-created_date', 6),
    initialData: [],
  });

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-secondary font-heading font-semibold text-sm uppercase tracking-wider">
            Encuentra tu compañero
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl mt-2 mb-4">
            Animales que buscan hogar
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Estos amiguitos están esperando por ti. Cada uno tiene una historia y mucho amor para dar.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(6).fill(0).map((_, i) => <AnimalCardSkeleton key={i} />)
            : animals.map((animal, i) => (
                <AnimalCard key={animal.id} animal={animal} index={i} />
              ))
          }
        </div>

        {!isLoading && animals.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Aún no hay animales publicados.</p>
            <p className="text-muted-foreground text-sm mt-2">¡Pronto llegarán más amiguitos!</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/catalogo">
            <Button variant="outline" size="lg" className="rounded-full px-8 font-heading">
              Ver todos los animales
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
