import React, { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Botón de me gusta con contador. Requiere sesión para alternar.
// Props:
//   animalId
//   initialCount, initialLiked -> estado inicial (del catálogo/detalle)
//   user        -> usuario actual (o null)
//   size        -> 'sm' | 'md'
export default function LikeButton({ animalId, initialCount = 0, initialLiked = false, user, size = 'md' }) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      base44.auth.redirectToLogin(window.location.pathname);
      return;
    }
    if (loading) return;
    // Actualización optimista
    const prev = { count, liked };
    setLiked(!liked);
    setCount(c => c + (liked ? -1 : 1));
    setLoading(true);
    try {
      const res = await base44.social.likes.toggle(animalId);
      setCount(res.count);
      setLiked(res.liked);
    } catch {
      setCount(prev.count);
      setLiked(prev.liked);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={liked ? 'Quitar me gusta' : 'Dar me gusta'}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
        liked ? 'text-red-500 bg-red-500/10' : 'text-muted-foreground hover:bg-muted'
      }`}
    >
      {loading
        ? <Loader2 className={`${iconSize} animate-spin`} />
        : <Heart className={`${iconSize} ${liked ? 'fill-red-500' : ''}`} />}
      <span className={`${textSize} font-medium`}>{count}</span>
    </button>
  );
}
