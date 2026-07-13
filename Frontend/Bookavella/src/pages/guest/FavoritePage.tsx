import { useFavorites } from '../../features/favorite/hooks/useFavourite';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '@/features/property/services/propertyService';
import PropertyCard from '@/components/PropertyCard';
import EmptyState from '@/components/EmptyState'; // Importação do EmptyState
import { Heart, Loader2, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { Button } from '../../../@/components/ui/button';

export default function FavoritesPage() {
  const { data: favoritesResponse, isLoading: loadingFavorites } = useFavorites();

  const favorites = favoritesResponse?.data || [];
  const propertyId = '';

  const { data: propertiesResponse, isLoading: loadingProperties } = useQuery({
    queryKey: ['properties', 'search', {}],
    queryFn: () => propertyService.searchProperties({}),
    enabled: favorites.length > 0,
  });

  const isLoading = loadingFavorites || loadingProperties;

  const favoriteProperties = (propertiesResponse?.data || []).filter((prop) =>
    favorites.some((fav) => fav.propertyId === prop.id)
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-8 font-body text-text-primary">
      <div className="space-y-1">
        <h1 className="text-3xl font-heading font-semibold text-text-primary">My Favorites</h1>
        <p className="text-sm text-text-secondary">
          Your curated selection of design sanctuaries and exclusive hotel boutiques.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-surface border border-border h-[320px] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        /* ACOPLAMENTO DO EMPTYSTATE DE FAVORITOS */
        <EmptyState
          icon={Heart}
          title="You haven't saved any properties yet"
          description="Explore our editorial selection of design hotels and save your favorite spaces to this list."
          action={
            <Button asChild className="h-9 text-xs flex items-center gap-1.5 cursor-pointer">
              <Link to={ROUTES.HOME}>
                <Compass className="h-4 w-4" />
                Explore sanctuaries
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              showFavoriteButton={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}