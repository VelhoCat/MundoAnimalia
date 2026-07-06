import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
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

  return (
    <div className="bg-card rounded-2xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Registro</TableHead>
            <TableHead>Rol</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.full_name}</TableCell>
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
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                No hay usuarios registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
