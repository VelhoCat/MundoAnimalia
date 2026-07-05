import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';
import AdminAnimals from '../components/admin/AdminAnimals';
import AdminRequests from '../components/admin/AdminRequests';
import AdminUsers from '../components/admin/AdminUsers';
import AdminNews from '../components/admin/AdminNews';

export default function AdminDashboard() {
  const { user } = useOutletContext();

  if (!user || user.role !== 'admin') {
    return (
      <div className="pt-24 pb-16 px-4 text-center">
        <h2 className="font-heading font-bold text-2xl mb-2">Acceso denegado</h2>
        <p className="text-muted-foreground">Solo administradores pueden acceder a este panel.</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-2xl">Panel de Administración</h1>
            <p className="text-sm text-muted-foreground">Gestiona la plataforma Mundo Animalia</p>
          </div>
        </div>

        <Tabs defaultValue="animals" className="space-y-6">
          <TabsList className="bg-muted rounded-xl p-1">
            <TabsTrigger value="animals" className="rounded-lg">Animales</TabsTrigger>
            <TabsTrigger value="requests" className="rounded-lg">Solicitudes</TabsTrigger>
            <TabsTrigger value="news" className="rounded-lg">Noticias</TabsTrigger>
            <TabsTrigger value="users" className="rounded-lg">Usuarios</TabsTrigger>
          </TabsList>

          <TabsContent value="animals"><AdminAnimals /></TabsContent>
          <TabsContent value="requests"><AdminRequests /></TabsContent>
          <TabsContent value="news"><AdminNews user={user} /></TabsContent>
          <TabsContent value="users"><AdminUsers /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
