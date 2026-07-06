import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingAuth(true);
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    } catch (error) {
      // 401 es normal cuando nadie ha iniciado sesión; solo registramos otros errores.
      if (error?.status && error.status !== 401) {
        console.error('Auth check failed:', error);
      }
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setAuthChecked(true);
    }
  };

  // Inicia sesión contra la API real (email + contraseña)
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const loggedUser = await base44.auth.login(email, password);
      setUser(loggedUser);
      setIsAuthenticated(true);
      return loggedUser;
    } catch (error) {
      setAuthError(error.message || 'No se pudo iniciar sesión.');
      throw error;
    }
  };

  // Registra una cuenta nueva (rol adoptante) e inicia sesión automáticamente
  const register = async (fullName, email, password) => {
    setAuthError(null);
    try {
      const newUser = await base44.auth.register({ full_name: fullName, email, password });
      setUser(newUser);
      setIsAuthenticated(true);
      return newUser;
    } catch (error) {
      setAuthError(error.message || 'No se pudo crear la cuenta.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await base44.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      authChecked,
      login,
      register,
      logout,
      navigateToLogin,
      checkUserAuth: checkAppState,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
