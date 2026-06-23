import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

// Protege rutas: exige sesión y, opcionalmente, ciertos roles.
//   <ProtectedRoute roles={['admin']}> ... </ProtectedRoute>
export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    // Autenticado pero sin permiso → al inicio
    return <Navigate to="/" replace />;
  }

  return children;
}
