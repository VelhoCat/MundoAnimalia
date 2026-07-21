import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { PawPrint, Pencil, Trash2, Plus, User as UserIcon, Loader2 } from 'lucide-react';
import UserStars from '@/components/social/UserStars';
import EditProfileDialog from '@/components/profile/EditProfileDialog';

const estadoLabels = {
  disponible: { label: 'Disponible', className: 'bg-primary text-primary-foreground' },
  en_proceso: { label: 'En proceso', className: 'bg-secondary text-secondary-foreground' },
  adoptado: { label: 'Adoptado', className: 'bg-muted text-muted-foreground' },
};

export default function Profile() {
  const { user } = useOutletContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isAdmin = user?.role === 'admin';
  const canPublish = isAdmin || user?.role === 'voluntario';

  // Admin ve todos los animales; el resto solo los que publicó.
  const { data: animals, isLoading } = useQuery({
    queryKey: ['my-animals', user?.email, user?.role],
    queryFn: () =>
      isAdmin
        ? base44.entities.Animal.list('-created_date')
        : base44.entities.Animal.filter({ publicado_por: user.email }, '-created_date'),
    initialData: [],
    enabled: !!user,
  });

  // Estadísticas y estrellas del usuario
  const { data: stats } = useQuery({
    queryKey: ['user-stats', user?.email],
    queryFn: () => base44.social.userStats(user.email),
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Animal.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-animals'] });
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      queryClient.invalidateQueries({ queryKey: ['featured-animals'] });
      toast({ title: 'Publicación eliminada' });
    },
    onError: () => {
      toast({ title: 'No se pudo eliminar', description: 'Inténtalo nuevamente.', variant: 'destructive' });
    },
  });

  const handleDelete = (animal) => {
    if (window.confirm(`¿Eliminar la publicación de ${animal.nombre}? Esta acción no se puede deshacer.`)) {
      deleteMutation.mutate(animal.id);
    }
  };

  if (!user) return null;

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Cabecera del usuario */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-heading font-bold shrink-0">
            {user.full_name?.charAt(0)?.toUpperCase() || <UserIcon className="w-7 h-7" />}
          </div>
          <div className="min-w-0">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl">{user.full_name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-muted-foreground text-sm">
              <span className="truncate">{user.email}</span>
              <Badge variant="outline" className="capitalize">{user.role || 'adoptante'}</Badge>
              {user.baneado && (
                <Badge variant="outline" className="text-destructive border-destructive/40">Suspendida</Badge>
              )}
            </div>
          </div>
          <div className="ml-auto shrink-0">
            <EditProfileDialog user={user} />
          </div>
        </div>

        {/* Nivel del usuario (estrellas) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground mb-2">Animales dados en adopción</p>
            <div className="flex items-center justify-between">
              <UserStars stars={stats?.given_stars || 0} size={18} />
              <span className="font-heading font-bold text-2xl">{stats?.given_count ?? 0}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground mb-2">Animales adoptados</p>
            <div className="flex items-center justify-between">
              <UserStars stars={stats?.adopted_stars || 0} size={18} />
              <span className="font-heading font-bold text-2xl">{stats?.adopted_count ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Sección: mis publicaciones */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-semibold text-xl">
            {isAdmin ? 'Todas las publicaciones' : 'Mis publicaciones'}
          </h2>
          {canPublish && (
            <Link to="/publicar">
              <Button className="rounded-full bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-1" />
                Publicar animal
              </Button>
            </Link>
          )}
        </div>

        {/* Carga */}
        {isLoading && (
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
          </div>
        )}

        {/* Vacío */}
        {!isLoading && animals.length === 0 && (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl">
            <PawPrint className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-lg mb-1">Aún no hay publicaciones</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {canPublish
                ? 'Cuando publiques un animal, aparecerá aquí para que puedas editarlo o eliminarlo.'
                : 'Todavía no has publicado animales.'}
            </p>
            {canPublish && (
              <Link to="/publicar">
                <Button variant="outline" className="rounded-full">
                  <Plus className="w-4 h-4 mr-1" />
                  Publicar mi primer animal
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Lista */}
        {!isLoading && animals.length > 0 && (
          <div className="space-y-3">
            {animals.map((animal) => {
              const estado = estadoLabels[animal.estado_adopcion] || estadoLabels.disponible;
              return (
                <div
                  key={animal.id}
                  className="flex items-center gap-4 p-3 rounded-2xl border border-border bg-card"
                >
                  <Link to={`/animal/${animal.id}`} className="shrink-0">
                    <img
                      src={animal.foto_url || '/logo.png'}
                      alt={animal.nombre}
                      className="w-16 h-16 rounded-xl object-cover bg-muted"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/animal/${animal.id}`} className="font-heading font-semibold hover:text-primary transition-colors">
                      {animal.nombre}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={estado.className}>{estado.label}</Badge>
                      <span className="text-xs text-muted-foreground capitalize truncate">
                        {animal.especie} · {animal.raza || 'Mestizo'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link to={`/publicar?edit=${animal.id}`}>
                      <Button variant="outline" size="sm" className="rounded-full">
                        <Pencil className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Editar</span>
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(animal)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending && deleteMutation.variables === animal.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <><Trash2 className="w-4 h-4 sm:mr-1" /><span className="hidden sm:inline">Eliminar</span></>}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
