import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Pencil, Loader2, Save } from 'lucide-react';

// Permite al usuario cambiar su nombre y/o su contraseña.
export default function EditProfileDialog({ user }) {
  const { toast } = useToast();
  const { checkUserAuth } = useAuth();

  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState(user?.full_name || '');
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [repetir, setRepetir] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const abrir = (v) => {
    setOpen(v);
    if (v) {
      // Al abrir, refrescamos los campos y limpiamos contraseñas
      setNombre(user?.full_name || '');
      setActual(''); setNueva(''); setRepetir(''); setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const cambiaNombre = nombre.trim() !== '' && nombre.trim() !== user?.full_name;
    const cambiaPass = nueva !== '';

    if (!cambiaNombre && !cambiaPass) {
      setError('No hay cambios que guardar.');
      return;
    }
    if (cambiaPass) {
      if (nueva.length < 6) { setError('La nueva contraseña debe tener al menos 6 caracteres.'); return; }
      if (nueva !== repetir) { setError('Las contraseñas nuevas no coinciden.'); return; }
      if (!actual) { setError('Debes escribir tu contraseña actual.'); return; }
    }

    setLoading(true);
    try {
      await base44.auth.updateProfile({
        full_name: cambiaNombre ? nombre.trim() : '',
        password_actual: cambiaPass ? actual : '',
        password_nueva: cambiaPass ? nueva : '',
      });
      await checkUserAuth();   // refresca los datos del usuario en toda la app
      toast({ title: 'Perfil actualizado' });
      setOpen(false);
    } catch (err) {
      setError(err?.message || 'No se pudo guardar. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={abrir}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full">
          <Pencil className="w-4 h-4 mr-1" />
          Editar perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Editar mi perfil</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-destructive/10 text-destructive text-sm px-4 py-3">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>

          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Cambiar contraseña <span className="text-xs">(déjalo vacío si no quieres cambiarla)</span>
            </p>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="actual">Contraseña actual</Label>
                <Input id="actual" type="password" autoComplete="current-password"
                  value={actual} onChange={(e) => setActual(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nueva">Nueva contraseña</Label>
                <Input id="nueva" type="password" autoComplete="new-password" placeholder="Mínimo 6 caracteres"
                  value={nueva} onChange={(e) => setNueva(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repetir">Repetir nueva contraseña</Label>
                <Input id="repetir" type="password" autoComplete="new-password"
                  value={repetir} onChange={(e) => setRepetir(e.target.value)} />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full rounded-full">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Guardar cambios
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
