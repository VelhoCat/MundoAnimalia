import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AnimalCard from '../components/animals/AnimalCard';
import AnimalCardSkeleton from '../components/animals/AnimalCardSkeleton';
import AnimalFilters from '../components/animals/AnimalFilters';
import { PawPrint, AlertTriangle, RotateCw } from 'lucide-react';

export default function Catalog() {
  const [filters, setFilters] = useState({
    especie: '', edad_estimada: '', tamano: '', ubicacion: '', estado_adopcion: '', search: ''
  });

  const { data: animals, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['animals'],
    queryFn: () => base44.entities.Animal.list('-created_date'),
    initialData: [],
  });

  const filtered = useMemo(() => {
    return animals.filter(a => {
      if (filters.especie && a.especie !== filters.especie) return false;
      if (filters.edad_estimada && a.edad_estimada !== filters.edad_estimada) return false;
      if (filters.tamano && a.tamano !== filters.tamano) return false;
      if (filters.ubicacion && a.ubicacion !== filters.ubicacion) return false;
      if (filters.estado_adopcion && a.estado_adopcion !== filters.estado_adopcion) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const searchable = `${a.nombre} ${a.raza} ${a.descripcion}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });
  }, [animals, filters]);

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <PawPrint className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-heading font-bold text-3xl">Catálogo de Animales</h1>
          </div>
          <p className="text-muted-foreground ml-13">
            Encuentra a tu próximo compañero de vida. Todos buscan un hogar lleno de amor.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <AnimalFilters filters={filters} setFilters={setFilters} />
        </div>

        {/* Error state */}
        {isError && (
          <div className="text-center py-20">
            <AlertTriangle className="w-16 h-16 text-destructive/40 mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-xl mb-2">No pudimos cargar los animales</h3>
            <p className="text-muted-foreground mb-6">
              Ocurrió un problema al obtener el catálogo. Revisa tu conexión e inténtalo de nuevo.
            </p>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              <RotateCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Reintentando...' : 'Reintentar'}
            </button>
          </div>
        )}

        {/* Results count */}
        {!isLoading && !isError && (
          <p className="text-sm text-muted-foreground mb-6">
            {filtered.length} {filtered.length === 1 ? 'animal encontrado' : 'animales encontrados'}
          </p>
        )}

        {/* Grid */}
        {!isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading
              ? Array(8).fill(0).map((_, i) => <AnimalCardSkeleton key={i} />)
              : filtered.map((animal, i) => (
                  <AnimalCard key={animal.id} animal={animal} index={i} />
                ))
            }
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="text-center py-20">
            <PawPrint className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-xl mb-2">No se encontraron animales</h3>
            <p className="text-muted-foreground">Intenta ajustar los filtros de búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
