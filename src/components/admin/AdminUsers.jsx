import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Ban, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

const roleColors = {
  admin: 'bg-primary text-primary-foreground',
  voluntario: 'bg-secondary/10 text-secondary',
  adoptante: 'bg-muted text-muted-foreground',
};

export default function AdminUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => base44.entities.User.list('-created_date'),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.User.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: 'Rol actualizado' });
    },
  });

  const banMutation = useMutation({
    mutationFn: ({ id, baneado }) => base44.entities.User.update(id, { baneado }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: variables.baneado ? 'Cuenta suspendida' : 'Cuenta reactivada' });
    },
    onError: () => toast({ title: 'No se pudo cambiar el estado', variant: 'destructive' }),
  });

  return (
    <div className="bg-card rounded-2xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Registro</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead className="text-right">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => {
            const baneado = !!user.baneado;
            const esAdmin = (user.role || 'adoptante') === 'admin';
            return (
              <TableRow key={user.id} className={baneado ? 'bg-destructive/5' : ''}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {user.full_name}
                    {baneado && (
                      <Badge variant="outline" className="text-destructive border-destructive/40">Suspendido</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.created_date ? format(new Date(user.created_date), 'dd/MM/yyyy') : '-'}
                </TableCell>
                <TableCell>
                  <Select
                    value={user.role || 'adoptante'}
                    onValueChange={v => updateMutation.mutate({ id: user.id, data: { role: v } })}
                  >
                    <SelectTrigger className="w-32 h-8">
                      <Badge className={roleColors[user.role || 'adoptante']}>
                        {(user.role || 'adoptante').charAt(0).toUpperCase() + (user.role || 'adoptante').slice(1)}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adoptante">Adoptante</SelectItem>
                      <SelectItem value="voluntario">Voluntario</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  {esAdmin ? (
                    <span className="text-xs text-muted-foreground">—</span>
                  ) : baneado ? (
                    <Button
                      variant="outline" size="sm" className="rounded-full h-8"
                      disabled={banMutation.isPending}
                      onClick={() => banMutation.mutate({ id: user.id, baneado: false })}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" /> Reactivar
                    </Button>
                  ) : (
                    <Button
                      variant="outline" size="sm"
                      className="rounded-full h-8 text-destructive hover:bg-destructive/10 border-destructive/30"
                      disabled={banMutation.isPending}
                      onClick={() => {
                        if (window.confirm(`¿Suspender la cuenta de ${user.full_name}? No podrá publicar ni comentar.`)) {
                          banMutation.mutate({ id: user.id, baneado: true });
                        }
                      }}
                    >
                      <Ban className="w-4 h-4 mr-1" /> Banear
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                No hay usuarios registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
