import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '../features/favorite/hooks/useFavourite';
import { useToggleFavorite } from '../features/favorite/hooks/useToggleFavourite';
import { toast } from 'sonner';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  propertyId: string;
  size?: 'sm' | 'md';
}

export default function FavoriteButton({ propertyId, size = 'md' }: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  
  // Consome a lista de favoritos ativa do cache do TanStack Query
  const { data: favoritesResponse } = useFavorites();
  const toggleFavoriteMutation = useToggleFavorite();

  const favorites = favoritesResponse?.data || [];
  const isFavorited = favorites.some((fav) => fav.propertyId === propertyId);

  const handleToggle = (e: React.MouseEvent) => {
    // Previne que o clique dispare o link de navegação do Card pai
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to save favorites');
      return;
    }

    toggleFavoriteMutation.mutate({ propertyId, isFavorited });
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
  };

  const iconClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
  };

  return (
    <button
      onClick={handleToggle}
      disabled={toggleFavoriteMutation.isPending}
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-background/80 hover:bg-background backdrop-blur-sm border border-border shadow-sm text-text-secondary hover:text-accent transition-all duration-normal active:scale-90 cursor-pointer disabled:opacity-50 disabled:pointer-events-none',
        sizeClasses[size]
      )}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={cn(
          iconClasses[size],
          'transition-all duration-normal',
          isFavorited ? 'fill-accent text-accent scale-105' : 'text-text-secondary hover:scale-105'
        )}
      />
    </button>
  );
}