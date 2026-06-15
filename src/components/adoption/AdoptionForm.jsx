import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Heart } from 'lucide-react';

export default function AdoptionForm({ animal, user, onSuccess }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    animal_id: animal.id,
    animal_nombre: animal.nombre,
    nombre_solicitante: user.full_name || '',
    email_solicitante: user.email || '',
    telefono: '',
    direccion: '',
    tipo_vivienda: '',
    tiene_patio: false,
    otras_mascotas: false,
    experiencia_mascotas: '',
    motivo: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.entities.AdoptionRequest.create(form);
    toast({
      title: '¡Solicitud enviada!',
      description: `Tu solicitud para adoptar a ${animal.nombre} ha sido registrada. Te contactaremos pronto.`,
    });
    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre completo</Label>
          <Input id="nombre" value={form.nombre_solicitante} onChange={e => setForm({...form, nombre_solicitante: e.target.value})} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email_solicitante} onChange={e => setForm({...form, email_solicitante: e.target.value})} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} placeholder="+56 9..." required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Input id="direccion" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tipo de vivienda</Label>
        <Select value={form.tipo_vivienda} onValueChange={v => setForm({...form, tipo_vivienda: v})}>
          <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="casa">Casa</SelectItem>
            <SelectItem value="departamento">Departamento</SelectItem>
            <SelectItem value="parcela">Parcela</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <Switch checked={form.tiene_patio} onCheckedChange={v => setForm({...form, tiene_patio: v})} />
          <Label>Tiene patio</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={form.otras_mascotas} onCheckedChange={v => setForm({...form, otras_mascotas: v})} />
          <Label>Otras mascotas</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Experiencia con mascotas</Label>
        <Textarea
          value={form.experiencia_mascotas}
          onChange={e => setForm({...form, experiencia_mascotas: e.target.value})}
          placeholder="Cuéntanos sobre tu experiencia..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>¿Por qué quieres adoptar? *</Label>
        <Textarea
          value={form.motivo}
          onChange={e => setForm({...form, motivo: e.target.value})}
          placeholder="Cuéntanos tu motivación..."
          rows={3}
          required
        />
      </div>

      <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 rounded-full h-12 font-heading font-semibold" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Heart className="w-4 h-4 mr-2" />}
        Enviar solicitud
      </Button>
    </form>
  );
}
