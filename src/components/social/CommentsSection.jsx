import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { MessageCircle, Send, Pencil, Trash2, Loader2, X, Check } from 'lucide-react';

function tiempoRelativo(fecha) {
  const d = new Date(fecha);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return 'hace un momento';
  const m = Math.floor(s / 60);
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  const dias = Math.floor(h / 24);
  if (dias < 30) return `hace ${dias} d`;
  return d.toLocaleDateString('es-CL');
}

export default function CommentsSection({ animalId, user }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'admin';

  const [texto, setTexto] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTexto, setEditTexto] = useState('');

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', animalId],
    queryFn: () => base44.social.comments.list(animalId),
    initialData: [],
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['comments', animalId] });
    queryClient.invalidateQueries({ queryKey: ['animals'] });
  };

  const createMut = useMutation({
    mutationFn: (t) => base44.social.comments.create(animalId, t),
    onSuccess: () => { setTexto(''); invalidate(); },
    onError: () => toast({ title: 'No se pudo comentar', variant: 'destructive' }),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, t }) => base44.social.comments.update(id, t),
    onSuccess: () => { setEditingId(null); setEditTexto(''); invalidate(); },
    onError: () => toast({ title: 'No se pudo editar', variant: 'destructive' }),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => base44.social.comments.delete(id),
    onSuccess: () => { invalidate(); toast({ title: 'Comentario eliminado' }); },
    onError: () => toast({ title: 'No se pudo eliminar', variant: 'destructive' }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    createMut.mutate(texto.trim());
  };

  const startEdit = (c) => { setEditingId(c.id); setEditTexto(c.texto); };

  return (
    <div className="mt-10 pt-8 border-t border-border">
      <div className="flex items-center gap-2 mb-5">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h2 className="font-heading font-semibold text-xl">
          Comentarios {comments.length > 0 && <span className="text-muted-foreground font-normal">({comments.length})</span>}
        </h2>
      </div>

      {/* Formulario para comentar */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <Textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe un comentario..."
            rows={2}
            className="resize-none"
          />
          <div className="flex justify-end mt-2">
            <Button type="submit" size="sm" className="rounded-full" disabled={createMut.isPending || !texto.trim()}>
              {createMut.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Send className="w-4 h-4 mr-1" />}
              Comentar
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground mb-6">
          Inicia sesión para dejar un comentario.
        </p>
      )}

      {/* Lista */}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando comentarios...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aún no hay comentarios. ¡Sé el primero!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => {
            const canEdit = user && c.user_email === user.email;
            const canDelete = canEdit || isAdmin;
            const isEditing = editingId === c.id;
            return (
              <div key={c.id} className="flex gap-3">
                <div className="w-9 h-9 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                  {c.autor_nombre?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-muted/50 rounded-2xl px-4 py-2.5">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm">{c.autor_nombre}</span>
                      <span className="text-xs text-muted-foreground">{tiempoRelativo(c.created_date)}</span>
                    </div>
                    {isEditing ? (
                      <div>
                        <Textarea
                          value={editTexto}
                          onChange={(e) => setEditTexto(e.target.value)}
                          rows={2}
                          className="resize-none bg-background"
                        />
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm" className="rounded-full h-7"
                            disabled={updateMut.isPending || !editTexto.trim()}
                            onClick={() => updateMut.mutate({ id: c.id, t: editTexto.trim() })}
                          >
                            <Check className="w-3.5 h-3.5 mr-1" /> Guardar
                          </Button>
                          <Button size="sm" variant="ghost" className="rounded-full h-7" onClick={() => setEditingId(null)}>
                            <X className="w-3.5 h-3.5 mr-1" /> Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words">{c.texto}</p>
                    )}
                  </div>

                  {!isEditing && (canEdit || canDelete) && (
                    <div className="flex gap-3 mt-1 ml-2">
                      {canEdit && (
                        <button onClick={() => startEdit(c)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                          <Pencil className="w-3 h-3" /> Editar
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => { if (window.confirm('¿Eliminar este comentario?')) deleteMut.mutate(c.id); }}
                          className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Eliminar
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
