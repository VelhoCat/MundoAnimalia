import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function AnimalFilters({ filters, setFilters }) {
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value === 'todos' ? '' : value }));
  };

  const clearFilters = () => {
    setFilters({ especie: '', edad_estimada: '', tamano: '', ubicacion: '', estado_adopcion: '', search: '' });
  };

  const hasActiveFilters = Object.values(filters).some(v => v && v !== '');

  const FilterSelects = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      <Select value={filters.especie || 'todos'} onValueChange={v => updateFilter('especie', v)}>
        <SelectTrigger className="rounded-xl">
          <SelectValue placeholder="Especie" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todas las especies</SelectItem>
          <SelectItem value="perro">🐕 Perros</SelectItem>
          <SelectItem value="gato">🐈 Gatos</SelectItem>
          <SelectItem value="otro">🐾 Otros</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.edad_estimada || 'todos'} onValueChange={v => updateFilter('edad_estimada', v)}>
        <SelectTrigger className="rounded-xl">
          <SelectValue placeholder="Edad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todas las edades</SelectItem>
          <SelectItem value="cachorro">Cachorro</SelectItem>
          <SelectItem value="joven">Joven</SelectItem>
          <SelectItem value="adulto">Adulto</SelectItem>
          <SelectItem value="senior">Senior</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.tamano || 'todos'} onValueChange={v => updateFilter('tamano', v)}>
        <SelectTrigger className="rounded-xl">
          <SelectValue placeholder="Tamaño" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos los tamaños</SelectItem>
          <SelectItem value="pequeño">Pequeño</SelectItem>
          <SelectItem value="mediano">Mediano</SelectItem>
          <SelectItem value="grande">Grande</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.ubicacion || 'todos'} onValueChange={v => updateFilter('ubicacion', v)}>
        <SelectTrigger className="rounded-xl">
          <SelectValue placeholder="Ubicación" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todas las ubicaciones</SelectItem>
          <SelectItem value="arica">Arica</SelectItem>
          <SelectItem value="putre">Putre</SelectItem>
          <SelectItem value="camarones">Camarones</SelectItem>
          <SelectItem value="general_lagos">General Lagos</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.estado_adopcion || 'todos'} onValueChange={v => updateFilter('estado_adopcion', v)}>
        <SelectTrigger className="rounded-xl">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos los estados</SelectItem>
          <SelectItem value="disponible">Disponible</SelectItem>
          <SelectItem value="en_proceso">En proceso</SelectItem>
          <SelectItem value="adoptado">Adoptado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, raza..."
            value={filters.search || ''}
            onChange={e => updateFilter('search', e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
        
        {/* Mobile filter button */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon" className="rounded-xl shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-3">
              <FilterSelects />
            </div>
          </SheetContent>
        </Sheet>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground shrink-0">
            <X className="w-4 h-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Desktop filters */}
      <div className="hidden lg:block">
        <FilterSelects />
      </div>
    </div>
  );
}
