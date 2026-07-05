import React, { useState } from 'react';
import { Newspaper, Calendar, ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const categoriaColors = {
  Evento: 'bg-primary/10 text-primary',
  Campaña: 'bg-secondary/10 text-secondary',
  Rescate: 'bg-primary text-primary-foreground',
  Institucional: 'bg-muted text-muted-foreground',
  Comunidad: 'bg-secondary text-secondary-foreground',
};

const formatFecha = (iso) => {
  try {
    return format(new Date(iso), "d 'de' MMMM, yyyy", { locale: es });
  } catch {
    return '';
  }
};

export default function Noticias() {
  const [selected, setSelected] = useState(null);

  const { data: noticias = [], isLoading } = useQuery({
    queryKey: ['noticias'],
    queryFn: () => base44.entities.Noticia.list('-created_date'),
    initialData: [],
  });

  const destacada = noticias[0];

  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <section className="py-16 px-4 sm:px-6 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary font-heading font-semibold text-sm uppercase tracking-wider">
              Mantente informado
            </span>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl mt-2 mb-4">
              Noticias
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Entérate de nuestras últimas actividades, campañas, rescates y eventos
              en la región de Arica y Parinacota.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Estado vacío */}
      {!isLoading && noticias.length === 0 && (
        <section className="py-24 px-4 sm:px-6">
          <div className="max-w-md mx-auto text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Newspaper className="w-6 h-6 text-muted-foreground" />
            </div>
            <h2 className="font-heading font-semibold text-xl mb-2">Aún no hay noticias</h2>
            <p className="text-muted-foreground text-sm">
              Pronto publicaremos novedades sobre nuestras actividades y campañas.
            </p>
          </div>
        </section>
      )}

      {/* Noticia destacada */}
      {destacada && (
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => setSelected(destacada)}
              className="group grid grid-cols-1 lg:grid-cols-2 gap-8 bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="aspect-[16/10] lg:aspect-auto overflow-hidden bg-muted">
                {destacada.imagen && (
                  <img
                    src={destacada.imagen}
                    alt={destacada.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>
              <div className="p-6 lg:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={categoriaColors[destacada.categoria] || 'bg-muted text-muted-foreground'}>
                    {destacada.categoria}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatFecha(destacada.created_date)}
                  </span>
                </div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-4">
                  {destacada.titulo}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {destacada.resumen}
                </p>
                <div className="flex items-center justify-between">
                  {destacada.ubicacion ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {destacada.ubicacion}, Arica y Parinacota
                    </div>
                  ) : <span />}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary"
                    onClick={(e) => { e.stopPropagation(); setSelected(destacada); }}
                  >
                    Leer más
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Grid de noticias */}
      <section className="py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {noticias.slice(1).map((noticia, i) => (
              <motion.div
                key={noticia.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelected(noticia)}
                className="group bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  {noticia.imagen && (
                    <img
                      src={noticia.imagen}
                      alt={noticia.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={`text-xs ${categoriaColors[noticia.categoria] || 'bg-muted text-muted-foreground'}`}>
                      {noticia.categoria}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatFecha(noticia.created_date)}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2">
                    {noticia.titulo}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                    {noticia.resumen}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      {noticia.ubicacion && <><MapPin className="w-3 h-3" />{noticia.ubicacion}</>}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary text-xs px-2 h-7"
                      onClick={(e) => { e.stopPropagation(); setSelected(noticia); }}
                    >
                      Leer más
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de noticia completa */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          {selected && (
            <>
              <div className="aspect-[16/9] overflow-hidden rounded-t-lg bg-muted">
                {selected.imagen && (
                  <img
                    src={selected.imagen}
                    alt={selected.titulo}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <Badge className={categoriaColors[selected.categoria] || 'bg-muted text-muted-foreground'}>
                    {selected.categoria}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatFecha(selected.created_date)}
                  </span>
                  {selected.ubicacion && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {selected.ubicacion}, Arica y Parinacota
                    </span>
                  )}
                </div>
                <DialogHeader>
                  <DialogTitle className="font-heading text-2xl text-left leading-tight mb-3">
                    {selected.titulo}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  {(selected.contenido || selected.resumen || '').split('\n\n').map((parrafo, idx) => (
                    <p key={idx}>{parrafo}</p>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
