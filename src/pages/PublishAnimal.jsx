import React, { useState } from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload, PawPrint, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PublishAnimal() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('edit');

  const { data: editAnimals } = useQuery({
    queryKey: ['edit-animal', editId],
    queryFn: () => editId ? base44.entities.Animal.filter({ id: editId }) : Promise.resolve([]),
    enabled: !!editId,
    initialData: [],
  });
  const editAnimal = editAnimals[0];

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(null);

  React.useEffect(() => {
    if (editAnimal) {
      setForm({ ...editAnimal });
    } else if (!editId) {
      setForm({
        nombre: '', descripcion: '', especie: '', raza: '', edad_estimada: '',
        tamano: '', sexo: '', estado_salud: '', vacunas: false, esterilizado: false,
        chip: false, foto_url: '', ubicacion: '', etiquetas: [], estado_adopcion: 'disponible',
      });
    }
  }, [editAnimal, editId]);

  if (!user || (user.role !== 'admin' && user.role !== 'voluntario')) {
    return (
      <div className="pt-24 pb-16 px-4 text-center">
        <h2 className="font-heading font-bold text-2xl mb-2">Acceso restringido</h2>
        <p className="text-muted-foreground">Solo voluntarios y administradores pueden publicar animales.</p>
      </div>
    );
  }

  // Cuenta suspendida: no puede publicar ni editar publicaciones.
  if (user.baneado) {
    return (
      <div className="pt-24 pb-16 px-4 text-center">
        <h2 className="font-heading font-bold text-2xl mb-2">Cuenta suspendida</h2>
        <p className="text-muted-foreground">
          Tu cuenta está suspendida, así que no puedes publicar ni editar publicaciones.
          Contacta a un administrador si crees que es un error.
        </p>
      </div>
    );
  }

  if (!form) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(prev => ({ ...prev, foto_url: file_url }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await base44.entities.Animal.update(editId, form);
        toast({ title: 'Animal actualizado', description: `${form.nombre} ha sido actualizado exitosamente.` });
      } else {
        // Registrar quién publica el animal (identificador = email/usuario)
        await base44.entities.Animal.create({ ...form, publicado_por: user.email });
        toast({ title: '¡Animal publicado!', description: `${form.nombre} ya está visible en el catálogo.` });
      }
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      queryClient.invalidateQueries({ queryKey: ['featured-animals'] });
      navigate('/catalogo');
    } catch (err) {
      toast({
        title: 'No se pudo guardar',
        description: err?.message || 'Inténtalo nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <Link to="/catalogo" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <PawPrint className="w-5 h-5 text-primary" />
          </div>
          <h1 className="font-heading font-bold text-2xl">
            {editId ? 'Editar animal' : 'Publicar animal'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo */}
          <div className="space-y-2">
            <Label>Fotografía</Label>
            <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center">
              {form.foto_url ? (
                <div className="relative">
                  <img src={form.foto_url} alt="Preview" className="w-full max-h-64 object-cover rounded-xl" />
                  <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => update('foto_url', '')}>
                    Cambiar foto
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {uploading ? 'Subiendo...' : 'Haz clic para subir una foto'}
                  </p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Input value={form.nombre} onChange={e => update('nombre', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Especie *</Label>
              <Select value={form.especie} onValueChange={v => update('especie', v)}>
                <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="perro">Perro</SelectItem>
                  <SelectItem value="gato">Gato</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Raza</Label>
              <Input value={form.raza} onChange={e => update('raza', e.target.value)} placeholder="Ej: Labrador, Mestizo" />
            </div>
            <div className="space-y-2">
              <Label>Sexo</Label>
              <Select value={form.sexo} onValueChange={v => update('sexo', v)}>
                <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="macho">Macho</SelectItem>
                  <SelectItem value="hembra">Hembra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Edad estimada *</Label>
              <Select value={form.edad_estimada} onValueChange={v => update('edad_estimada', v)}>
                <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cachorro">Cachorro</SelectItem>
                  <SelectItem value="joven">Joven</SelectItem>
                  <SelectItem value="adulto">Adulto</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tamaño *</Label>
              <Select value={form.tamano} onValueChange={v => update('tamano', v)}>
                <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pequeño">Pequeño</SelectItem>
                  <SelectItem value="mediano">Mediano</SelectItem>
                  <SelectItem value="grande">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ubicación *</Label>
              <Select value={form.ubicacion} onValueChange={v => update('ubicacion', v)}>
                <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="arica">Arica</SelectItem>
                  <SelectItem value="putre">Putre</SelectItem>
                  <SelectItem value="camarones">Camarones</SelectItem>
                  <SelectItem value="general_lagos">General Lagos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Estado de salud</Label>
            <Select value={form.estado_salud} onValueChange={v => update('estado_salud', v)}>
              <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="excelente">Excelente</SelectItem>
                <SelectItem value="bueno">Bueno</SelectItem>
                <SelectItem value="en_tratamiento">En tratamiento</SelectItem>
                <SelectItem value="requiere_atencion">Requiere atención</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Descripción</Label>
            <Textarea value={form.descripcion} onChange={e => update('descripcion', e.target.value)} rows={4} placeholder="Describe la personalidad, historia y necesidades del animal..." />
          </div>

          {/* Switches */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={form.vacunas} onCheckedChange={v => update('vacunas', v)} />
              <Label>Vacunas al día</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.esterilizado} onCheckedChange={v => update('esterilizado', v)} />
              <Label>Esterilizado/a</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.chip} onCheckedChange={v => update('chip', v)} />
              <Label>Microchip</Label>
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 rounded-full h-12 font-heading font-semibold" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {editId ? 'Guardar cambios' : 'Publicar animal'}
          </Button>
        </form>
      </div>
    </div>
  );
}
