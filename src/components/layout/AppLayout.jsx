import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppLayout() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const me = await base44.auth.me();
        setUser(me);
      }
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="flex-1">
        <Outlet context={{ user }} />
      </main>
      <Footer />
    </div>
  );
}
