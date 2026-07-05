import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Mail, MapPin, Phone, Heart, Globe, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Mundo Animalia" className="h-14 w-auto brightness-0 invert" />
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              Conectamos corazones con patitas que necesitan un hogar. 
              Adopción responsable en la región de Arica y Parinacota.
            </p>
          </div>

          {/* Links rápidos */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              {[
                { to: '/catalogo', label: 'Adoptar' },
                { to: '/noticias', label: 'Noticias' },
                { to: '/acerca', label: 'Nosotros' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cuidados */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Cuidado Animal</h4>
            <p className="text-sm opacity-70 leading-relaxed mb-3">
              Cada mascota recibe una guía de cuidados personalizada según su raza y edad
              al momento de adoptarla.
            </p>
            <ul className="space-y-2">
              {['Alimentación', 'Higiene', 'Salud', 'Esterilización', 'Vacunación'].map(item => (
                <li key={item} className="text-sm opacity-70">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm opacity-70">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                Arica y Parinacota, Chile
              </li>
              <li className="flex items-center gap-2 text-sm opacity-70">
                <Mail className="w-4 h-4 flex-shrink-0" />
                contacto@mundoanimalia.cl
              </li>
              <li className="flex items-center gap-2 text-sm opacity-70">
                <Phone className="w-4 h-4 flex-shrink-0" />
                +56 9 1234 5678
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs opacity-50">
            © {new Date().getFullYear()} Mundo Animalia. Todos los derechos reservados.
          </p>
          <p className="text-xs opacity-50 flex items-center gap-1">
            Hecho con <Heart className="w-3 h-3 text-destructive" /> en Arica, Chile
          </p>
        </div>
      </div>
    </footer>
  );
}
