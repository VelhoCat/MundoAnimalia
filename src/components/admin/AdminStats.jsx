import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PawPrint, FileText, Heart, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(113, 60%, 40%)', 'hsl(30, 93%, 54%)', 'hsl(150, 40%, 50%)', 'hsl(0, 84%, 60%)'];

export default function AdminStats() {
  const { data: animals = [] } = useQuery({
    queryKey: ['admin-animals'],
    queryFn: () => base44.entities.Animal.list(),
    initialData: [],
  });

  const { data: requests = [] } = useQuery({
    queryKey: ['admin-requests'],
    queryFn: () => base44.entities.AdoptionRequest.list(),
    initialData: [],
  });

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => base44.entities.User.list(),
    initialData: [],
  });

  const disponibles = animals.filter(a => a.estado_adopcion === 'disponible').length;
  const enProceso = animals.filter(a => a.estado_adopcion === 'en_proceso').length;
  const adoptados = animals.filter(a => a.estado_adopcion === 'adoptado').length;

  const statCards = [
    { title: 'Animales publicados', value: animals.length, icon: PawPrint, color: 'text-primary' },
    { title: 'Solicitudes', value: requests.length, icon: FileText, color: 'text-secondary' },
    { title: 'Adopciones', value: adoptados, icon: Heart, color: 'text-primary' },
    { title: 'Usuarios', value: users.length, icon: Users, color: 'text-secondary' },
  ];

  const speciesData = [
    { name: 'Perros', value: animals.filter(a => a.especie === 'perro').length },
    { name: 'Gatos', value: animals.filter(a => a.especie === 'gato').length },
    { name: 'Otros', value: animals.filter(a => a.especie === 'otro').length },
  ].filter(d => d.value > 0);

  const statusData = [
    { name: 'Disponibles', cantidad: disponibles },
    { name: 'En proceso', cantidad: enProceso },
    { name: 'Adoptados', cantidad: adoptados },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <Card key={s.title} className="rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="font-heading font-bold text-3xl">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Estado de adopción</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="cantidad" fill="hsl(113, 60%, 40%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Especies</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={speciesData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label>
                  {speciesData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
