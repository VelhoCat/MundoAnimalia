import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { Ban } from 'lucide-react';

export default function AppLayout() {
  // El usuario y el logout vienen del contexto global de autenticación,
  // así las pestañas (Admin/Publicar) y el flujo de adopción reaccionan
  // automáticamente al iniciar o cerrar sesión.
  const { user, logout } = useAuth();
  const suspendido = !!user?.baneado;

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navbar user={user} onLogout={logout} />
      <main className="flex-1">
        <Outlet context={{ user }} />
      </main>
      <Footer />

      {/* Aviso permanente si la cuenta está suspendida */}
      {suspendido && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground shadow-lg">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-start sm:items-center gap-3">
            <Ban className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-sm leading-snug">
              <span className="font-semibold">Tu cuenta está suspendida.</span>{' '}
              Puedes seguir navegando y viendo animales, pero no puedes publicar, comentar,
              editar tus publicaciones ni enviar solicitudes de adopción. Contacta a un
              administrador si crees que es un error.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
