import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PawPrint, LogIn, Loader2 } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ¿A dónde volver tras iniciar sesión? (?redirect=/ruta)
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión. Revisa tus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
            <PawPrint className="w-7 h-7" />
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl">Iniciar sesión</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Accede para adoptar, publicar o administrar.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-5"
        >
          {error && (
            <div className="rounded-xl bg-destructive/10 text-destructive text-sm px-4 py-3">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Correo o usuario</Label>
            <Input
              id="email"
              type="text"
              autoComplete="username"
              placeholder="tucorreo@ejemplo.cl o tu usuario"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 rounded-full h-12 text-base font-heading font-semibold"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Ingresando…</>
            ) : (
              <><LogIn className="w-5 h-5 mr-2" /> Ingresar</>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <Link to={`/registro${location.search}`} className="text-primary font-medium hover:underline">
              Regístrate
            </Link>
          </p>
        </form>

        {/* Credenciales de prueba — quita este bloque en producción */}
        <div className="mt-6 text-xs text-muted-foreground bg-muted/50 rounded-xl p-4">
          <p className="font-medium text-foreground mb-1">Cuentas de prueba (contraseña: password123)</p>
          <p>admin@mundoanimalia.cl — administrador</p>
          <p>maria@mundoanimalia.cl — voluntario</p>
          <p>carlos.mendoza@gmail.com — adoptante</p>
        </div>
      </div>
    </div>
  );
}
