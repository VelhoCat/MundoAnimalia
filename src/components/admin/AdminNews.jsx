import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Pencil, Trash2, Plus, Upload, Loader2, Newspaper } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CATEGORIAS = ['Evento', 'Campaña', 'Rescate', 'Institucional', 'Comunidad'];
const UBICACIONES = ['Arica', 'Putre', 'Camarones', 'General Lagos'];

const categoriaColors = {
  Evento: 'bg-primary/10 text-primary',
  Campaña: 'bg-secondary/10 text-secondary',
  Rescate: 'bg-primary text-primary-foreground',
  Institucional: 'bg-muted text-muted-foreground',
  Comunidad: 'bg-secondary text-secondary-foreground',
};

const EMPTY = { titulo: '', resumen: '', contenido: '', categoria: '', ubicacion: '', imagen: '' };

const formatFecha = (iso) => {
  try {
    return format(new Date(iso), "d 'de' MMMM, yyyy", { locale: es });
  } catch {
    return '';
  }
};

export default function AdminNews({ user }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: noticias = [] } = useQuery({
    queryKey: ['admin-news'],
    queryFn: () => base44.entities.Noticia.list('-created_date'),
    initialData: [],
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-news'] });
    queryClient.invalidateQueries({ queryKey: ['noticias'] });
  };

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Noticia.delete(id),
    onSuccess: () => {
      invalidate();
      toast({ title: 'Noticia eliminada' });
    },
  });

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY);
    setOpen(true);
  };

  const openEdit = (noticia) => {
    setEditId(noticia.id);
    setForm({
      titulo: noticia.titulo || '',
      resumen: noticia.resumen || '',
      contenido: noticia.contenido || '',
      categoria: noticia.categoria || '',
      ubicacion: noticia.ubicacion || '',
      imagen: noticia.imagen || '',
    });
    setOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    update('imagen', file_url);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (editId) {
      await base44.entities.Noticia.update(editId, form);
      toast({ title: 'Noticia actualizada', description: `"${form.titulo}" fue actualizada.` });
    } else {
      await base44.entities.Noticia.create({ ...form, publicado_por: user?.email || null });
      toast({ title: '¡Noticia publicada!', description: `"${form.titulo}" ya está visible en Noticias.` });
    }
    invalidate();
    setSaving(false);
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate} className="bg-primary hover:bg-primary/90 rounded-full">
          <Plus className="w-4 h-4 mr-2" />
          Nueva noticia
        </Button>
      </div>

      <div className="bg-card rounded-2xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {noticias.map(noticia => (
              <TableRow key={noticia.id}>
                <TableCell className="font-medium max-w-xs truncate">{noticia.titulo}</TableCell>
                <TableCell>
                  <Badge className={categoriaColors[noticia.categoria] || 'bg-muted text-muted-foreground'}>
                    {noticia.categoria || '—'}
                  </Badge>
                </TableCell>
                <TableCell>{noticia.ubicacion || '—'}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{formatFecha(noticia.created_date)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(noticia)}>
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
                          <AlertDialogTitle>¿Eliminar esta noticia?</AlertDialogTitle>
                          <AlertDialogDescription>
                            "{noticia.titulo}" se eliminará de forma permanente. Esta acción no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMutation.mutate(noticia.id)} className="bg-destructive">
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {noticias.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No hay noticias publicadas aún.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-primary" />
              {editId ? 'Editar noticia' : 'Nueva noticia'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Imagen */}
            <div className="space-y-2">
              <Label>Imagen</Label>
              <div className="border-2 border-dashed border-border rounded-2xl p-4 text-center">
                {form.imagen ? (
                  <div className="relative">
                    <img src={form.imagen} alt="Preview" className="w-full max-h-48 object-cover rounded-xl" />
                    <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => update('imagen', '')}>
                      Cambiar imagen
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer block py-4">
                    <Upload className="w-7 h-7 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {uploading ? 'Subiendo...' : 'Haz clic para subir una imagen'}
                    </p>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Título *</Label>
              <Input value={form.titulo} onChange={e => update('titulo', e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoría *</Label>
                <Select value={form.categoria} onValueChange={v => update('categoria', v)}>
                  <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ubicación</Label>
                <Select value={form.ubicacion} onValueChange={v => update('ubicacion', v)}>
                  <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                  <SelectContent>
                    {UBICACIONES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Resumen *</Label>
              <Textarea
                value={form.resumen}
                onChange={e => update('resumen', e.target.value)}
                rows={3}
                placeholder="Resumen breve que aparece en la tarjeta de la noticia..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Contenido completo</Label>
              <Textarea
                value={form.contenido}
                onChange={e => update('contenido', e.target.value)}
                rows={6}
                placeholder="Texto completo del artículo (separa los párrafos con una línea en blanco)..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1 rounded-full" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 rounded-full font-heading font-semibold"
                disabled={saving || !form.categoria}
              >
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editId ? 'Guardar cambios' : 'Publicar noticia'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
