import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppLayout() {
  // El usuario y el logout vienen del contexto global de autenticación,
  // así las pestañas (Admin/Publicar) y el flujo de adopción reaccionan
  // automáticamente al iniciar o cerrar sesión.
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navbar user={user} onLogout={logout} />
      <main className="flex-1">
        <Outlet context={{ user }} />
      </main>
      <Footer />
    </div>
  );
}
