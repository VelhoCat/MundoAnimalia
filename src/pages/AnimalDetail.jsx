import React, { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, MapPin, Heart, Check, X, Syringe, Scissors, Radio } from 'lucide-react';
import AdoptionForm from '../components/adoption/AdoptionForm';

const edadLabels = { cachorro: 'Cachorro', joven: 'Joven', adulto: 'Adulto', senior: 'Senior' };
const tamanoLabels = { pequeño: 'Pequeño', mediano: 'Mediano', grande: 'Grande' };
const ubicacionLabels = { arica: 'Arica', putre: 'Putre', camarones: 'Camarones', general_lagos: 'General Lagos' };
const saludLabels = { excelente: 'Excelente', bueno: 'Bueno', en_tratamiento: 'En tratamiento', requiere_atencion: 'Requiere atención' };
const sexoLabels = { macho: 'Macho', hembra: 'Hembra' };

export default function AnimalDetail() {
  const { id } = useParams();
  const { user } = useOutletContext();
  const [adoptOpen, setAdoptOpen] = useState(false);

  const { data: animals, isLoading } = useQuery({
    queryKey: ['animal', id],
    queryFn: () => base44.entities.Animal.filter({ id }),
    initialData: [],
  });

  const animal = animals[0];

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="pt-24 pb-16 px-4 text-center">
        <h2 className="font-heading font-bold text-2xl">Animal no encontrado</h2>
        <Link to="/catalogo">
          <Button variant="outline" className="mt-4 rounded-full">Volver al catálogo</Button>
        </Link>
      </div>
    );
  }

  const defaultPhoto = animal.especie === 'gato'
    ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=800&fit=crop'
    : 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=800&fit=crop';

  const infoItems = [
    { label: 'Especie', value: animal.especie?.charAt(0).toUpperCase() + animal.especie?.slice(1) },
    { label: 'Raza', value: animal.raza || 'Mestizo' },
    { label: 'Edad', value: edadLabels[animal.edad_estimada] },
    { label: 'Tamaño', value: tamanoLabels[animal.tamano] },
    { label: 'Sexo', value: sexoLabels[animal.sexo] || 'No especificado' },
    { label: 'Ubicación', value: ubicacionLabels[animal.ubicacion] },
    { label: 'Salud', value: saludLabels[animal.estado_salud] || 'No especificado' },
  ];

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <Link to="/catalogo" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-square">
            <img
              src={animal.foto_url || defaultPhoto}
              alt={animal.nombre}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge className={`${
                animal.estado_adopcion === 'disponible' ? 'bg-primary text-primary-foreground'
                  : animal.estado_adopcion === 'en_proceso' ? 'bg-secondary text-secondary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {animal.estado_adopcion === 'disponible' ? 'Disponible'
                  : animal.estado_adopcion === 'en_proceso' ? 'En proceso'
                  : 'Adoptado'}
              </Badge>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl mb-2">{animal.nombre}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{ubicacionLabels[animal.ubicacion] || animal.ubicacion}, Arica y Parinacota</span>
              </div>
            </div>

            {animal.descripcion && (
              <p className="text-muted-foreground leading-relaxed">{animal.descripcion}</p>
            )}

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3">
              {infoItems.map(item => (
                <div key={item.label} className="p-3 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                  <p className="font-medium text-sm">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Health badges */}
            <div className="flex flex-wrap gap-3">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${animal.vacunas ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                <Syringe className="w-4 h-4" />
                Vacunas {animal.vacunas ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${animal.esterilizado ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                <Scissors className="w-4 h-4" />
                Esterilizado {animal.esterilizado ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${animal.chip ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                <Radio className="w-4 h-4" />
                Microchip {animal.chip ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              </div>
            </div>

            {/* Tags */}
            {animal.etiquetas?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {animal.etiquetas.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
            )}

            {/* Adopt button */}
            {animal.estado_adopcion === 'disponible' && (
              <Dialog open={adoptOpen} onOpenChange={setAdoptOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full h-14 text-lg font-heading font-semibold"
                    onClick={() => {
                      if (!user) {
                        base44.auth.redirectToLogin(window.location.pathname);
                        return;
                      }
                      setAdoptOpen(true);
                    }}
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Quiero adoptar a {animal.nombre}
                  </Button>
                </DialogTrigger>
                {user && (
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-heading">Solicitud de adopción — {animal.nombre}</DialogTitle>
                    </DialogHeader>
                    <AdoptionForm animal={animal} user={user} onSuccess={() => setAdoptOpen(false)} />
                  </DialogContent>
                )}
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
