import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const estadoColors = {
  disponible: 'bg-primary/10 text-primary',
  en_proceso: 'bg-secondary/10 text-secondary',
  adoptado: 'bg-muted text-muted-foreground',
};

export default function AdminAnimals() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: animals = [] } = useQuery({
    queryKey: ['admin-animals'],
    queryFn: () => base44.entities.Animal.list('-created_date'),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Animal.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-animals'] });
      toast({ title: 'Animal eliminado' });
    },
  });

  return (
    <div className="bg-card rounded-2xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Especie</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {animals.map(animal => (
            <TableRow key={animal.id}>
              <TableCell className="font-medium">{animal.nombre}</TableCell>
              <TableCell className="capitalize">{animal.especie}</TableCell>
              <TableCell className="capitalize">{animal.ubicacion?.replace('_', ' ')}</TableCell>
              <TableCell>
                <Badge className={estadoColors[animal.estado_adopcion] || ''}>
                  {animal.estado_adopcion === 'disponible' ? 'Disponible' : animal.estado_adopcion === 'en_proceso' ? 'En proceso' : 'Adoptado'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-1 justify-end">
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/publicar?edit=${animal.id}`)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar a {animal.nombre}?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(animal.id)} className="bg-destructive">
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {animals.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                No hay animales publicados aún.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
