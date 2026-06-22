import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PawPrint, ArrowLeft } from 'lucide-react';

export default function PageNotFound() {
  return (
    <div className="pt-24 pb-16 px-4 min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <PawPrint className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-heading font-bold text-5xl mb-3">404</h1>
        <p className="text-lg text-muted-foreground mb-6">
          ¡Ups! Esta página se fue a pasear y no volvió 🐾
        </p>
        <Link to="/">
          <Button className="bg-primary hover:bg-primary/90 rounded-full px-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
