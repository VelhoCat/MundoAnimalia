import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';

import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import AnimalDetail from './pages/AnimalDetail';
import PublishAnimal from './pages/PublishAnimal';
import About from './pages/About';
import CareInfo from './pages/CareInfo';
import AdminDashboard from './pages/AdminDashboard';
import Noticias from './pages/Noticias';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/animal/:id" element={<AnimalDetail />} />
        <Route path="/publicar" element={<PublishAnimal />} />
        <Route path="/acerca" element={<About />} />
        <Route path="/cuidados" element={<CareInfo />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
