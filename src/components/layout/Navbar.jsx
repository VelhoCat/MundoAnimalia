import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, PawPrint, Sun, Moon, LogOut, LogIn, User, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from
'@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import NotificationsBell from './NotificationsBell';

export default function Navbar({ user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
  };

  const navLinks = [
  { to: '/catalogo', label: 'Adoptar' },
  { to: '/noticias', label: 'Noticias' },
  { to: '/cuidados', label: 'Cuidados' },
  { to: '/acerca', label: 'Nosotros' }];


  const isAdmin = user?.role === 'admin';
  const isVoluntario = user?.role === 'voluntario';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent ${
    scrolled ?
    'bg-background/90 backdrop-blur-xl shadow-sm border-b border-border/50' :
    ""}`
    }>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="Mundo Animalia"
              className="h-12 w-auto group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
            <Link key={link.to} to={link.to}>
                <Button
                variant="ghost"
                className={`font-body text-sm ${
                location.pathname === link.to ?
                'text-primary font-semibold' :
                'text-muted-foreground hover:text-foreground'}`
                }>
                
                  {link.label}
                </Button>
              </Link>
            )}
            {(isAdmin || isVoluntario) &&
            <Link to="/publicar">
                <Button variant="ghost" className={`font-body text-sm ${
              location.pathname === '/publicar' ?
              'text-primary font-semibold' :
              'text-muted-foreground hover:text-foreground'}`
              }>
                  Publicar
                </Button>
              </Link>
            }
            {isAdmin &&
            <Link to="/admin">
                <Button variant="ghost" className={`font-body text-sm ${
              location.pathname === '/admin' ?
              'text-primary font-semibold' :
              'text-muted-foreground hover:text-foreground'}`
              }>
                  <Shield className="w-4 h-4 mr-1" />
                  Admin
                </Button>
              </Link>
            }
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleDark} className="text-muted-foreground">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {user && <NotificationsBell user={user} />}

            {user ?
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.full_name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role || 'adoptante'}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/perfil">
                      <User className="w-4 h-4 mr-2" />
                      Mi perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> :

            <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" className="font-body text-sm rounded-full text-muted-foreground hover:text-foreground">
                    <LogIn className="w-4 h-4 mr-1" />
                    Iniciar sesión
                  </Button>
                </Link>
                <Link to="/catalogo">
                  <Button className="bg-primary hover:bg-primary/90 font-body text-sm rounded-full px-6">
                    Ver Animales
                  </Button>
                </Link>
              </div>
            }

            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) =>
                  <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start font-body">
                        {link.label}
                      </Button>
                    </Link>
                  )}
                  {(isAdmin || isVoluntario) &&
                  <Link to="/publicar" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start font-body">
                        Publicar Animal
                      </Button>
                    </Link>
                  }
                  {isAdmin &&
                  <Link to="/admin" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start font-body">
                        <Shield className="w-4 h-4 mr-2" />
                        Panel Admin
                      </Button>
                    </Link>
                  }
                  <div className="border-t pt-4">
                    {user ?
                    <div className="flex flex-col gap-2">
                        <Link to="/perfil" onClick={() => setOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start">
                            <User className="w-4 h-4 mr-2" />
                            Mi perfil
                          </Button>
                        </Link>
                        <Button variant="outline" className="w-full" onClick={() => {onLogout();setOpen(false);}}>
                          <LogOut className="w-4 h-4 mr-2" />
                          Cerrar sesión
                        </Button>
                      </div> :

                    <div className="flex flex-col gap-2">
                        <Link to="/login" onClick={() => setOpen(false)}>
                          <Button variant="outline" className="w-full">
                            <LogIn className="w-4 h-4 mr-2" />
                            Iniciar sesión
                          </Button>
                        </Link>
                        <Link to="/catalogo" onClick={() => setOpen(false)}>
                          <Button className="w-full bg-primary">Ver Animales</Button>
                        </Link>
                      </div>
                    }
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>);

}
