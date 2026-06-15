import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const estadoColors = {
  pendiente: 'bg-secondary/10 text-secondary',
  en_revision: 'bg-primary/10 text-primary',
  aprobada: 'bg-primary text-primary-foreground',
  rechazada: 'bg-destructive/10 text-destructive',
};

const estadoLabels = {
  pendiente: 'Pendiente',
  en_revision: 'En revisión',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
};

export default function AdminRequests() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests = [] } = useQuery({
    queryKey: ['admin-requests'],
    queryFn: () => base44.entities.AdoptionRequest.list('-created_date'),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.AdoptionRequest.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-requests'] });
      toast({ title: 'Solicitud actualizada' });
    },
  });

  return (
    <div className="bg-card rounded-2xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Solicitante</TableHead>
            <TableHead>Animal</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map(req => (
            <TableRow key={req.id}>
              <TableCell>
                <div>
                  <p className="font-medium text-sm">{req.nombre_solicitante}</p>
                  <p className="text-xs text-muted-foreground">{req.email_solicitante}</p>
                </div>
              </TableCell>
              <TableCell>{req.animal_nombre}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {req.created_date ? format(new Date(req.created_date), 'dd/MM/yyyy') : '-'}
              </TableCell>
              <TableCell>
                <Select
                  value={req.estado}
                  onValueChange={v => updateMutation.mutate({ id: req.id, data: { estado: v } })}
                >
                  <SelectTrigger className="w-32 h-8">
                    <Badge className={estadoColors[req.estado] || ''}>{estadoLabels[req.estado] || req.estado}</Badge>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="en_revision">En revisión</SelectItem>
                    <SelectItem value="aprobada">Aprobada</SelectItem>
                    <SelectItem value="rechazada">Rechazada</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-heading">Detalle de solicitud</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 text-sm">
                      <div><span className="text-muted-foreground">Nombre:</span> {req.nombre_solicitante}</div>
                      <div><span className="text-muted-foreground">Email:</span> {req.email_solicitante}</div>
                      <div><span className="text-muted-foreground">Teléfono:</span> {req.telefono}</div>
                      <div><span className="text-muted-foreground">Dirección:</span> {req.direccion || '-'}</div>
                      <div><span className="text-muted-foreground">Vivienda:</span> {req.tipo_vivienda || '-'}</div>
                      <div><span className="text-muted-foreground">Patio:</span> {req.tiene_patio ? 'Sí' : 'No'}</div>
                      <div><span className="text-muted-foreground">Otras mascotas:</span> {req.otras_mascotas ? 'Sí' : 'No'}</div>
                      <div><span className="text-muted-foreground">Experiencia:</span> {req.experiencia_mascotas || '-'}</div>
                      <div><span className="text-muted-foreground">Motivo:</span> {req.motivo}</div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
          {requests.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                No hay solicitudes aún.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
